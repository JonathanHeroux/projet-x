<?php
// Code pour hostinger et ses chemins. Doit être adapté si mise en ligne ailleurs
require_once dirname(__DIR__, 3) . "/projet-x-backend/config/database.php";

require_once dirname(__DIR__, 3) . "/projet-x-backend/models/Post.php";
require_once dirname(__DIR__, 3) . "/projet-x-backend/models/User.php";
require_once dirname(__DIR__, 3) . "/projet-x-backend/models/Follow.php";

require_once dirname(__DIR__, 3) . "/projet-x-backend/controllers/PostController.php";
require_once dirname(__DIR__, 3) . "/projet-x-backend/controllers/AuthController.php";
require_once dirname(__DIR__, 3) . "/projet-x-backend/controllers/FollowController.php";

require_once dirname(__DIR__, 3) . "/projet-x-backend/core/Router.php";

session_start();

header("Content-Type: application/json; charset=UTF-8");

$postModel = new Post($pdo);
$userModel = new User($pdo);
$followModel = new Follow($pdo);

$postController = new PostController($postModel);
$authController = new AuthController($userModel);
$followController = new FollowController($followModel, $userModel);

$router = new Router();

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

// Retirer le préfixe /api pour retrouver les routes PHP existantes
$uri = preg_replace("#^/api#", "", $uri);

require_once dirname(__DIR__, 3) . "/projet-x-backend/routes/routes.php";

$router->dispatch($method, $uri);