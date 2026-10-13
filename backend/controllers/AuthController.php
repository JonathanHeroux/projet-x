<?php

class AuthController
{
    // Keep the User model
    private User $userModel;

    // Receive the User model when new AuthController is created and use it in the controller
    public function __construct(User $userModel)
    {
        // Take the received User and store it in userModel
        $this->userModel = $userModel;
    }
    
    // Validate signup data, create the user and start the authenticated session
    public function signup(): void
    {
        // Receive the HTTP request body and store it in body
        $body = file_get_contents("php://input");
        // Translate JSON to PHP array (associative) and store it in data
        $data = json_decode($body, true);
        
        // Stock the user data
        $name = trim($data["name"] ?? "");
        $username = trim($data["username"]?? "");
        $password = $data["password"] ?? "";
        $birthDate = $data["birth_date"] ?? "";

        // Check all the fields are not empty
        if( $name === "" || $username === "" || $password === ""){
            http_response_code(422);
            echo json_encode([
                "error" => "Every fields are required"
            ]);
            return;
        }
        // Validate the birth date format and calendar validity
        $date = is_string($birthDate)
            ? DateTimeImmutable::createFromFormat("!Y-m-d", $birthDate)
            : false;

        if (
            $date === false ||
            $date->format("Y-m-d") !== $birthDate ||
            $date > new DateTimeImmutable("today")
        ) {
            http_response_code(422);
            echo json_encode([
                "error" => "Invalid birth date."
            ]);
            return;
        }

        // Find the user by username
        $existingUser = $this->userModel->findByUsername($username);
        
        // Error if the user already exist
        if($existingUser !== false){
            http_response_code(409);
            echo json_encode([
                "error"=> "Username already taken"
            ]);
            return;
        }

        // Create new user and stock it in newUser
        $newUser = $this->userModel->createUser($name,$username,$password,$birthDate);

        // Stop the signup process if the user creation failed
        if($newUser === false){
            http_response_code(500);
            echo json_encode([
                "error" => "Can't create user"
            ]);
            return;
        }

        // Store the authenticated user ID in the server-side session
        $_SESSION["user_id"] = $newUser["id"];

        http_response_code(201);

        echo json_encode(
            $newUser, JSON_UNESCAPED_UNICODE
        );

    }

    // Validate credentials and start an authenticated session
    public function login(): void
    {
        // Receive the HTTP request body and store it in body
        $body = file_get_contents("php://input");
        // Translate JSON to PHP array (associative) and store it in data
        $data = json_decode($body,true);

        // Stock the user data
        $username = trim($data["username"] ?? "");
        $password = $data["password"] ?? "";

        // Check all the fields are not empty
        if($username === "" || $password === ""){
            http_response_code(422);
            echo json_encode([
               "error" => "Every fields are required" 
            ]);
            return;
        }

        // Find the user by username
        $existingUser = $this->userModel->findByUsername($username);

        // Error if the user doesn't exist
        if($existingUser === false){
            http_response_code(401);
            echo json_encode([
                "error"=> "Invalid username or password"
            ]);
            return;
        }

        // Verify the submitted password against the stored password hash
        if( password_verify($password,$existingUser["password"]) === false){
            http_response_code(401);
            echo json_encode([
                "error"=> "Invalid username or password"
            ]);
            return;

        }

        // Build a safe user response without exposing the password hash
        $validUser = [
            "id" => $existingUser["id"],
            "name" => $existingUser["name"],
            "username" => $existingUser["username"],
            "avatar" => $existingUser["avatar"],
            "createdAt" => $existingUser["created_at"],
        ];
        
        // Store the authenticated user ID in the server-side session
        $_SESSION["user_id"] = $validUser["id"];

        http_response_code(200);

        echo json_encode(
            $validUser, JSON_UNESCAPED_UNICODE
        );
    }

