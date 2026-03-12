<?php
// Serve the React SPA for all non-API requests
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// If it's an API call, let Apache route it to /api/index.php via .htaccess
if (strpos($requestUri, '/api') === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'API route not found']);
    exit;
}

// For everything else, serve the React SPA index.html
$spaIndex = __DIR__ . '/frontend/index.html';
if (file_exists($spaIndex)) {
    readfile($spaIndex);
} else {
    http_response_code(503);
    echo 'Frontend not built yet. Run: npm run build';
}
