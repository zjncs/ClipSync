import React from 'react';
import { parseMarkdown } from '../utils/markdown';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface PreviewProps {
  content: string;
  isDarkMode: boolean;
  onCopy: (content: string) => Promise<boolean>;
}

export const Preview: React.FC<PreviewProps> = ({ content, isDarkMode, onCopy }) => {
  const [justCopied, setJustCopied] = useState(false);

  const handleCopy = async () => {
    const success = await onCopy(content);
    if (success) {
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
    }
  };

  const htmlContent = parseMarkdown(content);

  return (
    <div className="h-full">
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          预览
        </h2>
        <button
          onClick={handleCopy}
          disabled={!content.trim()}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            justCopied
              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
              : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {justCopied ? (
            <>
              <Check className="w-4 h-4" />
              <span>已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>
      
      <div className="p-4 h-full overflow-y-auto">
        {content.trim() ? (
          <div
            className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <p className="text-gray-400 dark:text-gray-500 italic">
            暂无内容预览...
          </p>
        )}
      </div>
    </div>
  );
};