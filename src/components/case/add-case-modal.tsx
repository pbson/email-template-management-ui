import React, { useState, useCallback, useEffect } from 'react';

import { useCreateCaseMutation } from '@/features/case/hooks/use-case-query';
import RichTextEditor from '../rich-text-editor/rich-text-editor';
import tagApi from '@/features/tag/tag.api';

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface AddCaseModalProps {
  show: boolean;
  onHide: () => void;
  onSave: () => void;
}

const AddCaseModal: React.FC<AddCaseModalProps> = ({
  show,
  onHide,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<number | ''>('');
  const [content, setContent] = useState('');

  const { mutate: createCase } = useCreateCaseMutation();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState<boolean>(false);


  useEffect(() => {
    const fetchTags = async () => {
      setIsLoadingTags(true);
      try {
        const response = await tagApi.getList();
        setTags(response.data);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchTags();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTagId === '') {
      alert('Please select a tag');
      return;
    }
    createCase(
      { title, content, tagId: selectedTagId },
      {
        onSuccess: () => {
          onSave();
          onHide();
        },
        onError: () => {
          alert('Failed to create case');
        },
      },
    );
  };

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl overflow-y-auto max-h-full">
        <h2 className="text-2xl font-bold mb-4">Add New Case</h2>
        <div>
          <div className="mb-4">
            <label htmlFor="caseTitle" className="block text-sm font-medium text-gray-700">
              Case Title
            </label>
            <input
              type="text"
              id="caseTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="caseTag" className="block text-sm font-medium text-gray-700">
              Case Tag
            </label>
            <select
              id="caseTag"
              value={selectedTagId}
              onChange={(e) => setSelectedTagId(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            >
              <option value="">Select Tag</option>
              {isLoadingTags ? (
                <option disabled>Loading tags...</option>
              ) : (
                tags?.map((tag: Tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="caseContent" className="block text-sm font-medium text-gray-700">
              Case Content
            </label>
            <RichTextEditor
              isCase={true}
              item={{
                id: 0,
                title: title,
                tag: tags?.find(tag => tag.id === selectedTagId)?.name || '',
                tagColor: tags?.find(tag => tag.id === selectedTagId)?.color || '',
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

export default AddCaseModal;