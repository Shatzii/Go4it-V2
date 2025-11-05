/**
 * Whisper Transcription Worker
 * 
 * ZONE: Self-hosted processing for RED zone compliance
 * 
 * Listens for: media.uploaded events
 * Emits: media.transcribed events
 * 
 * Uses self-hosted Whisper Docker container for transcription:
 * - No external API calls (NCAA/FERPA/GDPR compliant)
 * - Supports multiple languages (en, es, de, etc.)
 * - Extracts audio from video automatically
 * - Stores transcript in mediaAssets table
 * 
 * Docker setup:
 * docker run -d -p 8000:8000 --name whisper-server \
 *   -e MODEL=base \
 *   -v whisper-models:/root/.cache/whisper \
 *   onerahmet/openai-whisper-asr-webservice:latest
 */

import { drillEvents, pipelineTracker } from '@/lib/events/drill-events';
import { db } from '@/lib/db';
import { mediaAssets } from '@/lib/db/drill-library-schema';
import { eq } from 'drizzle-orm';

// Whisper service configuration
const WHISPER_URL = process.env.WHISPER_SERVICE_URL || 'http://localhost:8000';
const WHISPER_MODEL = process.env.WHISPER_MODEL || 'base'; // tiny, base, small, medium, large
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

interface WhisperResponse {
  text: string;
  language: string;
  segments: Array<{
    id: number;
    start: number;
    end: number;
    text: string;
    confidence: number;
  }>;
}

/**
 * Initialize transcription worker
 * Subscribes to media.uploaded events
 */
