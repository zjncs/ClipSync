import { useState, useEffect, useCallback } from 'react';
import { ClipboardEntry } from '../types/clipboard';
import { saveToStorage, loadFromStorage, generateId, generateTitle } from '../utils/storage';

export const useClipboard = () => {
  const [entries, setEntries] = useState<ClipboardEntry[]>([]);
  const [currentContent, setCurrentContent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    () => localStorage.getItem('dark-mode') === 'true' || false
  );

  // Load data on mount
  useEffect(() => {
    const savedEntries = loadFromStorage();
    setEntries(savedEntries);
    if (savedEntries.length > 0) {
      setCurrentContent(savedEntries[0].content);
    }
  }, []);

  // Auto-save current content
  useEffect(() => {
    const autoSaveTimeout = setTimeout(() => {
      if (currentContent.trim()) {
        saveCurrentEntry();
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimeout);
  }, [currentContent]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('dark-mode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const saveCurrentEntry = useCallback(() => {
    if (!currentContent.trim()) return;

    const newEntry: ClipboardEntry = {
      id: generateId(),
      content: currentContent,
      timestamp: Date.now(),
      title: generateTitle(currentContent),
    };

    setEntries(prevEntries => {
      // Check if the content already exists as the first entry
      if (prevEntries.length > 0 && prevEntries[0].content === currentContent) {
        return prevEntries;
      }

      const updatedEntries = [newEntry, ...prevEntries.slice(0, 49)]; // Keep only latest 50
      saveToStorage(updatedEntries);
      return updatedEntries;
    });
  }, [currentContent]);

  const loadEntry = useCallback((entry: ClipboardEntry) => {
    setCurrentContent(entry.content);
  }, []);

  const deleteEntry = useCallback((entryId: string) => {
    setEntries(prevEntries => {
      const updatedEntries = prevEntries.filter(entry => entry.id !== entryId);
      saveToStorage(updatedEntries);
      return updatedEntries;
    });
  }, []);

  const copyToClipboard = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
    setCurrentContent('');
    saveToStorage([]);
  }, []);

  const filteredEntries = entries.filter(entry =>
    entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    entries: filteredEntries,
    currentContent,
    searchQuery,
    isPreviewMode,
    isDarkMode,
    setCurrentContent,
    setSearchQuery,
    setIsPreviewMode,
    setIsDarkMode,
    saveCurrentEntry,
    loadEntry,
    deleteEntry,
    copyToClipboard,
    clearAll,
  };
};