"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Icon } from "@iconify/react";
import { uploadBlogImg } from "@/utils/apiService";

export default function DropzoneModal({
  isOpen,
  setIsOpen,
  OnuploadSuccess,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  OnuploadSuccess: (imageUrl: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false); // Track upload state
  

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      //console.log("ไฟล์ที่เลือก:", acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  const handleUpload = async () => {
    if (!file) return; 
  
    setIsUploading(true); 
  
    const formData = new FormData();
    formData.append("imgFile", file);
  
    try {
      const response = await uploadBlogImg(formData); 
      setIsUploading(false);
      setIsOpen(false);

      OnuploadSuccess(response.uploadedImageUrl);
  
    //  console.log("Upload success:", response);
    } catch (error) {
      setIsUploading(false);
    //  console.error("Upload failed:", error);
    }
  };
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white px-10 pt-10 pb-6 rounded-lg shadow-lg max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ปุ่มปิด Modal */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
        >
          <Icon icon="iconoir:cancel" className="text-lg text-[#414141]" width={24} height={24} />
        </button>

        {/* Dropzone */}
        <div
        {...getRootProps()}
        className="flex border-2 border-dashed border-gray-400 rounded-lg p-10 text-center cursor-pointer hover:bg-gray-100 w-full justify-center items-center"
        >
        <input {...getInputProps()} />
        <p className="flex text-gray-600 w-full whitespace-nowrap text-center justify-center items-center">
            {file ? `📁 ${file.name}` : "📁 ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์"}
        </p>
        </div>



        {/* แสดงปุ่มอัปโหลดเมื่อมีไฟล์ */}
        {file && (
          <div className="mt-4">
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full"
              disabled={isUploading}
            >
              {isUploading ? "กำลังอัปโหลด..." : "อัปโหลดไฟล์"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
