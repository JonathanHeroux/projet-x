<?php
$host ="localhost";
$dbname ="projet_x";
$username ="root";
$password ="";
try{
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password
    );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOEXCEPTION $e){
    die("Database connection failed: " . $e->getMessage());
}