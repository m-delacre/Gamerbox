<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240331152545 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE Game (id INT AUTO_INCREMENT NOT NULL, igdb_id INT NOT NULL, name VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, summary LONGTEXT DEFAULT NULL, release_date DATE DEFAULT NULL, developers VARCHAR(255) NOT NULL, banner VARCHAR(255) DEFAULT NULL, cover VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE game_game_mode (game_id INT NOT NULL, game_mode_id INT NOT NULL, INDEX IDX_AE79EA85E48FD905 (game_id), INDEX IDX_AE79EA85E227FA65 (game_mode_id), PRIMARY KEY(game_id, game_mode_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE game_theme (game_id INT NOT NULL, theme_id INT NOT NULL, INDEX IDX_A5469E87E48FD905 (game_id), INDEX IDX_A5469E8759027487 (theme_id), PRIMARY KEY(game_id, theme_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE game_genre (game_id INT NOT NULL, genre_id INT NOT NULL, INDEX IDX_B1634A77E48FD905 (game_id), INDEX IDX_B1634A774296D31F (genre_id), PRIMARY KEY(game_id, genre_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE GameMode (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, igdb_id INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE Genre (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, igdb_id INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE Theme (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, igdb_id INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE User (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, pseudonym VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_2DA17977E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE wishlist (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, INDEX IDX_9CE12A31A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE wishlist_game (wishlist_id INT NOT NULL, game_id INT NOT NULL, INDEX IDX_5814E07AFB8E54CD (wishlist_id), INDEX IDX_5814E07AE48FD905 (game_id), PRIMARY KEY(wishlist_id, game_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE game_game_mode ADD CONSTRAINT FK_AE79EA85E48FD905 FOREIGN KEY (game_id) REFERENCES Game (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE game_game_mode ADD CONSTRAINT FK_AE79EA85E227FA65 FOREIGN KEY (game_mode_id) REFERENCES GameMode (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE game_theme ADD CONSTRAINT FK_A5469E87E48FD905 FOREIGN KEY (game_id) REFERENCES Game (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE game_theme ADD CONSTRAINT FK_A5469E8759027487 FOREIGN KEY (theme_id) REFERENCES Theme (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE game_genre ADD CONSTRAINT FK_B1634A77E48FD905 FOREIGN KEY (game_id) REFERENCES Game (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE game_genre ADD CONSTRAINT FK_B1634A774296D31F FOREIGN KEY (genre_id) REFERENCES Genre (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE wishlist ADD CONSTRAINT FK_9CE12A31A76ED395 FOREIGN KEY (user_id) REFERENCES User (id)');
        $this->addSql('ALTER TABLE wishlist_game ADD CONSTRAINT FK_5814E07AFB8E54CD FOREIGN KEY (wishlist_id) REFERENCES wishlist (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE wishlist_game ADD CONSTRAINT FK_5814E07AE48FD905 FOREIGN KEY (game_id) REFERENCES Game (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE game_game_mode DROP FOREIGN KEY FK_AE79EA85E48FD905');
        $this->addSql('ALTER TABLE game_game_mode DROP FOREIGN KEY FK_AE79EA85E227FA65');
        $this->addSql('ALTER TABLE game_theme DROP FOREIGN KEY FK_A5469E87E48FD905');
        $this->addSql('ALTER TABLE game_theme DROP FOREIGN KEY FK_A5469E8759027487');
        $this->addSql('ALTER TABLE game_genre DROP FOREIGN KEY FK_B1634A77E48FD905');
        $this->addSql('ALTER TABLE game_genre DROP FOREIGN KEY FK_B1634A774296D31F');
        $this->addSql('ALTER TABLE wishlist DROP FOREIGN KEY FK_9CE12A31A76ED395');
        $this->addSql('ALTER TABLE wishlist_game DROP FOREIGN KEY FK_5814E07AFB8E54CD');
        $this->addSql('ALTER TABLE wishlist_game DROP FOREIGN KEY FK_5814E07AE48FD905');
        $this->addSql('DROP TABLE Game');
        $this->addSql('DROP TABLE game_game_mode');
        $this->addSql('DROP TABLE game_theme');
        $this->addSql('DROP TABLE game_genre');
        $this->addSql('DROP TABLE GameMode');
        $this->addSql('DROP TABLE Genre');
        $this->addSql('DROP TABLE Theme');
        $this->addSql('DROP TABLE User');
        $this->addSql('DROP TABLE wishlist');
        $this->addSql('DROP TABLE wishlist_game');
    }
}
