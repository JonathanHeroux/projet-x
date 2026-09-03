<?php

header("Content-Type: application/json; charset=UTF-8");

header("Access-Control-Allow-Origin: http://localhost:5173");

header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");

header("Access-Control-Allow-Headers:Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS"){
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/../config/database.php";

$method = $_SERVER["REQUEST_METHOD"];

if($method === "GET"){
$query = $pdo->query("SELECT 
posts.id, posts.content, posts.created_at, users.name, users.username, users.avatar FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC");

$posts = $query->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($posts, JSON_UNESCAPED_UNICODE);
exit;
}
if($method === "POST"){
    $body = file_get_contents("php://input");
    $data = json_decode($body,true);

    $content = trim($data["content"] ?? "");
    $userID = (int) ($data["user_id"] ?? 0);
    if ($content === "" || mb_strlen($content) > 276) {
        http_response_code(422);
        echo json_encode([
            "error" => "Content must contain between 1 and 276 characters."
        ]);
        exit;
    }
    
    if($userID <= 0){
        http_response_code(422);
        echo json_encode([
            "error" => "A valid user is required."
        ]);
        exit;
    }

    $insert = $pdo->prepare("INSERT INTO posts (user_id, content)VALUE (:user_id, :content)");
    $insert-> execute(["user_id" => $userID, "content" => $content,]);
    $postId = $pdo->lastInsertId();
    $query = $pdo->prepare("SELECT posts.id,posts.content, posts.created_at, users.name, users.username, users.avatar FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = :post_id");
    $query->execute([
        "post_id" => $postId,
    ]);
    $newPost = $query ->fetch(PDO::FETCH_ASSOC);
    http_response_code(201);
    echo json_encode($newPost, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === "DELETE") {
    $postId = (int) ($_GET["id"] ?? 0);

    if ($postId <= 0) {
        http_response_code(422);

        echo json_encode([
            "error" => "A valid post id is required."
        ]);

        exit;
    }

    $delete = $pdo->prepare("
        DELETE FROM posts
        WHERE id = :post_id
    ");

    $delete->execute([
        "post_id" => $postId,
    ]);

    http_response_code(200);

    echo json_encode([
        "message" => "Post deleted successfully."
    ]);

    exit;
}
if ($method === "PATCH") {
    $postId = (int) ($_GET["id"] ?? 0);

    $body = file_get_contents("php://input");
    $data = json_decode($body, true);

    $content = trim($data["content"] ?? "");

    if ($postId <= 0) {
        http_response_code(422);

        echo json_encode([
            "error" => "A valid post id is required."
        ]);

        exit;
    }

    if ($content === "" || mb_strlen($content) > 276) {
        http_response_code(422);

        echo json_encode([
            "error" => "Content must contain between 1 and 276 characters."
        ]);

        exit;
    }

    $update = $pdo->prepare("
        UPDATE posts
        SET content = :content
        WHERE id = :post_id
    ");

    $update->execute([
        "content" => $content,
        "post_id" => $postId,
    ]);

    $query = $pdo->prepare("
        SELECT
            posts.id,
            posts.content,
            posts.created_at,
            users.name,
            users.username,
            users.avatar
        FROM posts
        JOIN users
            ON posts.user_id = users.id
        WHERE posts.id = :post_id
    ");

    $query->execute([
        "post_id" => $postId,
    ]);

    $updatedPost = $query->fetch(PDO::FETCH_ASSOC);

    http_response_code(200);

    echo json_encode(
        $updatedPost,
        JSON_UNESCAPED_UNICODE
    );

    exit;
}
http_response_code(405);
echo json_encode([
    "error" => "Methode not allowed."
]);