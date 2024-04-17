<?php

namespace App\DataFixtures;

use App\Entity\Follow;
use App\Entity\Game;
use App\Entity\ReactionEnum;
use App\Entity\Review;
use App\Entity\User;
use App\Entity\WishlistGame;
use App\Service\GameBuilder;
use DateTime;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private $passwordHasher;
    private $gameBuilder;

    public function __construct(UserPasswordHasherInterface $passwordHasher, GameBuilder $gameBuilder)
    {
        $this->passwordHasher = $passwordHasher;
        $this->gameBuilder = $gameBuilder;
    }

    public function load(ObjectManager $manager): void
    {
        $game = new Game();
        $game = $this->gameBuilder->buildGame(1942);
        $manager->persist($game);

        $game1 = new Game();
        $game1 = $this->gameBuilder->buildGame(115);
        $manager->persist($game1);

        $game2 = new Game();
        $game2 = $this->gameBuilder->buildGame(250616);
        $manager->persist($game2);

        $game3 = new Game();
        $game3 = $this->gameBuilder->buildGame(747);
        $manager->persist($game3);

        $game4 = new Game();
        $game4 = $this->gameBuilder->buildGame(9874);
        $manager->persist($game4);

        $game5 = new Game();
        $game5 = $this->gameBuilder->buildGame(241);
        $manager->persist($game5);

        $user = new User();
        $user->setEmail('athos@gamerbox.com');
        $user->setPassword($this->passwordHasher->hashPassword($user, 'gamerbox'));
        $user->setRoles(['ROLE_ADMIN', 'ROLE_USER']);
        $user->setPseudonym('AthosAtreides');
        $user->setProfilePicture("uploads/profilePicture/mario.jpg");
        $manager->persist($user);

        $user1 = new User();
        $user1->setEmail('redsky@gamerbox.com');
        $user1->setPassword($this->passwordHasher->hashPassword($user1, 'redskygamerbox'));
        $user1->setRoles(['ROLE_USER']);
        $user1->setPseudonym('redsky');
        $user1->setProfilePicture("uploads/profilePicture/sonic.jpg");
        $manager->persist($user1);

        $user2 = new User();
        $user2->setEmail('john@gamerbox.com');
        $user2->setPassword($this->passwordHasher->hashPassword($user2, 'johngamerbox'));
        $user2->setRoles(['ROLE_USER']);
        $user2->setPseudonym('john');
        $manager->persist($user2);

        $user3 = new User();
        $user3->setEmail('robot@gamerbox.com');
        $user3->setPassword($this->passwordHasher->hashPassword($user3, 'robotgamerbox'));
        $user3->setRoles(['ROLE_USER']);
        $user3->setPseudonym('Rob0t');
        $user3->setProfilePicture("uploads/profilePicture/robot.png");
        $manager->persist($user3);

        $wishlist = new WishlistGame();
        $wishlist->setUser($user);
        $wishlist->setGame($game);
        $wishlist->setAddedDate(new DateTime());
        $manager->persist($wishlist);

        $wishlist1 = new WishlistGame();
        $wishlist1->setUser($user);
        $wishlist1->setGame($game1);
        $wishlist1->setAddedDate(new DateTime());
        $manager->persist($wishlist1);

        $wishlist2 = new WishlistGame();
        $wishlist2->setUser($user);
        $wishlist2->setGame($game2);
        $wishlist2->setAddedDate(new DateTime());
        $manager->persist($wishlist2);

        $wishlist3 = new WishlistGame();
        $wishlist3->setUser($user2);
        $wishlist3->setGame($game);
        $wishlist3->setAddedDate(new DateTime());
        $manager->persist($wishlist3);

        $wishlist4 = new WishlistGame();
        $wishlist4->setUser($user2);
        $wishlist4->setGame($game2);
        $wishlist4->setAddedDate(new DateTime());
        $manager->persist($wishlist4);

        $wishlist5 = new WishlistGame();
        $wishlist5->setUser($user2);
        $wishlist5->setGame($game3);
        $wishlist5->setAddedDate(new DateTime());
        $manager->persist($wishlist5);

        $wishlist6 = new WishlistGame();
        $wishlist6->setUser($user3);
        $wishlist6->setGame($game);
        $wishlist6->setAddedDate(new DateTime());
        $manager->persist($wishlist6);

        $wishlist7 = new WishlistGame();
        $wishlist7->setUser($user3);
        $wishlist7->setGame($game4);
        $wishlist7->setAddedDate(new DateTime());
        $manager->persist($wishlist7);

        $followList = new Follow();
        $followList->setFollower($user);
        $followList->setFollowed($user1);
        $manager->persist($followList);

        $followList1 = new Follow();
        $followList1->setFollower($user);
        $followList1->setFollowed($user2);
        $manager->persist($followList1);

        $followList2 = new Follow();
        $followList2->setFollower($user);
        $followList2->setFollowed($user3);
        $manager->persist($followList2);

        $followList3 = new Follow();
        $followList3->setFollower($user2);
        $followList3->setFollowed($user3);
        $manager->persist($followList3);

        $review = new Review();
        $review->setUser($user);
        $review->setContent("trop cool");
        $review->setGame($game5);
        $review->setReaction(ReactionEnum::like);
        $manager->persist($review);

        $review1 = new Review();
        $review1->setUser($user1);
        $review1->setContent("pas ouf");
        $review1->setGame($game5);
        $review1->setReaction(ReactionEnum::mitigate);
        $manager->persist($review1);

        $review2 = new Review();
        $review2->setUser($user2);
        $review2->setContent("naze");
        $review2->setGame($game5);
        $review2->setReaction(ReactionEnum::dislike);
        $manager->persist($review2);

        $review3 = new Review();
        $review3->setUser($user3);
        $review3->setContent("que dire...");
        $review3->setGame($game5);
        $review3->setReaction(ReactionEnum::mitigate);
        $manager->persist($review3);

        $review4 = new Review();
        $review4->setUser($user);
        $review4->setContent("trop cool");
        $review4->setGame($game2);
        $review4->setReaction(ReactionEnum::like);
        $manager->persist($review4);

        $review5 = new Review();
        $review5->setUser($user3);
        $review5->setContent("trop cool");
        $review5->setGame($game3);
        $review5->setReaction(ReactionEnum::like);
        $manager->persist($review5);

        $manager->flush();
    }
}
