import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import tagApi from '@/features/tag/tag.api';

interface AddTagModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  tagToEdit?: { id: number; name: string; color: string } | null;
}

const AddTagModal: React.FC<AddTagModalProps> = ({
  show,
  onClose,
  onSave,
  tagToEdit,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');

  useEffect(() => {
    if (tagToEdit) {
      setName(tagToEdit.name);
      setColor(tagToEdit.color);
    } else {
      setName('');
      setColor('#3B82F6');
    }
  }, [tagToEdit]);

  const handleSave = async () => {
    try {
      if (tagToEdit) {
        await tagApi.update({ id: tagToEdit.id, name, color });
      } else {
        await tagApi.add({ name, color });
      }
      onSave();
      onClose();
      // Refresh page
      window.location.reload();
    } catch (error) {
      console.error('Failed to save tag:', error);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            {tagToEdit ? 'Edit Tag' : 'Add Tag'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <label
                htmlFor="tagName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tag Name
              </label>
              <input
                type="text"
                id="tagName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter tag name"
              />
            </div>
            <div>
              <label
                htmlFor="tagColor"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Color
              </label>
              <div className="relative">
                <input
                  type="color"
                  id="tagColor"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer overflow-hidden appearance-none"
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                  }}
                />
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ backgroundColor: color }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTagModal;
