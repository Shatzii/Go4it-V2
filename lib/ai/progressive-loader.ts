/**
 * 🎯 Progressive Model Loader
 * 
 * Supports chunked model downloads for future client-side AI.
 * Compatible with existing Ollama + cloud setup.
 * 
 * SAFETY: All features OFF by default.
 */

interface ModelChunk {
  id: string;
  url: string;
  size: number; // MB
  priority: number; // 1 = highest
}

interface ModelSpec {
  chunks: ModelChunk[];
  totalSize: number;
  minChunksForBasic: number;
  minChunksForStandard: number;
  minChunksForFull: number;
}

interface LoadProgress {
  chunkId: string;
  loaded: number;
  total: number;
  percentage: number;
}

type ModelCapability = 'none' | 'basic' | 'standard' | 'full';

/**
 * Progressive Model Loader
 * 
 * Loads AI models in chunks for faster initial availability.
 * Enables "instant start, progressive enhancement" UX.
 */
export class ProgressiveModelLoader {
  private modelRegistry: Record<string, ModelSpec> = {
    // Essential models (auto-download on install)
    'transcript-analyzer': {
      chunks: [
        { 
          id: 'embedding', 
          url: '/models/transcript/embedding.chunk', 
          size: 2, 
          priority: 1 
        },
        { 
          id: 'classifier', 
          url: '/models/transcript/classifier.chunk', 
          size: 3, 
          priority: 2 
        },
        { 
          id: 'output', 
          url: '/models/transcript/output.chunk', 
          size: 2, 
          priority: 3 
        }
      ],
      totalSize: 7,
      minChunksForBasic: 1,
      minChunksForStandard: 2,
      minChunksForFull: 3
    },

    // Enhanced models (download on first use)
    'starpath-analyzer': {
      chunks: [
        { 
          id: 'core', 
          url: '/models/starpath/core.chunk', 
          size: 8, 
          priority: 1 
        },
        { 
          id: 'planner', 
          url: '/models/starpath/planner.chunk', 
          size: 12, 
          priority: 2 
        },
        { 
          id: 'optimizer', 
          url: '/models/starpath/optimizer.chunk', 
          size: 10, 
          priority: 3 
        }
      ],
      totalSize: 30,
      minChunksForBasic: 1,
      minChunksForStandard: 2,
      minChunksForFull: 3
    },

    // Content generation (social media, emails)
    'content-generator': {
      chunks: [
        { 
          id: 'templates', 
          url: '/models/content/templates.chunk', 
          size: 5, 
          priority: 1 
        },
        { 
          id: 'writer', 
          url: '/models/content/writer.chunk', 
          size: 15, 
          priority: 2 
        },
        { 
          id: 'optimizer', 
          url: '/models/content/optimizer.chunk', 
          size: 10, 
          priority: 3 
        }
      ],
      totalSize: 30,
      minChunksForBasic: 1,
      minChunksForStandard: 2,
      minChunksForFull: 3
    }
  };

  private loadedChunks = new Map<string, Set<string>>(); // modelName -> Set<chunkId>
  private downloadInProgress = new Map<string, Promise<any>>(); // chunkId -> Promise

  /**
   * Load model progressively
   * 
   * @returns Immediately with initial chunks, continues loading in background
   */
  async loadModelProgressive(
    modelName: string,
    onProgress?: (progress: LoadProgress) => void
  ): Promise<{
    loadedChunks: Set<string>;
    promise: Promise<ArrayBuffer[]>;
    currentCapability: ModelCapability;
  }> {
    const modelSpec = this.modelRegistry[modelName];
    if (!modelSpec) {
      throw new Error(`Unknown model: ${modelName}`);
    }

    // Initialize loaded chunks set
    if (!this.loadedChunks.has(modelName)) {
      this.loadedChunks.set(modelName, new Set());
    }
    const loadedChunks = this.loadedChunks.get(modelName)!;

    // Sort chunks by priority
    const sortedChunks = [...modelSpec.chunks].sort(
      (a, b) => a.priority - b.priority
    );

    // Start downloading all chunks in priority order
    const chunkPromises = sortedChunks.map(async (chunk) => {
      try {
        const buffer = await this.downloadChunkWithProgress(
          chunk,
          onProgress
        );
        
        await this.cacheChunk(modelName, chunk.id, buffer);
        loadedChunks.add(chunk.id);

        // Notify capability update
        const capability = this.getCurrentCapability(loadedChunks, modelSpec);
        this.notifyCapabilityUpdate(modelName, capability);

        return buffer;
      } catch (error) {
        console.warn(`Failed to download chunk ${chunk.id}:`, error);
        return null;
      }
    });

    return {
      loadedChunks,
      promise: Promise.all(chunkPromises),
      currentCapability: this.getCurrentCapability(loadedChunks, modelSpec)
    };
  }

