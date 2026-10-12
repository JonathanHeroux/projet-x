<?php

class Router 
{
    // Store all registered application routes
    private array $routes = [];

    public function addRoute(string $method, string $uri, callable $action):void
    {

    $route = [
        "method" => $method,
        "uri" => $uri,
        "action" => $action,
    ];
       $this->routes[] = $route;
    }

    public function dispatch(string $method, string $uri):void
    {
        // Find and execute the action matching the current HTTP request
        foreach ($this->routes as $route){
            if($method === $route["method"] && $uri === $route["uri"]){
               $action = $route["action"];
               $action();
               return;
            }
        }
        // No registered route matches the requested method and URI
                http_response_code(404);
                echo json_encode([
                    "error" => "Not found"
                ]);
                return;
    }
}