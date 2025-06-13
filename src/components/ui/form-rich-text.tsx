import React, { useCallback } from 'react';
import { useField } from 'formik';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  BoldIcon,
  ItalicIcon,
  ListBulletIcon,
  DocumentTextIcon,
  LinkIcon,
  PhotoIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  DocumentDuplicateIcon,
  DocumentIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

interface FormRichTextProps {
  name: string;
  label: string;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`
          p-1 rounded
          ${editor.isActive('bold')
            ? 'bg-gray-200 dark:bg-gray-700'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
        title="Bold"
      >
        <BoldIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`
          p-1 rounded
          ${editor.isActive('italic')
            ? 'bg-gray-200 dark:bg-gray-700'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
        title="Italic"
      >
        <ItalicIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`
          p-1 rounded
          ${editor.isActive('bulletList')
            ? 'bg-gray-200 dark:bg-gray-700'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
        title="Bullet List"
      >
        <ListBulletIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`
          p-1 rounded
          ${editor.isActive('orderedList')
            ? 'bg-gray-200 dark:bg-gray-700'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
        title="Numbered List"
      >
        <DocumentTextIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={setLink}
        className={`
          p-1 rounded
          ${editor.isActive('link')
            ? 'bg-gray-200 dark:bg-gray-700'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
        title="Add Link"
      >
        <LinkIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={addImage}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Add Image"
      >
        <PhotoIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`
          p-1 rounded
          ${editor.isActive('blockquote')
            ? 'bg-gray-200 dark:bg-gray-700'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
        title="Blockquote"
      >
        <DocumentIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`
          p-1 rounded
          ${editor.isActive('codeBlock')
            ? 'bg-gray-200 dark:bg-gray-700'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
        title="Code Block"
      >
        <CodeBracketIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`
          p-1 rounded
          ${editor.isActive({ textAlign: 'left' })
            ? 'bg-gray-200 dark:bg-gray-700'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
        title="Align Left"
      >
        <DocumentDuplicateIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Undo"
      >
        <ArrowUturnLeftIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Redo"
      >
        <ArrowUturnRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export const FormRichText: React.FC<FormRichTextProps> = ({
  name,
  label,
  error,
  touched,
  placeholder,
  maxLength,
  className = ''
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false
      }),
      Image,
      Placeholder.configure({
        placeholder: placeholder || 'Start writing...'
      })
    ],
    content: field.value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      field.onChange({
        target: {
          name: field.name,
          value: html
        }
      });
    }
  });

  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>
      <div
        className={`
          rounded-md border
          ${hasError
            ? 'border-red-300'
            : 'border-gray-300 dark:border-gray-600'
          }
          ${className}
        `}
      >
        <MenuBar editor={editor} />
        <EditorContent
          editor={editor}
          className={`
            prose dark:prose-invert max-w-none p-4
            focus:outline-none
            ${hasError
              ? 'text-red-900 placeholder-red-300'
              : 'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400'
            }
          `}
        />
      </div>
      {hasError && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {meta.error}
        </p>
      )}
      {maxLength && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {editor?.storage.characterCount.characters() || 0} / {maxLength} characters
        </p>
      )}
    </div>
  );
}; 