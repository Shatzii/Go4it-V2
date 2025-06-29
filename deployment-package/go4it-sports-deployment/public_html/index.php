<?php
// Go4it Sports - PHP Entry Point
// This file handles PHP routing if needed

// Simple routing example
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);

switch ($path) {
    case '/':
    case '/home':
        include 'index.html';
        break;
    case '/api/health':
        header('Content-Type: application/json');
        echo json_encode(['status' => 'OK', 'timestamp' => time()]);
        break;
    default:
        // Serve static files or fall back to index.html
        if (file_exists(__DIR__ . $path)) {
            return false; // Let the web server handle static files
        } else {
            include 'index.html'; // Single Page Application fallback
        }
        break;
}
?>
