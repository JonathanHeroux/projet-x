<?php

class Post
{
    private PDO $pdo;

    // Store the database connection for all model operations
    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    // Retrieve all posts with their associated user information
    public function getAll(): array
    {
        $query = $this->pdo->query("
            SELECT
                posts.id,
                posts.user_id,
                posts.content,
                posts.created_at,
                users.name,
                users.username,
                users.avatar,
                (
                SELECT COUNT(*)
                FROM posts AS replies
                WHERE replies.parent_id = posts.id
                ) AS repliesCount
            FROM posts
            JOIN users
            ON posts.user_id = users.id
            WHERE posts.parent_id IS NULL
            ORDER BY posts.created_at DESC
        ");

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    // Create a new post associated with a user
    public function create(int $userID, string $content): array
    {
        $insert = $this->pdo->prepare("
            INSERT INTO posts (user_id, content)
            VALUE (:user_id, :content)
        ");

        $insert->execute([
            "user_id" => $userID,
            "content" => $content,
        ]);

        // Retrieve the ID generated for the newly created post
        $postId = $this->pdo->lastInsertId();

        // Retrieve the complete post with its associated user information
        $query = $this->pdo->prepare("
            SELECT
                posts.id,
                posts.user_id,
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

        return $query->fetch(PDO::FETCH_ASSOC);
    }
        // Delete a post only if it belongs to the authenticated user
        public function delete(int $postId, int $userID): int
    {
        $delete = $this->pdo->prepare("
            DELETE FROM posts
            WHERE id = :post_id
            AND user_id = :user_id
        ");

        $delete->execute([
            "post_id" => $postId,
            "user_id" => $userID,
        ]);
        return $delete->rowCount();
    }

        // Update a post only if it belongs to the authenticated user
        public function update(int $postId, int $userID, string $content): array|false
    {
        $update = $this->pdo->prepare("
        UPDATE posts
        SET content = :content
        WHERE id = :post_id
        AND user_id = :user_id");

        $update->execute([
            "content" => $content,
            "post_id" => $postId,
            "user_id" => $userID,
        ]);

        // Retrieve the updated post only if it belongs to the user
        $query = $this->pdo->prepare("
            SELECT
                posts.id,
                posts.user_id,
                posts.content,
                posts.created_at,
                users.name,
                users.username,
                users.avatar
            FROM posts
            JOIN users
                ON posts.user_id = users.id
            WHERE posts.id = :post_id
            AND posts.user_id = :user_id
        ");

        $query->execute([
            "post_id" => $postId,
            "user_id" => $userID,
        ]);

        return $query->fetch(PDO::FETCH_ASSOC);
    }

        // Retrieve all posts published by a specific user
        public function getByUserId(int $userId): array
    {
        $request = $this->pdo->prepare("
            SELECT
                posts.id,
                posts.user_id,
                posts.content,
                posts.created_at,
                users.name,
                users.username,
                users.avatar,
                (
                SELECT COUNT(*)
                FROM posts AS replies
                WHERE replies.parent_id = posts.id
                ) AS repliesCount
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE posts.user_id = :user_id
            ORDER BY posts.created_at DESC, posts.id DESC
        ");

        $request->execute([
            "user_id" => $userId,
        ]);

        return $request->fetchAll(PDO::FETCH_ASSOC);
    }

    // Retrieve a single post by its ID
    public function findById(int $postId): array|false
    {
        $request = $this->pdo->prepare("
            SELECT
                posts.id,
                posts.user_id,
                posts.parent_id,
                posts.content,
                posts.created_at,
                users.name,
                users.username,
                users.avatar,
                (
                    SELECT COUNT(*)
                    FROM posts AS replies
                    WHERE replies.parent_id = posts.id
                ) AS repliesCount
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE posts.id = :post_id
        ");

        $request->execute([
            "post_id" => $postId,
        ]);

        return $request->fetch(PDO::FETCH_ASSOC);
    }

    // Create a reply linked to an existing post
    public function createReply(int $userId, int $parentId, string $content): array
    {
        $request = $this->pdo->prepare("
            INSERT INTO posts (user_id, parent_id, content)
            VALUES (:user_id, :parent_id, :content)
        ");

        $request->execute([
            "user_id" => $userId,
            "parent_id" => $parentId,
            "content" => $content,
        ]);

        return $this->findById((int) $this->pdo->lastInsertId());
    }

        // Retrieve the direct replies to a post
        public function getReplies(int $postId): array
    {
        $request = $this->pdo->prepare("
            SELECT
                posts.id,
                posts.user_id,
                posts.parent_id,
                posts.content,
                posts.created_at,
                users.name,
                users.username,
                users.avatar,
                (
                SELECT COUNT(*)
                FROM posts AS replies
                WHERE replies.parent_id = posts.id
                ) AS repliesCount
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE posts.parent_id = :post_id
            ORDER BY posts.created_at ASC, posts.id ASC
        ");

        $request->execute([
            "post_id" => $postId,
        ]);

        return $request->fetchAll(PDO::FETCH_ASSOC);
    }
    // Retrieve posts published by users followed by the authenticated user
        public function getFollowing(int $userId): array
    {
        $request = $this->pdo->prepare("
            SELECT
                posts.id,
                posts.user_id,
                posts.content,
                posts.created_at,
                users.name,
                users.username,
                users.avatar,
                (
                    SELECT COUNT(*)
                    FROM posts AS replies
                    WHERE replies.parent_id = posts.id
                ) AS repliesCount
            FROM posts
            JOIN users ON posts.user_id = users.id
            JOIN follows ON follows.following_id = posts.user_id
            WHERE follows.follower_id = :user_id
            AND posts.parent_id IS NULL
            ORDER BY posts.created_at DESC, posts.id DESC
        ");

        $request->execute([
            "user_id" => $userId,
        ]);

        return $request->fetchAll(PDO::FETCH_ASSOC);
    }

    
}