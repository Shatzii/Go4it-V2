import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = window.setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return `${diffSecs}s ago`;
  
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatDate(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop() || '';
}

export function getFileIcon(filename: string): string {
  const extension = getFileExtension(filename);
  switch (extension) {
    case 'rhy':
      return 'ri-file-code-line';
    case 'md':
      return 'ri-markdown-line';
    case 'json':
      return 'ri-braces-line';
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
      return 'ri-javascript-line';
    case 'html':
      return 'ri-html5-line';
    case 'css':
      return 'ri-css3-line';
    default:
      return 'ri-file-line';
  }
}

export function getFileIconColor(filename: string): string {
  const extension = getFileExtension(filename);
  switch (extension) {
    case 'rhy':
      return 'text-secondary-500';
    case 'md':
      return 'text-dark-400';
    case 'json':
      return 'text-yellow-500';
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
      return 'text-yellow-400';
    case 'html':
      return 'text-orange-500';
    case 'css':
      return 'text-blue-500';
    default:
      return 'text-dark-400';
  }
}