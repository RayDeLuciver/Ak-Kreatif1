<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // Validate required fields
    $required_fields = ['title', 'location', 'category', 'photographer'];
    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            throw new Exception("Field '$field' is required");
        }
    }

    // Validate and process file upload
    if (!isset($_FILES['thumbnail']) || $_FILES['thumbnail']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('No file uploaded or upload error occurred');
    }

    $file = $_FILES['thumbnail'];
    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    if (!in_array($file['type'], $allowed_types)) {
        throw new Exception('Invalid file type. Only JPG, PNG, and GIF are allowed');
    }

    // Check file size (20MB max)
    $max_size = 20 * 1024 * 1024; // 20MB
    if ($file['size'] > $max_size) {
        throw new Exception('File size too large. Maximum 20MB allowed');
    }

    // Create uploads directory if it doesn't exist
    $upload_dir = '../uploads/photos/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    // Generate unique filename
    $file_extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $unique_filename = 'photo_' . time() . '_' . uniqid() . '.' . $file_extension;
    $file_path = $upload_dir . $unique_filename;

    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $file_path)) {
        throw new Exception('Failed to save uploaded file');
    }

    // Process hashtags
    $hashtags = [];
    if (!empty($_POST['hashtags'])) {
        $hashtags_string = $_POST['hashtags'];
        $hashtags = array_map('trim', explode(' ', $hashtags_string));
        $hashtags = array_filter($hashtags, function($tag) {
            return !empty($tag);
        });
        // Ensure hashtags start with #
        $hashtags = array_map(function($tag) {
            return strpos($tag, '#') === 0 ? $tag : '#' . $tag;
        }, $hashtags);
    }

    // Insert photo into database
    $stmt = $pdo->prepare("
        INSERT INTO photos (title, supertext, location, category, photographer, hashtags, content, 
                          filename, original_filename, file_size, mime_type, is_published) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $is_published = isset($_POST['publish_online']) && $_POST['publish_online'] === 'true' ? 1 : 0;

    $stmt->execute([
        $_POST['title'],
        $_POST['supertext'] ?? '',
        $_POST['location'],
        $_POST['category'],
        $_POST['photographer'],
        json_encode($hashtags),
        $_POST['content'] ?? '',
        $unique_filename,
        $file['name'],
        $file['size'],
        $file['type'],
        $is_published
    ]);

    $photo_id = $pdo->lastInsertId();

    // Insert tags into photo_tags table
    if (!empty($hashtags)) {
        $tag_stmt = $pdo->prepare("INSERT INTO photo_tags (photo_id, tag) VALUES (?, ?)");
        foreach ($hashtags as $tag) {
            $tag_stmt->execute([$photo_id, $tag]);
        }
    }

    // Return success response
    $response = [
        'success' => true,
        'message' => 'Photo uploaded successfully',
        'photo_id' => $photo_id,
        'filename' => $unique_filename,
        'is_published' => $is_published,
        'public_url' => $is_published ? "index.html?photo=$photo_id" : null
    ];

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
