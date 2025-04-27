#!/bin/bash
# Go4It Sports Hugging Face Models Installation Script
# Optimized for 4 vCPU / 16GB RAM / 160GB SSD server

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
MODELS_DIR="/var/www/go4it/models"
VENV_DIR="/var/www/go4it/venv"
HUGGINGFACE_TOKEN=""  # Optional: Add your Hugging Face token here for private models

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Go4It Sports Hugging Face Models Installer${NC}"
echo -e "${GREEN}=========================================${NC}"

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
    echo -e "${RED}This script must be run as root${NC}"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 is required but not installed.${NC}"
    echo -e "${YELLOW}Installing Python 3...${NC}"
    apt update
    apt install -y python3 python3-pip python3-venv
fi

# Create necessary directories
mkdir -p ${MODELS_DIR}
chmod 755 ${MODELS_DIR}

# Create virtual environment
echo -e "\n${GREEN}Step 1: Creating Python virtual environment...${NC}"
python3 -m venv ${VENV_DIR}
source ${VENV_DIR}/bin/activate

# Install dependencies
echo -e "\n${GREEN}Step 2: Installing required packages...${NC}"
pip install --upgrade pip
pip install torch==2.0.1 torchvision==0.15.2 torchaudio==2.0.2 --index-url https://download.pytorch.org/whl/cpu
pip install transformers==4.30.2 onnx==1.14.0 onnxruntime==1.15.1
pip install opencv-python==4.8.0.74 pillow==9.5.0 huggingface_hub==0.16.4
pip install accelerate==0.20.3 datasets==2.13.1 evaluate==0.4.0 ffmpeg-python==0.2.0

# Sports-specific models to download
echo -e "\n${GREEN}Step 3: Downloading sports-specific models...${NC}"

# Function to download a model
download_model() {
    MODEL_NAME=$1
    HF_MODEL_ID=$2
    MODEL_TYPE=$3
    
    echo -e "${YELLOW}Downloading ${MODEL_NAME} (${HF_MODEL_ID})...${NC}"
    
    # Create directory for the model
    mkdir -p "${MODELS_DIR}/${MODEL_NAME}"
    
    # Download the model using Python and the Hugging Face Hub
    python3 -c "
from huggingface_hub import snapshot_download
try:
    path = snapshot_download(
        repo_id='${HF_MODEL_ID}', 
        local_dir='${MODELS_DIR}/${MODEL_NAME}',
        token='${HUGGINGFACE_TOKEN}'
    )
    print(f'Successfully downloaded ${HF_MODEL_ID} to {path}')
except Exception as e:
    print(f'Error downloading ${HF_MODEL_ID}: {str(e)}')
    exit(1)
"
    
    # Check if download was successful
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to download ${MODEL_NAME}.${NC}"
        return 1
    fi
    
    echo -e "${GREEN}Successfully downloaded ${MODEL_NAME}!${NC}"
    return 0
}

# Download all required models
# 1. Player Detection model
download_model "player-detection" "facebook/detr-resnet-50" "object-detection"

# 2. Sport Classification model
download_model "sport-classification" "microsoft/resnet-50" "image-classification"

# 3. Pose Estimation model
download_model "pose-estimation" "google/movenet-singlepose-thunder" "pose-estimation"

# 4. Action Recognition model
download_model "action-recognition" "FCakyon/yolov8n-action-classification" "video-classification"

# 5. Text generation for reports (smaller model)
download_model "text-generation" "TheBloke/Llama-2-7B-Chat-GGML" "text-generation"

# Create model server script
echo -e "\n${GREEN}Step 4: Creating model server script...${NC}"

cat > ${MODELS_DIR}/model_server.py << 'EOF'
"""
Go4It Sports Model Server
This script runs a server that provides inference for sports video analysis models.
"""
import os
import sys
import json
import torch
import socket
import threading
import numpy as np
from PIL import Image
import traceback
import signal
import time

# Global configuration
MODELS_DIR = "/var/www/go4it/models"
SERVER_PORT = 3456
SERVER_HOST = "localhost"
MAX_CONCURRENT_REQUESTS = 5
REQUEST_TIMEOUT = 60  # seconds

