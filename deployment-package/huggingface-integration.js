/**
 * Go4It Sports Hugging Face Model Integration
 * Optimized for 4 vCPU / 16GB RAM / 160GB SSD server
 * 
 * This module handles downloading, fine-tuning, and running Hugging Face models
 * for sports video analysis, reducing API costs and latency.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

// Configuration for Hugging Face models
const config = {
  // Base directory for storing models
  modelsDir: process.env.MODELS_DIR || path.join(process.cwd(), 'models'),
  
  // Model configurations
  models: {
    // Player detection and tracking
    playerDetection: {
      huggingFaceId: 'facebook/detr-resnet-50-dc5',
      localPath: 'player-detection',
      type: 'objectDetection',
      quantized: true, // Use quantized version to reduce memory usage
      maxInstances: 1  // Limit to 1 instance due to memory requirements
    },
    
    // Sport classification
    sportClassification: {
      huggingFaceId: 'microsoft/resnet-50',
      localPath: 'sport-classification',
      type: 'imageClassification',
      quantized: true,
      finetuned: true, // Can be fine-tuned on your sports dataset
      maxInstances: 2
    },
    
    // Pose estimation for technique analysis
    poseEstimation: {
      huggingFaceId: 'google/movenet-singlepose-thunder',
      localPath: 'pose-estimation',
      type: 'poseEstimation',
      quantized: false, // Need full precision for accurate pose detection
      maxInstances: 1
    },
    
    // Action recognition
    actionRecognition: {
      huggingFaceId: 'FCakyon/yolov8n-action-classification',
      localPath: 'action-recognition',
      type: 'videoClassification',
      quantized: true,
      finetuned: true,
      maxInstances: 1
    },
    
    // Text generation for analysis reports (smaller model for on-device use)
    textGeneration: {
      huggingFaceId: 'TheBloke/Llama-2-7B-Chat-GGML',
      localPath: 'text-generation',
      type: 'textGeneration',
      quantized: true, // Heavily quantized for memory efficiency
      maxInstances: 1
    }
  },
  
  // Python environment configuration
  pythonEnv: {
    venvPath: path.join(process.cwd(), 'venv'),
    requirements: [
      'torch==2.0.1',
      'torchvision==0.15.2',
      'transformers==4.30.2',
      'onnx==1.14.0',
      'onnxruntime==1.15.1',
      'opencv-python==4.8.0.74',
      'pillow==9.5.0',
      'huggingface_hub==0.16.4'
    ]
  },
  
  // Server resource configurations
  resources: {
    gpuEnabled: false, // Set to true if GPU is available
    maxMemoryPercent: 75, // Maximum memory percentage to use
    cpuThreads: Math.max(1, os.cpus().length - 1), // Leave 1 CPU free
    batchSize: 8, // Batch size for inference
    preloadModels: ['playerDetection', 'poseEstimation'], // Models to preload at startup
    lowMemoryThreshold: 0.85 // Threshold for low memory mode (85%)
  },
  
  // Caching configuration
  cache: {
    enabled: true,
    directory: path.join(os.tmpdir(), 'huggingface-cache'),
    maxSize: 5 * 1024 * 1024 * 1024, // 5GB
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    pruneInterval: 1 * 60 * 60 * 1000 // 1 hour
  }
};

/**
 * Initialize Hugging Face integration
 */
async function initialize() {
  // Create necessary directories
  ensureDirectoriesExist();
  
  // Set up Python virtual environment if it doesn't exist
  await setupPythonEnvironment();
  
  // Download and prepare models
  await downloadModels(config.resources.preloadModels);
  
  // Initialize model server
  const server = startModelServer();
  
  return {
    config,
    server,
    detectPlayers: async (imagePath) => {
      return callModel('playerDetection', { imagePath });
    },
    analyzePose: async (imagePath) => {
      return callModel('poseEstimation', { imagePath });
    },
    classifySport: async (imagePath) => {
      return callModel('sportClassification', { imagePath });
    },
    recognizeAction: async (videoPath) => {
      return callModel('actionRecognition', { videoPath });
    },
    generateAnalysisReport: async (data) => {
      return callModel('textGeneration', { prompt: formatPrompt(data) });
    },
    fineTuneModel: async (modelType, datasetPath, options = {}) => {
      return fineTune(modelType, datasetPath, options);
    },
    shutdown: () => {
      server.shutdown();
    }
  };
}

