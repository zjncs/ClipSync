export interface ClipboardEntry {
  id: string;
  content: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id?: string | null;
}

export interface AppState {
  entries: ClipboardEntry[];
  currentContent: string;
  searchQuery: string;
  isPreviewMode: boolean;
  isDarkMode: boolean;
}