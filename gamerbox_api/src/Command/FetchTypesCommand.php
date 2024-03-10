<?php

namespace App\Command;

use App\Entity\GameMode;
use App\Entity\Genre;
use App\Entity\Theme;
use App\Repository\GameModeRepository;
use App\Repository\GenreRepository;
use App\Repository\ThemeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[AsCommand(
    name: 'app:fetch-types',
    description: 'Fetch genres, modes and themes of games from igdb api.',
)]
class FetchTypesCommand extends Command
{
    private $client = HttpClientInterface::class;
    private $gameModeRepository = GameModeRepository::class;
    private $genreRepository = GenreRepository::class;
    private $themeRepository = ThemeRepository::class;
    private $entityManager = EntityManagerInterface::class;

    public function __construct(
        HttpClientInterface $client,
        EntityManagerInterface $entityManager,
        GameModeRepository $gameModeRepository,
        GenreRepository $genreRepository,
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
        $this->entityManager = $entityManager;
        $this->gameModeRepository = $gameModeRepository;
        $this->genreRepository = $genreRepository;
        $this->themeRepository = $themeRepository;

        parent::__construct();
    }

    protected function configure(): void
    {
        // $this
        //     ->addArgument('arg1', InputArgument::OPTIONAL, 'Argument description')
        //     ->addOption('option1', null, InputOption::VALUE_NONE, 'Option description');
        $this
            ->setDescription('Fetch types, genres, modes and themes of games from igdb api.')
            ->setHelp('Fetch types, genres, modes and themes of games from igdb api.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        // $arg1 = $input->getArgument('arg1');

        // if ($arg1) {
        //     $io->note(sprintf('You passed an argument: %s', $arg1));
        // }

        // if ($input->getOption('option1')) {
        //     // ...
        // }

        // genres
        $response = $this->client->request(
            'POST',
            'genres',
            ['body' => 'fields id,name; limit 40; offset 0;']
        );
        $genresData = json_decode($response->getContent(), true);

        foreach ($genresData as $genre) {
            $genreToFind = $this->genreRepository->findOneByIgdbId($genre['id']);
            if ($genreToFind === null) {
                $newGenre = new Genre();
                $newGenre->setIgdbId($genre['id']);
                $newGenre->setName($genre['name']);

                $this->entityManager->persist($newGenre);
                $this->entityManager->flush();
            }
        }

        // themes
        $response = $this->client->request(
            'POST',
            'themes',
            ['body' => 'fields id,name; limit 50; offset 0;']
        );
        $themesData = json_decode($response->getContent(), true);

        foreach ($themesData as $theme) {
            $themeToFind = $this->themeRepository->findOneByIgdbId($theme['id']);
            if ($themeToFind === null) {
                $newTheme = new Theme();
                $newTheme->setIgdbId($theme['id']);
                $newTheme->setName($theme['name']);

                $this->entityManager->persist($newTheme);
                $this->entityManager->flush();
            }
        }

        // game modes
        $response = $this->client->request(
            'POST',
            'game_modes',
            ['body' => 'fields id,name; limit 30; offset 0;']
        );
        $gameModesData = json_decode($response->getContent(), true);

        foreach ($gameModesData as $gameMode) {
            $gameModeToFind = $this->gameModeRepository->findOneByIgdbId($gameMode['id']);
            if ($gameModeToFind === null) {
                $newGameMode = new GameMode();
                $newGameMode->setIgdbId($gameMode['id']);
                $newGameMode->setName($gameMode['name']);

                $this->entityManager->persist($newGameMode);
                $this->entityManager->flush();
            }
        }

        $io->success('Genres, themes and game modes are up to date !');

        return Command::SUCCESS;
    }
}