# Model registry
MODEL_REGISTRY = {
    "playerDetection": {
        "path": os.path.join(MODELS_DIR, "player-detection"),
        "type": "object-detection",
        "preload": True
    },
    "sportClassification": {
        "path": os.path.join(MODELS_DIR, "sport-classification"),
        "type": "image-classification",
        "preload": True
    },
    "poseEstimation": {
        "path": os.path.join(MODELS_DIR, "pose-estimation"),
        "type": "pose-estimation",
        "preload": True
    },
    "actionRecognition": {
        "path": os.path.join(MODELS_DIR, "action-recognition"),
        "type": "video-classification",
        "preload": False
    },
    "textGeneration": {
        "path": os.path.join(MODELS_DIR, "text-generation"),
        "type": "text-generation",
        "preload": False
    }
}

# Global variable to store loaded models
loaded_models = {}

# Semaphore to limit concurrent requests
request_semaphore = threading.Semaphore(MAX_CONCURRENT_REQUESTS)

def load_model(model_key):
    """Load a model from the registry"""
    if model_key in loaded_models:
        return loaded_models[model_key]
        
    if model_key not in MODEL_REGISTRY:
        raise ValueError(f"Model {model_key} not found in registry")
        
    model_config = MODEL_REGISTRY[model_key]
    model_path = model_config["path"]
    
    print(f"Loading model {model_key} from {model_path}")
    
    try:
        # Initialize appropriate pipeline based on model type
        from transformers import pipeline
        
        # Check if CUDA is available
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {device} for {model_key}")
        
        if model_config["type"] == "object-detection":
            model = pipeline("object-detection", model=model_path, device=device)
        elif model_config["type"] == "image-classification":
            model = pipeline("image-classification", model=model_path, device=device)
        elif model_config["type"] == "pose-estimation":
            model = pipeline("pose-estimation", model=model_path, device=device)
        elif model_config["type"] == "video-classification":
            model = pipeline("video-classification", model=model_path, device=device)
        elif model_config["type"] == "text-generation":
            model = pipeline("text-generation", model=model_path, device=device)
        else:
            raise ValueError(f"Unknown model type: {model_config['type']}")
            
        loaded_models[model_key] = model
        print(f"Successfully loaded {model_key}")
        return model
        
    except Exception as e:
        traceback.print_exc()
        print(f"Error loading {model_key}: {str(e)}")
        raise

def handle_request(request_data):
    """Handle an inference request"""
    with request_semaphore:
        try:
            model_key = request_data.get("model")
            if not model_key:
                return {"error": "No model specified"}
                
            # Load model if not already loaded
            if model_key not in loaded_models:
                load_model(model_key)
                
            model = loaded_models[model_key]
            model_config = MODEL_REGISTRY[model_key]
            
            # Process different input types based on model type
            if model_config["type"] in ["object-detection", "image-classification", "pose-estimation"]:
                image_path = request_data.get("imagePath")
                if not image_path:
                    return {"error": "No image path provided"}
                    
                # Read image
                image = Image.open(image_path)
                result = model(image)
                
            elif model_config["type"] == "video-classification":
                video_path = request_data.get("videoPath")
                if not video_path:
                    return {"error": "No video path provided"}
                    
                result = model(video_path)
                
            elif model_config["type"] == "text-generation":
                prompt = request_data.get("prompt")
                if not prompt:
                    return {"error": "No prompt provided"}
                    
                result = model(prompt, max_length=1000, do_sample=True, temperature=0.7)
                
            else:
                return {"error": f"Unsupported model type: {model_config['type']}"}
                
            return {"result": result}
            
        except Exception as e:
            traceback.print_exc()
            return {"error": str(e)}

def handle_client(client_socket):
    """Handle a client connection"""
    buffer = ""
    client_socket.settimeout(REQUEST_TIMEOUT)
    
    try:
        while True:
            data = client_socket.recv(4096).decode("utf-8")
            if not data:
                break
                
            buffer += data
            if "\n\n" in buffer:  # Message delimiter
                request_str, buffer = buffer.split("\n\n", 1)
                try:
                    request_data = json.loads(request_str)
                    response = handle_request(request_data)
                    client_socket.sendall((json.dumps(response) + "\n\n").encode("utf-8"))
                except json.JSONDecodeError:
                    client_socket.sendall((json.dumps({"error": "Invalid JSON"}) + "\n\n").encode("utf-8"))
    except socket.timeout:
        print(f"Client connection timed out after {REQUEST_TIMEOUT} seconds")
    except Exception as e:
        print(f"Error handling client: {str(e)}")
    finally:
        client_socket.close()

