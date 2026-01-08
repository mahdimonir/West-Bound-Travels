import Button from '@/components/ui/Button';
import { Destination } from '@/types';
import { useState } from 'react';

interface DestinationFormProps {
  destination?: Destination | null;
  onSave: (data: any, files: FileList | null) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

export default function DestinationForm({
  destination,
  onSave,
  onCancel,
  isSaving = false,
}: DestinationFormProps) {
  const [formData, setFormData] = useState({
    name: destination?.name || '',
    description: destination?.description || '',
    location: destination?.location || '',
  });

  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async () => {
    await onSave(formData, files);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Destination Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          placeholder="e.g. Barikka Tila"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          placeholder="e.g. Border Area, Sunamganj"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          placeholder="Describe the destination..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(e.target.files)}
          className="w-full text-sm"
        />
        {files && <p className="text-xs text-gray-500 mt-1">{files.length} file(s) selected</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSaving || !formData.name}>
          {isSaving ? 'Saving...' : destination ? 'Update Destination' : 'Create Destination'}
        </Button>
      </div>
    </div>
  );
}
