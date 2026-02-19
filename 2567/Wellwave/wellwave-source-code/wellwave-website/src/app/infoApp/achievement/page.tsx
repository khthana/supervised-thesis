"use client";
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";

import AchievementPopup from './widget/addAchievement';

interface Reward {
  EXP: number;
  GEMS: number;
}

interface Level {
  ACH_ID: string;
  LEVEL: number;
  ICON_URL: string;
  TARGET_VALUE: number;
  REWARDS: Reward;
}

interface Achievement {
  ACH_ID: string;
  TITLE: string;
  DESCRIPTION: string;
  ACHIEVEMENTS_TYPE: string;
  levels: Level[];
}
interface MetaData {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
interface AchievementsData {
  data: Achievement[]; meta: MetaData;
}
const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true); // ตั้งค่าการโหลด
      try {

        const token = localStorage.getItem("accessToken");
        console.log("Token:", token); // ตรวจสอบ token ว่าได้มาหรือไม่
        if (!token) {
          setError("No token found, please login.");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://ce67-16.cloud.ce.kmitl.ac.th/api/v1/achievement`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });


        // เช็คว่า response เป็น 200 หรือไม่
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: AchievementsData = await response.json(); // ใช้ Interface ที่ประกาศไว้
        console.log("Fetched data:", data); // เช็คข้อมูลที่ได้รับจาก API

        if (response.ok) {
          setAchievements(data.data); // ตั้งค่า achievements
          setPagination({
            total: data.meta.total,
            totalPages: data.meta.totalPages
          });

        } else {
          setError('No achievements data found');
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
        setError('Failed to fetch achievements');
      } finally {
        setLoading(false); // ปิดสถานะโหลดในทุกกรณี
      }
    };

    fetchAchievements();
  }, []);



  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  // const [duration, setDuration] = useState(3);

  // const [duration, setDuration] = useState(1);

  // ฟังก์ชันเพิ่มระดับใหม่


  // ฟังก์ชันลบระดับ

  const Pagination = () => {
    const startItem = pagination.total > 0 ? (currentPage - 1) * 10 + 1 : 0;
    const endItem = Math.min(currentPage * 10, pagination.total);

    return (
      <footer className="fixed justify-between w-5/6 bottom-12 mb-2">
        <div className="flex justify-between items-center w-full">
          <p className="text-gray-600 text-sm">
            แสดง {startItem} - {endItem} จาก {pagination.total} รายการ
          </p>
          <div className="flex space-x-2 pr-4">
            {Array.from({ length: pagination.totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`py-1 px-3 rounded-lg transition-colors duration-200
                  ${currentPage === index + 1
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </footer>
    );
  };
  // ฟังก์ชันอัพเดต duration สำหรับระดับต่างๆ


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div className="top-0 px-28 py-6 p-6 bg-gray-100 min-h-screen font-sans">


      <div className="rounded-lg p-6 mt-16 h-[600px] bg-white  shadow-md">
        <p
          className="text-gray-600 text-sm pb-3 flex items-center cursor-pointer group"
          onClick={() => router.back()} // ย้อนกลับ
        >
          <span className="hover:underline inline-flex items-center group-hover:text-black">
            เพิ่มข้อมูล</span>
          <span style={{ margin: "0 8px" }}> &gt; </span>
          <Image
            src="/asset/achieve.svg"
            alt="article"
            width={16}
            height={16}
            className="mr-1"
          />
          <span className="text-black">ความสำเร็จ</span>

        </p>


        <div className="flex justify-between items-center mb-6" ><h1 className="text-xl font-bold text-gray-800">ความสำเร็จ ทั้งหมด 10 ความสำเร็จ</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setIsOpen(true)}>
            + เพิ่มความสำเร็จ
          </button>
          <AchievementPopup
            isOpen={isOpen}
            setIsOpen={setIsOpen}




          />
        </div>

        <div className="relative mt-4 mb-3">
          <input
            type="text"
            placeholder="ค้นหา"
            className="rounded-lg bg-gray-100 px-10 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto scrollbar-custom pr-2">
          {achievements && achievements.length > 0 ? (
            achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white rounded-md shadow p-4 flex items-center hover:shadow-lg transition border border-gray-300"
              >
                <div className="w-16 h-16 bg-red-200 rounded-md flex-shrink-0"></div>
                <div className="ml-4 flex-grow">
                  <h2 className="text-lg font-bold">{achievement.TITLE}</h2>

                  <p className="text-gray-600">
                    เงื่อนไข: <span > {achievement.DESCRIPTION}</span>
                  </p>

                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  ...
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600">ไม่มีข้อมูล achievement</p>
          )}
        </div>




        <Pagination />


      </div>
    </div>


  );
};

export default Achievements;
