<?php

namespace App\DataFixtures;

use App\Entity\Follow;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;    
    }

    public function load(ObjectManager $manager): void
    {
        $user = new User();
        $user->setEmail('athos@gamerbox.com');
        $user->setPassword($this->passwordHasher->hashPassword($user, 'gamerbox'));
        $user->setRoles(['ROLE_ADMIN','ROLE_USER']);
        $user->setPseudonym('AthosAtreides');
        $manager->persist($user);

        $user1 = new User();
        $user1->setEmail('redsky@gamerbox.com');
        $user1->setPassword($this->passwordHasher->hashPassword($user1, 'redskygamerbox'));
        $user1->setRoles(['ROLE_USER']);
        $user1->setPseudonym('redsky');
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
        $manager->persist($user3);

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

        $followList4 = new Follow();
        $followList4->setFollower($user2);
        $followList4->setFollowed($user);
        $manager->persist($followList4);

        $manager->flush();
    }
}
