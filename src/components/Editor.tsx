import React from 'react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  isDarkMode: boolean;
}

export const Editor: React.FC<EditorProps> = ({ content, onChange, isDarkMode }) => {
  return (
    <div className="h-full">
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          编辑器
        </h2>
      </div>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="在此粘贴或输入内容... 支持 Markdown 语法"
        className="w-full h-full resize-none border-none outline-none p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm leading-relaxed"
        style={{
          minHeight: 'calc(100vh - 200px)',
        }}
      />
    </div>
  );
};