<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../config/database.php';

try {
    // Test basic connection
    $stmt = $pdo->query("SELECT 1 as test");
    $result = $stmt->fetch();
    
    // Check if photos table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'photos'");
    $photos_exists = $stmt->rowCount() > 0;
    
    // Check photos table structure if it exists
    $columns = [];
    if ($photos_exists) {
        $stmt = $pdo->query("DESCRIBE photos");
        $columns = $stmt->fetchAll();
    }
    
    // Check if photo_tags table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'photo_tags'");
    $photo_tags_exists = $stmt->rowCount() > 0;
    
    // Check foreign key constraints
    $foreign_keys = [];
    if ($photo_tags_exists) {
        $stmt = $pdo->query("
            SELECT 
                CONSTRAINT_NAME,
                COLUMN_NAME,
                REFERENCED_TABLE_NAME,
                REFERENCED_COLUMN_NAME
            FROM information_schema.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = 'walking_story_db' 
            AND TABLE_NAME = 'photo_tags' 
            AND REFERENCED_TABLE_NAME IS NOT NULL
        ");
        $foreign_keys = $stmt->fetchAll();
    }
    
    echo json_encode([
        'success' => true,
        'database_connection' => 'OK',
        'database_name' => 'walking_story_db',
        'photos_table_exists' => $photos_exists,
        'photo_tags_table_exists' => $photo_tags_exists,
        'photos_columns' => $columns,
        'foreign_keys' => $foreign_keys,
        'message' => 'Database connection test successful'
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'message' => 'Database connection test failed'
    ], JSON_PRETTY_PRINT);
}
?>
