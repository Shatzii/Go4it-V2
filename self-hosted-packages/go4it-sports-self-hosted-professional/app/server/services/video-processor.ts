import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const execAsync = promisify(exec);

interface ThumbnailOptions {
  time?: number; // Time in seconds to capture thumbnail (default: middle of video)
  width?: number; // Width in pixels (default: 320)
}

interface HighlightOptions {
  startTime: number; // Start time in seconds
  endTime: number; // End time in seconds
  outputQuality?: string; // FFmpeg quality preset (ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow)
}

export class VideoProcessor {
  /**
   * Generate a thumbnail from a video file
   * @param videoPath Path to the source video file
   * @param options Thumbnail generation options
   * @returns Path to the generated thumbnail
   */
  static async generateThumbnail(
    videoPath: string,
    options: ThumbnailOptions = {}
  ): Promise<string> {
    // Create thumbnails directory if it doesn't exist
    const thumbnailDir = path.join(process.cwd(), 'uploads', 'thumbnails');
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    // Generate a unique filename for the thumbnail
    const thumbnailFilename = `${Date.now()}-${uuidv4()}.jpg`;
    const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);

    // Set default options
    const time = options.time !== undefined ? options.time : await this.getVideoDuration(videoPath) / 2;
    const width = options.width || 320;

    // Use ffmpeg to extract a frame from the video
    const ffmpegCommand = `ffmpeg -ss ${time} -i "${videoPath}" -vframes 1 -vf "scale=${width}:-1" -y "${thumbnailPath}"`;

    try {
      await execAsync(ffmpegCommand);
      return thumbnailPath;
    } catch (error: any) {
      console.error('Error generating thumbnail:', error);
      throw new Error(`Failed to generate thumbnail: ${error.message}`);
    }
  }

  /**
   * Create a highlight clip from a video
   * @param videoPath Path to the source video file
   * @param options Highlight clip options
   * @returns Object containing paths to the generated highlight and thumbnail
   */
  static async createHighlight(
    videoPath: string,
    options: HighlightOptions
  ): Promise<{ highlightPath: string; thumbnailPath: string }> {
    // Create highlights directory if it doesn't exist
    const highlightsDir = path.join(process.cwd(), 'uploads', 'highlights');
    if (!fs.existsSync(highlightsDir)) {
      fs.mkdirSync(highlightsDir, { recursive: true });
    }

    // Get file extension from source video
    const fileExt = path.extname(videoPath);
    
    // Generate a unique filename for the highlight clip
    const highlightFilename = `highlight-${Date.now()}-${uuidv4()}${fileExt}`;
    const highlightPath = path.join(highlightsDir, highlightFilename);

    // Validate input parameters
    if (
      options.startTime < 0 ||
      options.endTime <= options.startTime ||
      options.endTime > await this.getVideoDuration(videoPath)
    ) {
      throw new Error('Invalid start or end time for highlight creation');
    }

    // Set quality preset
    const quality = options.outputQuality || 'fast';
    
    // Calculate duration
    const duration = options.endTime - options.startTime;

    // Use ffmpeg to create the highlight clip
    // -ss: start time, -t: duration, -c:v copy -c:a copy: copy video and audio streams without re-encoding
    const ffmpegCommand = `ffmpeg -ss ${options.startTime} -i "${videoPath}" -t ${duration} -c:v libx264 -preset ${quality} -c:a aac -b:a 128k -y "${highlightPath}"`;

    try {
      await execAsync(ffmpegCommand);
      
      // Generate a thumbnail from the middle of the highlight
      const thumbnailPath = await this.generateThumbnail(highlightPath, {
        time: duration / 2
      });

      return {
        highlightPath,
        thumbnailPath
      };
    } catch (error: any) {
      console.error('Error creating highlight clip:', error);
      throw new Error(`Failed to create highlight clip: ${error.message}`);
    }
  }

  /**
   * Get the duration of a video file in seconds
   * @param videoPath Path to the video file
   * @returns Duration in seconds
   */
  static async getVideoDuration(videoPath: string): Promise<number> {
    try {
      // Use ffmpeg to get video duration
      const { stdout } = await execAsync(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`
      );
      
      const duration = parseFloat(stdout.trim());
      return isNaN(duration) ? 0 : duration;
    } catch (error: any) {
      console.error('Error getting video duration:', error);
      throw new Error(`Failed to get video duration: ${error.message}`);
    }
  }
}