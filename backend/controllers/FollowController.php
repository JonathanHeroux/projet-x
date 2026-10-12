<?php

class FollowController
{
    private Follow $followModel;
    private User $userModel;

    public function __construct(Follow $followModel, User $userModel)
    {
        $this->followModel = $followModel;
        $this->userModel = $userModel;
    }

    // Follow another user
    public function follow(): void
    {
        // Retrieve and validate the target user ID
        $followingId = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

        if ($followingId === false || $followingId === null || $followingId <= 0) {
            http_response_code(422);
            echo json_encode(["error" => "Invalid user ID"]);
            return;
        }

        // Get the authenticated user ID from the session
        $followerId = $_SESSION["user_id"] ?? null;

        if ($followerId === null) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            return;
        }

        // Prevent users from following themselves
        if ((int) $followerId === $followingId) {
            http_response_code(422);
            echo json_encode(["error" => "You cannot follow yourself"]);
            return;
        }

        // Check whether the target user exists
        if ($this->userModel->findById($followingId) === false) {
            http_response_code(404);
            echo json_encode(["error" => "User not found"]);
            return;
        }

        // Prevent duplicate follow relationships
        if ($this->followModel->isFollowing((int) $followerId, $followingId)) {
            http_response_code(409);
            echo json_encode(["error" => "Already following this user"]);
            return;
        }

        // Create the follow relationship
        $created = $this->followModel->follow((int) $followerId, $followingId);

        if (!$created) {
            http_response_code(500);
            echo json_encode(["error" => "Unable to follow user"]);
            return;
        }

        http_response_code(201);
        echo json_encode(["message" => "User followed successfully"]);
    }

    // Unfollow another user
    public function unfollow(): void
    {
        // Retrieve and validate the target user ID
        $followingId = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

        if ($followingId === false || $followingId === null || $followingId <= 0) {
            http_response_code(422);
            echo json_encode(["error" => "Invalid user ID"]);
            return;
        }

        // Get the authenticated user ID from the session
        $followerId = $_SESSION["user_id"] ?? null;

        if ($followerId === null) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            return;
        }

        // Delete the follow relationship
        $deleted = $this->followModel->unfollow((int) $followerId, $followingId);

        if (!$deleted) {
            http_response_code(404);
            echo json_encode(["error" => "Follow relationship not found"]);
            return;
        }

        http_response_code(200);
        echo json_encode(["message" => "User unfollowed successfully"]);
    }

    // Check whether the authenticated user follows another user
    public function status(): void
    {
        // Retrieve and validate the target user ID
        $followingId = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

        if ($followingId === false || $followingId === null || $followingId <= 0) {
            http_response_code(422);
            echo json_encode(["error" => "Invalid user ID"]);
            return;
        }

        // Get the authenticated user ID from the session
        $followerId = $_SESSION["user_id"] ?? null;

        if ($followerId === null) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            return;
        }

        // Check whether the target user exists
        if ($this->userModel->findById($followingId) === false) {
            http_response_code(404);
            echo json_encode(["error" => "User not found"]);
            return;
        }

        // Retrieve the follow relationship status
        $isFollowing = $this->followModel->isFollowing(
            (int) $followerId,
            $followingId
        );

        http_response_code(200);
        echo json_encode(["following" => $isFollowing]);
    }

    // Retrieve the authenticated user's following list
    public function following(): void
    {
        $userId = $_SESSION["user_id"] ?? null;

        if ($userId === null) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            return;
        }

        $users = $this->followModel->getFollowing((int) $userId);

        http_response_code(200);
        echo json_encode($users);
    }
}