import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    // Check if we have a build directory
    const buildDir = path.join(process.cwd(), '.next');
    if (!fs.existsSync(buildDir)) {
      return NextResponse.json(
        { error: 'No build found. Please build the project first.' },
        { status: 400 },
      );
    }

    // Analyze bundle size
    const bundleStats = await analyzeBundleSize();

    return NextResponse.json(bundleStats);
  } catch (error) {
    console.error('Bundle analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze bundle size' }, { status: 500 });
  }
}

async function analyzeBundleSize() {
  const buildDir = path.join(process.cwd(), '.next');
  const staticDir = path.join(buildDir, 'static');

  // Get all JavaScript files
  const jsFiles = await getJavaScriptFiles(staticDir);

  // Calculate total size
  let totalSize = 0;
  let gzippedSize = 0;
  const chunks: Array<{ name: string; size: number; modules: number }> = [];
  const largestModules: Array<{ name: string; size: number; path: string }> = [];

  for (const file of jsFiles) {
    const stats = fs.statSync(file);
    totalSize += stats.size;

    // Estimate gzipped size (approximately 30% of original)
    gzippedSize += Math.round(stats.size * 0.3);

    const fileName = path.basename(file);
    const relativePath = path.relative(staticDir, file);

    chunks.push({
      name: fileName,
      size: stats.size,
      modules: estimateModuleCount(stats.size),
    });

    // Track largest modules
    if (stats.size > 50 * 1024) {
      // > 50KB
      largestModules.push({
        name: fileName,
        size: stats.size,
        path: relativePath,
      });
    }
  }

  // Sort chunks by size
  chunks.sort((a, b) => b.size - a.size);
  largestModules.sort((a, b) => b.size - a.size);

  // Generate recommendations
  const recommendations = generateRecommendations(totalSize, chunks, largestModules);

  return {
    totalSize,
    gzippedSize,
    chunks: chunks.slice(0, 10), // Top 10 chunks
    largestModules: largestModules.slice(0, 10), // Top 10 modules
    recommendations,
  };
}

async function getJavaScriptFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      const subFiles = await getJavaScriptFiles(fullPath);
      files.push(...subFiles);
    } else if (entry.endsWith('.js') || entry.endsWith('.mjs')) {
      files.push(fullPath);
    }
  }

  return files;
}

function estimateModuleCount(size: number): number {
  // Rough estimate: 1 module per 10KB
  return Math.max(1, Math.round(size / (10 * 1024)));
}

function generateRecommendations(
  totalSize: number,
  chunks: any[],
  largestModules: any[],
): string[] {
  const recommendations: string[] = [];

  // Size-based recommendations
  if (totalSize > 5 * 1024 * 1024) {
    // > 5MB
    recommendations.push('Consider code splitting to reduce main bundle size');
  }

  if (totalSize > 2 * 1024 * 1024) {
    // > 2MB
    recommendations.push('Enable compression (gzip/brotli) on your server');
  }

  // Check for large chunks
  const largeChunks = chunks.filter((chunk) => chunk.size > 1024 * 1024); // > 1MB
  if (largeChunks.length > 0) {
    recommendations.push(`Split large chunks: ${largeChunks.map((c) => c.name).join(', ')}`);
  }

  // Check for specific optimizations
  const hasLargeLibraries = largestModules.some(
    (mod) => mod.name.includes('node_modules') || mod.size > 500 * 1024,
  );

  if (hasLargeLibraries) {
    recommendations.push('Consider using dynamic imports for large libraries');
  }

  // Generic recommendations
  if (recommendations.length === 0) {
    recommendations.push('Bundle size is well optimized');
    recommendations.push('Consider implementing tree shaking for unused code');
    recommendations.push('Use Next.js Image component for optimized images');
  } else {
    recommendations.push('Enable Next.js experimental features for better optimization');
    recommendations.push('Consider using a CDN for static assets');
  }

  return recommendations;
}