/**
 * Ensure all necessary directories exist
 */
function ensureDirectoriesExist() {
  const directories = [
    config.modelsDir,
    config.cache.directory,
    ...Object.values(config.models).map(model => 
      path.join(config.modelsDir, model.localPath)
    )
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

/**
 * Set up Python virtual environment
 */
async function setupPythonEnvironment() {
  if (fs.existsSync(path.join(config.pythonEnv.venvPath, 'bin', 'python')) ||
      fs.existsSync(path.join(config.pythonEnv.venvPath, 'Scripts', 'python.exe'))) {
    console.log('Python virtual environment already exists');
    return;
  }
  
  console.log('Setting up Python virtual environment...');
  
  // Create virtual environment
  await runCommand('python3', ['-m', 'venv', config.pythonEnv.venvPath]);
  
  // Install dependencies
  const pipPath = process.platform === 'win32' 
    ? path.join(config.pythonEnv.venvPath, 'Scripts', 'pip.exe')
    : path.join(config.pythonEnv.venvPath, 'bin', 'pip');
  
  await runCommand(pipPath, ['install', '--upgrade', 'pip']);
  await runCommand(pipPath, ['install', ...config.pythonEnv.requirements]);
  
  console.log('Python environment setup complete');
}

/**
 * Run a shell command
 */
async function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`Running command: ${command} ${args.join(' ')}`);
    
    const proc = spawn(command, args, { stdio: 'inherit' });
    
    proc.on('error', (err) => {
      reject(new Error(`Failed to execute command: ${err.message}`));
    });
    
    proc.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Command exited with code ${code}`));
      }
      resolve();
    });
  });
}

/**
 * Download models from Hugging Face
 */
async function downloadModels(modelKeys) {
  console.log(`Downloading models: ${modelKeys.join(', ')}`);
  
  const pythonScript = path.join(config.modelsDir, 'download_models.py');
  
  // Create Python script for downloading models
  fs.writeFileSync(pythonScript, `
import os
import sys
import json
from huggingface_hub import hf_hub_download, snapshot_download
from transformers import AutoModel, AutoFeatureExtractor, AutoTokenizer

# Load configuration
config = json.loads('''${JSON.stringify(config)}''')

# Process model keys
model_keys = ${JSON.stringify(modelKeys)}

for key in model_keys:
    if key not in config['models']:
        print(f"Model {key} not found in configuration")
        continue
        
    model_config = config['models'][key]
    model_id = model_config['huggingFaceId']
    local_path = os.path.join(config['modelsDir'], model_config['localPath'])
    
    print(f"Downloading {model_id} to {local_path}")
    
    try:
        # For various model types, use appropriate loading method
        if model_config['type'] == 'objectDetection':
            snapshot_download(repo_id=model_id, local_dir=local_path)
        elif model_config['type'] == 'imageClassification':
            snapshot_download(repo_id=model_id, local_dir=local_path)
        elif model_config['type'] == 'poseEstimation':
            snapshot_download(repo_id=model_id, local_dir=local_path)
        elif model_config['type'] == 'videoClassification':
            snapshot_download(repo_id=model_id, local_dir=local_path)
        elif model_config['type'] == 'textGeneration':
            # For text generation, download specific files based on quantization
            if model_config['quantized']:
                hf_hub_download(repo_id=model_id, 
                               filename="llama-2-7b-chat.ggmlv3.q4_0.bin", 
                               local_dir=local_path)
            else:
                snapshot_download(repo_id=model_id, local_dir=local_path)
        
        print(f"Successfully downloaded {model_id}")
    except Exception as e:
        print(f"Error downloading {model_id}: {str(e)}")
        sys.exit(1)

print("All models downloaded successfully")
  `);
  
  // Run the Python script to download models
  const pythonPath = process.platform === 'win32' 
    ? path.join(config.pythonEnv.venvPath, 'Scripts', 'python.exe')
    : path.join(config.pythonEnv.venvPath, 'bin', 'python');
  
  await runCommand(pythonPath, [pythonScript]);
  
  // Cleanup
  fs.unlinkSync(pythonScript);
}

/**
 * Start model server for inference
 */
function startModelServer() {
  console.log('Starting model server...');
  
  // Create Python script for model server
  const serverScript = path.join(config.modelsDir, 'model_server.py');
  
  fs.writeFileSync(serverScript, `
import os
import sys
import json
import time
import torch
import socket
import threading
import numpy as np
from PIL import Image
import io
import base64
import traceback
from transformers import pipeline, AutoProcessor

# Load configuration
config = json.loads('''${JSON.stringify(config)}''')

# Global models dict
loaded_models = {}

# Check if CUDA is available
cuda_available = torch.cuda.is_available() and config['resources']['gpuEnabled']
device = 'cuda' if cuda_available else 'cpu'
print(f"Using device: {device}")

# Load models based on configuration
def load_model(model_key):
    if model_key in loaded_models:
        return loaded_models[model_key]
        
    if model_key not in config['models']:
        raise ValueError(f"Model {model_key} not found in configuration")
        
    model_config = config['models'][model_key]
    model_path = os.path.join(config['modelsDir'], model_config['localPath'])
    
    print(f"Loading model {model_key} from {model_path}")
    
    try:
        # Initialize appropriate pipeline based on model type
        if model_config['type'] == 'objectDetection':
            model = pipeline("object-detection", model=model_path, device=device)
        elif model_config['type'] == 'imageClassification':
            model = pipeline("image-classification", model=model_path, device=device)
        elif model_config['type'] == 'poseEstimation':
            model = pipeline("pose-estimation", model=model_path, device=device)
        elif model_config['type'] == 'videoClassification':
            model = pipeline("video-classification", model=model_path, device=device)
        elif model_config['type'] == 'textGeneration':
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

# Handle requests
def handle_request(request_data):
    try:
        model_key = request_data.get('model')
        if not model_key:
            return {'error': 'No model specified'}
            
        # Load model if not already loaded
        if model_key not in loaded_models:
            load_model(model_key)
            
        model = loaded_models[model_key]
        model_config = config['models'][model_key]
        
        # Process different input types based on model type
        if model_config['type'] in ['objectDetection', 'imageClassification', 'poseEstimation']:
            image_path = request_data.get('imagePath')
            if not image_path:
                return {'error': 'No image path provided'}
                
            # Read image
            image = Image.open(image_path)
            result = model(image)
            
        elif model_config['type'] == 'videoClassification':
            video_path = request_data.get('videoPath')
            if not video_path:
                return {'error': 'No video path provided'}
                
            result = model(video_path)
            
        elif model_config['type'] == 'textGeneration':
            prompt = request_data.get('prompt')
            if not prompt:
                return {'error': 'No prompt provided'}
                
            result = model(prompt, max_length=1000, do_sample=True, temperature=0.7)
            
        else:
            return {'error': f"Unsupported model type: {model_config['type']}"}
            
        return {'result': result}
        
    except Exception as e:
        traceback.print_exc()
        return {'error': str(e)}

# Start server
def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('localhost', 3456))
    server_socket.listen(5)
    
    print("Model server started at localhost:3456")
    
    # Preload specified models
    for model_key in config['resources']['preloadModels']:
        try:
            load_model(model_key)
        except Exception as e:
            print(f"Failed to preload {model_key}: {str(e)}")
    
    try:
        while True:
            client_socket, _ = server_socket.accept()
            threading.Thread(target=handle_client, args=(client_socket,)).start()
    except KeyboardInterrupt:
        print("Shutting down server")
    finally:
        server_socket.close()

