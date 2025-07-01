/**
 * Vector Database Integration for Semantic Search
 * Qdrant-compatible vector storage and similarity search
 */

import { EventEmitter } from 'events';

export interface VectorPoint {
  id: string;
  vector: number[];
  payload: Record<string, any>;
}

export interface SearchResult {
  id: string;
  score: number;
  payload: Record<string, any>;
}

export interface Collection {
  name: string;
  vector_size: number;
  distance: 'Cosine' | 'Euclidean' | 'Dot';
  points_count: number;
  created_at: Date;
}

export class VectorDatabase extends EventEmitter {
  private collections: Map<string, Collection> = new Map();
  private vectors: Map<string, Map<string, VectorPoint>> = new Map();
  private isConnected = false;
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:6333') {
    super();
    this.baseUrl = baseUrl;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await this.checkConnection();
      await this.loadCollections();
      await this.createDefaultCollections();
      this.isConnected = true;
      console.log('🔍 Vector database initialized successfully');
      this.emit('ready');
    } catch (error) {
      console.log('🔍 Vector database not available, using in-memory fallback');
      this.initializeInMemoryStorage();
      this.isConnected = true;
      this.emit('ready');
    }
  }

  private async checkConnection(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/collections`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      console.log('🔍 Connected to Qdrant vector database');
    } catch (error) {
      throw new Error(`Failed to connect to vector database: ${error}`);
    }
  }

  private async loadCollections(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/collections`);
      const data = await response.json();
      
      for (const collection of data.result.collections || []) {
        this.collections.set(collection.name, {
          name: collection.name,
          vector_size: collection.config?.params?.vectors?.size || 768,
          distance: collection.config?.params?.vectors?.distance || 'Cosine',
          points_count: collection.points_count || 0,
          created_at: new Date()
        });
      }
    } catch (error) {
      console.error('🔍 Failed to load collections:', error);
    }
  }

  private async createDefaultCollections(): Promise<void> {
    const defaultCollections = [
      { name: 'documents', vector_size: 768, distance: 'Cosine' as const },
      { name: 'customers', vector_size: 768, distance: 'Cosine' as const },
      { name: 'products', vector_size: 768, distance: 'Cosine' as const },
      { name: 'content', vector_size: 768, distance: 'Cosine' as const }
    ];

    for (const collectionConfig of defaultCollections) {
      if (!this.collections.has(collectionConfig.name)) {
        await this.createCollection(collectionConfig.name, collectionConfig.vector_size, collectionConfig.distance);
      }
    }
  }

  private initializeInMemoryStorage(): void {
    // Fallback in-memory vector storage
    const defaultCollections = [
      { name: 'documents', vector_size: 768, distance: 'Cosine' as const },
      { name: 'customers', vector_size: 768, distance: 'Cosine' as const },
      { name: 'products', vector_size: 768, distance: 'Cosine' as const },
      { name: 'content', vector_size: 768, distance: 'Cosine' as const }
    ];

    for (const config of defaultCollections) {
      this.collections.set(config.name, {
        name: config.name,
        vector_size: config.vector_size,
        distance: config.distance,
        points_count: 0,
        created_at: new Date()
      });
      this.vectors.set(config.name, new Map());
    }

    console.log('🔍 In-memory vector storage initialized');
  }

  async createCollection(name: string, vectorSize: number, distance: 'Cosine' | 'Euclidean' | 'Dot' = 'Cosine'): Promise<void> {
    try {
      if (this.baseUrl !== 'memory') {
        const response = await fetch(`${this.baseUrl}/collections/${name}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vectors: {
              size: vectorSize,
              distance: distance
            }
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to create collection: ${response.statusText}`);
        }
      }

      const collection: Collection = {
        name,
        vector_size: vectorSize,
        distance,
        points_count: 0,
        created_at: new Date()
      };

      this.collections.set(name, collection);
      this.vectors.set(name, new Map());
      
      console.log(`🔍 Created vector collection: ${name}`);
    } catch (error) {
      console.error(`🔍 Failed to create collection ${name}:`, error);
      throw error;
    }
  }

  async upsertPoints(collectionName: string, points: VectorPoint[]): Promise<void> {
    try {
      if (this.baseUrl !== 'memory') {
        const response = await fetch(`${this.baseUrl}/collections/${collectionName}/points`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            points: points.map(point => ({
              id: point.id,
              vector: point.vector,
              payload: point.payload
            }))
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to upsert points: ${response.statusText}`);
        }
      }

      // Update in-memory storage
      const collectionVectors = this.vectors.get(collectionName);
      if (collectionVectors) {
        for (const point of points) {
          collectionVectors.set(point.id, point);
        }
        
        const collection = this.collections.get(collectionName);
        if (collection) {
          collection.points_count = collectionVectors.size;
        }
      }

      console.log(`🔍 Upserted ${points.length} points to ${collectionName}`);
    } catch (error) {
      console.error(`🔍 Failed to upsert points to ${collectionName}:`, error);
      throw error;
    }
  }

  async search(collectionName: string, vector: number[], limit: number = 10, threshold: number = 0.7): Promise<SearchResult[]> {
    try {
      if (this.baseUrl !== 'memory') {
        const response = await fetch(`${this.baseUrl}/collections/${collectionName}/points/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vector,
            limit,
            score_threshold: threshold
          })
        });

        if (response.ok) {
          const data = await response.json();
          return data.result.map((item: any) => ({
            id: item.id,
            score: item.score,
            payload: item.payload
          }));
        }
      }

      // Fallback to in-memory search
      return this.searchInMemory(collectionName, vector, limit, threshold);
    } catch (error) {
      console.error(`🔍 Search failed, using fallback:`, error);
      return this.searchInMemory(collectionName, vector, limit, threshold);
    }
  }

  private searchInMemory(collectionName: string, queryVector: number[], limit: number, threshold: number): SearchResult[] {
    const collectionVectors = this.vectors.get(collectionName);
    if (!collectionVectors) {
      return [];
    }

    const results: SearchResult[] = [];

    for (const [id, point] of collectionVectors) {
      const similarity = this.cosineSimilarity(queryVector, point.vector);
      if (similarity >= threshold) {
        results.push({
          id,
          score: similarity,
          payload: point.payload
        });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Simple text-to-vector conversion (in production, use a proper embedding model)
    const words = text.toLowerCase().split(/\s+/);
    const vector = new Array(768).fill(0);
    
    for (let i = 0; i < words.length && i < 768; i++) {
      const word = words[i];
      for (let j = 0; j < word.length && j < 768; j++) {
        vector[j] += word.charCodeAt(j % word.length) / 1000;
      }
    }
    
    // Normalize vector
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return norm > 0 ? vector.map(val => val / norm) : vector;
  }

  async addDocument(collectionName: string, id: string, text: string, metadata: Record<string, any> = {}): Promise<void> {
    const vector = await this.generateEmbedding(text);
    const point: VectorPoint = {
      id,
      vector,
      payload: {
        text,
        ...metadata,
        indexed_at: new Date().toISOString()
      }
    };

    await this.upsertPoints(collectionName, [point]);
  }

  async semanticSearch(collectionName: string, query: string, limit: number = 10): Promise<SearchResult[]> {
    const queryVector = await this.generateEmbedding(query);
    return this.search(collectionName, queryVector, limit, 0.5);
  }

  async deletePoints(collectionName: string, pointIds: string[]): Promise<void> {
    try {
      if (this.baseUrl !== 'memory') {
        const response = await fetch(`${this.baseUrl}/collections/${collectionName}/points/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            points: pointIds
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to delete points: ${response.statusText}`);
        }
      }

      // Update in-memory storage
      const collectionVectors = this.vectors.get(collectionName);
      if (collectionVectors) {
        for (const id of pointIds) {
          collectionVectors.delete(id);
        }
        
        const collection = this.collections.get(collectionName);
        if (collection) {
          collection.points_count = collectionVectors.size;
        }
      }

      console.log(`🔍 Deleted ${pointIds.length} points from ${collectionName}`);
    } catch (error) {
      console.error(`🔍 Failed to delete points from ${collectionName}:`, error);
      throw error;
    }
  }

  getCollections(): Collection[] {
    return Array.from(this.collections.values());
  }

  getCollection(name: string): Collection | undefined {
    return this.collections.get(name);
  }

  isReady(): boolean {
    return this.isConnected;
  }

  getStatus(): {
    connected: boolean;
    collections: number;
    totalPoints: number;
    baseUrl: string;
  } {
    const totalPoints = Array.from(this.collections.values())
      .reduce((sum, collection) => sum + collection.points_count, 0);

    return {
      connected: this.isConnected,
      collections: this.collections.size,
      totalPoints,
      baseUrl: this.baseUrl
    };
  }
}

export const vectorDatabase = new VectorDatabase();