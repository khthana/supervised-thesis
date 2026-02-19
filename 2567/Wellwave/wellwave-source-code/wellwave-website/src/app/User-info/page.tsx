"use client";

import React, { useState, useEffect } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface RiskAssessment {
  DIABETES: number;
  HYPERTENSION: number;
  DYSLIPIDEMIA: number;
  OBESITY: number;
}

interface LoginStats {
  LOGIN_STREAK: number;
  LASTED_LOGIN: string | null;
  STREAK_START: string | null;
}

interface UserApiResponse {
  UID: number;
  USERNAME: string | null;
  EMAIL: string;
  RISK_ASSESSMENT: RiskAssessment | null;
  COMPLETE_RATE: number;
  LOGIN_STATS: LoginStats;
}

const UserList = () => {
  const [users, setUsers] = useState<UserApiResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const router = useRouter();
  // สำหรับจัดเรียง
  const [sortState, setSortState] = useState({ column: "UID", direction: 1 }); // 1 = ขึ้น, 2 = ลง

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch("http://ce67-16.cloud.ce.kmitl.ac.th/api/v1/users/lists?limit=100", {
          method: "GET",
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (response.status === 401) {
          throw new Error("Unauthorized - กรุณาเข้าสู่ระบบใหม่");
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setUsers(result.data ?? []);
        setTotalUsers(result.meta?.total || 0);
      } catch (err) {
        setError("Error fetching users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ฟังก์ชันสำหรับการจัดเรียง
  const handleSort = (column: keyof UserApiResponse | "LASTED_LOGIN" | "LOGIN_STREAK") => {
    if (!users) return; // ตรวจสอบว่ามี users อยู่จริงก่อน

    const direction = sortState.column === column ? (sortState.direction === 1 ? 2 : 1) : 1;
    setSortState({ column, direction });

    const sortedUsers = [...users].sort((a, b) => {
      let valueA: number | Date = 0;
      let valueB: number | Date = 0;

      if (column === "UID") {
        valueA = a.UID;
        valueB = b.UID;
      } else if (column === "COMPLETE_RATE") {
        valueA = a.COMPLETE_RATE;
        valueB = b.COMPLETE_RATE;
      } else if (column === "LASTED_LOGIN") {
        valueA = new Date(a.LOGIN_STATS?.LASTED_LOGIN || "");
        valueB = new Date(b.LOGIN_STATS?.LASTED_LOGIN || "");
      } else if (column === "LOGIN_STREAK") {
        valueA = a.LOGIN_STATS?.LOGIN_STREAK || 0;
        valueB = b.LOGIN_STATS?.LOGIN_STREAK || 0;
      }

      return (valueA > valueB ? 1 : -1) * (direction === 1 ? 1 : -1);
    });

    setUsers(sortedUsers);
  };


  // ฟังก์ชันแสดงไอคอนการจัดเรียง
  const getIcon = (column: keyof UserApiResponse | "LOGIN_STATS.LASTED_LOGIN" | "LOGIN_STREAK") => {
    if (sortState.column !== column) return <FaSort className="inline" />;
    if (sortState.direction === 1) return <FaSortUp className="inline" />;
    if (sortState.direction === 2) return <FaSortDown className="inline" />;
    return <FaSort className="inline" />;
  };


  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>เกิดข้อผิดพลาด: {error}</p>;
  }

  if (!users || users.length === 0) {
    return <p>ไม่มีข้อมูลผู้ใช้</p>;
  }
  const handleRowClick = (UID: number) => {
    console.log(`User ID: ${UID}`); // เช็คว่า UID ถูกส่งเข้ามาถูกต้อง
    router.push(`/user/${UID}`); // ไปที่หน้าโปรไฟล์ของผู้ใช้
  };

  return (
    <div className="top-0 px-28 py-6 bg-gray-100 min-h-screen font-sans">
      <div className="rounded-lg p-6 mt-16 h-[600px] bg-white shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            ข้อมูลผู้ใช้ ทั้งหมด {totalUsers} คน
          </h1>
        </div>

        <div className="relative mt-4">
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

        <div className="overflow-auto scrollbar-custom flex-grow mt-4 max-h-[400px]">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th className="py-2 px-4 border-b text-left cursor-pointer" onClick={() => handleSort("UID")}>
                  ไอดีผู้ใช้ {getIcon("UID")}
                </th>

                <th className="py-2 px-4 border-b text-left cursor-pointer" onClick={() => handleSort("COMPLETE_RATE")}>
                  อัตราความสำเร็จ {getIcon("COMPLETE_RATE")}
                </th>
                <th
                  className="py-2 px-4 border-b text-left cursor-pointer"
                  onClick={() => handleSort("LASTED_LOGIN")}
                >
                  ใช้งานล่าสุด {getIcon("LOGIN_STATS.LASTED_LOGIN")}
                </th>


                <th className="py-2 px-4 border-b text-left cursor-pointer " onClick={() => handleSort("LOGIN_STREAK")}>
                  สถานะ {getIcon("LOGIN_STREAK")}
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr
                  key={user.UID}
                  className="text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => handleRowClick(user.UID)}
                >
                  <td className="py-2 px-4 border-b w-3/6">
                    <div className="flex items-center space-x-2">
                      <p className="m-0">#UID00000{user.UID || "ไม่ระบุ"}</p>
                      {user.RISK_ASSESSMENT ? (<>
                        {/* DIABETES */}
                        <span
                          className={`${user.RISK_ASSESSMENT.DIABETES === 0.25
                            ? "bg-green-100 text-green-600" // Low risk
                            : user.RISK_ASSESSMENT.DIABETES === 0.5
                              ? "bg-yellow-100 text-yellow-600" // Moderate risk
                              : user.RISK_ASSESSMENT.DIABETES === 0.75
                                ? "bg-orange-100 text-orange-600" // High risk
                                : user.RISK_ASSESSMENT.DIABETES === 1.0
                                  ? "bg-red-100 text-red-600" // Very high risk
                                  : "bg-gray-200 text-gray-600" // Default color
                            } py-2 px-4 rounded-lg mr-2`}
                        >
                          โรคเบาหวาน
                        </span>

                        {/* HYPERTENSION */}
                        <span
                          className={`${user.RISK_ASSESSMENT.HYPERTENSION === 0.25
                            ? "bg-green-100 text-green-600" // Low risk
                            : user.RISK_ASSESSMENT.HYPERTENSION === 1.0
                              ? "bg-red-100 text-red-600" // High risk
                              : "bg-gray-200 text-gray-600" // Default color
                            } py-2 px-4 rounded-lg mr-2`}
                        >
                          ความดันโลหิตสูง
                        </span>


                        {/* DYSLIPIDEMIA */}
                        <span
                          className={`${user.RISK_ASSESSMENT.DYSLIPIDEMIA === 0.25
                            ? "bg-green-100 text-green-600" // Low risk
                            : user.RISK_ASSESSMENT.DYSLIPIDEMIA === 1.0
                              ? "bg-red-100 text-red-600" // High risk
                              : "bg-gray-200 text-gray-600" // Default color
                            } py-2 px-4 rounded-lg mr-2`}
                        >
                          ไขมันในเลือดผิดปกติ
                        </span>
                        {/* OBESITY */}
                        <span
                          className={`${user.RISK_ASSESSMENT.OBESITY === 0.25
                            ? "bg-green-100 text-green-600" // Low risk
                            : user.RISK_ASSESSMENT.OBESITY === 0.5
                              ? "bg-yellow-100 text-yellow-600" // Moderate risk
                              : user.RISK_ASSESSMENT.OBESITY === 1.0
                                ? "bg-red-100 text-red-600" // High risk
                                : "bg-gray-200 text-gray-600" // Default color
                            } py-2 px-4 rounded-lg mr-2`}
                        >
                          โรคอ้วน
                        </span>

                      </>
                      ) : (
                        <span>ไม่มีข้อมูล</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex items-center">
                      <div className="flex h-2 w-28 rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full ${user.COMPLETE_RATE >= 100 ? "bg-blue-500" : "bg-blue-400"}`}
                          style={{ width: `${user.COMPLETE_RATE}%` }}
                        ></div>
                      </div>
                      <span className="ml-2">{user.COMPLETE_RATE}%</span>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {user.LOGIN_STATS?.LASTED_LOGIN
                      ? new Date(user.LOGIN_STATS.LASTED_LOGIN).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                      : "ไม่มีข้อมูล"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`py-1 px-2 rounded-lg text-sm ${user.COMPLETE_RATE >= 100 ? " text-green-600" : " text-red-600"}`}
                    >
                      {user.LOGIN_STATS?.LOGIN_STREAK > 0
                        ? `ใช้งานต่อเนื่อง ${user.LOGIN_STATS.LOGIN_STREAK} วัน`
                        : (user.LOGIN_STATS?.LOGIN_STREAK < 0 ? `ไม่เข้าใช้งาน ${Math.abs(user.LOGIN_STATS.LOGIN_STREAK)} วัน` : "ไม่เข้าใช้งาน")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
