"use client";
import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";
import SearchComponent from "../components/SearchComponent";
import TagCheckBoxComponent from "../components/GuideTagCheckBoxComponent";
import { format } from "date-fns";
import CheckBoxComponent from "../components/CheckBoxComponent";
import axios from "axios";
import CheckboxElement from "../interface/checkboxElement";
import PaginationComponent from "../components/PaginationComponent";
import { useQuery } from "react-query";
import { fetchBlog } from "@/utils/apiService";
import { useSession } from "next-auth/react";
import { fetchUserData } from "@/utils/apiService";
import { redirect, useRouter } from "next/navigation";

export default function Home() {
  const t = useTranslations();
  const router = useRouter();

  interface BlogData {
    _id: string;
    blogName: string;
    blogImage: string;
    blogCreator: string;
    blogViews: number;
    blogLikes: number;
    description: string;
    tags: string[];
    createdAt: string;
  }

  const [selectedProvince, setSelectedProvince] = useState("ภูเก็ต");

  const [tagsList, setTagList] = useState<CheckboxElement[]>([]);
  const [blogList, setBlogList] = useState<BlogData[]>([]);
  const [popularBlogList, setPopularBlogList] = useState<BlogData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province);
  };

  const handleTag = (tags: CheckboxElement[]) => {
    setTagList(tags);
  };

  const handleSelectPage = (page: number) => {
    if (page == currentPage) {
      return;
    }
    if (page > maxPage) {
      return;
    }

    if (page <= 0) {
      return;
    }

    setCurrentPage(page);
  };

  const {
    data: blogDataFromFilter,
    isLoading: isblogDataFromFilterLoading,
    isError: isblogDataFromFilterError,
  } = useQuery(
    ["blogDataFromFilter", selectedProvince, tagsList, currentPage],
    () =>
      fetchBlog(
        selectedProvince,
        tagsList
          .filter((tag) => tag.selected)
          .map((tag) => t(`Tags.${tag.name}`)),
        currentPage
      ),
    {
      retry: 0,
    }
  );

  const fetchPopularBlog = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/getPopularBlog`
      );
      return response.data.blogs;
    } catch (error) {
      console.error("Error fetching popular blogs:", error);
      throw error;
    }
  };

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("th-TH", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    }).format(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/attraction/tags`
        );

        const tagWithDefaultSelected = response.data.attractionTagKeys.map(
          (tag: CheckboxElement) => ({
            name: tag,
            selected: false,
          })
        );

        setTagList(tagWithDefaultSelected);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (blogDataFromFilter) {
      console.log(blogDataFromFilter);
      setBlogList(
        blogDataFromFilter.blogs.map((blog: BlogData) => ({
          _id: blog._id,
          blogName: blog.blogName,
          blogImage: blog.blogImage,
          blogCreator: blog.blogCreator,
          blogViews: blog.blogViews,
          blogLikes: blog.blogLikes,
          description: blog.description,
          tags: blog.tags,
          createdAt: formatDate(new Date(blog.createdAt)),
        }))
      );
      setMaxPage(blogDataFromFilter.totalPages);
    }
  }, [blogDataFromFilter]);

  useEffect(() => {
    const fetchPopularBlogs = async () => {
      try {
        const blogs = await fetchPopularBlog();
        setPopularBlogList(
          blogs.map((blog: BlogData) => ({
            _id: blog._id,
            blogName: blog.blogName,
            blogImage: blog.blogImage,
            blogCreator: blog.blogCreator,
            blogViews: blog.blogViews,
            blogLikes: blog.blogLikes,
            description: blog.description,
            tags: blog.tags,
            createdAt: formatDate(new Date(blog.createdAt)),
          }))
        );
      } catch (error) {
        console.error("Error fetching popular blogs:", error);
      }
    };
    fetchPopularBlogs();
  }, []);

  return (
    <>
      <div className="flex flex-col bg-[#F4F4F4] w-full h-full">
        <NavBar />
        <div className="flex px-20 pt-10 flex-col">
          <div className="flex flex-row text-lg">
            <div className="kanit font-regular hover:text-gray-500 cursor-pointer"
              onClick={() => window.location.href = "/"}>{t("AttractionPages.infoMain")}</div>
            <div className="kanit font-bold">บล็อกการท่องเที่ยว</div>
          </div>
          <div className="flex w-full flex-row justify-end">
            <div className="flex flex-row">
              <SearchComponent
                defaultValue={selectedProvince}
                onProvinceSelect={handleProvinceSelect}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col px-20">
          <div className="flex justify-end pt-4">
            <button className="kanit bg-orange-500 text-white text-bold p-2 rounded-lg hover:bg-orange-600 duration-200" onClick={() => router.push("/th/blog/create")}>
              สร้างบล็อก
            </button>
          </div>
          <h1 className="kanit text-2xl font-bold mb-2 ">บล็อกยอดนิยม</h1>
          <div className="kanit grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {popularBlogList.slice(0, 5).map((post) => (
              <div
                key={post._id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:shadow-orange-500/50 duration-200 cursor-pointer"
                onClick={() => router.push(`/blog/post/${post._id}`)}
              >
                  <Image
                    src={post.blogImage}
                    alt={post.blogName}
                    width={300}
                    height={100}
                    unoptimized
                    className="rounded-lg w-[100%] h-[200px]"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post.tags.slice(0,4).map((tag) => (
                      <span
                        key={tag}
                        className="bg-orange-100 text-orange-400 px-3 py-1 rounded-full text-md font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold mt-4 overflow-hidden text-ellipsis whitespace-nowrap">
                    {post.blogName}
                  </h2>
                  <p className="text-gray-600 text-lg mt-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    {post.description}
                  </p>
                  <span className="text-gray-500 text-lg">
                    {post.createdAt}
                  </span>
                  <div className="flex items-center gap-x-1">
                    <Icon icon="mdi:user" className="text-gray-500 text-lg" />
                    <span className="text-gray-500 text-lg">
                      {post.blogCreator}
                    </span>
                  </div>
                  <div className="flex items-center gap-x-4">
                    <div className="flex items-center gap-x-1">
                      <Icon
                        icon="mdi:eye-outline"
                        className="text-gray-500 text-lg"
                      />
                      <span className="text-gray-500 text-lg">
                        {post.blogViews}
                      </span>
                    </div>
                    <div className="flex items-center gap-x-1">
                      <Icon
                        icon="mdi:heart-outline"
                        className="text-gray-500 text-lg"
                      />
                      <span className="text-gray-500 text-lg">
                        {post.blogLikes}
                      </span>
                    </div>
                  </div>
              </div>
            ))}
          </div>
          <div className="flex flex-row mb-4">
            <div className="flex flex-col w-[15%]">
              <div className="flex kanit text-center text-2xl font-bold mb-2 pt-8">
                {t("AttractionPages.filter")}
              </div>
              <div className="flex mb-5 ">
                <TagCheckBoxComponent
                  maxHeight={735}
                  element={tagsList}
                  translationTagTitle={"AttractionPages.title_tags"}
                  onCheckBoxSelect={handleTag}
                  translationPrefix={"Tags."}
                />
              </div>
            </div>
            <div className="flex flex-col w-[85%] ml-8">
              <h1 className="kanit text-2xl font-bold mb-2 pt-8">บล็อกใหม่</h1>
              <div className="flex flex-col gap-y-2">
                {blogList.map((post) => (
                  <div
                    key={post._id}
                    className="flex items-center cursor-pointer bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:shadow-orange-500/50 duration-200 h-[193px]"
                    onClick={() => router.push(`/blog/post/${post._id}`)}
                  >
                      <div className="flex">
                        <Image
                          src={post.blogImage}
                          alt={post.blogName}
                          width={240}
                          height={100}
                          unoptimized
                          className="rounded-lg h-[100%] my-auto"
                        />
                        <div className="kanit ml-4 flex flex-col justify-between">
                          <div>
                            <h2 className="text-2xl font-bold">
                              {post.blogName}
                            </h2>
                            <div className="flex gap-2 mt-2">
                              {post.tags.slice(0,5).map((tag) => (
                                <span
                                  key={tag}
                                  className="bg-orange-100 text-orange-400 px-3 py-1 rounded-full text-md font-bold"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <p className="text-gray-600 mt-2 text-md">
                              {post.description}
                            </p>
                          </div>
                          <div className="flex mt-2 flex-col text-md">
                            <div className="flex items-center gap-x-1">
                              <Icon
                                icon="mdi:user"
                                className="text-gray-500"
                              />
                              <span className="text-gray-500">
                                {post.blogCreator}
                              </span>
                            </div>
                            <div className="flex items-center gap-x-1">
                              <span className="text-gray-500">
                                {post.createdAt}
                              </span>
                              <div className="flex items-center gap-x-4 ml-4">
                                <div className="flex items-center gap-x-1">
                                  <Icon
                                    icon="mdi:eye-outline"
                                    className="text-gray-500"
                                  />
                                  <span className="text-gray-500">
                                    {post.blogViews}
                                  </span>
                                </div>
                                <div className="flex items-center gap-x-1">
                                  <Icon
                                    icon="mdi:heart-outline"
                                    className="text-gray-500"
                                  />
                                  <span className="text-gray-500">
                                    {post.blogLikes}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end w-full h-full mb-5 px-4">
            <PaginationComponent
              currentPage={currentPage}
              maxPage={maxPage}
              onSelectPage={handleSelectPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
