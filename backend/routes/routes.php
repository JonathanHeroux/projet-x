<?php

// Define all available API endpoints
$routes = [
    ["GET", "/posts", [$postController, "getAll"]],
    ["POST", "/posts", [$postController, "create"]],
    ["DELETE", "/posts", [$postController, "delete"]],
    ["PATCH", "/posts", [$postController, "update"]],
    ["GET", "/users/posts", [$postController, "getByUser"]],
    ["GET", "/posts/detail", [$postController, "getOne"]],
    ["POST", "/posts/reply", [$postController, "reply"]],
    ["GET", "/posts/replies", [$postController, "getReplies"]],
    ["GET", "/posts/following", [$postController, "getFollowing"]],

    ["POST", "/login", [$authController, "login"]],
    ["POST", "/signup", [$authController, "signup"]],
    ["GET", "/me", [$authController, "connected"]],
    ["POST", "/logout", [$authController, "logout"]],
    ["GET", "/username-available", [$authController, "checkUsername"]],
    ["GET", "/users/profile", [$authController, "profile"]],
    ["POST", "/users/avatar", [$authController, "updateAvatar"]],

    ["POST", "/users/follow", [$followController, "follow"]],
    ["DELETE", "/users/follow", [$followController, "unfollow"]],
    ["GET", "/users/follow-status", [$followController, "status"]],
    ["GET", "/users/following", [$followController, "following"]],

];

// Register every route in the Router
foreach ($routes as $route) {
    $router->addRoute(...$route);
}