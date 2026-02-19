import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void; // Prop to send the selected file to the parent
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  }, []);

  const handleFiles = (files: FileList) => {
    if (files.length > 0) {
      const file = files[0];
      const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif'];
      const maxSize = 3 * 1024 * 1024; // 3MB in bytes

      if (!validTypes.includes(file.type)) {
        alert('Please upload SVG, PNG, JPG or GIF files only');
        return;
      }

      if (file.size > maxSize) {
        alert('File size must be less than 3MB');
        return;
      }

      setFile(file);
      onFileSelect(file); 
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div
          className={`flex flex-col items-center justify-center space-y-4 p-6 transition-colors
            ${isDragging ? 'bg-blue-50' : 'bg-white'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <svg
            className="w-12 h-12 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          
          <div className="text-center">
            <button
              onClick={() => document.getElementById('fileInput')?.click()}
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Link
            </button>
            <span className="text-gray-600"> or drag and drop</span>
          </div>
          
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept=".svg,.png,.jpg,.jpeg,.gif"
            onChange={handleFileInput}
          />
          
          <p className="text-sm text-gray-500">
            SVG, PNG, JPG or GIF (max. 3MB)
          </p>

          {file && (
            <div className="mt-4 text-sm text-gray-600">
              Selected file: {file.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;