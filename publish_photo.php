<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

if (!in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT'])) {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }

    $photo_id = $input['photo_id'] ?? null;
    $is_published = isset($input['is_published']) ? (bool)$input['is_published'] : true;

    if (!$photo_id) {
        throw new Exception('Photo ID is required');
    }

    // Check if photo exists
    $check_stmt = $pdo->prepare("SELECT id, title, is_published FROM photos WHERE id = ?");
    $check_stmt->execute([$photo_id]);
    $photo = $check_stmt->fetch();

    if (!$photo) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Photo not found'
        ]);
        exit;
    }

    // Update publish status
    $update_stmt = $pdo->prepare("UPDATE photos SET is_published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
    $update_stmt->execute([$is_published ? 1 : 0, $photo_id]);

    $action = $is_published ? 'published' : 'unpublished';
    $public_url = $is_published ? "index.html?photo=$photo_id" : null;

    echo json_encode([
        'success' => true,
        'message' => "Photo '{$photo['title']}' has been $action",
        'photo_id' => (int)$photo_id,
        'is_published' => $is_published,
        'public_url' => $public_url
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
