<?php

namespace App\Controller;

use App\Entity\Game;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ExternalAPIController extends AbstractController
{
    public function __construct(private HttpClientInterface $client)
    {
        $this->client = $client->withOptions([
            'base_uri' => 'https://api.igdb.com/v4/',
            'headers' => [
                'Accept' => 'application/json',
                'Client-ID' => $_ENV['CLIENT_ID'],
            ],
            'auth_bearer' => $_ENV['AUTH_BEARER'],
        ]);
    }

    #[Route('/api/gamerbox', name: 'api_external_api', methods: ['GET'])]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to Gamerbox'
        ]);
    }

    #[Route('/api/searchGame', name: 'api_searchGame', methods: ['POST'])]
    public function searchGame(SerializerInterface $serializer, Request $request): JsonResponse
    {
        $requestData = json_decode($request->getContent(), true);
        $search = $requestData['search'];
        $offset = $requestData['offset'];
        $limit = $requestData['limit'];

        // $response = $this->client->request(
        //     'POST',
        //     'games',
        //     ['body' => 'fields id,name,first_release_date; search "' . $search . '"; limit: ' . $limit . '; offset: ' . $offset . ';']
        // );
        // $searchResult = json_decode($response->getContent(), true);

        $results = $this->buildSearchThumbnail($search, $offset, $limit);

        $serializedResult = $serializer->serialize($results, 'json');

        return new JsonResponse($serializedResult, Response::HTTP_OK, [], true);
    }

    #[Route('/api/game/{id}', name: 'api_game_detail', methods: ['GET'])]
    public function getGame(int $id, SerializerInterface $serializer): JsonResponse
    {
        $game = $this->buildGame($id);
        $serializedGame = $serializer->serialize($game, 'json');

        return new JsonResponse($serializedGame, Response::HTTP_OK, [], true);
    }

    function buildGame(int $igdbId): Game
    {
        $game = new Game();

        $response = $this->client->request(
            'POST',
            'games',
            ['body' => 'fields id,artworks,cover,name,first_release_date,slug,summary; where id = ' . $igdbId . ';']
        );
        $gameData = json_decode($response->getContent(), true);

        $game->setIgdbId($igdbId);
        $game->setName($gameData[0]['name']);
        $game->setSlug($gameData[0]['slug']);

        if (array_key_exists('summary', $gameData[0])) {
            $game->setSummary($gameData[0]['summary']);
        } else {
            //$game->setSummary(null);
        }

        if (array_key_exists('first_release_date', $gameData[0])) {
            $releaseDateUnixTimestamp = $gameData[0]['first_release_date'];
            $releaseDate = new DateTime("@$releaseDateUnixTimestamp");
            $game->setReleaseDate($releaseDate);
        } else {
            //$game->setReleaseDate(null);
        }

        if (array_key_exists('artworks', $gameData[0])) {
            $firstArtwork = $gameData[0]['artworks'][0];
            $response = $this->client->request(
                'POST',
                'artworks',
                ['body' => 'fields *; where game = ' . $igdbId . '; where id = ' . $firstArtwork . ';']
            );
            $bannerData = json_decode($response->getContent(), true);
            $game->setBanner($bannerData[0]['url']);
        }

        $response = $this->client->request(
            'POST',
            'companies',
            ['body' => 'fields name; where developed = [' . $igdbId . '];']
        );
        $developersData = json_decode($response->getContent(), true);

        if (!empty($developersData)) {
            $game->setDevelopers($developersData[0]['name']);
        }

        return $game;
    }

    function buildSearchThumbnail(string $search, int $offset, int $limit): array
    {
        $searchThumbnail = [];

        $response = $this->client->request(
            'POST',
            'games',
            ['body' => 'fields id,name,first_release_date; search "' . $search . '"; limit: ' . $limit . '; offset: ' . $offset . ';']
        );
        $searchResult = json_decode($response->getContent(), true);

        foreach ($searchResult as $result) {
            $thumbnail = [];
            $thumbnail['igdbId'] = $result['id'];
            $thumbnail['name'] = $result['name'];
            if (array_key_exists('first_release_date', $result)) {
                $releaseDateUnixTimestamp = $result['first_release_date'];
                $releaseDate = new DateTime("@$releaseDateUnixTimestamp");
                $thumbnail['releaseDate'] = $releaseDate;
            }
            array_push($searchThumbnail, $thumbnail);
        }

        return $searchThumbnail;
    }
}
