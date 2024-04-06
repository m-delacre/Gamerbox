<?php

namespace App\Controller;

use App\Entity\Review;
use App\Entity\User;
use App\Repository\GameRepository;
use App\Repository\ReviewRepository;
use App\Service\GameBuilder;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Context\Normalizer\ObjectNormalizerContextBuilder;
use Symfony\Component\Serializer\SerializerInterface;

class ReviewController extends AbstractController
{
    private $gameBuilder = GameBuilder::class;

    public function __construct(GameBuilder $gameBuilder)
    {

        $this->gameBuilder = $gameBuilder;
    }

    #[Route('/api/review/add/{igdbId}', name: 'app_add_review', methods: ['POST'])]
    public function addReview(int $igdbId, Request $request, GameRepository $gameRepository, EntityManagerInterface $manager, SerializerInterface $serializer): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $game = $gameRepository->findOneByIgdbId($igdbId);

        if(!$game) {
            $game = $this->gameBuilder->buildGame($igdbId);
            $gameRepository->saveGame($game);
        }

        $review = $serializer->deserialize($request->getContent(), Review::class, 'json');
        $review->setGame($game);
        $review->setUser($user);

        $manager->persist($review);
        $manager->flush();

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('review')
            ->toArray();
        $serializedReview = $serializer->serialize($review, 'json', $context);

        return new JsonResponse($serializedReview, Response::HTTP_CREATED, [], true);
    }

    #[Route('/api/review/delete/{id}', name: 'app_delete_review', methods: ['POST'])]
    public function deleteReview(Review $review, Request $request, GameRepository $gameRepository, EntityManagerInterface $manager, SerializerInterface $serializer): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        if(!$review) {
            return new JsonResponse('No reviews', Response::HTTP_NOT_FOUND, [], false);
        }

        if($review->getUser() != $user) {
            return new JsonResponse(Response::HTTP_FORBIDDEN);
        }

        $manager->remove($review);
        $manager->flush();

        return new JsonResponse(Response::HTTP_NO_CONTENT);
    }

    #[Route('/api/review/get/{id}', name: 'app_get_user_reviews', methods: ['GET'])]
    public function getUserReviews(User $user, ReviewRepository $reviewRepository, SerializerInterface $serializer): JsonResponse
    {
        $reviews = $reviewRepository->findByUser($user);

        if(!$reviews) {
            return new JsonResponse('No reviews', Response::HTTP_NOT_FOUND, [], false);
        }

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('review')
            ->toArray();
        $serializedReviews = $serializer->serialize($reviews, 'json', $context);

        return new JsonResponse($serializedReviews, Response::HTTP_CREATED, [], true);
    }
}
