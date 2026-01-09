'use client';

import { useState } from 'react';
import Card from '../ui/Card';

interface BlogImage {
  id: string;
  url: string;
  alt: string;
}

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  images?: BlogImage[];
  onImageUpload?: (file: File) => Promise<string>;
  onImageRemove?: (imageId: string) => void;
}

/**
 * Markdown Editor with Image Management
 * Supports markdown editing with live preview and image upload/management
 */
export default function MarkdownEditor({
  value,
  onChange,
  images = [],
  onImageUpload,
  onImageRemove,
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    setUploading(true);
    try {
      const imageUrl = await onImageUpload(file);
      // Insert markdown image syntax at cursor position
      const markdownImage = `\n![${file.name}](${imageUrl})\n`;
      onChange(value + markdownImage);
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploading(false);
    }
  };

  const copyImageLink = (url: string) => {
    const markdownLink = `![Image](${url})`;
    navigator.clipboard.writeText(markdownLink);
    // You can add a toast notification here
  };

  return (
    <div className="space-y-4">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 transition"
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          
          {onImageUpload && (
            <label className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 transition cursor-pointer">
              {uploading ? 'Uploading...' : 'Upload Image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="text-xs text-gray-500">
          Markdown supported
        </div>
      </div>

      {/* Editor / Preview */}
      {showPreview ? (
        <Card className="p-6">
          <div className="prose prose-lg max-w-none">
            {value || <p className="text-gray-400 italic">No content to preview</p>}
          </div>
        </Card>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
          placeholder="Write your blog content in markdown...

# Heading 1
## Heading 2

**Bold text**
*Italic text*

- List item 1
- List item 2

[Link text](https://example.com)
![Image alt](image-url)

```javascript
// Code block
const example = 'Hello World';
```"
        />
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Uploaded Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                  <button
                    onClick={() => copyImageLink(image.url)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                    title="Copy markdown link"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  {onImageRemove && (
                    <button
                      onClick={() => onImageRemove(image.id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                      title="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Markdown Cheatsheet */}
      <details className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <summary className="text-sm font-bold text-gray-700 cursor-pointer">Markdown Cheatsheet</summary>
        <div className="mt-3 text-xs text-gray-600 space-y-2 font-mono">
          <p># Heading 1</p>
          <p>## Heading 2</p>
          <p>**Bold** or __Bold__</p>
          <p>*Italic* or _Italic_</p>
          <p>[Link](https://example.com)</p>
          <p>![Image](image-url)</p>
          <p>- List item</p>
          <p>1. Numbered list</p>
          <p>&gt; Blockquote</p>
          <p>```language</p>
          <p>Code block</p>
          <p>```</p>
        </div>
      </details>
    </div>
  );
}
