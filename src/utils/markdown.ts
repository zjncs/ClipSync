import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

export const parseMarkdown = (content: string): string => {
  try {
    const rawHtml = marked.parse(content);
    return DOMPurify.sanitize(rawHtml);
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return content;
  }
};