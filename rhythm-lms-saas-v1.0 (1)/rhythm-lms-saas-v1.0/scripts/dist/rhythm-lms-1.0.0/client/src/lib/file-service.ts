import { apiRequest } from './queryClient';

export type FileType = 'file' | 'directory';

export interface FileNode {
  name: string;
  path: string;
  type: FileType;
  children?: FileNode[];
}

export interface FileContent {
  content: string;
  path: string;
  lastModified: string;
}

export async function getFileTree(): Promise<FileNode> {
  try {
    const response = await apiRequest('GET', '/api/files/tree', undefined);
    return await response.json();
  } catch (error) {
    console.error('Failed to get file tree:', error);
    throw error;
  }
}

export async function getFileContent(path: string): Promise<FileContent> {
  try {
    const response = await apiRequest('GET', `/api/files/content?path=${encodeURIComponent(path)}`, undefined);
    return await response.json();
  } catch (error) {
    console.error(`Failed to get file content for ${path}:`, error);
    throw error;
  }
}

export async function saveFile(path: string, content: string): Promise<void> {
  try {
    await apiRequest('POST', '/api/files/save', { path, content });
  } catch (error) {
    console.error(`Failed to save file ${path}:`, error);
    throw error;
  }
}

export async function createFile(path: string, type: FileType = 'file'): Promise<void> {
  try {
    await apiRequest('POST', '/api/files/create', { path, type });
  } catch (error) {
    console.error(`Failed to create ${type} at ${path}:`, error);
    throw error;
  }
}

export async function deleteFile(path: string): Promise<void> {
  try {
    await apiRequest('DELETE', `/api/files/delete?path=${encodeURIComponent(path)}`, undefined);
  } catch (error) {
    console.error(`Failed to delete file ${path}:`, error);
    throw error;
  }
}

export async function renameFile(oldPath: string, newPath: string): Promise<void> {
  try {
    await apiRequest('POST', '/api/files/rename', { oldPath, newPath });
  } catch (error) {
    console.error(`Failed to rename file from ${oldPath} to ${newPath}:`, error);
    throw error;
  }
}

export async function getRecentActivity(limit: number = 5): Promise<{
  path: string;
  prompt: string;
  time: string;
}[]> {
  try {
    const response = await apiRequest('GET', `/api/files/activity?limit=${limit}`, undefined);
    return await response.json();
  } catch (error) {
    console.error('Failed to get recent activity:', error);
    throw error;
  }
}
