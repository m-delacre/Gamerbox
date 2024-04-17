<?php

namespace App\Controller;

use App\Entity\ReactionEnum;
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
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ReviewController extends AbstractController
{
    private $gameBuilder = GameBuilder::class;

    public function __construct(GameBuilder $gameBuilder)
    {

        $this->gameBuilder = $gameBuilder;
    }

    #[Route('/api/review/add/{igdbId}', name: 'app_add_review', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function addReview(int $igdbId, Request $request, ReviewRepository $reviewRepository, GameRepository $gameRepository, EntityManagerInterface $manager, SerializerInterface $serializer): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $game = $gameRepository->findOneByIgdbId($igdbId);
        $checkReviewed = $reviewRepository->findBy(['user' => $user, 'game' => $game]);

        if ($checkReviewed) {
            return new JsonResponse('Already reviewed', Response::HTTP_NOT_ACCEPTABLE, [], false);
        }

        if (!$game) {
            $game = $this->gameBuilder->buildGame($igdbId);
            $gameRepository->saveGame($game);
        }

        $requestData = json_decode($request->getContent(), true);
        $content = $requestData['content'];
        $reaction = $requestData['reaction'];

        $review = new Review();
        $review->setContent($content);

        if ($reaction === ReactionEnum::like->value) {
            $review->setReaction(ReactionEnum::like);
        }

        if ($reaction === ReactionEnum::dislike->value) {
            $review->setReaction(ReactionEnum::dislike);
        }

        if ($reaction === ReactionEnum::mitigate->value) {
            $review->setReaction(ReactionEnum::mitigate);
        }

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

    #[Route('/api/review/check/{igdbId}', name: 'app_check_review', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function checkReview(int $igdbId, ReviewRepository $reviewRepository, GameRepository $gameRepository, SerializerInterface $serializer): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $game = $gameRepository->findOneByIgdbId($igdbId);
        $checkReviewed = $reviewRepository->findBy(['user' => $user, 'game' => $game]);

        if (!$game) {
            return new JsonResponse(Response::HTTP_NOT_FOUND);
        }

        if (!$checkReviewed) {
            $data = ['reviewed' => false];
            $serializedData = $serializer->serialize($data, 'json');
            return new JsonResponse($serializedData, Response::HTTP_ACCEPTED, [], true);
        }

        $data = ['reviewed' => true];
        $serializedData = $serializer->serialize($data, 'json');
        return new JsonResponse($serializedData, Response::HTTP_ACCEPTED, [], true);
    }

    #[Route('/api/review/delete/{id}', name: 'app_delete_review', methods: ['POST'])]
    public function deleteReview(Review $review, EntityManagerInterface $manager): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();

        if (!$review) {
            return new JsonResponse('No reviews', Response::HTTP_NOT_FOUND, [], false);
        }

        if ($review->getUser() != $user) {
            return new JsonResponse(Response::HTTP_FORBIDDEN);
        }

        $manager->remove($review);
        $manager->flush();

        return new JsonResponse(Response::HTTP_NO_CONTENT);
    }

    #[Route('/api/review/get/{id}', name: 'app_get_user_reviews', methods: ['GET'])]
    public function getUserReviews(User $user, ReviewRepository $reviewRepository, Request $request, SerializerInterface $serializer, EntityManagerInterface $em): JsonResponse
    {
        $offset = $request->query->get('offset');
        if ($offset) {
            $reviews = $reviewRepository->loadMoreUserReview($user->getId(), $offset, $em);
        } else {
            $reviews = $reviewRepository->loadMoreUserReview($user->getId(), 0, $em);
        }

        if (!$reviews) {
            return new JsonResponse([], Response::HTTP_OK, [], false);
        }

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('review')
            ->toArray();
        $serializedReviews = $serializer->serialize($reviews, 'json', $context);

        return new JsonResponse($serializedReviews, Response::HTTP_CREATED, [], true);
    }
}
