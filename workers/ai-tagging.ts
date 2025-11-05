/**
 * AI Tagging Worker - local_fast_llm Classification
 * 
 * ZONE: Self-hosted processing for RED/YELLOW/GREEN zones
 * 
 * Listens for: media.transcribed events
 * Emits: drill.tagged events
 * 
 * Uses local_fast_llm (Ollama) for:
 * - Sport detection (football, basketball, soccer, ski jumping, flag football)
 * - Category classification (strength, speed, agility, skill, technique, conditioning)
 * - Skill level inference (beginner, intermediate, advanced, elite)
 * - Equipment extraction (cones, ball, ladder, resistance bands, etc.)
 * - GAR component mapping (sprint, cod, vertical, strength, endurance)
 * - Position detection (QB, WR, Forward, Midfielder, etc.)
 * 
 * All processing self-hosted via Ollama at localhost:11434
 */

import { drillEvents, pipelineTracker } from '@/lib/events/drill-events';
import { db } from '@/lib/db';
import { drills, mediaAssets } from '@/lib/db/drill-library-schema';
import { eq } from 'drizzle-orm';

// Ollama configuration
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const FAST_LLM_MODEL = process.env.LOCAL_FAST_LLM || 'claude-educational-primary:7b';
const MAX_RETRIES = 2;

interface TaggingResult {
  sport: string;
  category: string;
  skillLevel: string;
  equipment: string[];
  garComponent?: string;
  position?: string;
  aiTags: string[];
  confidence: number;
  reasoning: string;
}

/**
 * Initialize AI tagging worker
 * Subscribes to media.transcribed events
 */
