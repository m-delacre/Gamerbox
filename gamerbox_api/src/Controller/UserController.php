<?php

namespace App\Controller;

use App\Entity\Follow;
use App\Entity\User;
use App\Entity\Wishlist;
use App\Repository\FollowRepository;
use App\Repository\UserRepository;
use App\Repository\WishlistRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Context\Normalizer\ObjectNormalizerContextBuilder as ContextBuilder;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Serializer\Context\Normalizer\ObjectNormalizerContextBuilder;

class UserController extends AbstractController
{
    #[Route('/api/register', name: 'api_user_registration', methods:['POST'])]
    public function userRegistration(Request $request, SerializerInterface $serializer, EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher, ValidatorInterface $validator): JsonResponse
    {
        $profilePictureFile = $request->files->get('profilePicture');
        $user = $serializer->deserialize($request->request->get('data'), User::class, 'json');
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($passwordHasher->hashPassword($user, $user->getPassword()));

        if ($profilePictureFile) {
            $newFileName = 'GBOX-' . uniqid() . '.' . $profilePictureFile->guessExtension();
            try {
                $profilePictureFile->move(
                    $this->getParameter('kernel.project_dir') . '/public/uploads/profilePicture/',
                    $newFileName
                );
            } catch (FileException $e) {
                return new JsonResponse($serializer->serialize($e->getMessage(), 'json'), JsonResponse::HTTP_BAD_REQUEST, [], true);
            }

            $user->setProfilePicture('uploads/profilePicture/' . $newFileName);
        } else {
            $user->setProfilePicture(null);
        }

        $errors = $validator->validate($user);
        if ($errors->count() > 0) {
            return new JsonResponse($serializer->serialize($errors, 'json'), JsonResponse::HTTP_BAD_REQUEST, [], true);
        }

        $context = (new ContextBuilder())
            ->withGroups('user_info')
            ->toArray();
        $jsonUser = $serializer->serialize($user, 'json', $context);

        $em->persist($user);
        $em->flush();

        return new JsonResponse($jsonUser, Response::HTTP_CREATED, [], true);
    }

    #[Route('/api/user/wishlist/{id}', name: 'api_user_wishlist', methods: ['GET'])]
    public function getUserWishlist(User $user, SerializerInterface $serializer): JsonResponse
    {
        $wishlist = $user->getWishlistGames();

        if (!$wishlist) {
            return new JsonResponse([], Response::HTTP_OK, [], false);
        }

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('wishlist_game')
            ->toArray();

        $serializedWishlist = $serializer->serialize($wishlist, 'json', $context);

        return new JsonResponse($serializedWishlist, Response::HTTP_CREATED, [], true);
    }

    #[Route('/api/user/{id}', name: 'api_user_info', methods: ['GET'])]
    public function getUserInfo(int $id, SerializerInterface $serializer, UserRepository $userRepository): JsonResponse
    {
        $user = $userRepository->findOneById($id);

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('user_info')
            ->toArray();

        $serializedWishlist = $serializer->serialize($user, 'json', $context);

        return new JsonResponse($serializedWishlist, Response::HTTP_CREATED, [], true);
    }

    #[Route('/api/user/logged', name: 'api_logged_user_info', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function getLoggedUserInfo(SerializerInterface $serializer): JsonResponse
    {
        $user = $this->getUser();

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('user_info')
            ->toArray();

        $serializedWishlist = $serializer->serialize($user, 'json', $context);

        return new JsonResponse($serializedWishlist, Response::HTTP_CREATED, [], true);
    }

    #[Route('/api/user/follow/{id}', name: 'api_user_follow', methods: ['GET'])]
    public function getUserFollowList(User $user, SerializerInterface $serializer): JsonResponse
    {
        $follows = $user->getFollowing();
        $followingUsers = [];

        foreach ($follows as $follow) {
            $followingUsers[] = $follow->getFollowed();
        }

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('user_follower')
            ->toArray();

        $serializedFollowingList = $serializer->serialize($followingUsers, 'json', $context);

        return new JsonResponse($serializedFollowingList, Response::HTTP_CREATED, [], true);
    }

    #[Route('/api/user/follower/{id}', name: 'api_user_follower', methods: ['GET'])]
    public function getUserFollowerList(User $user, SerializerInterface $serializer): JsonResponse
    {
        $follows = $user->getFollowers();
        $followerUsers = [];

        foreach ($follows as $follow) {
            $followerUsers[] = $follow->getFollower();
        }

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('user_follower')
            ->toArray();

        $serializedFollowingList = $serializer->serialize($followerUsers, 'json', $context);

        return new JsonResponse($serializedFollowingList, Response::HTTP_CREATED, [], true);
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/api/follow/add/{id}', name: 'api_add_follow', methods: ['POST'])]
    public function addAFollow(int $id, UserRepository $userRepository, SerializerInterface $serializer, EntityManagerInterface $manager): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $userFollowed = $userRepository->findOneById($id);
        $followersOfUserFollowed = [];

        foreach ($userFollowed->getFollowers() as $follow) {
            $followersOfUserFollowed[] = $follow->getFollower();
        }

        $userIsFollower = false;
        foreach ($followersOfUserFollowed as $follower) {
            if ($follower->getId() === $user->getId()) {
                $userIsFollower = true;
                break;
            }
        }

        if ($userFollowed && $userIsFollower === false) {
            $followList = new Follow();
            $followList->setFollower($user);
            $followList->setFollowed($userFollowed);

            $manager->persist($followList);

            $manager->flush();

            $context = (new ObjectNormalizerContextBuilder())
                ->withGroups('user_follower')
                ->toArray();

            $serializedFollowingList = $serializer->serialize($followList, 'json', $context);

            return new JsonResponse($serializedFollowingList, Response::HTTP_CREATED, [], true);
        } else {
            return new JsonResponse('', Response::HTTP_NOT_FOUND, [], false);
        }
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/api/follow/remove/{id}', name: 'api_remove_follow', methods: ['POST'])]
    public function removeFollowing(int $id, UserRepository $userRepository, FollowRepository $followRepository, SerializerInterface $serializer, EntityManagerInterface $manager): JsonResponse
    {
        $user = $this->getUser();
        $userFollowed = $userRepository->findOneById($id);

        $followToDelete = $followRepository->findOneBy(['follower'=>$user, 'followed' => $userFollowed]);

        if ($followToDelete) {
            $manager->remove($followToDelete);
            $manager->flush();
            return new JsonResponse('Game delete from your wishlist', Response::HTTP_NO_CONTENT, [], true);
        }
    
        return new JsonResponse('', Response::HTTP_NOT_FOUND, [], true);
        
    }
}
