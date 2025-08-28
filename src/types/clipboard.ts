export interface ClipboardEntry {
  id: string;
  content: string;
  timestamp: number;
  title: string;
}

export interface AppState {
  entries: ClipboardEntry[];
  currentContent: string;
  searchQuery: string;
  isPreviewMode: boolean;
  isDarkMode: boolean;
}