def preload_models():
    """Preload models marked for preloading"""
    for model_key, config in MODEL_REGISTRY.items():
        if config.get("preload", False):
            try:
                load_model(model_key)
                print(f"Preloaded model: {model_key}")
            except Exception as e:
                print(f"Failed to preload {model_key}: {str(e)}")

def start_server():
    """Start the model server"""
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((SERVER_HOST, SERVER_PORT))
    server_socket.listen(10)
    
    print(f"Model server started at {SERVER_HOST}:{SERVER_PORT}")
    
    # Set up signal handlers for graceful shutdown
    def signal_handler(sig, frame):
        print("Shutting down server...")
        server_socket.close()
        sys.exit(0)
        
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Preload models
    preload_models()
    
    # Accept connections
    try:
        while True:
            try:
                client_socket, client_address = server_socket.accept()
                print(f"New connection from {client_address}")
                client_thread = threading.Thread(target=handle_client, args=(client_socket,))
                client_thread.daemon = True
                client_thread.start()
            except Exception as e:
                print(f"Error accepting connection: {str(e)}")
                time.sleep(1)  # Avoid tight loop if errors occur
    except KeyboardInterrupt:
        print("Server stopped by user")
    finally:
        server_socket.close()

if __name__ == "__main__":
    start_server()
EOF

# Create systemd service for the model server
echo -e "\n${GREEN}Step 5: Creating systemd service for model server...${NC}"

cat > /etc/systemd/system/go4it-models.service << EOF
[Unit]
Description=Go4It Sports HuggingFace Models Server
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=${MODELS_DIR}
ExecStart=${VENV_DIR}/bin/python ${MODELS_DIR}/model_server.py
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=go4it-models
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
EOF

# Create NodeJS integration module
echo -e "\n${GREEN}Step 6: Creating NodeJS integration module...${NC}"

mkdir -p /var/www/go4it/server/services/ai

cat > /var/www/go4it/server/services/ai/huggingface-service.js << 'EOF'
/**
 * Go4It Sports HuggingFace Models Integration Service
 */
const net = require('net');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  server: {
    host: 'localhost',
    port: 3456,
    timeout: 60000, // 60 seconds
    reconnectDelay: 5000 // 5 seconds
  },
  models: {
    playerDetection: {
      type: 'objectDetection',
      description: 'Detects players and objects in images'
    },
    sportClassification: {
      type: 'imageClassification',
      description: 'Classifies sports from images'
    },
    poseEstimation: {
      type: 'poseEstimation',
      description: 'Estimates athlete poses for technique analysis'
    },
    actionRecognition: {
      type: 'videoClassification',
      description: 'Recognizes actions and techniques in videos'
    },
    textGeneration: {
      type: 'textGeneration',
      description: 'Generates analysis reports from performance data'
    }
  }
};

/**
 * Call the model server
 */
async function callModel(modelKey, params) {
  return new Promise((resolve, reject) => {
    const client = net.createConnection({ 
      port: config.server.port, 
      host: config.server.host,
      timeout: config.server.timeout
    }, () => {
      console.log(`Connected to model server for ${modelKey}`);
      
      // Send request
      const request = {
        model: modelKey,
        ...params
      };
      
      client.write(JSON.stringify(request) + '\n\n');
    });
    
    let buffer = '';
    
    client.on('data', (data) => {
      buffer += data.toString();
      
      if (buffer.includes('\n\n')) {
        const response = buffer.split('\n\n')[0];
        try {
          const result = JSON.parse(response);
          client.end();
          
          if (result.error) {
            reject(new Error(result.error));
          } else {
            resolve(result.result);
          }
        } catch (err) {
          reject(new Error(`Failed to parse response: ${err.message}`));
        }
      }
    });
    
    client.on('error', (err) => {
      reject(new Error(`Socket error: ${err.message}`));
    });
    
    client.on('timeout', () => {
      client.end();
      reject(new Error('Connection timed out'));
    });
  });
}

/**
 * Detect players in an image
 */
async function detectPlayers(imagePath) {
  try {
    const result = await callModel('playerDetection', { imagePath });
    return result;
  } catch (error) {
    console.error('Error detecting players:', error);
    throw error;
  }
}

/**
 * Estimate poses in an image
 */
async function estimatePoses(imagePath) {
  try {
    const result = await callModel('poseEstimation', { imagePath });
    return result;
  } catch (error) {
    console.error('Error estimating poses:', error);
    throw error;
  }
}

