<?php

namespace App\Repository;

use App\Entity\WishlistGame;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<WishlistGame>
 *
 * @method WishlistGame|null find($id, $lockMode = null, $lockVersion = null)
 * @method WishlistGame|null findOneBy(array $criteria, array $orderBy = null)
 * @method WishlistGame[]    findAll()
 * @method WishlistGame[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WishlistGameRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, WishlistGame::class);
    }

    //    /**
    //     * @return WishlistGame[] Returns an array of WishlistGame objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('w')
    //            ->andWhere('w.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('w.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?WishlistGame
    //    {
    //        return $this->createQueryBuilder('w')
    //            ->andWhere('w.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
