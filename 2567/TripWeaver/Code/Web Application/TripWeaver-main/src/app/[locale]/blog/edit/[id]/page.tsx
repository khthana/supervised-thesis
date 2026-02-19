"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { useTranslations } from "next-intl";
import Select from "react-select";
import ImageResize from "tiptap-extension-resize-image";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NavBar from "../../../components/NavBar";
import BlogDropzoneModal from "../../../components/modals/BlogDropzoneModal";
import { uploadBlogImg } from "@/utils/apiService";
import { redirect } from "next/navigation";
import { useQuery } from "react-query";
import { fetchUserData, fetchBlogData } from "@/utils/apiService";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import "../../toolbar.css";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";

const tagsList = [
  "แหล่งท่องเที่ยว",
  "ผจญภัย",
  "สมาธิ",
  "ศิลปะ",
  "วัฒนธรรม",
  "ทิวทัศน์",
  "ธรรมชาติ",
  "ประวัติศาสตร์",
  "วิวเมือง",
  "ชายหาด",
  "ภูเขา",
  "สถาปัตยกรรม",
  "วัด",
  "ถนนคนเดิน",
  "ตลาด",
  "หมู่บ้าน",
  "อุทยานแห่งชาติ",
  "ดำน้ำ",
  "Snuggle",
  "น้ำตก",
  "เกาะ",
  "ซื้อของ",
  "แคมป์",
];

const tagOptions = tagsList.map((tag) => ({ value: tag, label: tag }));

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "ชื่อบล็อกต้องมีความยาวกว่า 5 ตัวอักษร" })
    .max(100, { message: "ชื่อบล็อกต้องมีความยาวไม่เกิน 100 ตัวอักษร" }),
  description: z
    .string()
    .min(10, { message: "รายละเอียดต้องมีความยาวกว่า 10 ตัวอักษร" })
    .max(256, { message: "รายละเอียดต้องมีความยาวไม่เกิน 350 ตัวอักษร" }),
  tags: z.array(z.string(), { message: "ต้องมีอย่างน้อย 1 แท็ก" }).nonempty(),
});

type FormValues = z.infer<typeof formSchema>;

