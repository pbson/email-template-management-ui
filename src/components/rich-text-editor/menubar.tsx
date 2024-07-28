import React, { useCallback } from 'react';

import { useCurrentEditor } from '@tiptap/react';
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  LinkIcon,
  Undo,
  Redo,
  Variable,
} from 'lucide-react';
import VariableSelector from '../variable/variable-selector';

const MenuBar = ({ isCase }: { isCase?: boolean }) => {
  const { editor } = useCurrentEditor();
  const [isVariableSelectorOpen, setIsVariableSelectorOpen] =
    React.useState(false);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ onClick, icon: Icon, isActive = false }: any) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`p-1.5 rounded transition-colors duration-150 ease-in-out ${
        isActive
          ? 'bg-blue-100 text-blue-800'
          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
      }`}
    >
      <Icon size={18} />
    </button>
  );

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter the URL:', previousUrl);

    if (url === null) {
      return; // Cancelled
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Check if the URL starts with a protocol
    if (!/^https?:\/\//i.test(url)) {
      // If not, prepend 'https://'
      const fullUrl = `https://${url}`;
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: fullUrl })
        .run();
    } else {
      // If it already has a protocol, use it as is
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  }, [editor]);

  const insertVariable = useCallback(
    (variable: string) => {
      editor.chain().focus().insertContent(`{{Variable:${variable}}}`).run();
      setIsVariableSelectorOpen(false);
    },
    [editor],
  );

  const placeAdvice = useCallback(() => {
    editor.chain().focus().insertContent('{{AdviceSection}}').run();
  }, [editor]);

  const fontFamilies = [
    { name: 'Default', value: '' },
    { name: 'Inter', value: 'Inter' },
    { name: 'Comic Sans', value: 'Comic Sans MS, Comic Sans' },
    { name: 'Serif', value: 'serif' },
    { name: 'Monospace', value: 'monospace' },
    { name: 'Cursive', value: 'cursive' },
  ];

  return (
    <div className="border-b border-gray-200">
      <div className="flex flex-wrap items-center gap-1 p-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={Bold}
          isActive={editor.isActive('bold')}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={Italic}
          isActive={editor.isActive('italic')}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          icon={UnderlineIcon}
          isActive={editor.isActive('underline')}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={Strikethrough}
          isActive={editor.isActive('strike')}
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          icon={Heading1}
          isActive={editor.isActive('heading', { level: 1 })}
        />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          icon={Heading2}
          isActive={editor.isActive('heading', { level: 2 })}
        />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          icon={Heading3}
          isActive={editor.isActive('heading', { level: 3 })}
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={List}
          isActive={editor.isActive('bulletList')}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={ListOrdered}
          isActive={editor.isActive('orderedList')}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          icon={Quote}
          isActive={editor.isActive('blockquote')}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          icon={Code}
          isActive={editor.isActive('code')}
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          icon={AlignLeft}
          isActive={editor.isActive({ textAlign: 'left' })}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          icon={AlignCenter}
          isActive={editor.isActive({ textAlign: 'center' })}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          icon={AlignRight}
          isActive={editor.isActive({ textAlign: 'right' })}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          icon={AlignJustify}
          isActive={editor.isActive({ textAlign: 'justify' })}
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        {/* <ToolbarButton onClick={addImage} icon={ImageIcon} /> */}
        <ToolbarButton
          onClick={setLink}
          icon={LinkIcon}
          isActive={editor.isActive('link')}
        />
        {/* <ToolbarButton onClick={insertTable} icon={TableIcon} /> */}
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={Undo}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={Redo}
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <input
          type="color"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
          className="w-8 h-8 p-0 cursor-pointer"
        />
        <select
          onChange={(e) =>
            editor.chain().focus().setFontFamily(e.target.value).run()
          }
          value={editor.getAttributes('textStyle').fontFamily || ''}
          className="text-sm border-gray-300 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        >
          {fontFamilies.map((font) => (
            <option key={font.value} value={font.value}>
              {font.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2 p-2 border-t border-gray-200">
        <button
          onClick={() => setIsVariableSelectorOpen(true)}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 ease-in-out text-sm font-medium flex items-center"
        >
          <Variable size={16} className="mr-1" />
          Insert Variable
        </button>
        {isCase && (
          <button
            onMouseDown={placeAdvice}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 ease-in-out text-sm font-medium"
          >
            Place Advice
          </button>
        )}
      </div>
      {isVariableSelectorOpen && (
        <VariableSelector
          isOpen={isVariableSelectorOpen}
          onClose={() => setIsVariableSelectorOpen(false)}
          onSelectVariable={insertVariable}
        />
      )}
    </div>
  );
};

export default MenuBar;
