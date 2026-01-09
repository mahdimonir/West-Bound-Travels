'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { blogsService, type BlogWithDetails } from '@/lib/services';
import { useToast } from '@/lib/toast';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import 'react-quill/dist/quill.snow.css';

// Dynamic import for react-quill (client-only)
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
  }
);
// const ReactQuill = () => <div>React Quill Disabled for Build Debug</div>;

interface BlogEditorProps {
  blog?: BlogWithDetails | null;
  onSave?: (blog: BlogWithDetails) => void;
  onCancel?: () => void;
}

export default function BlogEditor({ blog, onSave, onCancel }: BlogEditorProps) {
  const { success, error: toastError } = useToast();
  const isEditing = !!blog;
  
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    tags: blog?.tags?.join(', ') || '',
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>(blog?.image || '');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (publish = false) => {
    if (!formData.title || !formData.content) {
      toastError('Validation Error: Title and content are required.');
      return;
    }

    publish ? setPublishing(true) : setSaving(true);

    try {
      const tags = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const blogData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        tags,
        status: publish ? 'PUBLISHED' : 'DRAFT',
      };

      let fileList: FileList | undefined;
      if (coverImage) {
        const dt = new DataTransfer();
        dt.items.add(coverImage);
        fileList = dt.files;
      }

      let result;
      if (isEditing && blog?.id) {
        result = await blogsService.update(blog.id, blogData, fileList);
      } else {
        result = await blogsService.create(blogData, fileList);
      }

      success(`Blog post ${publish ? 'published' : 'saved as draft'} successfully.`);

      if (result.data && onSave) {
        onSave(result.data);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save blog';
      toastError(message);
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  };

  // Quill editor modules
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean'],
    ],
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block',
    'link', 'image'
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter blog title..."
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            placeholder="auto-generated-from-title"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            rows={2}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Brief description..."
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
          <div className="flex items-center gap-4">
            {coverImagePreview && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={coverImagePreview} alt="Cover" className="w-32 h-20 object-cover rounded-lg" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="flex-1"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="travel, houseboat, adventure"
          />
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(content: string) => setFormData(prev => ({ ...prev, content }))}
              modules={modules}
              formats={formats}
              className="h-64 mb-12"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => handleSave(false)}
            disabled={saving || publishing}
          >
            {saving ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handleSave(true)}
            disabled={saving || publishing}
          >
            {publishing ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
