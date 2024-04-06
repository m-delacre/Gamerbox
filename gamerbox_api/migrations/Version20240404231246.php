<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240404231246 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE wishlist (id INT AUTO_INCREMENT NOT NULL, added_date DATE NOT NULL, user_id INT NOT NULL, UNIQUE INDEX UNIQ_9CE12A31A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE wishlist_game (wishlist_id INT NOT NULL, game_id INT NOT NULL, INDEX IDX_5814E07AFB8E54CD (wishlist_id), INDEX IDX_5814E07AE48FD905 (game_id), PRIMARY KEY(wishlist_id, game_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE wishlist ADD CONSTRAINT FK_9CE12A31A76ED395 FOREIGN KEY (user_id) REFERENCES User (id)');
        $this->addSql('ALTER TABLE wishlist_game ADD CONSTRAINT FK_5814E07AFB8E54CD FOREIGN KEY (wishlist_id) REFERENCES wishlist (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE wishlist_game ADD CONSTRAINT FK_5814E07AE48FD905 FOREIGN KEY (game_id) REFERENCES Game (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE wishlist DROP FOREIGN KEY FK_9CE12A31A76ED395');
        $this->addSql('ALTER TABLE wishlist_game DROP FOREIGN KEY FK_5814E07AFB8E54CD');
        $this->addSql('ALTER TABLE wishlist_game DROP FOREIGN KEY FK_5814E07AE48FD905');
        $this->addSql('DROP TABLE wishlist');
        $this->addSql('DROP TABLE wishlist_game');
    }
}
