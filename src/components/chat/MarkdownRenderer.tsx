
'use client';
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Split the content by code blocks, keeping the code blocks as part of the array.
  // filter(Boolean) removes any empty strings that might result from the split.
  const parts = content.split(/(\`\`\`(?:[\w-]*\n)?[\s\S]*?\n\`\`\`)/g).filter(Boolean);

  return (
    // Apply Tailwind Typography base styles.
    // prose-sm provides smaller typography, sm:prose adjusts for larger screens.
    // dark:prose-invert ensures readability in dark mode.
    <div className="prose prose-sm sm:prose max-w-none text-foreground dark:prose-invert">
      {parts.map((part, index) => {
        // Check if the part is a code block
        if (part.startsWith('```') && part.endsWith('```')) {
          const languageMatch = part.match(/\`\`\`([\w-]*)\n/);
          // Default to 'plaintext' if no language is specified.
          const language = languageMatch && languageMatch[1] ? languageMatch[1].toLowerCase() : 'plaintext';
          // Extract the code content.
          const code = part.replace(/\`\`\`(?:[\w-]*)?\n?/, '').replace(/\n?\`\`\`$/, '');
          
          return (
            <pre 
              key={index} 
              className="bg-muted p-3 sm:p-4 rounded-md overflow-x-auto my-2 shadow-sm !text-sm" // Apply specific styling for code blocks.
            >
              <code className={`font-code language-${language}`}>{code}</code>
            </pre>
          );
        }
        
        // For non-code parts, render as a paragraph.
        // whitespace-pre-wrap preserves newlines and spaces from the original text.
        // break-words ensures long strings without spaces will wrap correctly.
        // my-0 overrides default prose paragraph margins, allowing newlines within the text to control spacing.
        return (
          <p key={index} className="whitespace-pre-wrap break-words my-0">
            {part}
          </p>
        );
      })}
    </div>
  );
}
