<?php
$uploadDir = __DIR__ . '/uploads/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file'])) {
        $file = $_FILES['file'];
        $target = $uploadDir . basename($file['name']);

        if (move_uploaded_file($file['tmp_name'], $target)) {
            echo "File uploaded successfully to: uploads/" . basename($file['name']);
        } else {
            echo "Upload failed.";
        }
    } else {
        echo "No file selected.";
    }
} else {
    echo "Invalid request.";
}
?>