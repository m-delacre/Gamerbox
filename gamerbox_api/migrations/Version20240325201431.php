<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240325201431 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE wishlist_game (wishlist_id INT NOT NULL, game_id INT NOT NULL, INDEX IDX_5814E07AFB8E54CD (wishlist_id), INDEX IDX_5814E07AE48FD905 (game_id), PRIMARY KEY(wishlist_id, game_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE wishlist_game ADD CONSTRAINT FK_5814E07AFB8E54CD FOREIGN KEY (wishlist_id) REFERENCES wishlist (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE wishlist_game ADD CONSTRAINT FK_5814E07AE48FD905 FOREIGN KEY (game_id) REFERENCES Game (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE game DROP FOREIGN KEY FK_83199EB2FB8E54CD');
        $this->addSql('DROP INDEX IDX_83199EB2FB8E54CD ON game');
        $this->addSql('ALTER TABLE game DROP wishlist_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE wishlist_game DROP FOREIGN KEY FK_5814E07AFB8E54CD');
        $this->addSql('ALTER TABLE wishlist_game DROP FOREIGN KEY FK_5814E07AE48FD905');
        $this->addSql('DROP TABLE wishlist_game');
        $this->addSql('ALTER TABLE Game ADD wishlist_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE Game ADD CONSTRAINT FK_83199EB2FB8E54CD FOREIGN KEY (wishlist_id) REFERENCES wishlist (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_83199EB2FB8E54CD ON Game (wishlist_id)');
    }
}
