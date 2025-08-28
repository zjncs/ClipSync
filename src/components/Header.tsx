import React from 'react';
import { Clipboard, Moon, Sun, Save, Eye, Edit3 } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  isPreviewMode: boolean;
  onToggleDarkMode: () => void;
  onTogglePreviewMode: () => void;
  onSave: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  isPreviewMode,
  onToggleDarkMode,
  onTogglePreviewMode,
  onSave,
}) => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Clipboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              ClipSync
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              跨设备剪贴板同步工具
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onSave}
            className="p-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
            title="保存当前内容"
          >
            <Save className="w-5 h-5" />
          </button>
          
          <button
            onClick={onTogglePreviewMode}
            className={`p-2 rounded-lg transition-colors ${
              isPreviewMode
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            } hover:bg-blue-200 dark:hover:bg-blue-800`}
            title={isPreviewMode ? '切换到编辑模式' : '切换到预览模式'}
          >
            {isPreviewMode ? <Edit3 className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title={isDarkMode ? '切换到浅色主题' : '切换到深色主题'}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};