/**
 * Classify sport in an image
 */
async function classifySport(imagePath) {
  try {
    const result = await callModel('sportClassification', { imagePath });
    return result;
  } catch (error) {
    console.error('Error classifying sport:', error);
    throw error;
  }
}

/**
 * Recognize actions in a video
 */
async function recognizeActions(videoPath) {
  try {
    const result = await callModel('actionRecognition', { videoPath });
    return result;
  } catch (error) {
    console.error('Error recognizing actions:', error);
    throw error;
  }
}

/**
 * Generate an analysis report
 */
async function generateReport(data) {
  try {
    // Format the prompt
    const prompt = formatReportPrompt(data);
    
    // Call the model
    const result = await callModel('textGeneration', { prompt });
    
    // Extract the generated text
    return result[0].generated_text;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}

/**
 * Format report generation prompt
 */
function formatReportPrompt(data) {
  // Format the prompt based on sports-specific performance data
  let prompt = 'Analyze the following sports performance data and provide a detailed report:\n\n';
  
  if (data.athlete) {
    prompt += `Athlete: ${data.athlete.name}\n`;
    prompt += `Sport: ${data.athlete.sport}\n`;
    if (data.athlete.position) {
      prompt += `Position: ${data.athlete.position}\n`;
    }
    prompt += '\n';
  }
  
  if (data.metrics) {
    prompt += 'Performance Metrics:\n';
    Object.entries(data.metrics).forEach(([key, value]) => {
      if (typeof value === 'object') {
        prompt += `- ${key}: ${value.average.toFixed(2)} (min: ${value.min.toFixed(2)}, max: ${value.max.toFixed(2)})\n`;
      } else {
        prompt += `- ${key}: ${value}\n`;
      }
    });
    prompt += '\n';
  }
  
  if (data.poses) {
    prompt += 'Pose Analysis:\n';
    data.poses.forEach((pose, i) => {
      prompt += `- Frame ${i+1}: Overall score ${pose.score.toFixed(2)}\n`;
    });
    prompt += '\n';
  }
  
  prompt += 'Please provide:\n';
  prompt += '1. Technical analysis of the performance\n';
  prompt += '2. Strengths demonstrated\n';
  prompt += '3. Areas for improvement\n';
  prompt += '4. Specific drills to improve technique\n';
  prompt += '5. Overall assessment\n';
  
  return prompt;
}

/**
 * Check if the model server is running
 */
async function checkServerStatus() {
  return new Promise((resolve) => {
    const client = net.createConnection({ 
      port: config.server.port, 
      host: config.server.host,
      timeout: 5000
    }, () => {
      client.end();
      resolve(true);
    });
    
    client.on('error', () => {
      resolve(false);
    });
    
    client.on('timeout', () => {
      client.end();
      resolve(false);
    });
  });
}

/**
 * Initialize the integration
 */
async function initialize() {
  console.log('Initializing HuggingFace models integration');
  
  // Check if server is running
  const serverRunning = await checkServerStatus();
  
  if (!serverRunning) {
    console.warn('HuggingFace model server not running. Models will not be available.');
    return false;
  }
  
  console.log('Successfully connected to HuggingFace model server');
  return true;
}

module.exports = {
  initialize,
  detectPlayers,
  estimatePoses,
  classifySport,
  recognizeActions,
  generateReport,
  config
};
EOF

# Enable and start the service
echo -e "\n${GREEN}Step 7: Enabling and starting the model server service...${NC}"
systemctl daemon-reload
systemctl enable go4it-models.service
systemctl start go4it-models.service

# Final setup
echo -e "\n${GREEN}Step 8: Creating test script...${NC}"

cat > ${MODELS_DIR}/test_models.py << 'EOF'
"""
Test script for Go4It Sports HuggingFace models
"""
import os
import sys
import json
import socket
import time

def test_connection():
    """Test connection to model server"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        sock.connect(("localhost", 3456))
        sock.close()
        print("✅ Successfully connected to model server")
        return True
    except Exception as e:
        print(f"❌ Failed to connect to model server: {e}")
        return False

def call_model(model_key, params):
    """Call a model via the server"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect(("localhost", 3456))
    
    request = {
        "model": model_key,
        **params
    }
    
    sock.sendall((json.dumps(request) + "\n\n").encode("utf-8"))
    
    buffer = ""
    while True:
        data = sock.recv(4096).decode("utf-8")
        if not data:
            break
            
        buffer += data
        if "\n\n" in buffer:
            response_str, _ = buffer.split("\n\n", 1)
            response = json.loads(response_str)
            sock.close()
            return response
    
    sock.close()
    raise Exception("No valid response received")

def run_tests():
    """Run tests for all models"""
    # First check connection
    if not test_connection():
        print("Exiting due to connection failure")
        return False
    
    # Test path
    test_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Test player detection
    try:
        print("\n--- Testing Player Detection Model ---")
        # Create a test image if it doesn't exist
        test_image = os.path.join(test_dir, "test_image.jpg")
        if not os.path.exists(test_image):
            print("Creating test image...")
            from PIL import Image, ImageDraw
            img = Image.new('RGB', (640, 480), color = (73, 109, 137))
            d = ImageDraw.Draw(img)
            d.rectangle([(200, 100), (400, 400)], fill=(128, 0, 0))
            img.save(test_image)
        
        response = call_model("playerDetection", {"imagePath": test_image})
        
        if "error" in response:
            print(f"❌ Player detection failed: {response['error']}")
        else:
            print(f"✅ Player detection successful: {json.dumps(response['result'], indent=2)}")
            
    except Exception as e:
        print(f"❌ Player detection test error: {e}")
    
    # Test other models as needed
    
    print("\nTests completed")
    return True

if __name__ == "__main__":
    run_tests()
EOF

# Run test script
echo -e "\n${GREEN}Step 9: Running test script to verify installation...${NC}"
sleep 5  # Give the server time to start
cd ${MODELS_DIR}
python3 test_models.py

# Create README
echo -e "\n${GREEN}Creating README file...${NC}"
cat > ${MODELS_DIR}/README.md << EOF
# Go4It Sports HuggingFace Models

This directory contains HuggingFace models for sports video analysis.

## Available Models

1. **Player Detection** (facebook/detr-resnet-50)
   - Detects players and objects in images

2. **Sport Classification** (microsoft/resnet-50)
   - Classifies sports from images

3. **Pose Estimation** (google/movenet-singlepose-thunder)
   - Analyzes athlete poses for technique assessment

4. **Action Recognition** (FCakyon/yolov8n-action-classification)
   - Recognizes actions and techniques in videos

5. **Text Generation** (TheBloke/Llama-2-7B-Chat-GGML)
   - Generates analysis reports from performance data

## Integration

The models are available through a model server running on port 3456.
NodeJS integration is available at:
\`/var/www/go4it/server/services/ai/huggingface-service.js\`

## Management

- Start/stop the model server: \`systemctl start/stop go4it-models\`
- Check status: \`systemctl status go4it-models\`
- View logs: \`journalctl -u go4it-models\`
- Run tests: \`cd ${MODELS_DIR} && python3 test_models.py\`
EOF

# Summary
echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}Installation Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo
echo -e "${YELLOW}Models installed:${NC}"
echo -e "- Player Detection (facebook/detr-resnet-50)"
echo -e "- Sport Classification (microsoft/resnet-50)"
echo -e "- Pose Estimation (google/movenet-singlepose-thunder)"
echo -e "- Action Recognition (FCakyon/yolov8n-action-classification)"
echo -e "- Text Generation (TheBloke/Llama-2-7B-Chat-GGML)"
echo
echo -e "${YELLOW}Model server:${NC}"
echo -e "- Status: systemctl status go4it-models"
echo -e "- Control: systemctl start/stop/restart go4it-models"
echo -e "- Logs: journalctl -u go4it-models"
echo
echo -e "${YELLOW}NodeJS integration:${NC}"
echo -e "- Path: /var/www/go4it/server/services/ai/huggingface-service.js"
echo
echo -e "${YELLOW}To use in your application:${NC}"
echo -e "1. Import the service:"
echo -e "   const hfService = require('./services/ai/huggingface-service');"
echo -e "2. Initialize:"
echo -e "   await hfService.initialize();"
echo -e "3. Call models:"
echo -e "   const players = await hfService.detectPlayers(imagePath);"
echo -e "   const poses = await hfService.estimatePoses(imagePath);"
echo -e "   const sport = await hfService.classifySport(imagePath);"
echo -e "   const actions = await hfService.recognizeActions(videoPath);"
echo -e "   const report = await hfService.generateReport(performanceData);"
echo
echo -e "${GREEN}HuggingFace models are now ready for use!${NC}"