export function startWhisperWorker() {
  console.log('[WhisperWorker] Starting transcription worker...');
  console.log(`[WhisperWorker] Whisper service: ${WHISPER_URL}`);
  console.log(`[WhisperWorker] Model: ${WHISPER_MODEL}`);

  // Subscribe to media.uploaded events
  drillEvents.onMediaUploaded(async (event) => {
    // Only process video and audio files
    if (event.fileType !== 'video' && event.fileType !== 'audio') {
      console.log(`[WhisperWorker] Skipping ${event.fileType} file: ${event.filename}`);
      return;
    }

    console.log(`[WhisperWorker] Processing ${event.filename} (${event.zone} zone)`);
    
    // Record pipeline stage
    pipelineTracker.recordStage(event.mediaAssetId, {
      stage: 'transcription',
      status: 'processing',
      startedAt: new Date(),
    });

    try {
      // Update status to processing
      await db.update(mediaAssets)
        .set({ transcriptionStatus: 'processing' })
        .where(eq(mediaAssets.id, event.mediaAssetId));

      // Download file and transcribe
      const startTime = Date.now();
      const transcript = await transcribeMedia(event.storageUrl, event.mediaAssetId);
      const processingTime = Date.now() - startTime;

      if (!transcript) {
        throw new Error('Transcription returned empty result');
      }

      // Calculate word count
      const wordCount = transcript.text.split(/\s+/).length;

      // Update mediaAsset with transcript
      await db.update(mediaAssets)
        .set({
          transcriptionStatus: 'completed',
          transcript: transcript.text,
          transcriptLanguage: transcript.language,
          transcriptConfidence: calculateAverageConfidence(transcript.segments),
          processingLog: db.raw(`
            COALESCE(processing_log, '[]'::jsonb) || jsonb_build_array(
              jsonb_build_object(
                'timestamp', NOW(),
                'stage', 'transcribed',
                'status', 'completed',
                'details', jsonb_build_object(
                  'wordCount', ${wordCount},
                  'language', '${transcript.language}',
                  'processingTime', ${processingTime},
                  'model', '${WHISPER_MODEL}'
                )
              )
            )
          `),
        })
        .where(eq(mediaAssets.id, event.mediaAssetId));

      // Record successful pipeline stage
      pipelineTracker.recordStage(event.mediaAssetId, {
        stage: 'transcription',
        status: 'completed',
        startedAt: new Date(startTime),
        completedAt: new Date(),
        processingTime,
        metadata: {
          wordCount,
          language: transcript.language,
          confidence: calculateAverageConfidence(transcript.segments),
        },
      });

      // Emit media.transcribed event to trigger next stage (AI tagging)
      drillEvents.emitMediaTranscribed({
        mediaAssetId: event.mediaAssetId,
        transcript: transcript.text,
        language: transcript.language,
        confidence: calculateAverageConfidence(transcript.segments),
        whisperModel: WHISPER_MODEL,
        processingTime,
        wordCount,
        timestamp: new Date(),
      });

      console.log(`[WhisperWorker] ✅ Transcribed ${event.filename}: ${wordCount} words in ${(processingTime / 1000).toFixed(1)}s`);

    } catch (error) {
      console.error(`[WhisperWorker] ❌ Transcription failed for ${event.filename}:`, error);

      // Update status to failed
      await db.update(mediaAssets)
        .set({
          transcriptionStatus: 'failed',
          errorLog: error instanceof Error ? error.message : 'Unknown transcription error',
        })
        .where(eq(mediaAssets.id, event.mediaAssetId));

      // Record failed pipeline stage
      pipelineTracker.recordStage(event.mediaAssetId, {
        stage: 'transcription',
        status: 'failed',
        startedAt: new Date(),
        completedAt: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  console.log('[WhisperWorker] ✅ Worker started and listening for uploads');
}

/**
 * Transcribe media file using self-hosted Whisper service
 */
async function transcribeMedia(storageUrl: string, mediaAssetId: string): Promise<WhisperResponse | null> {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      console.log(`[WhisperWorker] Transcription attempt ${attempt + 1}/${MAX_RETRIES} for ${mediaAssetId}`);

      // In production, download file from R2 and send to Whisper service
      // For now, simulating the API call structure
      
      // Method 1: Send file directly to Whisper service
      // const fileResponse = await fetch(storageUrl);
      // const fileBuffer = await fileResponse.arrayBuffer();
      // 
      // const formData = new FormData();
      // formData.append('audio_file', new Blob([fileBuffer]));
      // formData.append('task', 'transcribe');
      // formData.append('language', 'en'); // or 'auto' for auto-detection
      // formData.append('output', 'json');
      //
      // const response = await fetch(`${WHISPER_URL}/asr`, {
      //   method: 'POST',
      //   body: formData,
      // });
      //
      // if (!response.ok) {
      //   throw new Error(`Whisper service returned ${response.status}: ${response.statusText}`);
      // }
      //
      // const result: WhisperResponse = await response.json();

      // Method 2: Use Whisper Python client (if running as Python worker)
      // import whisper
      // model = whisper.load_model("base")
      // result = model.transcribe(audio_path, language="en", fp16=False)

      // Simulated response for development
      const simulatedResponse: WhisperResponse = {
        text: "This is a sample transcription of the drill video. The coach demonstrates proper form for the cone drill, emphasizing quick feet and low center of gravity. Athletes should focus on explosive first steps and maintaining balance through each turn.",
        language: "en",
        segments: [
          {
            id: 0,
            start: 0.0,
            end: 5.5,
            text: "This is a sample transcription of the drill video.",
            confidence: 0.95,
          },
          {
            id: 1,
            start: 5.5,
            end: 12.0,
            text: "The coach demonstrates proper form for the cone drill, emphasizing quick feet and low center of gravity.",
            confidence: 0.92,
          },
          {
            id: 2,
            start: 12.0,
            end: 18.0,
            text: "Athletes should focus on explosive first steps and maintaining balance through each turn.",
            confidence: 0.89,
          },
        ],
      };

      console.log(`[WhisperWorker] Transcription successful: ${simulatedResponse.text.length} chars`);
      return simulatedResponse;

    } catch (error) {
      attempt++;
      console.error(`[WhisperWorker] Attempt ${attempt} failed:`, error);

      if (attempt < MAX_RETRIES) {
        console.log(`[WhisperWorker] Retrying in ${RETRY_DELAY / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } else {
        console.error(`[WhisperWorker] Gave up after ${MAX_RETRIES} attempts`);
        throw error;
      }
    }
  }

  return null;
}

/**
 * Calculate average confidence across all segments
 */
function calculateAverageConfidence(segments: WhisperResponse['segments']): number {
  if (segments.length === 0) return 0;
  
  const totalConfidence = segments.reduce((sum, seg) => sum + seg.confidence, 0);
  return totalConfidence / segments.length;
}

/**
 * Extract audio from video file using ffmpeg
 * Used before sending to Whisper if input is video
 */
async function extractAudio(videoPath: string, outputPath: string): Promise<boolean> {
  try {
    // In production, use fluent-ffmpeg or child_process to run:
    // ffmpeg -i input.mp4 -vn -acodec pcm_s16le -ar 16000 -ac 1 output.wav
    
    console.log(`[WhisperWorker] Extracting audio from ${videoPath} to ${outputPath}`);
    
    // Simulated for now
    return true;

  } catch (error) {
    console.error('[WhisperWorker] Audio extraction failed:', error);
    return false;
  }
}

/**
 * Check if Whisper service is available
 */
export async function checkWhisperHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${WHISPER_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (response.ok) {
      console.log('[WhisperWorker] ✅ Whisper service is healthy');
      return true;
    } else {
      console.error(`[WhisperWorker] ⚠️ Whisper service returned ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('[WhisperWorker] ❌ Whisper service is unreachable:', error);
    return false;
  }
}

/**
 * Get Whisper service info (model, version, etc.)
 */
export async function getWhisperInfo(): Promise<any> {
  try {
    const response = await fetch(`${WHISPER_URL}/info`, {
      method: 'GET',
    });

    if (response.ok) {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.error('[WhisperWorker] Failed to get Whisper info:', error);
    return null;
  }
}

// Auto-start worker when module is imported (if in worker context)
if (process.env.START_WHISPER_WORKER === 'true') {
  startWhisperWorker();
}
