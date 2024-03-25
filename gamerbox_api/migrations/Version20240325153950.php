<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240325153950 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE wishlist (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, INDEX IDX_9CE12A31A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE wishlist ADD CONSTRAINT FK_9CE12A31A76ED395 FOREIGN KEY (user_id) REFERENCES User (id)');
        $this->addSql('ALTER TABLE game ADD wishlist_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE game ADD CONSTRAINT FK_83199EB2FB8E54CD FOREIGN KEY (wishlist_id) REFERENCES wishlist (id)');
        $this->addSql('CREATE INDEX IDX_83199EB2FB8E54CD ON game (wishlist_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE wishlist DROP FOREIGN KEY FK_9CE12A31A76ED395');
        $this->addSql('DROP TABLE wishlist');
        $this->addSql('ALTER TABLE Game DROP FOREIGN KEY FK_83199EB2FB8E54CD');
        $this->addSql('DROP INDEX IDX_83199EB2FB8E54CD ON Game');
        $this->addSql('ALTER TABLE Game DROP wishlist_id');
    }
}
