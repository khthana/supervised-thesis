"use client";
import { useParams, redirect, useRouter } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";
import NavBar from "@/app/[locale]/components/NavBar";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useQuery } from "react-query";
import { fetchUserData, fetchBlogData, updateBlogLike } from "../../../../../utils/apiService";
import { format } from "date-fns";
import "../../toolbar.css";

export default function BlogPost() {
  const { id } = useParams();
  const blogID = id as string;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blogCreateAt, setBlogCreateAt] = useState("");
  const [isLikeBlog, setIsLikeBlog] = useState<boolean>(false);
  const [blogCreator, setBlogCreator] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [CreatorImg, setCreatorImg] = useState("https://i.ibb.co/fdqgHhPV/no-img.png");
  const t = useTranslations();

  interface BlogData {
    blogName: string;
    blogImage: string;
    blogCreator: {
      displayName: string;
      imgPath: string;
      _id: string;
    };
    description: string;
    content: string;
    createdAt: string;
    tags: string[];
    blogViews: number;
    blogLikes: number;
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

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const updateBlogView = async () => {
    const viewedBlogs = JSON.parse(localStorage.getItem("viewedBlogs") || "[]");

    if (!viewedBlogs.includes(id)) {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/blog/updateView`, {
          blogId: id,
        });
        viewedBlogs.push(id);
        localStorage.setItem("viewedBlogs", JSON.stringify(viewedBlogs));
      } catch (error) {
        console.error("Error updating blog view count:", error);
      }
    }
  };

  const handleClickLike = async () => {
    if (userData?.likeBlogList?.includes(blogID)) {
      await updateBlogLike(blogID, session?.user?.id!, "DEC");
      setIsLikeBlog(false);
    } else {
      await updateBlogLike(blogID, session?.user?.id!, "ADD");
      setIsLikeBlog(true);
    }
    refetchBlogData();
    refetchUserData();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("th-TH", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    }).format(date);
  };

  useEffect(() => {
    if (blogData && userData) {
      setBlogCreateAt(formatDate(new Date(blogData.createdAt)));
      setBlogCreator(blogData.blogCreator.displayName);
      if (blogData.blogCreator.imgPath) {
        setCreatorImg(blogData.blogCreator.imgPath);
      }
      updateBlogView();
      const isLiked = userData?.likeBlogList?.includes(blogID) ?? false;
      setIsLikeBlog(isLiked);
      if (session?.user?.id === blogData.blogCreator._id) {
        setIsCreator(true);
      }
    }
  }, [blogData, userData]);

  if (!blogData || !userData) {
    return ;
  }

  return (
    <div className="flex flex-col bg-[#F4F4F4] w-full h-full kanit">
      <NavBar />
      <div className="flex px-20 mt-10 flex-col">
        <div className="flex flex-row text-lg">
          <div className="kanit font-regular hover:text-gray-500 cursor-pointer"
              onClick={() => window.location.href = "/"}>{t("AttractionPages.infoMain")}</div>
          <div className="kanit font-regular hover:text-gray-500 cursor-pointer"
              onClick={() => window.location.href = "/blog"}>บล็อกการท่องเที่ยว {">"}</div>
          <div className="kanit font-bold pl-1">{blogData.blogName}</div>
        </div>
      </div>
      <div className="container mx-auto w-[75%] bg-white rounded-lg m-4">
        <div className="flex flex-col p-4">
          <div className="text-3xl font-bold pt-4">{blogData.blogName}</div>
          <div className="flex flex-row space-x-2 pt-4">
            {blogData.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-orange-200 text-orange-400 px-3 py-1 rounded-full font-bold text-sm flex items-center"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center pt-2">
            <img
              src={CreatorImg}
              alt="Creator"
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div className="w-full">
              <div className="text-md pt-2">{blogCreator}</div>
              <div className="text-md flex items-center">
                {blogCreateAt}
                <Icon
                  icon="mdi:eye-outline"
                  className="text-gray-500 ml-8 mr-1 text-lg"
                />
                {blogData.blogViews}
                <Icon
                  icon="mdi:heart-outline"
                  className="text-gray-500 ml-4 mr-1 text-lg"
                />
                {blogData.blogLikes}
                <div className="flex items-center ml-auto">
                  {isCreator && (
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded-lg mr-2 flex items-center transition duration-300 ease-in-out"
                      onClick={() => router.push(`/blog/edit/${blogID}`)}
                    >
                      แก้ไขบล็อก
                    </button>
                  )}
                  {isLikeBlog ? (
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded-lg mr-2 flex items-center transition duration-300 ease-in-out"
                      onClick={handleClickLike}
                    >
                      <Icon
                        icon="mdi:heart"
                        className="text-white text-lg mt-1 mr-2"
                      />
                      เลิกถูกใจบล็อก
                    </button>
                  ) : (
                    <button
                      className="bg-orange-500 text-white px-4 py-1 rounded-lg ml-auto mr-2 flex items-center transition duration-300 ease-in-out"
                      onClick={handleClickLike}
                    >
                      <Icon
                        icon="mdi:heart-outline"
                        className="text-white text-lg mt-1 mr-2"
                      />
                      ถูกใจบล็อก
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 pb-4 text-lg">{blogData.description}</div>
          <div>
            <img
              src={blogData.blogImage}
              alt="blog"
              className="w-auto h-[500px] object-cover rounded-lg mx-auto"
            />
          </div>
          <div
            className="pt-4 text-lg tiptap"
            dangerouslySetInnerHTML={{ __html: blogData.content }}
          />
        </div>
      </div>
    </div>
  );
}