const EditBlogPost = () => {
  const [content, setContent] = useState("");
  const [tagselect, setTagselect] = useState<string[]>([]);
  const [blogImage, setBlogImage] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const [showUploadImageModal, setShowUploadImageModal] =
    useState<boolean>(false);
  const router = useRouter();

  const { id } = useParams();
  const blogID = id as string;

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: isUserDataError,
    refetch: refetchUserData,
  } = useQuery(
    ["userData", session?.user?.id],
    () => fetchUserData(session?.user?.id!),
    {
      enabled: !!session?.user?.id,
    }
  );

  const {
    data: blogData,
    isLoading: isBlogDataLoading,
    isError: isBlogDataError,
    refetch: refetchBlogData,
  } = useQuery(["blogData", blogID], () => fetchBlogData(blogID), {
    enabled: !!blogID,
    retry: 0,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageResize,
      Image.configure({
        inline: true,
        HTMLAttributes: {
          width: "600px",
          height: "auto",
        },
      }),
      Heading.configure({
        levels: [1, 2, 3, 4],
      }),
      BulletList,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (blogData && userData) {
      if (session?.user?.id !== blogData?.blogCreator?._id) {
        redirect("/blog");
      }
      setValue("title", blogData.blogName);
      setValue("description", blogData.description);
      setValue("tags", blogData.tags);
      setTagselect(blogData.tags);
      setContent(blogData.content);
      setBlogImage(blogData.blogImage);
      if (editor) {
        editor.commands.setContent(blogData.content);
      }
    }
  }, [blogData, userData, editor]);

  const handleBlogUploadImage = (reponse: any) => {
    setBlogImage(reponse);
  };

  const handleClickChangeImage = () => {
    console.log("Edit...");
    setShowUploadImageModal(true);
  };

  // Handle image upload
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    const formData = new FormData();
    formData.append("imgFile", file);
    try {
      const response = await uploadBlogImg(formData);
      const imageUrl = response.uploadedImageUrl;
      if (editor) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
    } catch (error) {
      console.error("Error uploading image", error);
    }
    event.target.value = "";
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    const blogData: {
      blogName: string;
      userID: string;
      description: string;
      tags: [string, ...string[]];
      content: string;
      blogImage?: string | null;
    } = {
      blogName: data.title,
      userID: session?.user?.id as string,
      description: data.description,
      tags: data.tags,
      content: content,
    };

    if (blogImage) {
      blogData.blogImage = blogImage;
    }
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/update/${blogID}`,
        blogData
      );
      const responseData = response.data;

      if (response.status === 200) {
        console.log("Blog post edited:", responseData);
        router.push(`/blog/post/${blogID}`);
      }
    } catch (error) {
      console.error("Error creating blog post:", error);
    }
  };

  const handleTagChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    if (selectedOption && !tagselect.includes(selectedOption.value)) {
      const newTags = [...tagselect, selectedOption.value];
      setTagselect(newTags);
      if (newTags.length > 0) {
        setValue("tags", newTags as [string, ...string[]]);
      }
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    const newTags = tagselect.filter((tag) => tag !== tagToRemove);
    setTagselect(newTags);
    setValue("tags", newTags as [string, ...string[]]);
  };

  //   const debug = () => {
  //     console.log("Content:", content);
  //   }

  return (
    <div className="flex flex-col bg-[#F4F4F4] w-full h-full">
      <NavBar />
      <div className="kanit w-3/4 mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 mb-20">
        <h1 className="text-3xl font-bold mb-6">แก้ไขบล็อกของคุณ</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-lg font-medium mb-2">
              ชื่อบล็อก
            </label>
            <input
              id="title"
              {...register("title")}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-400"
              placeholder="ชื่อบล็อกของคุณ"
            />
            {errors.title && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="blogImage"
              className="block text-lg font-medium mb-2"
            >
              รูปภาพหน้าปกบล็อก
            </label>
            {!blogImage && (
              <div
                className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-orange-400 transition"
                onClick={handleClickChangeImage}
              >
                <Icon
                  icon="uil:image-upload"
                  className="text-[100px] text-gray-500 hover:text-orange-400 transition"
                />
              </div>
            )}
            {showUploadImageModal && (
              <BlogDropzoneModal
                isOpen={showUploadImageModal}
                setIsOpen={setShowUploadImageModal}
                OnuploadSuccess={handleBlogUploadImage}
              />
            )}
            {blogImage && (
              <div
                className="flex mt-2 justify-center p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-orange-400 transition"
                onClick={handleClickChangeImage}
              >
                <img
                  src={blogImage}
                  alt="Blog"
                  className="w-1/4 h-auto rounded-md"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-lg font-medium mb-2"
            >
              รายละเอียดเบื้องต้น
            </label>
            <textarea
              id="description"
              {...register("description")}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-orange-400"
              placeholder="ใส่รายละเอียดเบื้องต้นของบล็อก"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* TipTap Editor with Toolbar */}
          <div className="flex  mt-10 flex-col sticky top-0 z-10">
            {/* Toolbar */}
            {editor && (
              <div className="flex space-x-2 p-2 border-b border-gray-200 bg-gray-100">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-1 px-2 rounded ${
                    editor.isActive("bold")
                      ? "bg-orange-500 text-white"
                      : "bg-white"
                  }`}
                >
                  <Icon icon="ooui:bold-b" className="" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-1 px-2 rounded ${
                    editor.isActive("italic")
                      ? "bg-orange-500 text-white"
                      : "bg-white"
                  }`}
                >
                  <Icon icon="tabler:italic" className="" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                  className={`p-1 px-2 rounded ${
                    editor.isActive("blockquote")
                      ? "bg-orange-500 text-white"
                      : "bg-white"
                  }`}
                >
                  <Icon icon="mdi:format-quote-open" className="text-lg" />
                </button>
                {/* Image Upload Button with Icon */}
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer p-2 bg-white rounded"
                >
                  <Icon icon="material-symbols:image" className="text-2xl" />
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {/* Text Alignment Buttons */}
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("left").run()
                    }
                    className={`p-2 rounded ${
                      editor?.isActive({ textAlign: "left" })
                        ? "bg-orange-500 text-white"
                        : "bg-white"
                    }`}
                  >
                    <Icon icon="iconoir:align-left" className="text-lg" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("center").run()
                    }
                    className={`p-2 rounded ${
                      editor?.isActive({ textAlign: "center" })
                        ? "bg-orange-500 text-white"
                        : "bg-white"
                    }`}
                  >
                    <Icon icon="iconoir:align-center" className="text-lg" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("right").run()
                    }
                    className={`p-2 rounded ${
                      editor?.isActive({ textAlign: "right" })
                        ? "bg-orange-500 text-white"
                        : "bg-white"
                    }`}
                  >
                    <Icon icon="iconoir:align-right" className="text-lg" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor?.chain().focus().setTextAlign("justify").run()
                    }
                    className={`p-2 rounded ${
                      editor?.isActive({ textAlign: "justify" })
                        ? "bg-orange-500 text-white"
                        : "bg-white"
                    }`}
                  >
                    <Icon icon="iconoir:align-justify" className="text-lg" />
                  </button>
                </div>

                {/* Heading Buttons */}
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  className={`p-2 rounded ${
                    editor.isActive("heading", { level: 1 })
                      ? "bg-orange-500 text-white"
                      : "bg-white"
                  }`}
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={`p-2 rounded ${
                    editor.isActive("heading", { level: 2 })
                      ? "bg-orange-500 text-white"
                      : "bg-white"
                  }`}
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  className={`p-2 rounded ${
                    editor.isActive("heading", { level: 3 })
                      ? "bg-orange-500 text-white"
                      : "bg-white"
                  }`}
                >
                  H3
                </button>

                {/* List Buttons */}
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={`p-2 rounded ${
                    editor.isActive("bulletList")
                      ? "bg-orange-500 text-white"
                      : "bg-white"
                  }`}
                >
                  <Icon icon="mdi:format-list-bulleted" className="text-lg" />
                </button>

                {/* Undo Button */}
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().undo().run()}
                  className="p-2 rounded bg-white"
                >
                  <Icon icon="mdi:undo" className="text-lg" />
                </button>

                {/* Redo Button */}
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().redo().run()}
                  className="p-2 rounded bg-white"
                >
                  <Icon icon="mdi:redo" className="text-lg" />
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">เนื้อหา</label>
            <div className="border border-gray-300 rounded-md">
              {/* Editor */}
              <div className="p-4">
                <EditorContent
                  editor={editor}
                  className="prose max-w-none focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Tags add */}
          <div>
            <label htmlFor="tags" className="block text-lg font-medium mb-2">
              เพิ่มแท็ก
            </label>
            <Select
              id="tags"
              options={tagOptions}
              className="basic-single-select"
              classNamePrefix="select"
              onChange={handleTagChange}
              placeholder="เพิ่มแท็ก"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {tagselect.map((tag) => (
                <span
                  key={tag}
                  className="bg-orange-200 text-orange-400 px-3 py-1 rounded-full font-bold text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-1 text-red-500"
                    onClick={() => handleTagRemove(tag)}
                    style={{
                      fontSize: "2rem",
                      lineHeight: "1rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            {errors.tags && (
              <p className="text-red-500 mt-2 text-sm">{errors.tags.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition duration-200 "
            >
              แก้ไขบล็อก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogPost;
