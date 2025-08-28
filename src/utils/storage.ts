import { ClipboardEntry } from '../types/clipboard';
import { supabase } from '../lib/supabase';

// 从 Supabase 加载数据
export const loadFromDatabase = async (): Promise<ClipboardEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('clipboard_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Failed to load from database:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to load from database:', error);
    return [];
  }
};

// 保存到 Supabase
export const saveToDatabase = async (entry: Omit<ClipboardEntry, 'id' | 'created_at' | 'updated_at'>): Promise<ClipboardEntry | null> => {
  try {
    const { data, error } = await supabase
      .from('clipboard_entries')
      .insert([entry])
      .select()
      .single();

    if (error) {
      console.error('Failed to save to database:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to save to database:', error);
    return null;
  }
};

// 从数据库删除条目
export const deleteFromDatabase = async (entryId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('clipboard_entries')
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error('Failed to delete from database:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete from database:', error);
    return false;
  }
};

// 清空所有数据
export const clearAllFromDatabase = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('clipboard_entries')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // 删除所有记录

    if (error) {
      console.error('Failed to clear database:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to clear database:', error);
    return false;
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