def handle_client(client_socket):
    buffer = ""
    try:
        while True:
            data = client_socket.recv(4096).decode('utf-8')
            if not data:
                break
                
            buffer += data
            if "\\n\\n" in buffer:  # Message delimiter
                request_str, buffer = buffer.split("\\n\\n", 1)
                try:
                    request_data = json.loads(request_str)
                    response = handle_request(request_data)
                    client_socket.sendall((json.dumps(response) + "\\n\\n").encode('utf-8'))
                except json.JSONDecodeError:
                    client_socket.sendall(json.dumps({'error': 'Invalid JSON'}) + "\\n\\n").encode('utf-8')
    except Exception as e:
        print(f"Error handling client: {str(e)}")
    finally:
        client_socket.close()

if __name__ == "__main__":
    start_server()
  `);
  
  // Start the model server
  const pythonPath = process.platform === 'win32' 
    ? path.join(config.pythonEnv.venvPath, 'Scripts', 'python.exe')
    : path.join(config.pythonEnv.venvPath, 'bin', 'python');
  
  const serverProcess = spawn(pythonPath, [serverScript], {
    detached: true,
    stdio: 'inherit'
  });
  
  // Check if server started successfully
  // Wait for server to start
  return {
    process: serverProcess,
    shutdown: () => {
      if (serverProcess && !serverProcess.killed) {
        console.log('Shutting down model server...');
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t']);
        } else {
          process.kill(-serverProcess.pid);
        }
      }
    }
  };
}

/**
 * Call a model for inference
 */
async function callModel(modelKey, params) {
  return new Promise((resolve, reject) => {
    const client = require('net').createConnection({ port: 3456 }, () => {
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
 * Format prompt for text generation model
 */
function formatPrompt(data) {
  // Format the input data into a prompt for the text generation model
  let prompt = 'Analyze the following sports performance data:\n\n';
  
  if (data.athlete) {
    prompt += `Athlete: ${data.athlete.name}\n`;
    prompt += `Sport: ${data.athlete.sport}\n`;
    prompt += `Position: ${data.athlete.position}\n\n`;
  }
  
  if (data.metrics) {
    prompt += 'Performance Metrics:\n';
    for (const [key, value] of Object.entries(data.metrics)) {
      prompt += `- ${key}: ${value.average} (min: ${value.min}, max: ${value.max})\n`;
    }
    prompt += '\n';
  }
  
  if (data.highlights) {
    prompt += 'Key Moments:\n';
    data.highlights.forEach((highlight, i) => {
      prompt += `- Moment ${i+1}: ${highlight.label} (score: ${highlight.score})\n`;
    });
    prompt += '\n';
  }
  
  prompt += 'Please provide a detailed analysis of this performance, including:';
  prompt += '\n1. Overall assessment';
  prompt += '\n2. Strengths demonstrated';
  prompt += '\n3. Areas for improvement';
  prompt += '\n4. Specific drills or techniques to work on';
  prompt += '\n5. Comparison to expected standards for their level';
  
  return prompt;
}

/**
 * Fine-tune a model on custom dataset
 */
async function fineTune(modelKey, datasetPath, options = {}) {
  if (!config.models[modelKey]) {
    throw new Error(`Model ${modelKey} not found in configuration`);
  }
  
  const modelConfig = config.models[modelKey];
  if (!modelConfig.finetuned) {
    throw new Error(`Model ${modelKey} is not configured for fine-tuning`);
  }
  
  console.log(`Fine-tuning ${modelKey} on dataset ${datasetPath}`);
  
  // Create Python script for fine-tuning
  const finetunePath = path.join(config.modelsDir, 'finetune.py');
  
  fs.writeFileSync(finetunePath, `
