/**
 * Go4It Engine - Base Worker
 * 
 * This is the foundation for all worker thread implementations.
 * It handles common operations like progress reporting and error handling.
 */

const { parentPort, workerData } = require('worker_threads');

// Extract job information from worker data
const { jobId, jobType, jobData } = workerData || {};

// Initialize worker
console.log(`Worker initialized for job ${jobId} (${jobType})`);

// Send progress updates to parent
function reportProgress(progress, result = null) {
  if (parentPort) {
    parentPort.postMessage({
      type: 'progress',
      jobId,
      progress,
      result
    });
  }
}

// Complete the job
function completeJob(result) {
  if (parentPort) {
    parentPort.postMessage({
      type: 'complete',
      jobId,
      result
    });
  }
}

// Handle errors
function handleError(error) {
  console.error(`Error in worker (${jobId}): ${error.message}`);
  
  if (parentPort) {
    parentPort.postMessage({
      type: 'error',
      jobId,
      error: error.message
    });
  }
  
  process.exit(1);
}

// Process job - to be overridden by specific workers
async function processJob() {
  try {
    // This is a placeholder implementation
    // Actual workers will override this function
    
    // Simulate work with progress updates
    for (let i = 0; i <= 100; i += 10) {
      reportProgress(i);
      
      // Simulate work
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Complete the job
    completeJob({ message: 'Job completed successfully' });
    
  } catch (error) {
    handleError(error);
  }
}

// Set up message handling
if (parentPort) {
  parentPort.on('message', async (message) => {
    if (message.type === 'cancel') {
      console.log(`Job ${jobId} cancelled`);
      process.exit(0);
    }
  });
}

// Set up error handling
process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);

// Start processing
processJob().catch(handleError);

// Export functions for specialized workers
module.exports = {
  reportProgress,
  completeJob,
  handleError,
  jobId,
  jobType,
  jobData
};