  /**
   * Download a chunk with progress tracking
   */
  private async downloadChunkWithProgress(
    chunk: ModelChunk,
    onProgress?: (progress: LoadProgress) => void
  ): Promise<ArrayBuffer> {
    // Check if already downloading
    const existingDownload = this.downloadInProgress.get(chunk.id);
    if (existingDownload) {
      return existingDownload;
    }

    // Check if already cached
    const cached = await this.getChunkFromCache(chunk.id);
    if (cached) {
      return cached;
    }

    // Start new download
    const downloadPromise = (async () => {
      const response = await fetch(chunk.url);
      if (!response.ok) {
        throw new Error(`Failed to download ${chunk.url}: ${response.statusText}`);
      }

      const reader = response.body!.getReader();
      const contentLength = parseInt(
        response.headers.get('content-length') || '0'
      );

      const chunks: Uint8Array[] = [];
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        // Report progress
        if (onProgress) {
          onProgress({
            chunkId: chunk.id,
            loaded: receivedLength,
            total: contentLength,
            percentage: (receivedLength / contentLength) * 100
          });
        }
      }

      // Combine chunks into single ArrayBuffer
      const chunksAll = new Uint8Array(receivedLength);
      let position = 0;
      for (const chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
      }

      this.downloadInProgress.delete(chunk.id);
      return chunksAll.buffer;
    })();