import os
import sys
import json
import torch
from transformers import Trainer, TrainingArguments, AutoModelForSequenceClassification, AutoImageProcessor, AutoTokenizer
from datasets import load_dataset, Dataset
import numpy as np

# Load configuration
config = json.loads('''${JSON.stringify(config)}''')
options = json.loads('''${JSON.stringify(options)}''')
model_key = "${modelKey}"
dataset_path = "${datasetPath}"

model_config = config['models'][model_key]
model_path = os.path.join(config['modelsDir'], model_config['localPath'])
model_id = model_config['huggingFaceId']

# Set up training arguments
training_args = TrainingArguments(
    output_dir=os.path.join(model_path, "finetuned"),
    num_train_epochs=options.get('epochs', 3),
    per_device_train_batch_size=options.get('batchSize', 8),
    per_device_eval_batch_size=options.get('batchSize', 8),
    warmup_steps=options.get('warmupSteps', 500),
    weight_decay=options.get('weightDecay', 0.01),
    logging_dir=os.path.join(model_path, "logs"),
    logging_steps=10,
    load_best_model_at_end=True,
    evaluation_strategy="epoch",
    save_strategy="epoch",
)

try:
    # Load dataset
    if os.path.isdir(dataset_path):
        # Local dataset, load based on type
        if model_config['type'] == 'imageClassification':
            dataset = load_dataset("imagefolder", data_dir=dataset_path)
        else:
            dataset = load_dataset("json", data_files=os.path.join(dataset_path, "*.json"))
    else:
        # Hugging Face dataset
        dataset = load_dataset(dataset_path)
    
    # Split dataset if needed
    if 'train' not in dataset:
        dataset = dataset['train'].train_test_split(test_size=0.2)
    
    # Set up model and trainer based on model type
    if model_config['type'] == 'imageClassification':
        # Fine-tune image classification model
        processor = AutoImageProcessor.from_pretrained(model_id)
        model = AutoModelForSequenceClassification.from_pretrained(
            model_id, 
            num_labels=len(dataset['train'].features['label'].names)
        )
        
        def preprocess_images(examples):
            images = [img.convert("RGB") for img in examples['image']]
            inputs = processor(images, return_tensors="pt", padding=True)
            inputs['labels'] = examples['label']
            return inputs
            
        train_dataset = dataset['train'].map(preprocess_images, batched=True)
        eval_dataset = dataset['test'].map(preprocess_images, batched=True)
        
        # Set up trainer
        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=train_dataset,
            eval_dataset=eval_dataset,
        )
        
    # Add more model types as needed...
    
    # Train the model
    trainer.train()
    
    # Save the fine-tuned model
    trainer.save_model()
    print(f"Fine-tuned model saved to {os.path.join(model_path, 'finetuned')}")
    
except Exception as e:
    print(f"Error fine-tuning model: {str(e)}")
    sys.exit(1)
  `);
  
  // Run the fine-tuning script
  const pythonPath = process.platform === 'win32' 
    ? path.join(config.pythonEnv.venvPath, 'Scripts', 'python.exe')
    : path.join(config.pythonEnv.venvPath, 'bin', 'python');
  
  await runCommand(pythonPath, [finetunePath]);
  
  // Cleanup
  fs.unlinkSync(finetunePath);
  
  console.log(`Fine-tuning of ${modelKey} complete`);
  
  // Update model config to use fine-tuned model
  const modelConfig = config.models[modelKey];
  const oldModelPath = modelConfig.huggingFaceId;
  modelConfig.huggingFaceId = path.join(config.modelsDir, modelConfig.localPath, 'finetuned');
  
  console.log(`Updated ${modelKey} to use fine-tuned model: ${modelConfig.huggingFaceId}`);
  
  return {
    modelKey,
    originalModel: oldModelPath,
    finetunedModel: modelConfig.huggingFaceId,
    datasetPath
  };
}

module.exports = {
  initialize,
  config
};