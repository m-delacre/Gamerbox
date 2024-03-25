<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\Context\Normalizer\ObjectNormalizerContextBuilder as ContextBuilder;
use Symfony\Component\Validator\Validator\ValidatorInterface;

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
}