    this.downloadInProgress.set(chunk.id, downloadPromise);
    return downloadPromise;
  }

  /**
   * Cache chunk in IndexedDB
   */
  private async cacheChunk(
    modelName: string,
    chunkId: string,
    buffer: ArrayBuffer
  ): Promise<void> {
    if (typeof window === 'undefined') return; // Server-side skip

    try {
      const cache = await caches.open('ai-models-v1');
      const url = this.getChunkCacheKey(modelName, chunkId);
      const response = new Response(buffer);
      await cache.put(url, response);
    } catch (error) {
      console.warn(`Failed to cache chunk ${chunkId}:`, error);
    }
  }

  /**
   * Get chunk from cache
   */
  private async getChunkFromCache(chunkId: string): Promise<ArrayBuffer | null> {
    if (typeof window === 'undefined') return null; // Server-side skip

    try {
      const cache = await caches.open('ai-models-v1');
      const response = await cache.match(chunkId);
      if (response) {
        return await response.arrayBuffer();
      }
    } catch (error) {
      console.warn(`Failed to get chunk ${chunkId} from cache:`, error);
    }

    return null;
  }

  /**
   * Generate cache key for chunk
   */
  private getChunkCacheKey(modelName: string, chunkId: string): string {
    return `/ai-models/${modelName}/${chunkId}`;
  }

  /**
   * Execute with available chunks
   */
  async executeWithAvailableChunks(
    modelName: string,
    input: any
  ): Promise<any> {
    const modelSpec = this.modelRegistry[modelName];
    if (!modelSpec) {
      throw new Error(`Unknown model: ${modelName}`);
    }

    const loadedChunks = this.loadedChunks.get(modelName) || new Set();
    const capability = this.getCurrentCapability(loadedChunks, modelSpec);

    switch (capability) {
      case 'basic':
        return this.executeBasicAnalysis(input, loadedChunks);
      case 'standard':
        return this.executeStandardAnalysis(input, loadedChunks);
      case 'full':
        return this.executeFullAnalysis(input, loadedChunks);
      default:
        throw new Error('No model chunks available');
    }
  }

  /**
   * Execute basic analysis (minimal chunks)
   */
  private async executeBasicAnalysis(
    input: any,
    loadedChunks: Set<string>
  ): Promise<any> {
    // TODO: Implement basic analysis with minimal chunks
    console.log('[Basic Analysis] Using minimal chunks:', Array.from(loadedChunks));
    return {
      type: 'basic',
      result: 'Basic analysis result',
      chunksUsed: Array.from(loadedChunks)
    };
  }

  /**
   * Execute standard analysis (most chunks)
   */
  private async executeStandardAnalysis(
    input: any,
    loadedChunks: Set<string>
  ): Promise<any> {
    // TODO: Implement standard analysis with most chunks
    console.log('[Standard Analysis] Using standard chunks:', Array.from(loadedChunks));
    return {
      type: 'standard',
      result: 'Standard analysis result',
      chunksUsed: Array.from(loadedChunks)
    };
  }

  /**
   * Execute full analysis (all chunks)
   */
  private async executeFullAnalysis(
    input: any,
    loadedChunks: Set<string>
  ): Promise<any> {
    // TODO: Implement full analysis with all chunks
    console.log('[Full Analysis] Using all chunks:', Array.from(loadedChunks));
    return {
      type: 'full',
      result: 'Full analysis result',
      chunksUsed: Array.from(loadedChunks)
    };
  }

  /**
   * Get current capability based on loaded chunks
   */
  private getCurrentCapability(
    loadedChunks: Set<string>,
    modelSpec: ModelSpec
  ): ModelCapability {
    const loadedCount = loadedChunks.size;

    if (loadedCount >= modelSpec.minChunksForFull) return 'full';
    if (loadedCount >= modelSpec.minChunksForStandard) return 'standard';
    if (loadedCount >= modelSpec.minChunksForBasic) return 'basic';
    return 'none';
  }

  /**
   * Notify when capability is updated
   */
  private notifyCapabilityUpdate(
    modelName: string,
    capability: ModelCapability
  ): void {
    // Dispatch custom event for UI updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('model-capability-updated', {
        detail: { modelName, capability }
      }));
    }

    console.log(`[Model Loader] ${modelName} capability updated: ${capability}`);
  }

  /**
   * Get loaded chunks for a model
   */
  async getLoadedChunks(modelName: string): Promise<Set<string>> {
    return this.loadedChunks.get(modelName) || new Set();
  }

  /**
   * Check if model is fully loaded
   */
  async isModelFullyLoaded(modelName: string): Promise<boolean> {
    const modelSpec = this.modelRegistry[modelName];
    if (!modelSpec) return false;

    const loadedChunks = await this.getLoadedChunks(modelName);
    return loadedChunks.size >= modelSpec.minChunksForFull;
  }

  /**
   * Get total download size for a model
   */
  getModelSize(modelName: string): number {
    const modelSpec = this.modelRegistry[modelName];
    return modelSpec?.totalSize || 0;
  }

  /**
   * Get download progress for a model
   */
  getDownloadProgress(modelName: string): number {
    const modelSpec = this.modelRegistry[modelName];
    if (!modelSpec) return 0;

    const loadedChunks = this.loadedChunks.get(modelName) || new Set();
    const loadedSize = modelSpec.chunks
      .filter(chunk => loadedChunks.has(chunk.id))
      .reduce((sum, chunk) => sum + chunk.size, 0);

    return (loadedSize / modelSpec.totalSize) * 100;
  }

  /**
   * Clear all cached models (for testing/debugging)
   */
  async clearCache(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      await caches.delete('ai-models-v1');
      this.loadedChunks.clear();
      this.downloadInProgress.clear();
    } catch (error) {
      console.warn('Failed to clear model cache:', error);
    }
  }
}

// Export singleton instance
export const progressiveLoader = new ProgressiveModelLoader();

// Export types
export type { ModelChunk, ModelSpec, LoadProgress, ModelCapability };
