import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddVariableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, defaultValue: string) => void;
  initialName?: string;
  initialDefaultValue?: string;
}

const AddVariableModal: React.FC<AddVariableModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialName = '',
  initialDefaultValue = '',
}) => {
  const [name, setName] = useState(initialName);
  const [defaultValue, setDefaultValue] = useState(initialDefaultValue);

  useEffect(() => {
    setName(initialName);
    setDefaultValue(initialDefaultValue);
  }, [initialName, initialDefaultValue]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), defaultValue.trim());
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialName ? 'Edit' : 'Add'} Variable
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="variableName"
              className="block text-sm font-medium text-gray-700"
            >
              Variable Name
            </label>
            <input
              type="text"
              id="variableName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter variable name"
            />
          </div>
          <div>
            <label
              htmlFor="defaultValue"
              className="block text-sm font-medium text-gray-700"
            >
              Preview Value
            </label>
            <input
              type="text"
              id="defaultValue"
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter example for preview"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVariableModal;
