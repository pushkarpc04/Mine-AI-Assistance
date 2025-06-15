'use client';
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // This is a very basic renderer. For full Markdown support and syntax highlighting,
  // a library like react-markdown with rehype-highlight or prism-react-renderer would be necessary.
  // This implementation splits by code blocks and renders them with <pre><code>.
  // It also handles basic newline to <br /> conversion for non-code text.

  const parts = content.split(/(\`\`\`[\w-]*\n[\s\S]*?\n\`\`\`)/g);

  return (
    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-foreground">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const languageMatch = part.match(/\`\`\`([\w-]*)\n/);
          const language = languageMatch && languageMatch[1] ? languageMatch[1] : '';
          const code = part.replace(/\`\`\`[\w-]*\n/, '').replace(/\n\`\`\`$/, '');
          return (
            <pre key={index} className="bg-muted p-3 sm:p-4 rounded-md overflow-x-auto my-2 shadow">
              <code className={`font-code text-sm ${language ? `language-${language}` : ''}`}>{code}</code>
            </pre>
          );
        }
        // For non-code parts, replace newlines with <br /> and render.
        // This helps preserve multi-line text formatting from AI responses.
        return (
          <span key={index}>
            {part.split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        );
      })}
    </div>
  );
}
