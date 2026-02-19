'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { useEffect, useState } from 'react';

// Dynamically import ReactQuill with no SSR
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new');
    const { default: QuillResizeImage } = await import('quill-resize-image');
    RQ.Quill.register('modules/resize', QuillResizeImage);
    return RQ;
  },
  { ssr: false }
);

const customImageHandler = function (node, delta) {
  const src = node.getAttribute('src');
  const style = node.getAttribute('style');
  if (style) {
    const width = node.style.width;
    delta.attributes = {
      ...delta.attributes,
      width: width,
      style: style,
    };
  }
  return delta;
};

export default function TextEditor({ getContext, size, initialContent = '' }) {
  const [contents, setContents] = useState(initialContent);

  useEffect(() => {
    setContents(initialContent);
  }, [initialContent]);

  const onHandle = (value) => {
    getContext(value);
    setContents(value);
  };

  const toolbar = [
    // [{ size: ['small', false, 'large', 'huge'] }],
    [
      'bold',
      'italic',
      'underline',
      { color: [] },
      // { list: 'ordered' },
      // { list: 'bullet' },
    ],
    ['link', 'code-block', 'image'],
  ];

  const modules = {
    toolbar: {
      container: toolbar,
    },
    resize: {
      modules: ['Resize', 'DisplaySize'],
      options: {
        displaySize: true,
        handleStyles: {
          backgroundColor: 'black',
          border: 'none',
          color: 'white',
        },
        modules: ['Resize', 'DisplaySize', 'Toolbar', 'Keyboard'],
      },
    },
    clipboard: {
      matchers: [['IMG', customImageHandler]],
    },
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const registerCustomImageBlot = async () => {
        const { default: RQ } = await import('react-quill-new');
        const ImageBlot = RQ.Quill.import('formats/image');

        class CustomImageBlot extends ImageBlot {
          static create(value) {
            const node = super.create(value);
            if (typeof value === 'string') {
              node.setAttribute('src', value);
              node.setAttribute(
                'style',
                'width: 50%; display: block; margin: auto;'
              );
            } else if (typeof value === 'object') {
              node.setAttribute('src', value.src);
              if (value.style) {
                node.setAttribute('style', value.style);
              }
            }
            return node;
          }

          static value(node) {
            return {
              src: node.getAttribute('src'),
              style: node.getAttribute('style'),
            };
          }
        }
        RQ.Quill.register('formats/image', CustomImageBlot, true);
      };

      registerCustomImageBlot();
    }
  }, []);

  return (
    <div className='relative'>
      <div className='quill' style={{ height: size }}>
        <style jsx global>{`
          .quill {
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .ql-toolbar.ql-snow {
            top: 0;
            z-index: 20;
            background: white;
            border: 1px solid #e5e7eb;
          }
          .ql-container.ql-snow {
            border: 1px solid #e5e7eb;
            flex: 1;
            overflow-y: auto;
          }
          .ql-editor {
            height: 100%;
            font-size: 16px;
          }
          .ql-editor img {
            display: block;
            margin: auto;
            max-width: 100%;
            height: auto;
          }
        `}</style>
        {typeof window !== 'undefined' && (
          <ReactQuill
            className='flex h-full max-h-full flex-col text-ellipsis'
            modules={modules}
            theme='snow'
            onChange={onHandle}
            value={contents}
          />
        )}
      </div>
    </div>
  );
}
