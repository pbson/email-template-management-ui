import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { Eye, Trash, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import RichTextEditor from '../rich-text-editor/rich-text-editor';
import PreviewModal from '../common/preview-modal';
import adviceApi from '@/features/advice/advice.api';
import variableApi from '@/features/variable/variable.api';

interface Tag {
  name: string;
  color: string;
}

interface CaseItemProps {
  caseItem: any;
  onSelect: (id: number, selected: boolean) => void;
  onDelete: (id: number) => void;
  onUpdate: (
    id: number,
    title: string,
    content: string,
    tagId?: number,
  ) => void;
  onEditorChange: any;
  tags: any;
}

const CaseItem: React.FC<CaseItemProps> = ({
  caseItem,
  onSelect,
  onDelete,
  onUpdate,
  onEditorChange,
  tags,
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [title, setTitle] = useState(caseItem.title);
  const [content, setContent] = useState(caseItem.content || '');

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(caseItem.id, e.target.checked);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    debouncedUpdateTitle(caseItem.id, e.target.value);
  };

  const debouncedUpdateTitle = useCallback(
    debounce((id: number, newTitle: string) => {
      onUpdate(id, newTitle, content);
    }, 500),
    [content, onUpdate],
  );

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    debouncedUpdateContent(caseItem.id, newContent);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tag = tags.find((tag: Tag) => tag.name === e.target.value);
    if (tag) {
      onUpdate(caseItem.id, title, content, tag.id);
    }
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
      onEditorChange(caseItem.id);
    }
  };

  const handleShowAdvices = () => {
    window.open(`/advice-management/${caseItem.id}`, '_blank');
  };

  const handlePreview = async () => {
    try {
      const [adviceResponse, variableResponse] = await Promise.all([
        adviceApi.getList(caseItem.id),
        variableApi.getList(),
      ]);

      const advices = adviceResponse.data.advices;
      const variables = variableResponse.data.reduce(
        (acc: any, variable: any) => {
          acc[variable.name] = variable.default_value;
          return acc;
        },
        {},
      );

      let replacedContent = content;

      if (advices.length > 0) {
        replacedContent = replacedContent.replace(
          /{{AdviceSection}}/g,
          advices[0].content,
        );
      } else {
        replacedContent = replacedContent.replace(/{{AdviceSection}}/g, '');
      }

      replacedContent = replacedContent.replace(
        /{{Variable:(.*?)}}/g,
        (p1: any) => {
          return variables[p1] || `{{Variable:${p1}}}`;
        },
      );

      setPreviewContent(replacedContent);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Failed to fetch advices or variables for preview:', error);
    }
  };

  return (
    <div className="mb-4 border border-gray-200 rounded-lg bg-white overflow-hidden">
      <div className="p-4 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 flex-grow">
            <input
              type="checkbox"
              checked={caseItem.selected}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition-all duration-150 ease-in-out"
            />
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-base w-full text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-300 rounded px-2 py-1 transition-all duration-150 ease-in-out w-64 border border-gray-200"
            />
            <div className="relative">
              <select
                className="appearance-none text-sm text-gray-600 border border-gray-200 focus:ring-1 focus:ring-blue-300 rounded pl-8 pr-8 py-1 transition-all duration-150 ease-in-out bg-transparent"
                defaultValue={caseItem?.tag?.name}
                onChange={handleTagChange}
              >
                {tags.map((tag: any) => (
                  <option key={tag.name} value={tag.name}>
                    {tag.name}
                  </option>
                ))}
              </select>
              <div
                style={{ backgroundColor: caseItem?.tag?.color }}
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full`}
              ></div>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handlePreview}
              className="p-1.5 hover:bg-gray-200 rounded-md transition-colors duration-150 ease-in-out text-gray-500 hover:text-gray-700"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => onDelete(caseItem.id)}
              className="p-1.5 hover:bg-gray-200 rounded-md transition-colors duration-150 ease-in-out text-gray-500 hover:text-gray-700"
            >
              <Trash size={18} />
            </button>
            <button
              onClick={handleShowAdvices}
              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-150 ease-in-out text-sm font-medium flex items-center space-x-1"
            >
              <BookOpen size={16} />
              <span>Show Advices</span>
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
          isCase={true}
          item={caseItem}
          onContentChange={handleContentChange}
        />
      )}
      <PreviewModal
        isCasePreview={true}
        show={isPreviewOpen}
        onHide={() => setIsPreviewOpen(false)}
        title={title}
        content={previewContent}
      />
    </div>
  );
};

export default CaseItem;
