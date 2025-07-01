import multer from 'multer';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configure Multer for video uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Utility function to process video
const processVideo = async (videoBuffer: Buffer, outputPath: string): Promise<void> => {
    // Save the video buffer to a file
    const fs = require('fs');
    fs.writeFileSync(outputPath, videoBuffer);

    // Example command to process the video using a hypothetical AI model
    const command = `your-video-processing-command ${outputPath}`;
    
    try {
        await execAsync(command);
    } catch (error) {
        console.error('Error processing video:', error);
        throw new Error('Video processing failed');
    }
};

// Export the upload middleware and processing function
export { upload, processVideo };