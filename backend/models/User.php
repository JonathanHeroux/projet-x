<?php

class User
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }
    // Find user by username
    public function findByUsername(string $username): array|false
    {
        // Prepare the request to find a user by username
        $request = $this->pdo->prepare("
        SELECT * FROM users WHERE username = :username");

        // Execute the request with received username
        $request->execute([
            "username" => $username,
        ]);

        //Return the user if found
        return $request->fetch(PDO::FETCH_ASSOC);
    }

    public function findById(int $userId): array|false
    {
        $request = $this->pdo->prepare("
        SELECT id,name,username,avatar,created_at FROM users WHERE id = :userId");

        $request->execute([
            "userId" => $userId,
        ]);

        return $request->fetch(PDO::FETCH_ASSOC);
    }

    public function createUser(string $name, string $username, string $password, string $birthDate): array|false
    {
    // Hash the password before storing it
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Prepare the request
    $insert = $this->pdo->prepare("
    INSERT INTO users (name, username, password, birth_date)
    VALUE (:name, :username, :password, :birth_date)");

    // Execute the request and stock the informations
    $insert->execute([
        "name" => $name,
        "username" => $username,
        "password" => $hashedPassword,
        "birth_date" => $birthDate,
    ]);

    $userId = $this->pdo->lastInsertId();

    $request = $this->pdo->prepare("
    SELECT id, name, username, avatar, created_at
    FROM users
    WHERE id = :user_id");

    $request->execute([
        "user_id" => $userId,
    ]);

    return $request->fetch(PDO::FETCH_ASSOC);
    }

    // Retrieve a user's public profile and follower counts
    public function getProfile(string $username): array|false
    {
    $request = $this->pdo->prepare("
        SELECT
        users.id,
        users.name,
        users.username,
        users.avatar,
        users.created_at,
        (
            SELECT COUNT(*)
            FROM follows
            WHERE following_id = users.id
        ) AS followers_count,
        (
            SELECT COUNT(*)
            FROM follows
            WHERE follower_id = users.id
        ) AS following_count
        FROM users
        WHERE users.username = :username");

    $request->execute([
        "username" => $username,
    ]);

    return $request->fetch(PDO::FETCH_ASSOC);
    }

    // Update the authenticated user's avatar
    public function updateAvatar(int $userId, string $avatarPath): bool
    {
    $request = $this->pdo->prepare("
        UPDATE users
        SET avatar = :avatar
        WHERE id = :user_id
    ");

    return $request->execute([
        "avatar" => $avatarPath,
        "user_id" => $userId,
    ]);
}

}