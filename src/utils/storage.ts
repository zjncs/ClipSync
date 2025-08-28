import { ClipboardEntry } from '../types/clipboard';

const STORAGE_KEY = 'clipboard-sync-data';

export const saveToStorage = (entries: ClipboardEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromStorage = (): ClipboardEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return [];
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const generateTitle = (content: string): string => {
  const firstLine = content.split('\n')[0].trim();
  if (firstLine.length === 0) {
    return '空白条目';
  }
  return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
};