import React, { useCallback } from 'react';


import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { debounce } from 'lodash';

import MenuBar from './menubar';

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Image,
  Link,
  Link.configure({
    autolink: true,
    openOnClick: false,
  }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Underline,
  TextStyle,
  Color,
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  FontFamily,
];

interface RichTextEditorProps {
  isCase?: boolean;
  item: any;
  onContentChange: (newContent: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  isCase,
  item,
  onContentChange,
}) => {
  const debouncedContentChange = useCallback(
    debounce((newContent: string) => {
      onContentChange(newContent);
    }, 500),
    [onContentChange],
  );
  

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <EditorProvider
          slotBefore={<MenuBar isCase={isCase} />}
          extensions={extensions}
          content={item.content || ''}
          onUpdate={({ editor }) => {
            debouncedContentChange(editor.getHTML());
          }}
        >
          <div className="prose max-w-none p-4 min-h-[200px] focus:outline-none editor-content" />
        </EditorProvider>
      </div>
    </div>
  );
};

export default RichTextEditor;
