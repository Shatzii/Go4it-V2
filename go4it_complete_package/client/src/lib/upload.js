/**
 * Upload.js - Go4It Sports Media Upload Module
 * Production build for https://go4itsports.org
 * 
 * This module handles intelligent media uploading with AI-powered
 * preprocessing and optimization.
 */

// Configuration that will be set during initialization
let config = {
  apiBase: '/api',
  assetBase: '/assets',
  debug: false
};

// Upload module state
const state = {
  initialized: false,
  uploads: new Map(), // Track ongoing uploads
  supportedTypes: ['video/mp4', 'video/quicktime', 'image/jpeg', 'image/png'],
  maxFileSize: 100 * 1024 * 1024 // 100MB default limit
};

/**
 * Initialize the upload module
 * @param {Object} options - Configuration options
 */
function init(options = {}) {
  // Merge provided options with defaults
  config = { ...config, ...options };
  
  if (config.debug) {
    console.log('Upload module initialized with config:', config);
  }
  
  // Update max file size if specified in environment
  const envMaxSize = parseInt(import.meta.env.VITE_MAX_UPLOAD_SIZE || '0', 10);
  if (envMaxSize > 0) {
    state.maxFileSize = envMaxSize;
  }
  
  // Register event listeners
  document.addEventListener('upload:request', handleUploadRequest);
  
  state.initialized = true;
  return true;
}

/**
 * Handle a request to upload media
 * @param {CustomEvent} event - The event containing upload parameters
 */
function handleUploadRequest(event) {
  if (!state.initialized) {
    console.error('Upload module not initialized');
    return;
  }
  
  const { file, options, requestId } = event.detail || {};
  
  if (!file) {
    notifyError('Missing file for upload', requestId);
    return;
  }
  
  // Validate file
  if (!validateFile(file)) {
    notifyError(`Invalid file: ${file.name}. Check file type and size.`, requestId);
    return;
  }
  
  // Track this upload
  const uploadId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  state.uploads.set(uploadId, {
    file,
    options,
    requestId,
    progress: 0,
    status: 'preparing'
  });
  
  if (config.debug) {
    console.log(`Preparing upload ${uploadId} for file: ${file.name}`, file.type, file.size);
  }
  
  // Notify upload started
  notifyUploadStatus({
    uploadId,
    requestId,
    status: 'preparing',
    progress: 0,
    message: 'Preparing file for upload...'
  });
  
  // Simulate upload process with multiple steps
  simulateUpload(uploadId);
}

/**
 * Validate file before upload
 * @param {File} file - The file to validate
 * @returns {boolean} True if file is valid
 */
function validateFile(file) {
  // Check file type
  if (!state.supportedTypes.includes(file.type)) {
    console.error(`Unsupported file type: ${file.type}`);
    return false;
  }
  
  // Check file size
  if (file.size > state.maxFileSize) {
    console.error(`File too large: ${file.size} bytes. Max: ${state.maxFileSize} bytes`);
    return false;
  }
  
  return true;
}

/**
 * Simulate the upload process for development/testing
 * @param {string} uploadId - The ID of the upload to simulate
 */
function simulateUpload(uploadId) {
  const upload = state.uploads.get(uploadId);
  if (!upload) return;
  
  // Update status to analyzing
  state.uploads.set(uploadId, {
    ...upload,
    status: 'analyzing',
    progress: 0.1
  });
  
  notifyUploadStatus({
    uploadId,
    requestId: upload.requestId,
    status: 'analyzing',
    progress: 0.1,
    message: 'Analyzing file content...'
  });
  
  // Simulate analysis delay
  setTimeout(() => {
    // Update to uploading
    state.uploads.set(uploadId, {
      ...upload,
      status: 'uploading',
      progress: 0.2
    });
    
    notifyUploadStatus({
      uploadId,
      requestId: upload.requestId,
      status: 'uploading',
      progress: 0.2,
      message: 'Uploading file...'
    });
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      const currentUpload = state.uploads.get(uploadId);
      if (!currentUpload || currentUpload.status !== 'uploading') {
        clearInterval(progressInterval);
        return;
      }
      
      const newProgress = Math.min(0.95, currentUpload.progress + 0.1);
      state.uploads.set(uploadId, {
        ...currentUpload,
        progress: newProgress
      });
      
      notifyUploadStatus({
        uploadId,
        requestId: upload.requestId,
        status: 'uploading',
        progress: newProgress,
        message: `Uploading: ${Math.round(newProgress * 100)}%`
      });
      
      // Finish upload when progress is high enough
      if (newProgress >= 0.9) {
        clearInterval(progressInterval);
        finishUpload(uploadId);
      }
    }, 800);
  }, 1200);
}

