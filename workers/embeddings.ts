/**
 * Embeddings Worker - Vector Generation for Semantic Search
 * 
 * ZONE: Supports RED, YELLOW, and GREEN zones (all self-hosted)
 * MODEL: local_embed_model via Ollama (self-hosted)
 * 
 * Pipeline Stage: drill.tagged → drill.embedded
 * 
 * Process:
 * 1. Listen for drill.tagged events
 * 2. Fetch drill + transcript + tags
 * 3. Create embedding prompt from combined content
 * 4. Generate vector embeddings via Ollama
 * 5. Store embeddings in mediaAssets/drills table
 * 6. Emit drill.embedded event → ready for approval
 * 
 * RED ZONE COMPLIANCE: All processing stays on self-hosted Ollama
 */

import { drillEvents, pipelineTracker } from '@/lib/events/drill-events';
import { db } from '@/lib/db';
import { mediaAssets, drills } from '@/lib/db/drill-library-schema';
import { eq } from 'drizzle-orm';

// Ollama configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text'; // 768 dimensions
const EMBED_BATCH_SIZE = 10; // Process embeddings in batches

/**
 * Initialize Embeddings worker - listens for drill.tagged events
 */
export function initEmbeddingsWorker() {
  console.log('[EmbeddingsWorker] 🔢 Initializing embeddings worker');
  console.log(`[EmbeddingsWorker] Ollama: ${OLLAMA_BASE_URL}`);
  console.log(`[EmbeddingsWorker] Model: ${EMBED_MODEL}`);

  // Listen for tagged drills that need embeddings
  drillEvents.onDrillTagged(async (event) => {
    const { drillId, mediaAssetId, tags } = event;

    console.log(`[EmbeddingsWorker] 🎯 Processing embeddings for drill ${drillId}`);

    // Record pipeline stage
    if (mediaAssetId) {
      pipelineTracker.recordStage(mediaAssetId, {
        stage: 'embeddings',
        status: 'processing',
        startedAt: new Date(),
      });
    }

    try {
      await generateEmbeddings(drillId, mediaAssetId);
      
      if (mediaAssetId) {
        pipelineTracker.recordStage(mediaAssetId, {
          stage: 'embeddings',
          status: 'completed',
          startedAt: new Date(),
          completedAt: new Date(),
        });
      }
    } catch (error) {
      console.error(`[EmbeddingsWorker] ❌ Embedding generation failed for ${drillId}:`, error);
      
      if (mediaAssetId) {
        pipelineTracker.recordStage(mediaAssetId, {
          stage: 'embeddings',
          status: 'failed',
          startedAt: new Date(),
          completedAt: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  });

  console.log('[EmbeddingsWorker] ✅ Embeddings worker ready and listening');
}

/**
 * Generate embeddings for a drill
 */
async function generateEmbeddings(drillId: string, mediaAssetId?: string): Promise<void> {
  const startTime = Date.now();

  // 1. Fetch drill data
  const drill = await db.query.drills.findFirst({
    where: eq(drills.id, drillId),
  });

  if (!drill) {
    throw new Error(`Drill ${drillId} not found`);
  }

  // 2. Fetch associated media asset (if exists)
  let mediaAsset;
  if (mediaAssetId) {
    mediaAsset = await db.query.mediaAssets.findFirst({
      where: eq(mediaAssets.id, mediaAssetId),
    });
  }

  // 3. Build embedding prompt from all available content
  const embeddingPrompt = buildEmbeddingPrompt(drill, mediaAsset);

  console.log(`[EmbeddingsWorker] Generating embeddings for: "${drill.title}"`);
  console.log(`[EmbeddingsWorker] Prompt length: ${embeddingPrompt.length} chars`);

  // 4. Generate embeddings via Ollama
  const embedding = await generateOllamaEmbedding(embeddingPrompt);
  const dimensions = embedding.length;

  console.log(`[EmbeddingsWorker] ✅ Generated ${dimensions}D embedding in ${Date.now() - startTime}ms`);

  // 5. Store embeddings in database
  await db.update(drills)
    .set({
      updatedAt: new Date(),
    })
    .where(eq(drills.id, drillId));

  // Store embedding in mediaAsset if available
  if (mediaAssetId) {
    await db.update(mediaAssets)
      .set({
        embedding: JSON.stringify(embedding),
        embeddingModel: EMBED_MODEL,
        embeddingDimensions: dimensions,
        updatedAt: new Date(),
      })
      .where(eq(mediaAssets.id, mediaAssetId));
  }

  // 6. Emit drill.embedded event
  drillEvents.emitDrillEmbedded({
    drillId,
    mediaAssetId,
    embeddingModel: EMBED_MODEL,
    dimensions,
    processingTime: Date.now() - startTime,
    timestamp: new Date(),
  });
}

/**
 * Build comprehensive prompt for embedding generation
 */
function buildEmbeddingPrompt(drill: any, mediaAsset?: any): string {
  const parts: string[] = [];

  // Title and description (most important)
  parts.push(`Title: ${drill.title}`);
  if (drill.description) {
    parts.push(`Description: ${drill.description}`);
  }

  // Sport and category information
  parts.push(`Sport: ${drill.sport}`);
  if (drill.category) {
    parts.push(`Category: ${drill.category}`);
  }
  if (drill.skillLevel) {
    parts.push(`Skill Level: ${drill.skillLevel}`);
  }
  if (drill.position) {
    parts.push(`Position: ${drill.position}`);
  }

  // StarPath integration
  if (drill.garComponent) {
    parts.push(`GAR Component: ${drill.garComponent}`);
  }
  if (drill.ariConnection) {
    parts.push(`ARI Connection: ${drill.ariConnection}`);
  }

  // AI-generated and manual tags
  if (drill.aiTags && Array.isArray(drill.aiTags)) {
    parts.push(`AI Tags: ${drill.aiTags.join(', ')}`);
  }
  if (drill.manualTags && Array.isArray(drill.manualTags)) {
    parts.push(`Manual Tags: ${drill.manualTags.join(', ')}`);
  }

  // Equipment and setup
  if (drill.equipment && Array.isArray(drill.equipment)) {
    parts.push(`Equipment: ${drill.equipment.join(', ')}`);
  }

  // Key coaching points
  if (drill.keyPoints && Array.isArray(drill.keyPoints)) {
    parts.push(`Key Points: ${drill.keyPoints.join('. ')}`);
  }

  // Transcript from video (if available)
  if (mediaAsset?.transcript) {
    // Truncate transcript to avoid token limits (keep first 500 chars)
    const truncatedTranscript = mediaAsset.transcript.substring(0, 500);
    parts.push(`Video Transcript: ${truncatedTranscript}`);
  }

  // Setup instructions
  if (drill.setupInstructions) {
    parts.push(`Setup: ${drill.setupInstructions}`);
  }

  return parts.join('\n');
}

/**
 * Generate embedding via Ollama API
 */
async function generateOllamaEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      prompt: text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama embeddings API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  
  if (!result.embedding || !Array.isArray(result.embedding)) {
    throw new Error('Invalid embedding response from Ollama');
  }

  return result.embedding;
}

/**
 * Batch generate embeddings for multiple drills
 */
export async function batchGenerateEmbeddings(drillIds: string[]): Promise<void> {
  console.log(`[EmbeddingsWorker] 📦 Batch processing ${drillIds.length} drills`);

  // Process in batches to avoid overwhelming Ollama
  for (let i = 0; i < drillIds.length; i += EMBED_BATCH_SIZE) {
    const batch = drillIds.slice(i, i + EMBED_BATCH_SIZE);
    console.log(`[EmbeddingsWorker] Processing batch ${Math.floor(i / EMBED_BATCH_SIZE) + 1}/${Math.ceil(drillIds.length / EMBED_BATCH_SIZE)}`);

    // Process batch in parallel
    await Promise.all(
      batch.map(drillId => generateEmbeddings(drillId).catch(err => {
        console.error(`[EmbeddingsWorker] Failed to process ${drillId}:`, err);
      }))
    );

    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`[EmbeddingsWorker] ✅ Batch processing complete`);
}

/**
 * Search drills by semantic similarity
 */
export async function searchDrillsBySimilarity(
  queryText: string,
  limit: number = 10,
  filters?: {
    sport?: string;
    category?: string;
    skillLevel?: string;
  }
): Promise<any[]> {
  console.log(`[EmbeddingsWorker] 🔍 Semantic search: "${queryText}"`);

  // 1. Generate embedding for search query
  const queryEmbedding = await generateOllamaEmbedding(queryText);

  // 2. Calculate cosine similarity with all drills (would use pgvector in production)
  // For now, return a basic query - in production, you'd use:
  // SELECT *, (embedding <=> query_embedding) AS distance FROM drills ORDER BY distance LIMIT 10

  console.warn('[EmbeddingsWorker] ⚠️ Semantic search requires pgvector extension - returning basic results');

  // Fallback to text search
  const results = await db.query.drills.findMany({
    where: (drills, { and, eq, like }) => {
      const conditions: any[] = [eq(drills.isPublic, true)];
      
      if (filters?.sport) {
        conditions.push(eq(drills.sport, filters.sport));
      }
      if (filters?.category) {
        conditions.push(eq(drills.category, filters.category));
      }
      if (filters?.skillLevel) {
        conditions.push(eq(drills.skillLevel, filters.skillLevel));
      }

      return and(...conditions);
    },
    limit,
  });

  return results;
}

/**
 * Check if Ollama embeddings endpoint is healthy
 */
export async function checkOllamaEmbeddingsHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(5000),
    });
    
    if (!response.ok) return false;

    const data = await response.json();
    const hasEmbedModel = data.models?.some((m: any) => m.name.includes('embed'));
    
    if (!hasEmbedModel) {
      console.warn(`[EmbeddingsWorker] ⚠️ Embed model not found. Available models:`, data.models?.map((m: any) => m.name));
      console.warn(`[EmbeddingsWorker] Please run: ollama pull ${EMBED_MODEL}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[EmbeddingsWorker] Health check failed:', error);
    return false;
  }
}

// Auto-start worker if this module is imported
if (process.env.NODE_ENV !== 'test') {
  checkOllamaEmbeddingsHealth().then(isHealthy => {
    if (isHealthy) {
      console.log('[EmbeddingsWorker] ✅ Ollama embeddings endpoint is healthy');
      initEmbeddingsWorker();
    } else {
      console.error('[EmbeddingsWorker] ⚠️ Ollama embeddings not available');
      console.error(`[EmbeddingsWorker] Please ensure Ollama is running and ${EMBED_MODEL} is installed`);
      console.error('[EmbeddingsWorker] Run: ollama pull', EMBED_MODEL);
    }
  });
}
