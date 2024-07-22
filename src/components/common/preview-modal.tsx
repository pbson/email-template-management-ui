import React from 'react';
import { X } from 'lucide-react';

interface PreviewModalProps {
  isCasePreview: boolean;
  show: boolean;
  onHide: () => void;
  title: string;
  content: string;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isCasePreview,
  show,
  onHide,
  title,
  content,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800">Preview</h2>
            <p className="text-sm text-gray-500">
              Preview with default value for variables{' '}
              {isCasePreview ? 'and first advice' : ''}
            </p>
          </div>
          <button
            onClick={onHide}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 flex-grow overflow-auto">
          <h3 className="text-md font-semibold mb-4 text-gray-700">
            {isCasePreview ? 'Case' : 'Advice'} Title: {title}
          </h3>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
