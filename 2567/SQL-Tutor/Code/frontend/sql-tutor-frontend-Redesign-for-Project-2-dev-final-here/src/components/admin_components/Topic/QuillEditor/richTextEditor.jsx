'use client';

import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { GetContents } from '../service/userService';
import { useEffect, useState } from 'react';
import QuillResizeImage from 'quill-resize-image';
Quill.register('modules/resize', QuillResizeImage);

// Add this function before the component
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

export default function Myeditor({ getContext, contentsid, size = '70vh' }) {
  // console.log('show contentsID', contentsid);
  const [contents, setContents] = useState(null);

  const onHandle = (value) => {
    setContents(value);
    getContext(value);
  };

  useEffect(() => {
    if (!contentsid) return;
    const fetchData = async () => {
      const data = await GetContents(contentsid);
      onHandle(data.Content_info);
      // console.log('show content', data);
    };
    fetchData();
  }, [contentsid]);

  const toolbar = [
    [{ size: ['small', false, 'large', 'huge'] }],
    [
      'bold',
      'italic',
      'underline',
      { color: [] },
      { list: 'ordered' },
      { list: 'bullet' },
    ],
    ['link', 'code-block', 'image'],
  ];

  // Modify the modules configuration
  const modules = {
    toolbar: {
      container: toolbar,
    },
    resize: {
      parchment: Quill.import('parchment'),
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
    formats: ['image'], // Add this line
  };

  // Modify the CustomImageBlot class in the useEffect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ImageBlot = Quill.import('formats/image');
      class CustomImageBlot extends ImageBlot {
        static create(value) {
          const node = super.create(value);
          if (typeof value === 'string') {
            node.setAttribute('src', value);
            // Add default styles for loaded images
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
      Quill.register('formats/image', CustomImageBlot, true);
    }
  }, []);

  return (
    <div className='relative'>
      <div className='quill' style={{ height: size }}>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;700&display=swap');

          .ql-editor {
            font-family: 'Noto Sans Thai', sans-serif !important;
            font-size: 16px;
          }
          .quill {
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
          }
          .ql-toolbar.ql-snow {
            top: 0;
            z-index: 20;
            background: white;
            border: 1px solid black;
          }
          .ql-container.ql-snow {
            border: 1px solid black;
            flex: 1;
            overflow-y: auto;
          }
          .ql-editor {
            height: 100%;
          }
          .toolbar {
            position: relative !important;
            top: 0 !important;
          }
          .ql-editor img {
            display: block !important;
            margin: auto !important;
            max-width: 100% !important;
            height: auto !important;
          }
        `}</style>
        <ReactQuill
          className='flex h-full max-h-full flex-col text-ellipsis'
          modules={modules}
          theme='snow'
          onChange={onHandle}
          value={contents}
        />
      </div>
    </div>
  );
}
