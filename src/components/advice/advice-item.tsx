import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { Eye, Trash, ChevronDown, ChevronUp } from 'lucide-react';
import RichTextEditor from '../rich-text-editor/rich-text-editor';
import variableApi from '@/features/variable/variable.api';
import PreviewModal from '../common/preview-modal';

interface AdviceItemProps {
  adviceItem: any;
  onSelect: (id: number, selected: boolean) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, title: string, content: string) => void;
  onEditorChange: any;
}

const AdviceItem: React.FC<AdviceItemProps> = ({
  adviceItem,
  onSelect,
  onDelete,
  onUpdate,
  onEditorChange,
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [title, setTitle] = useState(adviceItem.title);
  const [content, setContent] = useState(adviceItem.content || '');

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(adviceItem.id, e.target.checked);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    debouncedUpdateTitle(adviceItem.id, e.target.value);
  };

  const debouncedUpdateTitle = useCallback(
    debounce((id: number, newTitle: string) => {
      onUpdate(id, newTitle, content);
    }, 500),
    [content, onUpdate],
  );

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    debouncedUpdateContent(adviceItem.id, newContent);
  };

  const debouncedUpdateContent = useCallback(
    debounce((id: number, newContent: string) => {
      onUpdate(id, title, newContent);
    }, 500),
    [title, onUpdate],
  );

  const toggleEditor = () => {
    setIsEditorOpen(!isEditorOpen);
    if (isEditorOpen) {
      onEditorChange(adviceItem.id, title, content);
    }
  };

  const handlePreview = async () => {
    try {
      const variableResponse = await variableApi.getList();

      console.log('variableResponse', variableResponse);

      const variables = variableResponse.data.reduce(
        (acc: any, variable: any) => {
          acc[variable.name] = variable.default_value;
          return acc;
        },
        {},
      );

      let replacedContent = content;

      replacedContent = replacedContent.replace(
        /{{Variable:(.*?)}}/g,
        (p1: any) => {
          return variables[p1] || `{{Variable:${p1}}}`;
        },
      );

      setPreviewContent(replacedContent);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Failed to fetch variables for preview:', error);
    }
  };

  return (
    <div className="mb-4 border border-gray-200 rounded-lg bg-white overflow-hidden">
      <div className="p-4 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 flex-grow">
            <input
              type="checkbox"
              checked={adviceItem.selected}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition-all duration-150 ease-in-out"
            />
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-base w-full text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-300 rounded px-2 py-1 transition-all duration-150 ease-in-out w-64 border border-gray-200"
            />
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handlePreview}
              className="p-1.5 hover:bg-gray-200 rounded-md transition-colors duration-150 ease-in-out text-gray-500 hover:text-gray-700"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => onDelete(adviceItem.id)}
              className="p-1.5 hover:bg-gray-200 rounded-md transition-colors duration-150 ease-in-out text-gray-500 hover:text-gray-700"
            >
              <Trash size={18} />
            </button>
            <button
              onClick={toggleEditor}
              className="p-1.5 hover:bg-gray-200 rounded-md transition-colors duration-150 ease-in-out text-gray-500 hover:text-gray-700"
            >
              {isEditorOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
      {isEditorOpen && (
        <RichTextEditor
          isCase={false}
          item={adviceItem}
          onContentChange={handleContentChange}
        />
      )}
      <PreviewModal
        isCasePreview={false}
        show={isPreviewOpen}
        onHide={() => setIsPreviewOpen(false)}
        title={title}
        content={previewContent}
      />
    </div>
  );
};

export default AdviceItem;
