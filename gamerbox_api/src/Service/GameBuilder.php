<?php

namespace App\Service;

use App\Repository\GameModeRepository;
use App\Repository\GenreRepository;
use App\Repository\ThemeRepository;
use App\Entity\Game;
use App\Entity\GameMode;
use App\Entity\Genre;
use App\Entity\Theme;
use DateTime;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class GameBuilder
{
    private $client = HttpClientInterface::class;
    private $genreRepository = GenreRepository::class;
    private $themeRepository = ThemeRepository::class;
    private $gameModeRepository = GameModeRepository::class;

    public function __construct(
        HttpClientInterface $client,
        GenreRepository $genreRepository,
        GameModeRepository $gameModeRepository,
        ThemeRepository $themeRepository
    ) {
        $this->client = $client->withOptions([
            'base_uri' => 'https://api.igdb.com/v4/',
            'headers' => [
                'Accept' => 'application/json',
                'Client-ID' => $_ENV['CLIENT_ID'],
            ],
            'auth_bearer' => $_ENV['AUTH_BEARER'],
        ]);
        $this->genreRepository = $genreRepository;
        $this->themeRepository = $themeRepository;
        $this->gameModeRepository = $gameModeRepository;
    }

    function buildGame(int $igdbId): Game
    {
        $game = new Game();

        $response = $this->client->request(
            'POST',
            'games',
            ['body' => 'fields id,artworks,cover,name,first_release_date,slug,summary,genres,game_modes,themes; where id = ' . $igdbId . ';']
        );
        $gameData = json_decode($response->getContent(), true);

        $game->setIgdbId($igdbId);
        $game->setName($gameData[0]['name']);
        $game->setSlug($gameData[0]['slug']);

        $game->setSummary($gameData[0]['summary'] ?? null);

        if (array_key_exists('cover', $gameData[0])) {
            $response = $this->client->request(
                'POST',
                'covers',
                ['body' => 'fields id,image_id,url; where id = ' . $gameData[0]['cover'] . ';']
            );
            $coverData = json_decode($response->getContent(), true);
            $game->setCover($coverData[0]['url']);
        }

        if (array_key_exists('first_release_date', $gameData[0])) {
            $releaseDateUnixTimestamp = $gameData[0]['first_release_date'];
            $releaseDate = new DateTime("@$releaseDateUnixTimestamp");
            $game->setReleaseDate($releaseDate);
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

        if (array_key_exists('genres', $gameData[0])) {
            foreach ($gameData[0]['genres'] as $genreId) {
                $genre = $this->genreRepository->findOneByIgdbId($genreId);
                if ($genre === null) {
                    
                } else {
                    $game->addGenre($genre);
                }
            }
        }

        if (array_key_exists('game_modes', $gameData[0])) {
            foreach ($gameData[0]['game_modes'] as $game_modeId) {
                $gameMode = $this->gameModeRepository->findOneByIgdbId($game_modeId);
                if ($gameMode === null) {
                    
                } else {
                    $game->addMode($gameMode);
                }
            }
        }

        if (array_key_exists('themes', $gameData[0])) {
            foreach ($gameData[0]['themes'] as $themeId) {
                $theme = $this->themeRepository->findOneByIgdbId($themeId);
                if ($theme === null) {
                    
                } else {
                    $game->addTheme($theme);
                }
            }
        }

        return $game;
    }

    function buildSearchThumbnail(string $search, int $offset, int $limit): array
    {
        $searchThumbnail = [];

        $response = $this->client->request(
            'POST',
            'games',
            ['body' => 'fields id,name,first_release_date,cover; search "' . $search . '"; limit: ' . $limit . '; offset: ' . $offset . ';']
        );
        $searchResult = json_decode($response->getContent(), true);

        $resultsIds = [];
        for ($resultsIndex = 0; $resultsIndex < count($searchResult); $resultsIndex++) {
            array_push($resultsIds, $searchResult[$resultsIndex]['id']);
        }

        $requestBodyIds = implode(",", $resultsIds);

        // get covers
        $response = $this->client->request(
            'POST',
            'covers',
            ['body' => 'fields image_id,url; where game = (' . $requestBodyIds . ');']
        );
        $coversData = json_decode($response->getContent(), true);

        foreach ($searchResult as $result) {
            $thumbnail = [];
            $thumbnail['igdbId'] = $result['id'];
            $thumbnail['name'] = $result['name'];
            if (array_key_exists('cover', $result)) {
                $targetId = $result['cover'];
                foreach ($coversData as $cover) {
                    if ($cover['id'] == $targetId) {
                        $url = $cover['url'];
                        $thumbnail['cover'] = $url;
                        break;
                    }
                }
            } else {
                $thumbnail['cover'] = null;
            }

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