export function startAITaggingWorker() {
  console.log('[AITagging] Starting AI tagging worker...');
  console.log(`[AITagging] Ollama URL: ${OLLAMA_URL}`);
  console.log(`[AITagging] Model: ${FAST_LLM_MODEL}`);

  // Subscribe to media.transcribed events
  drillEvents.onMediaTranscribed(async (event) => {
    console.log(`[AITagging] Processing mediaAsset ${event.mediaAssetId} (${event.wordCount} words)`);

    // Record pipeline stage
    pipelineTracker.recordStage(event.mediaAssetId, {
      stage: 'tagging',
      status: 'processing',
      startedAt: new Date(),
    });

    try {
      const startTime = Date.now();

      // Get full mediaAsset for context
      const [mediaAsset] = await db.select()
        .from(mediaAssets)
        .where(eq(mediaAssets.id, event.mediaAssetId))
        .limit(1);

      if (!mediaAsset) {
        throw new Error(`MediaAsset ${event.mediaAssetId} not found`);
      }

      // Generate tags using local_fast_llm
      const tags = await generateTags(
        event.transcript,
        mediaAsset.originalName,
        mediaAsset.fileType
      );

      const processingTime = Date.now() - startTime;

      // Create or update drill record
      const [drill] = await db.insert(drills).values({
        title: generateTitle(tags, mediaAsset.originalName),
        description: event.transcript.substring(0, 500), // First 500 chars as initial description
        shortDescription: event.transcript.substring(0, 150),
        sport: tags.sport,
        category: tags.category,
        skillLevel: tags.skillLevel,
        position: tags.position,
        garComponent: tags.garComponent,
        primaryVideoId: event.mediaAssetId,
        equipment: tags.equipment,
        aiTags: tags.aiTags,
        aiConfidence: tags.confidence,
        status: 'draft', // Requires approval before publishing
        instructionSteps: generateInstructionSteps(event.transcript),
      }).returning();

      // Update mediaAsset processing log
      await db.update(mediaAssets)
        .set({
          processingLog: db.raw(`
            COALESCE(processing_log, '[]'::jsonb) || jsonb_build_array(
              jsonb_build_object(
                'timestamp', NOW(),
                'stage', 'tagged',
                'status', 'completed',
                'details', jsonb_build_object(
                  'drillId', '${drill.id}',
                  'sport', '${tags.sport}',
                  'category', '${tags.category}',
                  'aiTags', '${JSON.stringify(tags.aiTags)}',
                  'confidence', ${tags.confidence},
                  'processingTime', ${processingTime}
                )
              )
            )
          `),
        })
        .where(eq(mediaAssets.id, event.mediaAssetId));

      // Record successful pipeline stage
      pipelineTracker.recordStage(event.mediaAssetId, {
        stage: 'tagging',
        status: 'completed',
        startedAt: new Date(startTime),
        completedAt: new Date(),
        processingTime,
        metadata: {
          drillId: drill.id,
          sport: tags.sport,
          category: tags.category,
          confidence: tags.confidence,
        },
      });

      // Emit drill.tagged event to trigger embeddings generation
      drillEvents.emitDrillTagged({
        drillId: drill.id,
        mediaAssetId: event.mediaAssetId,
        tags: {
          aiTags: tags.aiTags,
          sport: tags.sport,
          category: tags.category,
          skillLevel: tags.skillLevel,
          equipment: tags.equipment,
          garComponent: tags.garComponent,
        },
        aiConfidence: tags.confidence,
        model: FAST_LLM_MODEL,
        processingTime,
        timestamp: new Date(),
      });

      console.log(`[AITagging] ✅ Tagged drill ${drill.id}: ${tags.sport}/${tags.category}/${tags.skillLevel} (${(tags.confidence * 100).toFixed(0)}% confidence)`);

    } catch (error) {
      console.error(`[AITagging] ❌ Tagging failed for ${event.mediaAssetId}:`, error);

      // Record failed pipeline stage
      pipelineTracker.recordStage(event.mediaAssetId, {
        stage: 'tagging',
        status: 'failed',
        startedAt: new Date(),
        completedAt: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  console.log('[AITagging] ✅ Worker started and listening for transcriptions');
}

/**
 * Generate tags using local_fast_llm (Ollama)
 */
async function generateTags(
  transcript: string,
  filename: string,
  fileType: string
): Promise<TaggingResult> {
  try {
    const prompt = buildTaggingPrompt(transcript, filename);

    console.log(`[AITagging] Calling Ollama with ${FAST_LLM_MODEL}...`);

    // Call Ollama API
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: FAST_LLM_MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.3, // Lower temperature for more consistent classification
          top_p: 0.9,
          num_ctx: 4096, // 4K context window (local_fast_llm has 8K max)
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    const output = result.response;

    // Parse structured output
    const tags = parseTaggingOutput(output);

    console.log(`[AITagging] Generated tags: Sport=${tags.sport}, Category=${tags.category}, Confidence=${tags.confidence}`);

    return tags;

  } catch (error) {
    console.error('[AITagging] Ollama call failed:', error);

    // Fallback to basic keyword extraction
    return extractTagsFromKeywords(transcript, filename);
  }
}

/**
 * Build tagging prompt for local_fast_llm
 */
function buildTaggingPrompt(transcript: string, filename: string): string {
  return `You are an expert sports drill classifier for the Go4it Sports Academy StarPath system.

Analyze this drill video transcript and filename, then classify it into the following categories:

**Transcript:**
${transcript}

**Filename:** ${filename}

**Classification Task:**

1. **Sport** (choose ONE):
   - football, basketball, soccer, ski_jumping, flag_football

2. **Category** (choose ONE):
   - strength, speed, agility, skill, technique, conditioning

3. **Skill Level** (choose ONE):
   - beginner, intermediate, advanced, elite

4. **Equipment** (list ALL mentioned):
   - Examples: cones, ball, ladder, resistance_bands, hurdles, sled, parachute, medicine_ball, etc.

5. **GAR Component** (choose ONE if applicable):
   - sprint, cod (change of direction), vertical, strength, endurance

6. **Position** (if sport-specific):
   - Examples: QB, WR, RB, TE (football), Forward, Guard, Center (basketball), Midfielder, Striker, Defender (soccer)

7. **AI Tags** (3-5 descriptive keywords):
   - Examples: explosive, footwork, coordination, power, endurance, reaction_time, etc.

8. **Confidence** (0.0 to 1.0):
   - How confident are you in these classifications?

**Output Format (JSON):**
{
  "sport": "...",
  "category": "...",
  "skillLevel": "...",
  "equipment": ["...", "..."],
  "garComponent": "..." (optional),
  "position": "..." (optional),
  "aiTags": ["...", "...", "..."],
  "confidence": 0.95,
  "reasoning": "Brief explanation of classification decisions"
}

Respond ONLY with the JSON object, no additional text.`;
}

/**
 * Parse tagging output from LLM response
 */
function parseTaggingOutput(output: string): TaggingResult {
  try {
    // Extract JSON from markdown code blocks if present
    let jsonStr = output;
    const codeBlockMatch = output.match(/```json\n([\s\S]*?)\n```/) || output.match(/```\n([\s\S]*?)\n```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
    }

    const parsed = JSON.parse(jsonStr);

    return {
      sport: normalizeString(parsed.sport),
      category: normalizeString(parsed.category),
      skillLevel: normalizeString(parsed.skillLevel),
      equipment: Array.isArray(parsed.equipment) ? parsed.equipment.map(normalizeString) : [],
      garComponent: parsed.garComponent ? normalizeString(parsed.garComponent) : undefined,
      position: parsed.position ? normalizeString(parsed.position) : undefined,
      aiTags: Array.isArray(parsed.aiTags) ? parsed.aiTags.map(normalizeString) : [],
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.7,
      reasoning: parsed.reasoning || '',
    };

  } catch (error) {
    console.error('[AITagging] Failed to parse LLM output:', error);
    console.error('[AITagging] Raw output:', output);

    // Return default classification
    return {
      sport: 'football',
      category: 'skill',
      skillLevel: 'intermediate',
      equipment: [],
      aiTags: ['training', 'drill'],
      confidence: 0.3,
      reasoning: 'Failed to parse LLM output, using defaults',
    };
  }
}

/**
 * Fallback: Extract tags from keywords if AI fails
 */
function extractTagsFromKeywords(transcript: string, filename: string): TaggingResult {
  const text = `${transcript} ${filename}`.toLowerCase();

  // Sport detection
  let sport = 'football'; // default
  if (text.includes('basketball') || text.includes('hoop') || text.includes('dribble')) sport = 'basketball';
  if (text.includes('soccer') || text.includes('goal') || text.includes('pitch')) sport = 'soccer';
  if (text.includes('ski') || text.includes('jump') || text.includes('slope')) sport = 'ski_jumping';
  if (text.includes('flag football')) sport = 'flag_football';

  // Category detection
  let category = 'skill'; // default
  if (text.includes('sprint') || text.includes('speed')) category = 'speed';
  if (text.includes('agility') || text.includes('cone') || text.includes('ladder')) category = 'agility';
  if (text.includes('strength') || text.includes('weight') || text.includes('power')) category = 'strength';
  if (text.includes('conditioning') || text.includes('endurance')) category = 'conditioning';

  // Equipment extraction
  const equipment: string[] = [];
  const equipmentKeywords = ['cone', 'ball', 'ladder', 'hurdle', 'sled', 'band', 'medicine ball', 'parachute'];
  equipmentKeywords.forEach(item => {
    if (text.includes(item)) equipment.push(item.replace(' ', '_'));
  });

  return {
    sport,
    category,
    skillLevel: 'intermediate',
    equipment,
    aiTags: [category, sport, 'training'],
    confidence: 0.5,
    reasoning: 'Keyword-based fallback classification',
  };
}

/**
 * Generate drill title from tags and filename
 */
function generateTitle(tags: TaggingResult, filename: string): string {
  // Clean filename
  const cleanName = filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[-_]/g, ' ') // Replace dashes/underscores with spaces
    .replace(/\d+/g, '') // Remove numbers
    .trim();

  if (cleanName.length > 10) {
    return cleanName.substring(0, 60);
  }

  // Generate from tags
  const sportName = tags.sport.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  const categoryName = tags.category.charAt(0).toUpperCase() + tags.category.slice(1);
  
  return `${sportName} ${categoryName} Drill - ${tags.skillLevel.charAt(0).toUpperCase() + tags.skillLevel.slice(1)}`;
}

/**
 * Extract instruction steps from transcript
 */
function generateInstructionSteps(transcript: string): any[] {
  // Simple sentence splitting for now
  // In production, use NLP to identify numbered steps or procedural language
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  return sentences.slice(0, 5).map((sentence, index) => ({
    step: index + 1,
    text: sentence.trim(),
    duration: 30, // default 30 seconds per step
  }));
}

/**
 * Normalize string for database consistency
 */
function normalizeString(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, '_');
}

/**
 * Check Ollama health
 */
export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`[AITagging] ✅ Ollama is healthy. Available models: ${data.models?.length || 0}`);
      return true;
    } else {
      console.error(`[AITagging] ⚠️ Ollama returned ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('[AITagging] ❌ Ollama is unreachable:', error);
    return false;
  }
}

// Auto-start worker when module is imported (if in worker context)
if (process.env.START_AI_TAGGING_WORKER === 'true') {
  startAITaggingWorker();
}
