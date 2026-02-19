"use client";
import { Task } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MissionPopup from "./widget/missionPopup";
interface Task {
  title: string;
  habitCategory: string;
  reward: {
    exp: number;
    gem: number;
  };
  completeRate: number;
  userCompletionCount: {
    completed: number;
    total: number;
  };
  moodFeedback: string;
  type: string;
  image_url: string;
}

// อินเตอร์เฟซสำหรับข้อมูลที่แสดงในตาราง
interface DisplayTask {
  name: string;
  category: string;
  reward: number;
  successRate: string;
  participants: string;
  status: string;
}




const TaskPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // กำหนดให้ popup เปิด/ปิด
  const [amount, setAmount] = useState(1); // เก็บจำนวน
  const [duration, setDuration] = useState(1); // เก็บระยะเวลา
  const [apiData, setApiData] = useState<Task[]>([]);
  const [sortedData, setSortedData] = useState<DisplayTask[]>([]);
  const [sortConfig, setSortConfig] = useState<{ column: keyof DisplayTask | null; direction: number }>({
    column: null,
    direction: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        console.log("Token:", token); // ตรวจสอบ token ว่าได้มาหรือไม่


        const response = await fetch(`http://ce67-16.cloud.ce.kmitl.ac.th/api/v1/habit/mission-stats`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }); const result = await response.json();

        console.log("API Data:", result.data); // ตรวจสอบข้อมูลที่ได้รับจาก API

        // เก็บข้อมูลดิบจาก API
        setApiData(result.data);

        // แปลงข้อมูลที่ได้รับให้อยู่ในรูปแบบที่ตรงกับ DisplayTask Interface
        const formattedData = result.data.map((item: Task) => ({
          name: item.title,
          category: item.habitCategory,
          reward: item.reward.gem || item.reward.exp, // รวม gem และ exp เป็นตัวเลขเดียว (หรือจะแสดงแยกก็ได้)
          successRate: item.completeRate, // แปลงเป็นเปอร์เซ็นต์
          participants: `${item.userCompletionCount.completed}/${item.userCompletionCount.total}`,
          status: item.moodFeedback || "-" // ใช้ค่าเริ่มต้นเป็น "-" ถ้าไม่มีข้อมูล
        }));

        setSortedData(formattedData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);
  const handleSort = (column: keyof DisplayTask) => {
    const feelingsOrder = ['กดดัน', 'ท้อแท้', 'เฉยๆ', 'พอใจ', 'สดใส', '-'];

    setSortConfig((prev) => {
      const newDirection = prev.column === column ? (prev.direction + 1) % 3 : 1;
      const sorted = [...sortedData].sort((a, b) => {
        if (newDirection === 0) return 0;
        if (column === "reward") {
          return newDirection === 1
            ? (a[column] as number) - (b[column] as number)
            : (b[column] as number) - (a[column] as number);
        }

        if (column === "status") {
          const indexA = feelingsOrder.indexOf(a[column]);
          const indexB = feelingsOrder.indexOf(b[column]);
          return newDirection === 1 ? indexA - indexB : indexB - indexA;
        }

        // สำหรับ successRate ที่เป็น string แต่มีเครื่องหมาย %
        if (column === "successRate") {
          const numA = parseFloat(a[column].replace('%', ''));
          const numB = parseFloat(b[column].replace('%', ''));
          return newDirection === 1 ? numA - numB : numB - numA;
        }

        return newDirection === 1
          ? String(a[column]).localeCompare(String(b[column]), 'th')
          : String(b[column]).localeCompare(String(a[column]), 'th');
      });

      setSortedData(sorted);
      return { column, direction: newDirection };
    });
  };

  const getIcon = (column: keyof DisplayTask) => {
    if (sortConfig.column !== column) return <FaSort className="inline" />;
    if (sortConfig.direction === 1) return <FaSortUp className="inline" />;
    if (sortConfig.direction === 2) return <FaSortDown className="inline" />;
    return <FaSort className="inline" />;
  };




  return (

    <div className="top-0 px-28 py-6 bg-gray-100 min-h-screen font-sans">
      <div className="bg-white shadow rounded-lg p-6 mt-16 h-[600px] flex flex-col">
        <p
          className="text-gray-600 text-sm pb-3 flex items-center cursor-pointer group"
          onClick={() => router.back()} // ย้อนกลับ
        >
          <span className="hover:underline inline-flex items-center group-hover:text-black">
            เพิ่มข้อมูล</span>
          <span style={{ margin: "0 8px" }}> &gt; </span>
          <Image
            src="/asset/fire.svg"
            alt="fire"
            width={16}
            height={16}
            className="mr-1"
          />
          <span className="text-black">ภารกิจ</span>

        </p>



        <div className="flex justify-between items-center mb-6" ><h1 className="text-xl font-bold text-gray-800">ข้อมูลภารกิจ ทั้งหมด {sortedData.length} รายการ</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setIsPopupOpen(true)}>
            + เพิ่มภารกิจ
          </button>
          <MissionPopup
            isOpen={isPopupOpen}
            setIsOpen={setIsPopupOpen}
            amount={amount}
            setAmount={setAmount}
            duration={duration}
            setDuration={setDuration}
          />

        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="ค้นหา"
            className="rounded-lg bg-gray-100 px-10 py-2 w-full max-w-full focus:outline-none focus:ring focus:ring-blue-300"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </span>
        </div>

        <div className="overflow-auto scrollbar-custom flex-grow mt-4 max-h-[400px]">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white">
              <tr className="text-left text-gray-600">
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("name")}>
                  ชื่อภารกิจ {getIcon("name")}
                </th>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("category")}>
                  หมวดหมู่ {getIcon("category")}
                </th>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("reward")}>
                  ของรางวัล {getIcon("reward")}
                </th>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("successRate")}>
                  อัตราความสำเร็จ {getIcon("successRate")}
                </th>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("participants")}>
                  จำนวนคนทำสำเร็จ {getIcon("participants")}
                </th>
                <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("status")}>
                  ความรู้สึก {getIcon("status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((task, index) => (
                <tr key={index} className="text-sm text-gray-700">
                  <td className="py-2 px-4 border-b">
                    <div className="flex items-center space-x-3">

                      <span>{task.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">{task.category}</td>
                  <td className="py-2 px-4 border-b">
                    {apiData[index] && (
                      <div className="flex items-center">
                        {apiData[index].reward.gem > 0 && apiData[index].reward.exp > 0 ? (
                          <>
                            <Image
                              src="/asset/Gem.svg"
                              alt="Gem"
                              width={14}
                              height={14}
                              className="mr-1"
                            />
                            <span>{apiData[index].reward.gem}</span>
                            <Image
                              src="/asset/EXP.svg"
                              alt="EXP"
                              width={14}
                              height={14}
                              className="mr-1 ml-2"
                            />
                            <span>{apiData[index].reward.exp}</span>
                          </>
                        ) : apiData[index].reward.gem > 0 ? (
                          <>
                            <Image
                              src="/asset/Gem.svg"
                              alt="Gem"
                              width={14}
                              height={14}
                              className="mr-1"
                            />
                            <span>{apiData[index].reward.gem}</span>
                          </>
                        ) : apiData[index].reward.exp > 0 ? (
                          <>
                            <Image
                              src="/asset/EXP.svg"
                              alt="EXP"
                              width={14}
                              height={14}
                              className="mr-1"
                            />
                            <span>{apiData[index].reward.exp}</span>
                          </>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                    )}

                  </td>
                  <td className="py-2 px-14 border-b">{task.successRate}%</td>
                  <td className="py-2 px-14 border-b">{task.participants}</td>
                  <td className="py-2 px-4 border-b  pr-4">
                    <span
                      className={`py-0.5 px-3 rounded text-sm 
                      ${task.status === "กดดัน" ? "bg-red-100 text-red-600 border border-red-600" : ""}
                      ${task.status === "ท้อแท้" ? "bg-orange-100 text-orange-600 border border-orange-600" : ""}
                      ${task.status === "เฉยๆ" ? "bg-yellow-100 text-yellow-600 border border-yellow-600" : ""}
                      ${task.status === "พอใจ" ? "bg-green-100 text-green-500 border border-green-500" : ""}
                      ${task.status === "สดใส" ? "bg-green-200 text-green-700 border border-green-700" : ""}
                      ${task.status === "-" ? "text-center" : "border"} 
                    `}

                    >
                      {task.status}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div className="pt-8 flex justify-between items-center mt-auto">
          <p className="text-gray-600 text-sm">แสดง 1-10 จาก {sortedData.length} รายการ</p>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <button key={page} className={`py-1 px-3 rounded-lg ${page === 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                {page}
              </button>
            ))}
            <button className="py-1 px-3 bg-gray-200 text-gray-600 rounded-lg">...</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
