import React, { useState } from 'react';
import { useClipboard } from './hooks/useClipboard';
import { Header } from './components/Header';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

function App() {
  const {
    entries,
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
  } = useClipboard();

  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { message, type, id }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleSave = () => {
    saveCurrentEntry();
    showToast('内容已保存', 'success');
  };

  const handleCopy = async (content: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      showToast('已复制到剪贴板', 'success');
    } else {
      showToast('复制失败', 'error');
    }
    return success;
  };

  const handleClearAll = () => {
    if (window.confirm('确定要清空所有历史记录吗？此操作不可撤销。')) {
      clearAll();
      showToast('已清空所有记录', 'info');
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        {isLoading && (
          <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm z-50">
            正在加载数据...
          </div>
        )}
        
        <Header
          isDarkMode={isDarkMode}
          isPreviewMode={isPreviewMode}
          isSaving={isSaving}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onTogglePreviewMode={() => setIsPreviewMode(!isPreviewMode)}
          onSave={handleSave}
        />
        
        <div className={`flex h-screen ${isLoading ? 'pt-10' : ''}`}>
          <Sidebar
            entries={entries}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onLoadEntry={loadEntry}
            onDeleteEntry={deleteEntry}
            onClearAll={handleClearAll}
            onCopy={handleCopy}
            isDarkMode={isDarkMode}
          />
          
          <div className="flex-1 flex">
            <div className="flex-1 border-r border-gray-200 dark:border-gray-700">
              <Editor
                content={currentContent}
                onChange={setCurrentContent}
                isDarkMode={isDarkMode}
              />
            </div>
            
            {isPreviewMode && (
              <div className="flex-1">
                <Preview
                  content={currentContent}
                  isDarkMode={isDarkMode}
                  onCopy={handleCopy}
                />
              </div>
            )}
          </div>
        </div>

        {/* Toast Notifications */}
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;