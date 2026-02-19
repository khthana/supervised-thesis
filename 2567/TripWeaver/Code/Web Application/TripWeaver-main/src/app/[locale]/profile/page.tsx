"use client";
import React, { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import CheckboxElement from "../interface/checkboxElement";
import TagCheckBoxComponent from "../components/TagCheckBoxComponent";
import axios from "axios";
import { useQuery } from "react-query";
import { fetchUserBlog, fetchUserTrip, fetchUserFavoritePlace, fetchUserData } from "@/utils/apiService";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import PaginationComponent from "../components/PaginationComponent";
import BlogCard from "../components/BlogCard";
import ProfileTripCard from "../components/ProfileTripCard";
import FavoritePlaceCard from "../components/FavoritePlaceCard";
import { set } from "mongoose";
import Swal from "sweetalert2";
import RequestModal from "../components/modals/RequestModal";
import PersonaForm from "../components/PersonaForm";
import EditProfileModal from "../components/modals/EditProfileModal";

interface BlogData {
  _id: string;
  blogName: string;
  blogImage: string;
}

interface TripData {
  _id: string;
  tripName: string;
  tripImage: string;
}

interface FavoritePlaceData {
  _id: string;
  name: string;
  imgPath: string;
}

const Sidebar = ({
  setSelectedContent,
}: {
  setSelectedContent: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="sidebar w-20 h-[calc(100vh-68px)] bg-gray-200 text-gray-800 flex flex-col p-4 transition-all duration-300 z-50">
      <ul className="space-y-2 h-screen">
        <li className="relative group">
          <div
            onClick={() => setSelectedContent("profile")}
            className="cursor-pointer hover:bg-gray-700 hover:text-white p-2 rounded flex items-center justify-center"
          >
            <Icon
              icon="mdi:account"
              width="24"
              height="24"
              className="flex-shrink-0"
            />
            <span className="kanit text-lg ml-6 transition-opacity duration-300 absolute left-full whitespace-nowrap bg-orange-200 p-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:bg-gray-700">
              โปรไฟล์
            </span>
          </div>
        </li>
        <li className="relative group">
          <div
            onClick={() => setSelectedContent("trip")}
            className="cursor-pointer hover:bg-gray-700 hover:text-white p-2 rounded flex items-center justify-center"
          >
            <Icon
              icon="material-symbols:trip"
              width="24"
              height="24"
              className="flex-shrink-0"
            />
            <span className="kanit text-lg ml-6 transition-opacity duration-300 absolute left-full whitespace-nowrap bg-orange-200 p-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:bg-gray-700">
              ทริปของฉัน
            </span>
          </div>
        </li>
        <li className="relative group">
          <div
            onClick={() => setSelectedContent("blog")}
            className="cursor-pointer hover:bg-gray-700 hover:text-white p-2 rounded flex items-center justify-center"
          >
            <Icon
              icon="mdi:blog"
              width="24"
              height="24"
              className="flex-shrink-0"
            />
            <span className="kanit text-lg ml-6 transition-opacity duration-300 absolute left-full whitespace-nowrap bg-orange-200 p-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:bg-gray-700">
              บล็อกของฉัน
            </span>
          </div>
        </li>
        <li className="relative group">
          <div
            onClick={() => setSelectedContent("favorite")}
            className="cursor-pointer hover:bg-gray-700 hover:text-white p-2 rounded flex items-center justify-center"
          >
            <Icon
              icon="mdi:heart"
              width="24"
              height="24"
              className="flex-shrink-0"
            />
            <span className="kanit text-lg ml-6 transition-opacity duration-300 absolute left-full whitespace-nowrap bg-orange-200 p-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:bg-gray-700">
              สถานที่ที่ชื่นชอบ
            </span>
          </div>
        </li>

        <li className="relative group">
          <div
            onClick={() => setSelectedContent("places")}
            className="cursor-pointer hover:bg-gray-700 hover:text-white p-2 rounded flex items-center justify-center"
          >
            <Icon
              icon="ic:baseline-place"
              width="24"
              height="24"
              className="flex-shrink-0"
            />
            <span className="kanit text-lg ml-6 transition-opacity duration-300 absolute left-full whitespace-nowrap bg-orange-200 p-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:bg-gray-700">
              คำขอเพิ่ม/แก้ไขสถานที่
            </span>
          </div>
        </li>
        <li className="relative group">
          <div
            onClick={() => setSelectedContent("interests")}
            className="cursor-pointer hover:bg-gray-700 hover:text-white p-2 rounded flex items-center justify-center"
          >
            <Icon
              icon="typcn:point-of-interest-outline"
              width="24"
              height="24"
              className="flex-shrink-0"
            />
            <span className="kanit text-lg ml-6 transition-opacity duration-300 absolute left-full whitespace-nowrap bg-orange-200 p-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:bg-gray-700">
              แก้ไขความสนใจ
            </span>
          </div>
        </li>
      </ul>
    </div>
  );
};


const ProfileContent = ({ setSelectedContent }: { setSelectedContent: (content: string) => void }) => {
  const { data: session, update } = useSession();
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userData, setUserData] = useState<{
    id: string;
    imgPath?: string;
    displayName?: string;
    email?: string;
  }>({
    id: "",
    imgPath: "",
    displayName: "",
    email: "",
  });
  
  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/user/getUser/${session.user.id}`)
        .then((res) => res.json())
        .then((user) => {
          console.log(user)
          setUserData(user)
          setDisplayName(user.displayName || session?.user?.name);
          setEmail(user.email || session?.user?.email);
        })
        .catch((error) => console.error("Error fetching profile data:", error));
    }
  }, [session]);

  const handleProfileUpdated = (updatedData: any) => {
    fetch(`/api/user/getUser/${session?.user?.id}`)
      .then((res) => res.json())
      .then(async (user) => {
        setUserData(user);
        //setProfileImage(user.imgPath);
        setDisplayName(user.displayName || session?.user?.name);
        setEmail(user.email || session?.user?.email);
        await update({
          user: {
            name: user.displayName,
            email: user.email,
            //image: user.imgPath,
          },
        });
      })
      .catch((error) => console.error("Error refetching updated profile data:", error));
  };

  useEffect(() => {
    if (session?.user?.id) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const resRecent = await fetch(`/api/user/getRecentProfile/${session?.user?.id}`);
          if (!resRecent.ok) throw new Error("Failed to fetch profile data");
          const recentData = await resRecent.json();
          setRecentTrips(recentData.recentTrips || []);
          setRecentBlogs(recentData.recentBlogs || []);

          const resUser = await fetch(`/api/user/getUser/${session?.user?.id}`);
          if (!resUser.ok) throw new Error("Failed to fetch user data");
          const userData = await resUser.json();
          setUserPoints(userData.points || 0);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [session?.user?.id]);

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Prepare form data for image upload with profileID included
      const uploadFormData = new FormData();
      uploadFormData.append("imgFile", file);
      uploadFormData.append("profileID", session?.user?.id || "");

      // Upload the image using our API endpoint for profile images
      const uploadRes = await fetch("/api/user/uploadProfilePic", {
        method: "POST",
        body: uploadFormData,
      });
      const uploadData = await uploadRes.json();

      if (uploadRes.ok && uploadData.message === "Update profile image success") {
        const newImageUrl = uploadData.uploadedImageUrl;
        if (!newImageUrl) {
          throw new Error("Upload succeeded but no image URL was returned.");
        }
        // Update local state and refresh profile data
        setProfileImage(newImageUrl);
        await update({
          user: {
            image: newImageUrl,
          },
        });
      } else {
        console.error("Image upload failed", uploadData);
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };

  if (loading) return <p></p>;
  if (error) return <p className="text-red-500">ไม่พบข้อมูล</p>;

  return (
    <div className="flex">
      {/* Information */}
      <div className="flex flex-col items-center kanit border-2 border-gray-200 rounded-md mt-8 ml-8 gap-y-2 p-8 shadow-lg">
        <div className="mt-3 relative">
          <img
            src={session?.user?.image || "/images/no-img.png"}
            alt={session?.user?.name || "User"}
            width={256}
            height={256}
            className="rounded-full w-[256px] h-[256px]"
          />
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleProfilePicChange}
          />
          {/* Overlay button to change profile picture */}
          <button
            className="absolute bottom-0 right-0 bg-[#EE6527] text-white rounded-full p-2 hover:bg-[#DDDDDD] hover:text-black"
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon icon="mdi:pencil" />
          </button>
        </div>
        <div className="flex kanit font-bold text-2xl">{displayName}</div>
        <div className="flex kanit text-xl">{email}</div>
        <div className="flex mt-2 gap-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="kanit bg-[#EE6527] hover:bg-[#DDDDDD] hover:text-black text-white px-4 rounded-full font-regular h-8 flex items-center space-x-2"
          >
            <Icon icon="mdi:pencil" />
            <span>แก้ไข</span>
          </button>
        </div>
        <div className="flex kanit text-xl mt-4">
          Weaver Point : {userPoints ?? "ไม่พบข้อมูล"}
        </div>
      </div>

      {/* Activity */}
      <div className="flex flex-col">
        {/* Recent Trips */}
        <div className="flex flex-col mt-8 ml-2 p-2 h-fit">
          <div className="flex kanit text-2xl font-bold">ทริปล่าสุด</div>
          <div className="flex mt-2">
            {recentTrips.map((trip, index) => (
              <a key={index} href={`/plantrip/summary/${trip._id}`} className="m-3 p-3 shadow-md hover:shadow-lg hover:shadow-orange-500/50 duration-200">
                <Image src={trip.tripImage || "/images/no-img.png"} alt={trip.tripName} width={256} height={256} className="h-36 rounded-lg" unoptimized />
                <div className="flex kanit text-lg mt-3">{trip.tripName}</div>
              </a>
            ))}
            <button
              onClick={() => setSelectedContent("trip")}
              className="m-3 p-3 shadow-md hover:shadow-lg hover:shadow-orange-500/50 duration-200"
            >
              <div className="flex kanit justify-center items-center bg-gray-300 text-2xl w-36 h-36 rounded-lg hover:text-4xl duration-200">
                <Icon icon="grommet-icons:form-next" />
              </div>
              <div className="flex kanit text-lg mt-3">ดูเพิ่มเติม</div>
            </button>
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="flex flex-col mt-8 ml-2 p-2 h-fit">
          <div className="flex kanit text-2xl font-bold">บล็อกล่าสุด</div>
          <div className="flex mt-2">
            {recentBlogs.map((blog, index) => (
              <a key={index} href={`/blog/post/${blog._id}`} className="m-3 p-3 shadow-md hover:shadow-lg hover:shadow-orange-500/50 duration-200">
                <Image src={blog.blogImage || "/images/no-img.png"} alt={blog.blogName} width={256} height={256} className="h-36 rounded-lg" unoptimized />
                <div className="flex kanit text-lg mt-3">{blog.blogName}</div>
              </a>
            ))}
            <button
              onClick={() => setSelectedContent("blog")}
              className="m-3 p-3 shadow-md hover:shadow-lg hover:shadow-orange-500/50 duration-200"
            >
              <div className="flex kanit justify-center items-center bg-gray-300 text-2xl w-36 h-36 rounded-lg hover:text-4xl duration-200">
                <Icon icon="grommet-icons:form-next" />
              </div>
              <div className="flex kanit text-lg mt-3">ดูเพิ่มเติม</div>
            </button>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={userData}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>


  );
};

const TripContent = ({
  currentPage,
  maxPage,
  handleSelectPage,
  tripList,
  handleTripSearch,
}: {
  currentPage: number;
  maxPage: number;
  handleSelectPage: (page: number) => void;
  tripList: TripData[];
  handleTripSearch: (searchText: string) => void;
}) => (
  <div className="flex flex-col kanit rounded-md mt-8 ml-4">
    <div className="flex h-[750px]">
      <div className="flex flex-col w-[100%]">
        <div className="flex justify-between items-end ">
          <div className="flex kanit font-bold text-2xl ml-5">ทริปของฉัน</div>
          <input
            type="text"
            placeholder="ค้นหาทริปของฉัน"
            className="p-2 border-2 border-gray-200 rounded-md mr-5 ml-auto"
            onChange={(e) => handleTripSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap pl-8 h-full pt-4 ml-8 -z-9 content-start">
          {tripList.map((trip, index) => (
            <div
              className="flex w-1/4 justify-end items-end px-2 h-52 my-2"
              key={index}
            >
              <ProfileTripCard
                tripImage={trip.tripImage}
                tripID={trip._id}
                tripName={trip.tripName}
              />
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
);

const BlogContent = ({
  tagsList,
  handleTag,
  currentPage,
  maxPage,
  handleSelectPage,
  blogList,
  handleBlogSearch,
}: {
  tagsList: CheckboxElement[];
  handleTag: (tags: CheckboxElement[]) => void;
  currentPage: number;
  maxPage: number;
  handleSelectPage: (page: number) => void;
  blogList: BlogData[];
  handleBlogSearch: (searchText: string) => void;
}) => (
  <div className="flex flex-col kanit rounded-md mt-8 ml-4">
    <div className="flex">
      <div className="flex mb-5 mt-[59px] h-fit">
        <TagCheckBoxComponent
          maxHeight={610}
          element={tagsList}
          translationTagTitle={"AttractionPages.title_tags"}
          onCheckBoxSelect={handleTag}
          translationPrefix={"Tags."}
        />
      </div>
      <div className="flex flex-col w-[90%]">
        <div className="flex justify-between items-end ">
          <div className="flex kanit font-bold text-2xl ml-5">บล็อกของฉัน</div>
          <input
            type="text"
            placeholder="ค้นหาบล็อกของฉัน"
            className="p-2 border-2 border-gray-200 rounded-md mr-5 ml-auto"
            onChange={(e) => handleBlogSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap pl-8 h-full pt-4 content-start">
          {blogList.map((blog, index) => (
            <div
              className="flex w-1/4 justify-end items-end px-2 h-52 my-2"
              key={index}
            >
              <BlogCard
                blogImage={blog.blogImage}
                blogID={blog._id}
                blogName={blog.blogName}
              />
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
);

const FavoriteContent = ({
  tagsList,
  handleTag,
  currentPage,
  maxPage,
  handleSelectPage,
  favoritePlaceList,
  handleFavoriteSearch,
}: {
  tagsList: CheckboxElement[];
  handleTag: (tags: CheckboxElement[]) => void;
  currentPage: number;
  maxPage: number;
  handleSelectPage: (page: number) => void;
  favoritePlaceList: FavoritePlaceData[];
  handleFavoriteSearch: (searchText: string) => void;
}) => (
  <div className="flex flex-col kanit rounded-md mt-8 ml-4">
    <div className="flex">
      <div className="flex mb-5 mt-[59px] h-fit">
        <TagCheckBoxComponent
          maxHeight={610}
          element={tagsList}
          translationTagTitle={"AttractionPages.title_tags"}
          onCheckBoxSelect={handleTag}
          translationPrefix={"Tags."}
        />
      </div>
      <div className="flex flex-col w-[90%]">
        <div className="flex justify-between items-end">
          <div className="flex kanit font-bold text-2xl ml-5">สถานที่ที่ชื่นชอบ</div>
          <input
            type="text"
            placeholder="ค้นหาสถานที่ที่ชื่นชอบ"
            className="p-2 border-2 border-gray-200 rounded-md mr-5 ml-auto"
            onChange={(e) => handleFavoriteSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap pl-8 h-full pt-4 content-start">
          {favoritePlaceList.map((attraction, index) => (
            <div
              className="flex w-1/4 justify-end items-end px-2 my-2 h-52 "
              key={index}
            >
              <FavoritePlaceCard
                attractionImage={attraction.imgPath}
                attractionID={attraction._id}
                attractionName={attraction.name}
              />
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
);

const PlacesContent = () => {
  const { data: session } = useSession();
  const [placeRequests, setPlaceRequests] = useState<any[]>([]);
  const [placeLoading, setPlaceLoading] = useState(false);
  const [placeError, setPlaceError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const t = useTranslations();
  const [showModal, setShowModal] = useState(false);
  const [selectedPlaceType, setSelectedPlaceType] = useState<"attraction" | "restaurant" | "accommodation" | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchPlaceRequests = async () => {
        setPlaceLoading(true);
        try {
          const res = await fetch(`/api/request/getUser/${session?.user?.id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch requests");
          }
          const data = await res.json();
          setPlaceRequests(data);
        } catch (error: any) {
          setPlaceError("error.message");
        } finally {
          setPlaceLoading(false);
        }
      };
      fetchPlaceRequests();
    }
  }, [session?.user?.id]);

  const handleCancel = (id: string) => {
    Swal.fire({
      title: "ยืนยัน?",
      text: "คุณต้องการยกเลิกคำขอนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      customClass: {
        title: "kanit",
        popup: "kanit",
        confirmButton: "kanit",
        cancelButton: "kanit",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/request/delete/${id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            Swal.fire("สำเร็จ", "ยกเลิกคำขอสำเร็จ", "success");
            setPlaceRequests((prev) => prev.filter((req) => req._id !== id));
          } else {
            Swal.fire("ผิดพลาด", "ไม่สามารถยกเลิกคำขอได้", "error");
          }
        } catch (error: any) {
          Swal.fire("ผิดพลาด", "เกิดข้อผิดพลาด", "error");
        }
      }
    });
  };

  const totalPages = Math.ceil(placeRequests.length / itemsPerPage);
  const currentItems = placeRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateRequest = (placeType: "attraction" | "restaurant" | "accommodation") => {
    setSelectedPlaceType(placeType);
    setShowModal(true);
    setDropdownOpen(false);
  };


  return (
    <div className="flex flex-col ml-4 mt-8">
      <div className="flex justify-between items-center mb-4">
        <div className="kanit font-bold text-2xl">คำขอเพิ่ม/แก้ไขสถานที่</div>

        {/* Create Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="kanit bg-[#EE6527] hover:bg-[#DDDDDD] hover:text-black text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
          >
            <span>สร้างคำขอ</span>
            <Icon icon="mingcute:down-fill" />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
              <button
                className="kanit block w-full text-left px-4 py-2 hover:bg-gray-200"
                onClick={() => handleCreateRequest("attraction")}
              >
                สถานที่ท่องเที่ยว
              </button>
              <button
                className="kanit block w-full text-left px-4 py-2 hover:bg-gray-200"
                onClick={() => handleCreateRequest("accommodation")}
              >
                ที่พัก
              </button>
              <button
                className="kanit block w-full text-left px-4 py-2 hover:bg-gray-200"
                onClick={() => handleCreateRequest("restaurant")}
              >
                ร้านอาหาร
              </button>
            </div>
          )}
        </div>
      </div>

      {placeLoading ? (
        <div></div>
      ) : placeError ? (
        <div className="kanit text-xl">ไม่พบข้อมูล</div>
      ) : (
        <>
          <div className="mt-4 w-full">
            <table className="bg-white kanit w-full">
              <thead>
                <tr>
                  <th className="py-4 px-4 border-b text-left">ชื่อสถานที่</th>
                  <th className="py-4 px-4 border-b text-left">ประเภท</th>
                  <th className="py-4 px-4 border-b text-left">สถานะ</th>
                  <th className="py-4 px-4 border-b text-left">
                    วันที่ส่งคำขอ
                  </th>
                  <th className="py-4 px-4 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((request: any) => (
                  <tr key={request._id}>
                    <td className="py-4 px-4 border-b">
                      {request.details?.name || "ไม่พบข้อมูล"}
                    </td>
                    <td className="py-4 px-4 border-b">
                      {request.type === "add"
                        ? "เพิ่มสถานที่"
                        : "แก้ไขสถานที่"}
                    </td>
                    <td
                      className={`py-4 px-4 border-b ${request.status === "approved"
                        ? "text-green-500"
                        : request.status === "waiting"
                          ? "text-yellow-500"
                          : "text-red-500"
                        }`}
                    >
                      {request.status === "approved"
                        ? "สำเร็จ"
                        : request.status === "waiting"
                          ? "รอดำเนินการ"
                          : request.status === "rejected"
                            ? "ปฎิเสธคำขอ"
                            : request.status}
                    </td>
                    <td className="py-4 px-4 border-b">
                      {new Date(request.date).toLocaleDateString("th-TH")}
                    </td>
                    <td className="py-4 px-4 border-b">
                      {request.status === "waiting" && (
                        <button
                          onClick={() => handleCancel(request._id)}
                          className="kanit bg-[#EE6527] hover:bg-[#DDDDDD] hover:text-black text-white px-4 rounded-full font-regular h-8 flex items-center space-x-2"
                        >
                          <Icon icon="mdi:close" />
                          <span>ยกเลิกคำขอ</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <PaginationComponent
            currentPage={currentPage}
            maxPage={totalPages}
            onSelectPage={setCurrentPage}
          />
        </>
      )}

      {/* Request Modal */}
      {showModal && selectedPlaceType && (
        <RequestModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          placeType={selectedPlaceType}
          userId={session?.user?.id!}
          requestType="add"
          onSuccess={() => { }}
          t={t}
        />
      )}
    </div>
  );
};

