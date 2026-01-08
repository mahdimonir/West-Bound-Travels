'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Markdown Renderer Component
 * Renders markdown content with syntax highlighting and GitHub Flavored Markdown support
 */
export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={`${className} bg-gray-100 px-1 py-0.5 rounded text-sm`} {...props}>
                {children}
              </code>
            );
          },
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-bold text-gray-900 mt-8 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl font-bold text-gray-900 mt-6 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-gray-700 leading-relaxed mb-4" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-primary-600 hover:text-primary-700 underline font-medium" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-2 mb-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 my-4" {...props} />
          ),
          img: ({ node, ...props }) => (
            <img className="rounded-lg shadow-md my-6 w-full" {...props} alt={props.alt || 'Blog image'} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-t border-gray-200" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
