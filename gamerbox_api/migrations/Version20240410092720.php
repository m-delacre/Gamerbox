<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240410092720 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE Game (id INT AUTO_INCREMENT NOT NULL, igdb_id INT NOT NULL, name VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, summary LONGTEXT DEFAULT NULL, release_date DATE DEFAULT NULL, developers VARCHAR(255) DEFAULT NULL, banner VARCHAR(255) DEFAULT NULL, cover VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE game_game_mode (game_id INT NOT NULL, game_mode_id INT NOT NULL, INDEX IDX_AE79EA85E48FD905 (game_id), INDEX IDX_AE79EA85E227FA65 (game_mode_id), PRIMARY KEY(game_id, game_mode_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE game_theme (game_id INT NOT NULL, theme_id INT NOT NULL, INDEX IDX_A5469E87E48FD905 (game_id), INDEX IDX_A5469E8759027487 (theme_id), PRIMARY KEY(game_id, theme_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE game_genre (game_id INT NOT NULL, genre_id INT NOT NULL, INDEX IDX_B1634A77E48FD905 (game_id), INDEX IDX_B1634A774296D31F (genre_id), PRIMARY KEY(game_id, genre_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE GameMode (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, igdb_id INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE Genre (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, igdb_id INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE Theme (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, igdb_id INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE User (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, pseudonym VARCHAR(255) NOT NULL, profile_picture VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_2DA17977E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE follow (id INT AUTO_INCREMENT NOT NULL, follower_id INT DEFAULT NULL, followed_id INT DEFAULT NULL, INDEX IDX_68344470AC24F853 (follower_id), INDEX IDX_68344470D956F010 (followed_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE review (id INT AUTO_INCREMENT NOT NULL, content LONGTEXT NOT NULL, liked TINYINT(1) DEFAULT NULL, mitigate TINYINT(1) DEFAULT NULL, user_id INT DEFAULT NULL, game_id INT NOT NULL, INDEX IDX_794381C6A76ED395 (user_id), INDEX IDX_794381C6E48FD905 (game_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE wishlist_game (id INT AUTO_INCREMENT NOT NULL, added_add DATETIME NOT NULL, game_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_5814E07AE48FD905 (game_id), INDEX IDX_5814E07AA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE game_game_mode ADD CONSTRAINT FK_AE79EA85E48FD905 FOREIGN KEY (game_id) REFERENCES Game (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE game_game_mode ADD CONSTRAINT FK_AE79EA85E227FA65 FOREIGN KEY (game_mode_id) REFERENCES GameMode (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE game_theme ADD CONSTRAINT FK_A5469E87E48FD905 FOREIGN KEY (game_id) REFERENCES Game (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE game_theme ADD CONSTRAINT FK_A5469E8759027487 FOREIGN KEY (theme_id) REFERENCES Theme (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE game_genre ADD CONSTRAINT FK_B1634A77E48FD905 FOREIGN KEY (game_id) REFERENCES Game (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE game_genre ADD CONSTRAINT FK_B1634A774296D31F FOREIGN KEY (genre_id) REFERENCES Genre (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE follow ADD CONSTRAINT FK_68344470AC24F853 FOREIGN KEY (follower_id) REFERENCES User (id)');
        $this->addSql('ALTER TABLE follow ADD CONSTRAINT FK_68344470D956F010 FOREIGN KEY (followed_id) REFERENCES User (id)');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT FK_794381C6A76ED395 FOREIGN KEY (user_id) REFERENCES User (id)');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT FK_794381C6E48FD905 FOREIGN KEY (game_id) REFERENCES Game (id)');
        $this->addSql('ALTER TABLE wishlist_game ADD CONSTRAINT FK_5814E07AE48FD905 FOREIGN KEY (game_id) REFERENCES Game (id)');
        $this->addSql('ALTER TABLE wishlist_game ADD CONSTRAINT FK_5814E07AA76ED395 FOREIGN KEY (user_id) REFERENCES User (id)');
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
        $this->addSql('ALTER TABLE follow DROP FOREIGN KEY FK_68344470AC24F853');
        $this->addSql('ALTER TABLE follow DROP FOREIGN KEY FK_68344470D956F010');
        $this->addSql('ALTER TABLE review DROP FOREIGN KEY FK_794381C6A76ED395');
        $this->addSql('ALTER TABLE review DROP FOREIGN KEY FK_794381C6E48FD905');
        $this->addSql('ALTER TABLE wishlist_game DROP FOREIGN KEY FK_5814E07AE48FD905');
        $this->addSql('ALTER TABLE wishlist_game DROP FOREIGN KEY FK_5814E07AA76ED395');
        $this->addSql('DROP TABLE Game');
        $this->addSql('DROP TABLE game_game_mode');
        $this->addSql('DROP TABLE game_theme');
        $this->addSql('DROP TABLE game_genre');
        $this->addSql('DROP TABLE GameMode');
        $this->addSql('DROP TABLE Genre');
        $this->addSql('DROP TABLE Theme');
        $this->addSql('DROP TABLE User');
        $this->addSql('DROP TABLE follow');
        $this->addSql('DROP TABLE review');
        $this->addSql('DROP TABLE wishlist_game');
    }
}
