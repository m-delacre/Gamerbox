<?php

namespace App\Controller;

use App\Entity\Game;
use App\Entity\Wishlist;
use App\Repository\GameRepository;
use App\Repository\WishlistRepository;
use App\Service\GameBuilder;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\Serializer\Context\Normalizer\ObjectNormalizerContextBuilder;

class GameController extends AbstractController
{
    private $client = HttpClientInterface::class;
    private $gameBuilder = GameBuilder::class;

    public function __construct(HttpClientInterface $client, GameBuilder $gameBuilder)
    {
        $this->client = $client->withOptions([
            'base_uri' => 'https://api.igdb.com/v4/',
            'headers' => [
                'Accept' => 'application/json',
                'Client-ID' => $_ENV['CLIENT_ID'],
            ],
            'auth_bearer' => $_ENV['AUTH_BEARER'],
        ]);

        $this->gameBuilder = $gameBuilder;
    }

    #[Route('/api/gamerbox', name: 'api_external_api', methods: ['GET'])]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to Gamerbox'
        ]);
    }

    #[Route('/api/search', name: 'api_searchGame', methods: ['POST'])]
    public function searchGame(SerializerInterface $serializer, Request $request): JsonResponse
    {
        $requestData = json_decode($request->getContent(), true);
        $search = $requestData['search'];
        $offset = $requestData['offset'];
        $limit = $requestData['limit'];

        $results = $this->gameBuilder->buildSearchThumbnail($search, $offset, $limit);

        $serializedResult = $serializer->serialize($results, 'json');

        return new JsonResponse($serializedResult, Response::HTTP_OK, [], true);
    }

    #[Route('/api/game/{id}', name: 'api_game_detail', methods: ['GET'])]
    public function getGame(int $id, SerializerInterface $serializer): JsonResponse
    {
        $game = $this->gameBuilder->buildGame($id);
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('full_game')
            ->toArray();
        $serializedGame = $serializer->serialize($game, 'json', $context);

        return new JsonResponse($serializedGame, Response::HTTP_OK, [], true);
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/api/game/whishlist/{igdbId}', name: 'api_game_add_wishlist', methods: ['POST'])]
    public function addGameToWishlist(int $igdbId, WishlistRepository $wishlistRepository, EntityManagerInterface $em, GameRepository $gameRepository, GameBuilder $gameBuilder): JsonResponse
    {
        $game = $gameRepository->findOneByIgdbId($igdbId);
        $user = $this->getUser();

        if(!$game) {
            $game = $gameBuilder->buildGame($igdbId);
            $gameRepository->saveGame($game);
        }
        
        $wishlist = $wishlistRepository->findOneByUser($user);

        if(!$wishlist) {
            $newWishlist = new Wishlist();
            $newWishlist->setUser($this->getUser());
            $newWishlist->addGame($game);

            $em->persist($newWishlist);
        } else {
            $wishlist->addGame($game);
        }

        $em->flush();

        return new JsonResponse('Jeu ajouté', Response::HTTP_OK, [], true);
    }
}