    // Return the currently authenticated user from the active session
    public function connected():void
    {
        // Retrieve the authenticated user ID from the session
        $userId = $_SESSION["user_id"] ?? null;

        // Reject the request when no authenticated session exists
        if($userId === null){
            
            http_response_code(401);
            echo json_encode([
                "error"=> "Session expired"
            ]);
            return;
        }

        // Retrieve the current user using the trusted session ID
        $connectedByUserId = $this->userModel->findById($userId);

        // Reject stale sessions whose user no longer exists
        if($connectedByUserId === false){
            http_response_code(401);
            echo json_encode([
                "error"=> "Session expired"
            ]);
            return;

        }

        http_response_code(200);
        echo json_encode(
            $connectedByUserId, JSON_UNESCAPED_UNICODE
        );
        
    }
    
    public function logout():void
    {
        session_unset();
        session_destroy();

        setcookie(session_name(), "", [
        "expires" => time() - 3600,
        "path" => "/",
        "httponly" => true,
        ]);

        http_response_code(200);
        echo json_encode([
            "message" => "Logout successful"
        ]);
    }

    // Check whether a username is already registered
    public function checkUsername(): void
{
    $username = trim($_GET["username"] ?? "");

    if ($username === "") {
        http_response_code(422);

        echo json_encode([
            "error" => "Username is required."
        ]);

        return;
    }

    $user = $this->userModel->findByUsername($username);

    echo json_encode([
        "available" => $user === false
    ]);
}

// Return a user's public profile
public function profile(): void
{
    $username = trim($_GET["username"] ?? "");

    if ($username === "") {
        http_response_code(422);
        echo json_encode(["error" => "Username is required"]);
        return;
    }

    $profile = $this->userModel->getProfile($username);

    if ($profile === false) {
        http_response_code(404);
        echo json_encode(["error" => "User not found"]);
        return;
    }

    http_response_code(200);
    echo json_encode($profile, JSON_UNESCAPED_UNICODE);
}

// Upload and save the authenticated user's profile avatar
    public function updateAvatar(): void
{
    $userId = $_SESSION["user_id"] ?? null;

    if ($userId === null) {
        http_response_code(401);
        echo json_encode(["error" => "Authentication required."]);
        return;
    }

    if (
        !isset($_FILES["avatar"]) ||
        $_FILES["avatar"]["error"] !== UPLOAD_ERR_OK
    ) {
        http_response_code(422);
        echo json_encode(["error" => "Invalid image upload."]);
        return;
    }

    $file = $_FILES["avatar"];

    // Limit uploaded images to 2 MB
    if ($file["size"] > 2 * 1024 * 1024) {
        http_response_code(422);
        echo json_encode(["error" => "Image must be smaller than 2 MB."]);
        return;
    }

    // Validate the actual file type
    $mimeType = (new finfo(FILEINFO_MIME_TYPE))->file($file["tmp_name"]);

    $allowedTypes = [
        "image/jpeg" => "jpg",
        "image/png" => "png",
        "image/webp" => "webp",
    ];

    if (!isset($allowedTypes[$mimeType])) {
        http_response_code(422);
        echo json_encode(["error" => "Only JPG, PNG and WebP images are allowed."]);
        return;
    }

    // Save the image in the public uploads directory
    $uploadDirectory = getenv("AVATAR_UPLOAD_DIR")
    ?: dirname(__DIR__) . "/public/uploads/avatars";
    error_log("Avatar upload directory: " . $uploadDirectory);

    if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0755, true)) {
        http_response_code(500);
        echo json_encode(["error" => "Unable to create upload directory."]);
        return;
    }

    $fileName = bin2hex(random_bytes(16)) . "." . $allowedTypes[$mimeType];
    $destination = $uploadDirectory . "/" . $fileName;

    if (!move_uploaded_file($file["tmp_name"], $destination)) {
        http_response_code(500);
        echo json_encode(["error" => "Unable to save image."]);
        return;
    }

    $avatarPath = "/uploads/avatars/" . $fileName;

    // Update the avatar path in the database
    if (!$this->userModel->updateAvatar((int) $userId, $avatarPath)) {
        unlink($destination);

        http_response_code(500);
        echo json_encode(["error" => "Unable to update avatar."]);
        return;
    }

    echo json_encode([
        "avatar" => $avatarPath,
    ]);
}
    

}