<?php

class Follow
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    // Follow a user
    public function follow(int $followerId, int $followingId): bool
    {
        $request = $this->pdo->prepare("
            INSERT INTO follows (follower_id, following_id)
            VALUES (:follower_id, :following_id)
        ");

        return $request->execute([
            "follower_id" => $followerId,
            "following_id" => $followingId,
        ]);
    }

    // Unfollow a user
    public function unfollow(int $followerId, int $followingId): bool
    {
        $request = $this->pdo->prepare("
            DELETE FROM follows
            WHERE follower_id = :follower_id
            AND following_id = :following_id
        ");

        $request->execute([
            "follower_id" => $followerId,
            "following_id" => $followingId,
        ]);

        return $request->rowCount() > 0;
    }

    // Check whether a user follows another user
    public function isFollowing(int $followerId, int $followingId): bool
    {
        $request = $this->pdo->prepare("
            SELECT 1 FROM follows
            WHERE follower_id = :follower_id
            AND following_id = :following_id
        ");

        $request->execute([
            "follower_id" => $followerId,
            "following_id" => $followingId,
        ]);

        return $request->fetchColumn() !== false;
    }

    // Retrieve the users followed by the authenticated user
    public function getFollowing(int $userId): array
    {
        $request = $this->pdo->prepare("
            SELECT
                users.id,
                users.name,
                users.username,
                users.avatar
            FROM follows
            INNER JOIN users
                ON users.id = follows.following_id
            WHERE follows.follower_id = :user_id
            ORDER BY users.name ASC
        ");

        $request->execute([
            "user_id" => $userId,
        ]);

        return $request->fetchAll(PDO::FETCH_ASSOC);
    }
}