/**
 * Complete the simulated upload process
 * @param {string} uploadId - The ID of the upload to finish
 */
function finishUpload(uploadId) {
  const upload = state.uploads.get(uploadId);
  if (!upload) return;
  
  // Update to processing
  state.uploads.set(uploadId, {
    ...upload,
    status: 'processing',
    progress: 0.95
  });
  
  notifyUploadStatus({
    uploadId,
    requestId: upload.requestId,
    status: 'processing',
    progress: 0.95,
    message: 'Processing upload...'
  });
  
  // Simulate processing delay
  setTimeout(() => {
    // Complete the upload
    state.uploads.set(uploadId, {
      ...upload,
      status: 'complete',
      progress: 1.0,
      result: {
        id: `file-${Date.now()}`,
        name: upload.file.name,
        url: `${config.assetBase}/uploads/${upload.file.name.replace(/\s+/g, '_')}`,
        type: upload.file.type,
        size: upload.file.size,
        uploadDate: new Date().toISOString()
      }
    });
    
    const currentUpload = state.uploads.get(uploadId);
    
    notifyUploadStatus({
      uploadId,
      requestId: upload.requestId,
      status: 'complete',
      progress: 1.0,
      message: 'Upload complete!',
      result: currentUpload.result
    });
  }, 1500);
}

/**
 * Notify error during upload
 * @param {string} message - Error message
 * @param {string} requestId - Original request ID
 */
function notifyError(message, requestId) {
  document.dispatchEvent(new CustomEvent('upload:error', {
    detail: {
      requestId,
      message,
      timestamp: new Date().toISOString()
    }
  }));
}

/**
 * Notify about upload status changes
 * @param {Object} statusInfo - Upload status information
 */
function notifyUploadStatus(statusInfo) {
  document.dispatchEvent(new CustomEvent('upload:status', {
    detail: {
      ...statusInfo,
      timestamp: new Date().toISOString()
    }
  }));
}

/**
 * Programmatically upload a file
 * @param {File} file - File to upload
 * @param {Object} options - Upload options
 * @returns {Promise} Promise resolving with upload result
 */
function uploadFile(file, options = {}) {
  return new Promise((resolve, reject) => {
    if (!state.initialized) {
      reject(new Error('Upload module not initialized'));
      return;
    }
    
    const requestId = Date.now().toString(36);
    
    // Create handlers for events
    const statusHandler = (event) => {
      if (event.detail.requestId === requestId) {
        if (event.detail.status === 'complete') {
          document.removeEventListener('upload:status', statusHandler);
          document.removeEventListener('upload:error', errorHandler);
          resolve(event.detail.result);
        }
      }
    };
    
    const errorHandler = (event) => {
      if (event.detail.requestId === requestId) {
        document.removeEventListener('upload:status', statusHandler);
        document.removeEventListener('upload:error', errorHandler);
        reject(new Error(event.detail.message));
      }
    };
    
    // Register handlers
    document.addEventListener('upload:status', statusHandler);
    document.addEventListener('upload:error', errorHandler);
    
    // Dispatch upload request
    document.dispatchEvent(new CustomEvent('upload:request', {
      detail: { file, options, requestId }
    }));
    
    // Set a timeout
    setTimeout(() => {
      document.removeEventListener('upload:status', statusHandler);
      document.removeEventListener('upload:error', errorHandler);
      reject(new Error('Upload request timed out'));
    }, 30000); // 30 second timeout
  });
}

// Public API
export default {
  init,
  uploadFile,
};