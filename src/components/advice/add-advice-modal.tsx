import React, { useState, useCallback } from 'react';

import adviceApi from '@/features/advice/advice.api';
import RichTextEditor from '../rich-text-editor/rich-text-editor';

interface AddAdviceModalProps {
  show: boolean;
  onHide: () => void;
  onSave: () => void;
  caseId: number;
}

const AddAdviceModal: React.FC<AddAdviceModalProps> = ({
  show,
  onHide,
  onSave,
  caseId,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adviceApi.add({ title, content, caseId });
      onSave();
      onHide();
    } catch (error) {
      alert('Failed to create advice');
    }
  };

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Add New Advice</h2>
        <div>
          <div className="mb-4">
            <label
              htmlFor="adviceTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Advice Title
            </label>
            <input
              type="text"
              id="adviceTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="adviceContent"
              className="block text-sm font-medium text-gray-700"
            >
              Advice Content
            </label>
            <RichTextEditor
              item={{
                id: 0,
                title: title,
                content: content,
              }}
              onContentChange={handleContentChange}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onHide}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdviceModal;
