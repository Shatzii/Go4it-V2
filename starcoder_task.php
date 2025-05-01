<?php
header('Content-Type: text/plain');

// Map task to basic prompt instructions
$prompts = [
    'analyze' => 'Analyze this project folder and report possible improvements.',
    'fix'     => 'Scan this project and auto-fix broken scripts or bad folders.',
    'optimize'=> 'Optimize this codebase for faster load and better structure.',
    'scan'    => 'Find any major issues in this codebase and list them clearly.',
    'explain' => 'Explain how this project is structured and how it runs.'
];

// Get input
$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';
$prompt = $prompts[$action] ?? null;

if (!$prompt) {
    http_response_code(400);
    echo "Unknown task: $action";
    exit;
}

// Prepare StarCoder API call
$payload = json_encode([
    'model' => 'codellama:13b', // or your model
    'prompt' => $prompt,
    'stream' => false
]);

$ch = curl_init('http://localhost:11434/v1/completions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => $payload
]);

$response = curl_exec($ch);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    echo "Error: $error";
} else {
    $data = json_decode($response, true);
    echo $data['choices'][0]['text'] ?? 'No response from model.';
}
?>