import React from 'react';
import { ClipboardEntry } from '../types/clipboard';
import { Search, Trash2, RotateCcw, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  entries: ClipboardEntry[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLoadEntry: (entry: ClipboardEntry) => void;
  onDeleteEntry: (entryId: string) => void;
  onClearAll: () => void;
  onCopy: (content: string) => Promise<boolean>;
  isDarkMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  entries,
  searchQuery,
  onSearchChange,
  onLoadEntry,
  onDeleteEntry,
  onClearAll,
  onCopy,
  isDarkMode,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (entry: ClipboardEntry, event: React.MouseEvent) => {
    event.stopPropagation();
    const success = await onCopy(entry.content);
    if (success) {
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return '昨天';
    } else if (diffInDays < 7) {
      return `${diffInDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索历史记录..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {entries.length > 0 && (
          <button
            onClick={onClearAll}
            className="mt-3 w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>清空全部</span>
          </button>
        )}
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="p-4 text-center">
            <div className="text-gray-400 dark:text-gray-500">
              <RotateCcw className="w-12 h-12 mx-auto mb-3" />
              <p className="text-sm">暂无历史记录</p>
              <p className="text-xs mt-1">开始输入或粘贴内容</p>
            </div>
          </div>
        ) : (
          <div className="p-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onLoadEntry(entry)}
                className="group relative mb-2 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {entry.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(entry.created_at)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                      {entry.content.substring(0, 100)}...
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleCopy(entry, e)}
                      className={`p-1.5 rounded ${
                        copiedId === entry.id
                          ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800'
                      } transition-colors`}
                      title="复制内容"
                    >
                      {copiedId === entry.id ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEntry(entry.id);
                      }}
                      className="p-1.5 rounded bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                      title="删除条目"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};