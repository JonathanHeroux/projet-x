<?php

// Start or resume the user's PHP session
session_start();

// Configure the API response format and cross-origin access
header("Content-Type: application/json; charset=UTF-8");

header("Access-Control-Allow-Origin: http://localhost:5173");

header("Access-Control-Allow-Credentials: true");

header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");

header("Access-Control-Allow-Headers:Content-Type");

// Handle CORS preflight requests before processing the API request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS"){
    http_response_code(204);
    exit;
}

// Load the database connection and application classes
require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../models/Post.php";
require_once __DIR__ . "/../models/User.php";
require_once __DIR__ . "/../controllers/PostController.php";
require_once __DIR__ . "/../controllers/AuthController.php";
require_once __DIR__ . "/../core/Router.php";
require_once __DIR__ . "/../models/Follow.php";
require_once __DIR__ . "/../controllers/FollowController.php";

// Create and inject the application dependencies
$postModel = new Post($pdo);
$userModel = new User($pdo);
$followModel = new Follow($pdo);

$postController = new PostController($postModel);
$authController = new AuthController($userModel);
$followController = new FollowController($followModel, $userModel);
$router = new Router();

// Retrieve the HTTP method and URI of the current request
$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

// Register all available API routes
require_once __DIR__ . "/../routes/routes.php";

// Dispatch the current request to its matching controller action
$router->dispatch($method,$uri);