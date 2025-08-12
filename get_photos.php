<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

try {
    // Get query parameters
    $category = $_GET['category'] ?? null;
    $published_only = isset($_GET['published_only']) ? (bool)$_GET['published_only'] : false;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

    // Build query
    $where_conditions = [];
    $params = [];

    if ($category) {
        $where_conditions[] = "category = ?";
        $params[] = $category;
    }

    if ($published_only) {
        $where_conditions[] = "is_published = 1";
    }

    $where_clause = !empty($where_conditions) ? "WHERE " . implode(" AND ", $where_conditions) : "";

    $sql = "
        SELECT 
            id,
            title,
            location,
            category,
            photographer,
            hashtag as hashtags,
            content,
            filename,
            is_published,
            created_at
        FROM photos 
        $where_clause 
        ORDER BY created_at DESC 
        LIMIT $limit OFFSET $offset
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $photos = $stmt->fetchAll();

    // Process photos data
    $processed_photos = [];
    foreach ($photos as $photo) {
        // Parse hashtags (could be JSON or plain text)
        $hashtags = [];
        if (!empty($photo['hashtags'])) {
            $decoded = json_decode($photo['hashtags'], true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $hashtags = $decoded;
            } else {
                // If not JSON, split by space and add # if missing
                $tags = explode(' ', trim($photo['hashtags']));
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
        
        $processed_photos[] = [
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
    }

    // Get total count for pagination
    $count_sql = "SELECT COUNT(*) as total FROM photos $where_clause";
    $count_stmt = $pdo->prepare($count_sql);
    $count_stmt->execute($params);
    $total = $count_stmt->fetch()['total'];

    echo json_encode([
        'success' => true,
        'photos' => $processed_photos,
        'pagination' => [
            'total' => (int)$total,
            'limit' => $limit,
            'offset' => $offset,
            'has_more' => ($offset + $limit) < $total
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
