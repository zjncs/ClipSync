import { useState, useEffect, useCallback } from 'react';
import { ClipboardEntry } from '../types/clipboard';
import { 
  loadFromDatabase, 
  saveToDatabase, 
  deleteFromDatabase, 
  clearAllFromDatabase, 
  generateTitle 
} from '../utils/storage';
import { supabase } from '../lib/supabase';

export const useClipboard = () => {
  const [entries, setEntries] = useState<ClipboardEntry[]>([]);
  const [currentContent, setCurrentContent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    () => localStorage.getItem('dark-mode') === 'true' || false
  );

  // 加载数据并设置实时监听
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      const data = await loadFromDatabase();
      setEntries(data);
      if (data.length > 0) {
        setCurrentContent(data[0].content);
      }
      setIsLoading(false);
    };

    loadInitialData();

    // 设置实时监听
    const subscription = supabase
      .channel('clipboard_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clipboard_entries'
        },
        async (payload) => {
          console.log('Real-time update:', payload);
          // 重新加载数据
          const updatedData = await loadFromDatabase();
          setEntries(updatedData);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 自动保存当前内容
  useEffect(() => {
    const autoSaveTimeout = setTimeout(() => {
      if (currentContent.trim()) {
        saveCurrentEntry();
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimeout);
  }, [currentContent]);

  // 保存深色模式偏好
  useEffect(() => {
    localStorage.setItem('dark-mode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const saveCurrentEntry = useCallback(() => {
    if (!currentContent.trim() || isSaving) return;

    setIsSaving(true);
    
    const entryData = {
      content: currentContent,
      title: generateTitle(currentContent),
      user_id: null,
    };

    // 检查是否与最新条目内容相同
    if (entries.length > 0 && entries[0].content === currentContent) {
      setIsSaving(false);
      return;
    }

    saveToDatabase(entryData).then((savedEntry) => {
      if (savedEntry) {
        // 数据会通过实时监听自动更新，这里不需要手动更新状态
        console.log('Entry saved successfully');
      }
      setIsSaving(false);
    }).catch((error) => {
      console.error('Failed to save entry:', error);
      setIsSaving(false);
    });
  }, [currentContent]);

  const loadEntry = useCallback((entry: ClipboardEntry) => {
    setCurrentContent(entry.content);
  }, []);

  const deleteEntry = useCallback(async (entryId: string) => {
    const success = await deleteFromDatabase(entryId);
    if (success) {
      // 数据会通过实时监听自动更新
      console.log('Entry deleted successfully');
    }
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

  const clearAll = useCallback(async () => {
    const success = await clearAllFromDatabase();
    if (success) {
      setCurrentContent('');
      // 数据会通过实时监听自动更新
      console.log('All entries cleared successfully');
    }
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
    isLoading,
    isSaving,
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