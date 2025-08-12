<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

try {
    // Get photo ID from URL parameter
    $photo_id = $_GET['id'] ?? null;
    
    if (!$photo_id) {
        throw new Exception('Photo ID is required');
    }

    // Get photo from database
    $stmt = $pdo->prepare("
        SELECT 
            id,
            title,
            location,
            category,
            photographer,
            hashtag,
            content,
            filename,
            is_published,
            created_at
        FROM photos 
        WHERE id = ?
    ");

    $stmt->execute([$photo_id]);
    $photo = $stmt->fetch();

    if (!$photo) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Photo not found'
        ]);
        exit;
    }

    // Check if photo is published (for public access)
    $public_access = isset($_GET['public']) && $_GET['public'] === 'true';
    if ($public_access && !$photo['is_published']) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => 'Photo is not published'
        ]);
        exit;
    }

    // Parse hashtags (could be JSON or plain text)
    $hashtags = [];
    if (!empty($photo['hashtag'])) {
        $decoded = json_decode($photo['hashtag'], true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            $hashtags = $decoded;
        } else {
            // If not JSON, split by space and add # if missing
            $tags = explode(' ', trim($photo['hashtag']));
            foreach ($tags as $tag) {
                $tag = trim($tag);
                if (!empty($tag)) {
                    $hashtags[] = strpos($tag, '#') === 0 ? $tag : '#' . $tag;
                }
            }
        }
    }
    
    // Build photo URL
    $photo_url = 'uploads/photos/' . ($photo['filename'] ?? 'default.jpg');
    
    $processed_photo = [
        'id' => (int)$photo['id'],
        'title' => $photo['title'] ?? '',
        'supertext' => '', // Not available in current table structure
        'location' => $photo['location'] ?? '',
        'category' => $photo['category'] ?? '',
        'photographer' => $photo['photographer'] ?? '',
        'tags' => $hashtags,
        'content' => $photo['content'] ?? '',
        'thumbnail' => $photo_url,
        'filename' => $photo['filename'] ?? '',
        'original_filename' => $photo['filename'] ?? '', // Use filename as fallback
        'file_size' => 0, // Not available in current table structure
        'mime_type' => 'image/jpeg', // Default value
        'is_published' => (bool)($photo['is_published'] ?? 0),
        'isUploaded' => true,
        'createdAt' => $photo['created_at'] ?? '',
        'updatedAt' => $photo['created_at'] ?? '', // Use created_at as fallback
        'public_url' => ($photo['is_published'] ?? 0) ? "index.html?photo=" . $photo['id'] : null
    ];

    echo json_encode([
        'success' => true,
        'photo' => $processed_photo
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
