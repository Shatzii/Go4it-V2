<?php
/**
 * Go4It Server-Side Deployment Handler
 * 
 * This PHP script handles server-side operations for the Go4It deployment tool.
 * Place this file in your web-accessible directory (e.g., /var/www/html/).
 * 
 * SECURITY NOTE: This script should be protected by proper authentication in production.
 */

// Set headers for JSON response
header('Content-Type: application/json');

// Enable error reporting in development (comment out in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Prevent caching
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Log function
function writeLog($message, $type = 'INFO') {
    $logFile = __DIR__ . '/go4it_deployment.log';
    $date = date('Y-m-d H:i:s');
    $logLine = "[$date] [$type] $message\n";
    file_put_contents($logFile, $logLine, FILE_APPEND);
    return $logLine;
}

// Initialize response
$response = [
    'success' => false,
    'message' => '',
    'logs' => []
];

// Get request action
$action = isset($_POST['action']) ? $_POST['action'] : '';

// Handle different actions
switch ($action) {
    case 'check_connection':
        // Just checking if the server is responsive
        $response['success'] = true;
        $response['message'] = 'Connection successful';
        $response['logs'][] = writeLog('Connection check successful');
        break;
        
    case 'prepare_deployment':
        // Prepare for deployment
        $clientPath = isset($_POST['clientPath']) ? $_POST['clientPath'] : '/var/www/go4itsports/client';
        $serverPath = isset($_POST['serverPath']) ? $_POST['serverPath'] : '/var/www/go4itsports/server';
        $monacoPath = isset($_POST['monacoPath']) ? $_POST['monacoPath'] : '/var/www/html/pharaoh';
        
        // Create directories if they don't exist
        if (!file_exists($clientPath)) {
            if (mkdir($clientPath, 0755, true)) {
                $response['logs'][] = writeLog("Created client directory: $clientPath");
            } else {
                $response['logs'][] = writeLog("Failed to create client directory: $clientPath", 'ERROR');
            }
        }
        
        if (!file_exists($serverPath)) {
            if (mkdir($serverPath, 0755, true)) {
                $response['logs'][] = writeLog("Created server directory: $serverPath");
            } else {
                $response['logs'][] = writeLog("Failed to create server directory: $serverPath", 'ERROR');
            }
        }
        
        if (!file_exists($monacoPath)) {
            if (mkdir($monacoPath, 0755, true)) {
                $response['logs'][] = writeLog("Created Monaco directory: $monacoPath");
            } else {
                $response['logs'][] = writeLog("Failed to create Monaco directory: $monacoPath", 'ERROR');
            }
        }
        
        $response['success'] = true;
        $response['message'] = 'Deployment preparation complete';
        $response['logs'][] = writeLog('Deployment preparation completed');
        break;
        
    case 'upload_file':
        // Handle file upload
        if (!isset($_FILES['file'])) {
            $response['message'] = 'No file uploaded';
            $response['logs'][] = writeLog('No file uploaded', 'ERROR');
            break;
        }
        
        $file = $_FILES['file'];
        $targetPath = isset($_POST['targetPath']) ? $_POST['targetPath'] : '';
        $fileName = isset($_POST['fileName']) ? $_POST['fileName'] : $file['name'];
        
        if (empty($targetPath)) {
            $response['message'] = 'No target path specified';
            $response['logs'][] = writeLog('No target path specified', 'ERROR');
            break;
        }
        
        // Create directory if it doesn't exist
        $dirPath = dirname($targetPath);
        if (!file_exists($dirPath)) {
            mkdir($dirPath, 0755, true);
        }
        
        // Move uploaded file to target location
        if (move_uploaded_file($file['tmp_name'], $targetPath . '/' . $fileName)) {
            $response['success'] = true;
            $response['message'] = 'File uploaded successfully';
            $response['logs'][] = writeLog("File uploaded: {$targetPath}/{$fileName}");
        } else {
            $response['message'] = 'Failed to upload file';
            $response['logs'][] = writeLog("Failed to upload file: {$targetPath}/{$fileName}", 'ERROR');
        }
        break;
        
    case 'extract_zip':
        // Extract ZIP file
        $zipPath = isset($_POST['zipPath']) ? $_POST['zipPath'] : '';
        $extractPath = isset($_POST['extractPath']) ? $_POST['extractPath'] : '';
        
        if (empty($zipPath) || empty($extractPath)) {
            $response['message'] = 'Missing zip path or extract path';
            $response['logs'][] = writeLog('Missing zip path or extract path', 'ERROR');
            break;
        }
        
        if (!file_exists($zipPath)) {
            $response['message'] = 'ZIP file not found';
            $response['logs'][] = writeLog("ZIP file not found: $zipPath", 'ERROR');
            break;
        }
        
        // Create extraction directory if it doesn't exist
        if (!file_exists($extractPath)) {
            mkdir($extractPath, 0755, true);
        }
        
        // Extract the ZIP file
        $zip = new ZipArchive();
        if ($zip->open($zipPath) === TRUE) {
            $zip->extractTo($extractPath);
            $zip->close();
            $response['success'] = true;
            $response['message'] = 'ZIP extracted successfully';
            $response['logs'][] = writeLog("ZIP extracted: $zipPath to $extractPath");
        } else {
            $response['message'] = 'Failed to extract ZIP';
            $response['logs'][] = writeLog("Failed to extract ZIP: $zipPath", 'ERROR');
        }
        break;
        
    case 'run_script':
        // Run a shell script
        $scriptPath = isset($_POST['scriptPath']) ? $_POST['scriptPath'] : '';
        
        if (empty($scriptPath)) {
            $response['message'] = 'No script path specified';
            $response['logs'][] = writeLog('No script path specified', 'ERROR');
            break;
        }
        
        if (!file_exists($scriptPath)) {
            $response['message'] = 'Script not found';
            $response['logs'][] = writeLog("Script not found: $scriptPath", 'ERROR');
            break;
        }
        
        // Make script executable
        chmod($scriptPath, 0755);
        
        // Execute script
        $output = [];
        $return_var = 0;
        exec("$scriptPath 2>&1", $output, $return_var);
        
        if ($return_var === 0) {
            $response['success'] = true;
            $response['message'] = 'Script executed successfully';
            $response['logs'][] = writeLog("Script executed: $scriptPath");
            $response['output'] = $output;
        } else {
            $response['message'] = 'Script execution failed';
            $response['logs'][] = writeLog("Script execution failed: $scriptPath (Exit code: $return_var)", 'ERROR');
            $response['output'] = $output;
        }
        break;
        
    case 'set_permissions':
        // Set file permissions
        $path = isset($_POST['path']) ? $_POST['path'] : '';
        $recursive = isset($_POST['recursive']) ? (bool)$_POST['recursive'] : false;
        $fileMode = isset($_POST['fileMode']) ? $_POST['fileMode'] : '0644';
        $dirMode = isset($_POST['dirMode']) ? $_POST['dirMode'] : '0755';
        
        if (empty($path)) {
            $response['message'] = 'No path specified';
            $response['logs'][] = writeLog('No path specified', 'ERROR');
            break;
        }
        
        if (!file_exists($path)) {
            $response['message'] = 'Path not found';
            $response['logs'][] = writeLog("Path not found: $path", 'ERROR');
            break;
        }
        
        // Convert string modes to octal
        $fileMode = octdec($fileMode);
        $dirMode = octdec($dirMode);
        
        // Set permissions
        $success = true;
        
        if (is_dir($path) && $recursive) {
            // Set directory permissions recursively
            $dirIterator = new RecursiveDirectoryIterator($path, RecursiveDirectoryIterator::SKIP_DOTS);
            $iterator = new RecursiveIteratorIterator($dirIterator, RecursiveIteratorIterator::SELF_FIRST);
            
            foreach ($iterator as $item) {
                if ($item->isDir()) {
                    if (!chmod($item->getPathname(), $dirMode)) {
                        $success = false;
                        $response['logs'][] = writeLog("Failed to set permissions on directory: {$item->getPathname()}", 'ERROR');
                    }
                } else {
                    if (!chmod($item->getPathname(), $fileMode)) {
                        $success = false;
                        $response['logs'][] = writeLog("Failed to set permissions on file: {$item->getPathname()}", 'ERROR');
                    }
                }
            }
            
            // Set permissions on the root directory
            chmod($path, $dirMode);
            $response['logs'][] = writeLog("Set recursive permissions on: $path");
        } else {
            // Set permissions on a single file or directory
            $mode = is_dir($path) ? $dirMode : $fileMode;
            if (chmod($path, $mode)) {
                $response['logs'][] = writeLog("Set permissions on: $path");
            } else {
                $success = false;
                $response['logs'][] = writeLog("Failed to set permissions on: $path", 'ERROR');
            }
        }
        
        $response['success'] = $success;
        $response['message'] = $success ? 'Permissions set successfully' : 'Failed to set some permissions';
        break;
        
    case 'verify_deployment':
        // Verify deployment by checking existence of key files
        $clientPath = isset($_POST['clientPath']) ? $_POST['clientPath'] : '/var/www/go4itsports/client';
        $serverPath = isset($_POST['serverPath']) ? $_POST['serverPath'] : '/var/www/go4itsports/server';
        $monacoPath = isset($_POST['monacoPath']) ? $_POST['monacoPath'] : '/var/www/html/pharaoh';
        
        $results = [
            'client' => [
                'exists' => file_exists($clientPath),
                'isDirectory' => is_dir($clientPath),
                'hasFiles' => is_dir($clientPath) ? count(glob("$clientPath/*")) > 0 : false
            ],
            'server' => [
                'exists' => file_exists($serverPath),
                'isDirectory' => is_dir($serverPath),
                'hasFiles' => is_dir($serverPath) ? count(glob("$serverPath/*")) > 0 : false
            ],
            'monaco' => [
                'exists' => file_exists($monacoPath),
                'isDirectory' => is_dir($monacoPath),
                'hasFiles' => is_dir($monacoPath) ? count(glob("$monacoPath/*")) > 0 : false
            ]
        ];
        
        $response['success'] = $results['client']['hasFiles'] && $results['server']['hasFiles'];
        $response['message'] = $response['success'] ? 'Deployment verified successfully' : 'Deployment verification failed';
        $response['logs'][] = writeLog("Deployment verification: " . ($response['success'] ? 'Success' : 'Failed'));
        $response['results'] = $results;
        break;
        
    default:
        $response['message'] = 'Unknown action';
        $response['logs'][] = writeLog("Unknown action: $action", 'ERROR');
}

// Return response as JSON
echo json_encode($response);