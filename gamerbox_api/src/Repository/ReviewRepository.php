<?php

namespace App\Repository;

use App\Entity\Game;
use App\Entity\Review;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Review>
 *
 * @method Review|null find($id, $lockMode = null, $lockVersion = null)
 * @method Review|null findOneBy(array $criteria, array $orderBy = null)
 * @method Review[]    findAll()
 * @method Review[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ReviewRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Review::class);
    }

    //    /**
    //     * @return Review[] Returns an array of Review objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('r')
    //            ->andWhere('r.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('r.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Review
    //    {
    //        return $this->createQueryBuilder('r')
    //            ->andWhere('r.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function loadMoreGameReview(int $gameId, $offset, EntityManagerInterface $em)
    {
        $qb = $em->createQueryBuilder();

        $qb->add('select', 'r')
            ->add('from', 'App\Entity\Review r')
            ->add('where', 'r.game = :gameId')
            ->add('orderBy', 'r.id ASC')
            ->setFirstResult($offset)
            ->setMaxResults(3)
            ->setParameter('gameId', $gameId);

        $query = $qb->getQuery();
        $result = $query->getResult();

        return $result;
        // $data = [];
        // $lenght = count($result);

        // for ($i = 0; $i < $lenght; $i++) {
        //     $newReview = [
        //         "id" => $result[$i]->getId(),
        //         "user" => ['id' => $result[$i]->getUser()->getId(), 'pseudonym' => $result[$i]->getUser()->getPseudonym(), 'profilePicture' => $result[$i]->getUser()->getProfilePicture()],
        //         "content" => $result[$i]->getContent(),
        //         "liked" => $result[$i]->isLiked(),
        //         "mitigate" => $result[$i]->isMitigate(),
        //         "game"=>['igdbId' => $result[$i]->getGame()->getIgdbId(), 'name' => $result[$i]->getGame()->getName(), 'cover' => $result[$i]->getGame()->getCover()],
        //     ];

        //     array_push($data, $newReview);
        // }

        // return $data;
    }

    public function loadMoreUserReview(int $userId, int $offset, EntityManagerInterface $em)
    {
        $qb = $em->createQueryBuilder();

        $qb->add('select', 'r')
            ->add('from', 'App\Entity\Review r')
            ->add('where', 'r.user = :userId')
            ->add('orderBy', 'r.id ASC')
            ->setFirstResult($offset)
            ->setMaxResults(3)
            ->setParameter('userId', $userId);

        $query = $qb->getQuery();
        $result = $query->getResult();
        return $result;
        // $data = [];
        // $lenght = count($result);

        // for ($i = 0; $i < $lenght; $i++) {
        //     $newReview = [
        //         "id" => $result[$i]->getId(),
        //         "user" => ['id' => $result[$i]->getUser()->getId(), 'pseudonym' => $result[$i]->getUser()->getPseudonym(), 'profilePicture' => $result[$i]->getUser()->getProfilePicture()],
        //         "content" => $result[$i]->getContent(),
        //         "liked" => $result[$i]->isLiked(),
        //         "mitigate" => $result[$i]->isMitigate(),
        //         "game"=>['igdbId' => $result[$i]->getGame()->getIgdbId(), 'name' => $result[$i]->getGame()->getName(), 'cover' => $result[$i]->getGame()->getCover()],
        //     ];

        //     array_push($data, $newReview);
        // }

        // return $data;
    }
}
