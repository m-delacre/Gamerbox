<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\WishlistRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Context\Normalizer\ObjectNormalizerContextBuilder as ContextBuilder;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Serializer\Context\Normalizer\ObjectNormalizerContextBuilder;

class UserController extends AbstractController
{
    #[Route('/api/register', name: 'api_user_registration')]
    public function userRegistration(Request $request, SerializerInterface $serializer, EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher, ValidatorInterface $validator): JsonResponse
    {
        $user = $serializer->deserialize($request->getContent(), User::class, 'json');
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($passwordHasher->hashPassword($user, $user->getPassword()));

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
    public function getUserWishlist(User $user, WishlistRepository $wishlistRepository, SerializerInterface $serializer): JsonResponse
    {
        $wishlist = $wishlistRepository->findOneByUser($user);

        if (!$wishlist) {
            return new JsonResponse('pas trouvé', Response::HTTP_NOT_FOUND, [], true);
        }

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('wishlist_game')
            ->toArray();

        $serializedWishlist = $serializer->serialize($wishlist->getGame(), 'json', $context);

        return new JsonResponse($serializedWishlist, Response::HTTP_CREATED, [], true);
    }

    #[Route('/api/user', name: 'api_user_info', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function getUserInfo(SerializerInterface $serializer): JsonResponse
    {
        $user = $this->getUser();

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('user_info')
            ->toArray();

        $serializedWishlist = $serializer->serialize($user, 'json', $context);

        return new JsonResponse($serializedWishlist, Response::HTTP_CREATED, [], true);
    }
}
