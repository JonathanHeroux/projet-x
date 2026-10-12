<?php

class PostController
{
    // Keep the Post model 
    private Post $postModel;

    // Receive the Post model when new PostController is created and use it in the controller
    public function __construct(Post $postModel)
    {
        // Take the received Post and store it in postModel
        $this->postModel = $postModel;
    }

     // Retrieve all posts from the model and return them as JSON
    public function getAll(): void
    {
        $posts = $this->postModel->getAll();

        echo json_encode(
            $posts,
            JSON_UNESCAPED_UNICODE
        );
    }
    
     // Validate the request data and create a new post    
        public function create(): void
    {
        // Get the authenticated user ID from the PHP session
        $userID = $_SESSION["user_id"] ?? null;

        // Reject requests from unauthenticated users
        if ($userID === null)
        {
        http_response_code(401);

        echo json_encode([
            "error" => "Authentication required."
        ]);

        return;
        }
        
        // Read and decode the JSON request body
        $body = file_get_contents("php://input");
        $data = json_decode($body, true);

        $content = trim($data["content"] ?? "");

        // Validate the post content
        if ($content === "" || mb_strlen($content) > 276) 
        {
        http_response_code(422);

        echo json_encode([
            "error" => "Content must contain between 1 and 276 characters."
        ]);

        return;
        }

        // Create the post using the authenticated user's ID
        $newPost = $this->postModel->create($userID, $content);

        http_response_code(201);

        echo json_encode(
            $newPost,
            JSON_UNESCAPED_UNICODE
        );
    }


        // Validate authentication and ownership before deleting a post
        public function delete(): void
    {
        $userID = $_SESSION["user_id"] ?? null;

        if ($userID === null) {
            http_response_code(401);
            echo json_encode([
                "error" => "Authentication required."
            ]);
            return;
        }

        $postId = (int) ($_GET["id"] ?? 0);

        if ($postId <= 0) {
            http_response_code(422);
            echo json_encode([
                "error" => "A valid post id is required."
            ]);
            return;
        }

        $deleted = $this->postModel->delete($postId, $userID);

        if ($deleted === 0) {
            http_response_code(404);
            echo json_encode([
                "error" => "Post not found."
            ]);
            return;
        }

        http_response_code(200);
        echo json_encode([
            "message" => "Post deleted successfully."
        ]);
    }

        // Validate authentication and ownership before updating a post
        public function update(): void
    {
        $userID = $_SESSION["user_id"] ?? null;

        if ($userID === null) {
            http_response_code(401);
            echo json_encode([
                "error" => "Authentication required."
            ]);
            return;
        }

        $postId = (int) ($_GET["id"] ?? 0);

        // Read and decode the JSON request body
        $body = file_get_contents("php://input");
        $data = json_decode($body, true);

        $content = trim($data["content"] ?? "");

        if ($postId <= 0) {
            http_response_code(422);
            echo json_encode([
                "error" => "A valid post id is required."
            ]);
            return;
        }

        if ($content === "" || mb_strlen($content) > 276) {
            http_response_code(422);
            echo json_encode([
                "error" => "Content must contain between 1 and 276 characters."
            ]);
            return;
        }

        $updatedPost = $this->postModel->update($postId, $userID, $content);

        if ($updatedPost === false) {
            http_response_code(404);
            echo json_encode([
                "error" => "Post not found."
            ]);
            return;
        }

        http_response_code(200);
        echo json_encode(
            $updatedPost,
            JSON_UNESCAPED_UNICODE
        );
    }

        // Return posts published by a specific user
        public function getByUser(): void
    {
        $userId = filter_input(INPUT_GET, "user_id", FILTER_VALIDATE_INT);

        if ($userId === false || $userId === null || $userId <= 0) {
            http_response_code(422);
            echo json_encode(["error" => "Invalid user ID"]);
            return;
        }

        $posts = $this->postModel->getByUserId($userId);

        http_response_code(200);
        echo json_encode($posts, JSON_UNESCAPED_UNICODE);
    }

    // Return a single post
    public function getOne(): void
    {
        $postId = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

        if (!$postId || $postId <= 0) {
            http_response_code(422);
            echo json_encode(["error" => "Invalid post ID"]);
            return;
        }

        $post = $this->postModel->findById($postId);

        if ($post === false) {
            http_response_code(404);
            echo json_encode(["error" => "Post not found"]);
            return;
        }

        echo json_encode($post, JSON_UNESCAPED_UNICODE);
    }

    // Validate and publish a reply
    public function reply(): void
    {
        $userId = $_SESSION["user_id"] ?? null;

        if ($userId === null) {
            http_response_code(401);
            echo json_encode(["error" => "Authentication required"]);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);

        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON body"]);
            return;
        }

        $parentId = filter_var($data["parent_id"] ?? null, FILTER_VALIDATE_INT);
        $content = $data["content"] ?? null;

        if (!$parentId || $parentId <= 0) {
            http_response_code(422);
            echo json_encode(["error" => "Invalid parent post ID"]);
            return;
        }

        if (!is_string($content)) {
            http_response_code(422);
            echo json_encode(["error" => "Invalid reply content"]);
            return;
        }

        $content = trim($content);

        if ($content === "" || mb_strlen($content) > 276) {
            http_response_code(422);
            echo json_encode(["error" => "Reply must contain between 1 and 276 characters"]);
            return;
        }

        if ($this->postModel->findById($parentId) === false) {
            http_response_code(404);
            echo json_encode(["error" => "Original post not found"]);
            return;
        }

        $reply = $this->postModel->createReply((int) $userId, $parentId, $content);

        http_response_code(201);
        echo json_encode($reply, JSON_UNESCAPED_UNICODE);
    }

        // Return all direct replies to a post
        public function getReplies(): void
    {
        $postId = filter_input(INPUT_GET, "post_id", FILTER_VALIDATE_INT);

        if (!$postId || $postId <= 0) {
            http_response_code(422);
            echo json_encode(["error" => "Invalid post ID"]);
            return;
        }

        if ($this->postModel->findById($postId) === false) {
            http_response_code(404);
            echo json_encode(["error" => "Original post not found"]);
            return;
        }

        $replies = $this->postModel->getReplies($postId);

        echo json_encode($replies, JSON_UNESCAPED_UNICODE);
    }

    // Retrieve posts from accounts followed by the authenticated user
    public function getFollowing(): void
    {
    $userId = $_SESSION["user_id"] ?? null;

    if ($userId === null) {
        http_response_code(401);
        echo json_encode(["error" => "Authentication required."]);
        return;
    }

    $posts = $this->postModel->getFollowing((int) $userId);

    echo json_encode($posts, JSON_UNESCAPED_UNICODE);
    }
}