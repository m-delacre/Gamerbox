# :video_game: Gamerbox 
Gamerbox is a personal project that I did to develop my skills, I was inspired by the principle of [Letterboxd](https://letterboxd.com/) but for video games.
   - Front-end: 
     - [ViteJS](https://github.com/vitejs/vite)
     - [React](https://github.com/facebook/react)
     - [TypeScript](https://github.com/microsoft/TypeScript)
    - Back-end:
      - [Symfony](https://github.com/symfony/symfony)
      - [MySQL](https://www.mysql.com/fr/)
## :sparkles: Features
*	Login / Registration
+	Add games to your wishlist
-	Follow your friends
* Game Review 

## :zap: Require / what i used
* [Composer](https://getcomposer.org/)
+ [Symfony-CLI](https://symfony.com/download)
## :package:Installation & :gear:Configuration
Clone this repository :
```
git clone: https://github.com/m-delacre/Gamerbox
```
### Back-end : 
in /gamerbox_api
```
composer install
```
setup your database server and config /gamerbox_api/.env or create .env.local
```php
DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8"
```
to configure the JWT Token see the [LexikJWTAuthenticationBundle](https://github.com/lexik/LexikJWTAuthenticationBundle)
```php
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=tomate
```
Create the database :
```php
php bin/console doctrine:database:create
```
If you use the symfony-cli start your server with :
```php
symfony server:start
```
### Front-end : 
in /gamerbox_front
```javascript
npm i
npm run dev
```