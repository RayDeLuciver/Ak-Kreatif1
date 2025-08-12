<?php
// Disable error reporting to prevent HTML output
error_reporting(0);
ini_set('display_errors', 0);

// Clean any previous output
if (ob_get_level()) {
    ob_end_clean();
}

// Start fresh output buffering
ob_start();

// Set headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Only POST method allowed');
    }

    // Debug: Log received data
    error_log("Upload attempt - POST data: " . print_r($_POST, true));
    error_log("Upload attempt - FILES data: " . print_r($_FILES, true));

    // Validate required fields
    $required_fields = ['title', 'location', 'category', 'photographer'];
    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            throw new Exception("Field '$field' is required");
        }
    }

    // Validate file upload
    if (!isset($_FILES['thumbnail'])) {
        throw new Exception('No file uploaded - thumbnail field missing');
    }

    $file = $_FILES['thumbnail'];
    
    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $error_messages = [
            UPLOAD_ERR_INI_SIZE => 'File too large (exceeds php.ini limit)',
            UPLOAD_ERR_FORM_SIZE => 'File too large (exceeds form limit)',
            UPLOAD_ERR_PARTIAL => 'File upload incomplete',
            UPLOAD_ERR_NO_FILE => 'No file uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'No temporary directory',
            UPLOAD_ERR_CANT_WRITE => 'Cannot write to disk',
            UPLOAD_ERR_EXTENSION => 'Upload stopped by extension'
        ];
        
        $error_msg = isset($error_messages[$file['error']]) 
            ? $error_messages[$file['error']] 
            : 'Unknown upload error: ' . $file['error'];
            
        throw new Exception($error_msg);
    }

    // Validate file type
    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    $file_type = strtolower($file['type']);
    
    if (!in_array($file_type, $allowed_types)) {
        throw new Exception('Invalid file type. Only JPEG, PNG, and GIF allowed. Received: ' . $file_type);
    }

    // File size validation removed - unlimited upload
    // No size limit validation on server side

    // Create upload directory
    $upload_dir = dirname(__DIR__) . '/uploads/photos/';
    if (!is_dir($upload_dir)) {
        if (!mkdir($upload_dir, 0755, true)) {
            throw new Exception('Cannot create upload directory');
        }
    }

    // Generate unique filename
    $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $unique_filename = 'photo_' . date('Y-m-d_H-i-s') . '_' . uniqid() . '.' . $file_extension;
    $file_path = $upload_dir . $unique_filename;

    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $file_path)) {
        throw new Exception('Failed to save uploaded file');
    }

    // Process hashtags
    $hashtags = [];
    if (!empty($_POST['hashtags'])) {
        $hashtag_string = trim($_POST['hashtags']);
        $hashtags = preg_split('/\s+/', $hashtag_string);
        $hashtags = array_filter($hashtags);
        $hashtags = array_map(function($tag) {
            $tag = trim($tag);
            return (strpos($tag, '#') === 0) ? $tag : '#' . $tag;
        }, $hashtags);
    }

    // Check if should be published online
    $is_published = isset($_POST['publish_online']) && 
                   ($_POST['publish_online'] === 'true' || $_POST['publish_online'] === '1' || $_POST['publish_online'] === 'on');

    $photo_id = time();
    $db_saved = false;

    // Try to save to database
    try {
        require_once dirname(__DIR__) . '/config/database.php';
        
        // Ensure table exists
        $create_table_sql = "CREATE TABLE IF NOT EXISTS photos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(500) NOT NULL,
            location VARCHAR(500) NOT NULL,
            category VARCHAR(100) NOT NULL,
            photographer VARCHAR(500) NOT NULL,
            hashtag TEXT,
            content TEXT,
            filename VARCHAR(500) NOT NULL,
            is_published BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
        
        $pdo->exec($create_table_sql);

        // Insert photo data
        $stmt = $pdo->prepare("
            INSERT INTO photos (title, location, category, photographer, hashtag, content, filename, is_published) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $content = isset($_POST['content']) ? $_POST['content'] : '';
        
        $result = $stmt->execute([
            $_POST['title'],
            $_POST['location'],
            $_POST['category'],
            $_POST['photographer'],
            implode(' ', $hashtags),
            $content,
            $unique_filename,
            $is_published ? 1 : 0
        ]);

        if ($result) {
            $photo_id = $pdo->lastInsertId();
            $db_saved = true;
        }
        
    } catch (Exception $db_error) {
        // Log database error but don't fail the upload
        error_log("Database save failed: " . $db_error->getMessage());
        // File is still saved, so we continue
    }

    // Clear any accumulated output
    ob_clean();

    // Prepare success response
    $response = [
        'success' => true,
        'message' => 'Photo uploaded successfully!',
        'data' => [
            'photo_id' => $photo_id,
            'filename' => $unique_filename,
            'title' => $_POST['title'],
            'location' => $_POST['location'],
            'category' => $_POST['category'],
            'photographer' => $_POST['photographer'],
            'hashtags' => $hashtags,
            'is_published' => $is_published,
            'db_saved' => $db_saved,
            'file_size' => round($file['size'] / 1024 / 1024, 2) . 'MB'
        ]
    ];

    // Add public URL if published
    if ($is_published) {
        $response['data']['public_url'] = "../index.html?photo=" . $photo_id;
    }

    // Output JSON response
    echo json_encode($response, JSON_PRETTY_PRINT);

} catch (Exception $e) {
    // Clear any output
    ob_clean();
    
    // Set error status
    http_response_code(400);
    
    // Return error response
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'debug' => [
            'post_data' => $_POST,
            'files_data' => isset($_FILES) ? $_FILES : 'No files',
            'request_method' => $_SERVER['REQUEST_METHOD']
        ]
    ], JSON_PRETTY_PRINT);
}

// End output buffering and send
ob_end_flush();
?>