export default function Profile() {
  const t = useTranslations();
  const router = useRouter();

  const [selectedProvince, setSelectedProvince] = useState("ภูเก็ต");
  const [blogList, setBlogList] = useState<BlogData[]>([]);
  const [tripList, setTripList] = useState<TripData[]>([]);
  const [favoritePlace, setFavoritePlace] = useState<string[]>([]);
  const [favoritePlaceList, setFavoritePlaceList] = useState<FavoritePlaceData[]>([]);
  const [blogCurrentPage, setBlogCurrentPage] = useState<number>(1);
  const [blogMaxPage, setBlogMaxPage] = useState<number>(1);
  const [tripCurrentPage, setTripCurrentPage] = useState<number>(1);
  const [tripMaxPage, setTripMaxPage] = useState<number>(1);
  const [favoriteCurrentPage, setFavoriteCurrentPage] = useState<number>(1);
  const [favoriteMaxPage, setFavoriteMaxPage] = useState<number>(1);
  const [blogSearchText, setBlogSearchText] = useState<string>("");
  const [tripSearchText, setTripSearchText] = useState<string>("");
  const [favoriteSearchText, setfavoriteSearchText] = useState<string>("");
  const { data: session, status } = useSession();
  const userID = session?.user?.id || "";
  const [blogTagsList, setBlogTagList] = useState<CheckboxElement[]>([]);
  const [favoriteTagsList, setFavoriteTagList] = useState<CheckboxElement[]>(
    []
  );

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const {
    data: blogDataFromFilter,
    isLoading: isblogDataFromFilterLoading,
    isError: isblogDataFromFilterError,
  } = useQuery(
    [
      "blogDataFromFilter",
      selectedProvince,
      blogTagsList,
      blogCurrentPage,
      session?.user?.id,
      blogSearchText,
    ],
    () =>
      fetchUserBlog(
        selectedProvince,
        blogTagsList
          .filter((tag) => tag.selected)
          .map((tag) => t(`Tags.${tag.name}`)),
        blogCurrentPage,
        userID,
        blogSearchText
      ),
    {
      retry: 0,
    }
  );

  const {
    data: tripDataFromFilter,
    isLoading: istripDataFromFilterLoading,
    isError: istripDataFromFilterError,
  } = useQuery(
    ["tripDataFromFilter", tripCurrentPage, session?.user?.id, tripSearchText],
    () => fetchUserTrip(tripCurrentPage, userID, tripSearchText),
    {
      retry: 0,
    }
  );

  const {
    data: favoriteDataFromFilter,
    isLoading: isfavoriteDataFromFilterLoading,
    isError: isfavoriteDataFromFilterError,
  } = useQuery(
    [
      "favoriteDataFromFilter",
      favoriteTagsList,
      favoriteCurrentPage,
      favoritePlace,
      favoriteSearchText,
    ],
    () =>
      fetchUserFavoritePlace(
        favoriteTagsList
          .filter((tag) => tag.selected)
          .map((tag) => tag.name),
        favoriteCurrentPage,
        favoritePlace,
        favoriteSearchText
      ),
    {
      retry: 0,
    }
  );

  const handleBlogTag = (tags: CheckboxElement[]) => {
    setBlogTagList(tags);
  };

  const handleFavoriteTag = (tags: CheckboxElement[]) => {
    setFavoriteTagList(tags);
  };

  const handleBlogSearch = (text: string) => {
    setBlogSearchText(text);
  };

  const handleBlogSelectPage = (page: number) => {
    if (page == blogCurrentPage) {
      return;
    }
    if (page > blogMaxPage) {
      return;
    }

    if (page <= 0) {
      return;
    }

    setBlogCurrentPage(page);
  };

  const handleTripSearch = (text: string) => {
    setTripSearchText(text);
  };

  const handleTripSelectPage = (page: number) => {
    if (page == tripCurrentPage) {
      return;
    }
    if (page > tripMaxPage) {
      return;
    }

    if (page <= 0) {
      return;
    }

    setTripCurrentPage(page);
  };

  const handleFavoriteSearch = (text: string) => {
    setfavoriteSearchText(text);
  };

  const handleFavoriteSelectPage = (page: number) => {
    if (page == favoriteCurrentPage) {
      return;
    }
    if (page > favoriteMaxPage) {
      return;
    }

    if (page <= 0) {
      return;
    }

    setFavoriteCurrentPage(page);
    console.log("favoriteCurrentPage", favoriteCurrentPage);
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

        setBlogTagList(tagWithDefaultSelected);
        setFavoriteTagList(tagWithDefaultSelected);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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

  useEffect(() => {
    if (blogDataFromFilter) {
      setBlogList(
        blogDataFromFilter.blogs.map((blog: BlogData) => ({
          _id: blog._id,
          blogName: blog.blogName,
          blogImage: blog.blogImage,
        }))
      );
      setBlogMaxPage(blogDataFromFilter.totalPages);
    }
  }, [blogDataFromFilter]);

  useEffect(() => {
    if (tripDataFromFilter) {
      setTripList(
        tripDataFromFilter.trips.map((trip: TripData) => ({
          _id: trip._id,
          tripName: trip.tripName,
          tripImage: trip.tripImage,
        }))
      );
      setTripMaxPage(tripDataFromFilter.totalPages);
    }
  }, [tripDataFromFilter]);

  useEffect(() => {
    if (userData) {
      setFavoritePlace(userData.favoritePlaces);
    }
  }, [userData]);

  useEffect(() => {
    if (favoriteDataFromFilter) {
      setFavoritePlaceList(
        favoriteDataFromFilter.attractions.map((attraction: FavoritePlaceData) => ({
          _id: attraction._id,
          name: attraction.name,
          imgPath: attraction.imgPath[0],
        }))
      );
      setFavoriteMaxPage(favoriteDataFromFilter.totalPages);
    }
  }, [favoriteDataFromFilter]);

  // useEffect(() => {
  //   console.log("blogList", blogList);
  //   console.log("favoritePlaceList", favoritePlaceList);
  // }, [blogList, favoritePlaceList]);

  const [selectedContent, setSelectedContent] = useState("profile");

  useEffect(() => {
    if (selectedContent === "interests") {
        Swal.fire({
            title: "คุณแน่ใจใช่หรือไม่ ?",
            text: "ต้องการแก้ไขความสนใจใช่มั้ย",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ใช่",
            confirmButtonColor: "#2563ea",
            cancelButtonText: "ไม่",
            customClass: {
              title: "kanit",
              popup: "kanit",
              confirmButton: "kanit",
              cancelButton: "kanit",
            },
        }).then((result) => {
            if (!result.isConfirmed) {
                setSelectedContent("profile");
            }
        });
    }
}, [selectedContent]);

  const renderContent = () => {
    switch (selectedContent) {
      case "profile":
        return <ProfileContent setSelectedContent={setSelectedContent} />;
      case "trip":
        return (
          <TripContent
            currentPage={tripCurrentPage}
            maxPage={tripMaxPage}
            handleSelectPage={handleTripSelectPage}
            tripList={tripList}
            handleTripSearch={handleTripSearch}
          />
        );
      case "blog":
        return (
          <BlogContent
            tagsList={blogTagsList}
            handleTag={handleBlogTag}
            currentPage={blogCurrentPage}
            maxPage={blogMaxPage}
            handleSelectPage={handleBlogSelectPage}
            blogList={blogList}
            handleBlogSearch={handleBlogSearch}
          />
        );
      case "favorite":
        return (
          <FavoriteContent
            tagsList={favoriteTagsList}
            handleTag={handleFavoriteTag}
            currentPage={favoriteCurrentPage}
            maxPage={favoriteMaxPage}
            handleSelectPage={handleFavoriteSelectPage}
            favoritePlaceList={favoritePlaceList}
            handleFavoriteSearch={handleFavoriteSearch}
          />
        );
      case "places":
        return <PlacesContent />;
      case "interests":
        return <PersonaForm onClose={() => setSelectedContent("profile")} />;
      default:
        return <ProfileContent setSelectedContent={setSelectedContent} />;
    }
  };

  return (
    <>
      <div className="flex flex-col bg-[#F4F4F4] w-full h-full">
        <NavBar />
        <div className="flex flex-row">
          <Sidebar setSelectedContent={setSelectedContent} />
          <div className="p-4 h-full w-full">{renderContent()}</div>
        </div>
      </div>
    </>
  );
}
