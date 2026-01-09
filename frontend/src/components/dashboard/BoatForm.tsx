import Button from '@/components/ui/Button';
import { Boat } from '@/types';
import { useState } from 'react';

interface Room {
  type: string;
  count: number;
  maxPax: number;
  balcony: boolean;
  attachBath: boolean;
  price: number;
}

interface BoatFormProps {
  boat?: Boat | null;
  onSave: (data: any, files: FileList | null) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

export default function BoatForm({ boat, onSave, onCancel, isSaving = false }: BoatFormProps) {
  const [formData, setFormData] = useState({
    name: boat?.name || '',
    type: (boat?.type || 'AC') as 'AC' | 'NON_AC',
    totalRooms: boat?.totalRooms || 7,
    description: boat?.description || '',
    features: boat?.features || [],
  });

  const [rooms, setRooms] = useState<Room[]>(
    boat?.rooms && Array.isArray(boat.rooms) && boat.rooms.length > 0
      ? boat.rooms
      : [
          { type: 'AC with Balcony/Attach Bath', count: 4, maxPax: 4, balcony: true, attachBath: true, price: 5000 },
          { type: 'Couple Attach Bath', count: 1, maxPax: 2, balcony: false, attachBath: true, price: 4000 },
          { type: 'Couple Non-Attach Bath', count: 1, maxPax: 2, balcony: false, attachBath: false, price: 2000 },
          { type: '2-Bed Attach Bath', count: 1, maxPax: 6, balcony: false, attachBath: true, price: 5000 },
        ]
  );

  const [files, setFiles] = useState<FileList | null>(null);
  const [newFeature, setNewFeature] = useState('');

  const handleAddRoom = () => {
    setRooms([...rooms, { type: '', count: 1, maxPax: 2, balcony: false, attachBath: false, price: 0 }]);
  };

  const handleRemoveRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const handleRoomChange = (index: number, field: keyof Room, value: any) => {
    const updated = [...rooms];
    updated[index] = { ...updated[index], [field]: value };
    setRooms(updated);
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const handleSubmit = async () => {
    const data = {
      ...formData,
      rooms,
    };
    await onSave(data, files);
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Boat Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="e.g. Hoarer Sultan House Boat"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'AC' | 'NON_AC' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="AC">AC</option>
            <option value="NON_AC">NON-AC</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Total Rooms *</label>
        <input
          type="number"
          value={formData.totalRooms}
          onChange={(e) => setFormData({ ...formData, totalRooms: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          min="1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          placeholder="Describe the boat..."
        />
      </div>

      {/* Room Configurations */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">Room Configurations</label>
          <button
            type="button"
            onClick={handleAddRoom}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            + Add Room Type
          </button>
        </div>
        <div className="space-y-3">
          {rooms.map((room, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-2">
                <input
                  type="text"
                  value={room.type}
                  onChange={(e) => handleRoomChange(idx, 'type', e.target.value)}
                  placeholder="Room type"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="number"
                  value={room.count}
                  onChange={(e) => handleRoomChange(idx, 'count', parseInt(e.target.value) || 0)}
                  placeholder="Count"
                  min="1"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="number"
                  value={room.maxPax}
                  onChange={(e) => handleRoomChange(idx, 'maxPax', parseInt(e.target.value) || 0)}
                  placeholder="Max pax"
                  min="1"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="number"
                  value={room.price}
                  onChange={(e) => handleRoomChange(idx, 'price', parseInt(e.target.value) || 0)}
                  placeholder="Price"
                  min="0"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm col-span-1"
                />
                <label className="flex items-center gap-2 px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={room.balcony}
                    onChange={(e) => handleRoomChange(idx, 'balcony', e.target.checked)}
                    className="rounded"
                  />
                  Balcony
                </label>
                <label className="flex items-center gap-2 px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={room.attachBath}
                    onChange={(e) => handleRoomChange(idx, 'attachBath', e.target.checked)}
                    className="rounded"
                  />
                  Attach Bath
                </label>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveRoom(idx)}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
            placeholder="Add a feature..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button
            type="button"
            onClick={handleAddFeature}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.features.map((feature, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
            >
              {feature}
              <button
                type="button"
                onClick={() => handleRemoveFeature(idx)}
                className="hover:text-primary-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(e.target.files)}
          className="w-full text-sm"
        />
        {files && (
          <p className="text-xs text-gray-500 mt-1">{files.length} file(s) selected</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSaving || !formData.name}>
          {isSaving ? 'Saving...' : boat ? 'Update Boat' : 'Create Boat'}
        </Button>
      </div>
    </div>
  );
}
