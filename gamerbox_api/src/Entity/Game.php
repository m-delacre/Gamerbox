<?php

namespace App\Entity;

use App\Repository\GameRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: GameRepository::class)]
#[ORM\Table(name: "Game", options: ["engine" => "InnoDB"])]
class Game
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['full_game', 'wishlist_game'])]
    private ?int $igdbId = null;

    #[ORM\Column(length: 255)]
    #[Groups(['full_game', 'wishlist_game'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['full_game', 'wishlist_game'])]
    private ?string $slug = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['full_game'])]
    private ?string $summary = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['full_game'])]
    private ?\DateTimeInterface $releaseDate = null;

    #[ORM\Column(length: 255)]
    #[Groups(['full_game'])]
    private ?string $developers = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['full_game'])]
    private ?string $banner = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['full_game', 'wishlist_game'])]
    private ?string $cover = null;

    #[ORM\ManyToMany(targetEntity: GameMode::class, inversedBy: 'games')]
    #[Groups(['full_game'])]
    private Collection $modes;

    #[ORM\ManyToMany(targetEntity: Theme::class, inversedBy: 'games')]
    #[Groups(['full_game'])]
    private Collection $theme;

    #[ORM\ManyToMany(targetEntity: Genre::class, inversedBy: 'games')]
    #[Groups(['full_game'])]
    private Collection $genre;

    #[ORM\ManyToMany(targetEntity: Wishlist::class, mappedBy: 'game')]
    private Collection $wishlists;

    public function __construct()
    {
        $this->modes = new ArrayCollection();
        $this->theme = new ArrayCollection();
        $this->genre = new ArrayCollection();
        $this->wishlists = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIgdbId(): ?int
    {
        return $this->igdbId;
    }

    public function setIgdbId(int $igdbId): static
    {
        $this->igdbId = $igdbId;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    public function getSummary(): ?string
    {
        return $this->summary;
    }

    public function setSummary(?string $summary): static
    {
        $this->summary = $summary;

        return $this;
    }

    public function getReleaseDate(): ?\DateTimeInterface
    {
        return $this->releaseDate;
    }

    public function setReleaseDate(\DateTimeInterface $releaseDate): static
    {
        $this->releaseDate = $releaseDate;

        return $this;
    }

    public function getDevelopers(): ?string
    {
        return $this->developers;
    }

    public function setDevelopers(string $developers): static
    {
        $this->developers = $developers;

        return $this;
    }

    public function getBanner(): ?string
    {
        return $this->banner;
    }

    public function setBanner(string $banner): static
    {
        $this->banner = $banner;

        return $this;
    }

    /**
     * @return Collection<int, GameMode>
     */
    public function getModes(): Collection
    {
        return $this->modes;
    }

    public function addMode(GameMode $mode): static
    {
        if (!$this->modes->contains($mode)) {
            $this->modes->add($mode);
        }

        return $this;
    }

    public function removeMode(GameMode $mode): static
    {
        $this->modes->removeElement($mode);

        return $this;
    }

    /**
     * @return Collection<int, Theme>
     */
    public function getTheme(): Collection
    {
        return $this->theme;
    }

    public function addTheme(Theme $theme): static
    {
        if (!$this->theme->contains($theme)) {
            $this->theme->add($theme);
        }

        return $this;
    }

    public function removeTheme(Theme $theme): static
    {
        $this->theme->removeElement($theme);

        return $this;
    }

    /**
     * @return Collection<int, Genre>
     */
    public function getGenre(): Collection
    {
        return $this->genre;
    }

    public function addGenre(Genre $genre): static
    {
        if (!$this->genre->contains($genre)) {
            $this->genre->add($genre);
        }

        return $this;
    }

    public function removeGenre(Genre $genre): static
    {
        $this->genre->removeElement($genre);

        return $this;
    }

    public function getCover(): ?string
    {
        return $this->cover;
    }

    public function setCover(?string $cover): static
    {
        $this->cover = $cover;

        return $this;
    }

    /**
     * @return Collection<int, Wishlist>
     */
    public function getWishlists(): Collection
    {
        return $this->wishlists;
    }

    public function addWishlist(Wishlist $wishlist): static
    {
        if (!$this->wishlists->contains($wishlist)) {
            $this->wishlists->add($wishlist);
            $wishlist->addGame($this);
        }

        return $this;
    }

    public function removeWishlist(Wishlist $wishlist): static
    {
        if ($this->wishlists->removeElement($wishlist)) {
            $wishlist->removeGame($this);
        }

        return $this;
    }
}
