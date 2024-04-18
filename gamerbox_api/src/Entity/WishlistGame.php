<?php

namespace App\Entity;

use App\Repository\WishlistGameRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: WishlistGameRepository::class)]
class WishlistGame
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'wishlistGames')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['wishlist_game'])]
    private ?Game $Game = null;

    #[ORM\ManyToOne(inversedBy: 'wishlistGames')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['wishlist_game'])]
    private ?User $User = null;

    #[Groups(['wishlist_game'])]
    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $addedDate = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getGame(): ?Game
    {
        return $this->Game;
    }

    public function setGame(?Game $Game): static
    {
        $this->Game = $Game;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->User;
    }

    public function setUser(?User $User): static
    {
        $this->User = $User;

        return $this;
    }

    public function getAddedDate(): ?\DateTimeInterface
    {
        return $this->addedDate;
    }

    public function setAddedDate(\DateTimeInterface $addedDate): static
    {
        $this->addedDate = $addedDate;

        return $this;
    }
}
