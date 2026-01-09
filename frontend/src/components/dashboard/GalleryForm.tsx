import Button from '@/components/ui/Button';
import { useState } from 'react';

type GalleryCategory = 'BOAT' | 'DESTINATION' | 'NATURE' | 'CULCTURE';

interface GalleryFormProps {
  onSave: (data: { alt: string; category: GalleryCategory }, file: File) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

export default function GalleryForm({ onSave, onCancel, isSaving = false }: GalleryFormProps) {
  const [formData, setFormData] = useState({
    alt: '',
    category: 'BOAT' as GalleryCategory,
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (file) {
      await onSave(formData, file);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm"
        />
        {preview && (
          <div className="mt-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text *</label>
        <input
          type="text"
          value={formData.alt}
          onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          placeholder="e.g. Tanguar Haor wetland"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as GalleryCategory })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="BOAT">Boat</option>
          <option value="DESTINATION">Destination</option>
          <option value="NATURE">Nature</option>
          <option value="CULCTURE">Culture</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSaving || !file || !formData.alt}>
          {isSaving ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>
    </div>
  );
}
