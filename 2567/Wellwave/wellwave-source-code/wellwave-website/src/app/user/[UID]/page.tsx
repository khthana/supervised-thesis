/* eslint-disable @typescript-eslint/no-unused-vars */
// import React from "react";
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import ProgressCircle from "../../User-info/widget/progressCircle";
import LineChartSample2 from "../../User-info/widget/lineChart";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

import { useParams, useRouter } from "next/navigation";

interface UserProfileResponse {
    data: {
        UID: number;
        USERNAME: string | null;
        EMAIL: string;
        GOOGLE_ID: string | null;
        YEAR_OF_BIRTH: number | null;
        GENDER: string | null;
        HEIGHT: number | null;
        WEIGHT: number | null;
        GEM: number;
        EXP: number;
        ROLE: string;
        REMINDER_NOTI_TIME: string | null;
        IMAGE_URL: string | null;
        USER_GOAL: string | null;
        USER_GOAL_STEP_WEEK: number | null;
        USER_GOAL_EX_TIME_WEEK: number | null;
        createAt: string;
        AGE: number;
        RISK_ASSESSMENT: string | null;
        LOGIN_STATS: LoginStats;
        COMPLETE_RATE: CompleteRate;
    };
}

interface LoginStats {
    LOGIN_STREAK: number;
    LASTED_LOGIN: string | null;
    STREAK_START: string | null;
}

interface CompleteRate {
    OVERALL_PERCENTAGE: number;
    MISSTION_TYPES: MissionTypes;
    ACTIVITY_TYPES: ActivityTypes;
}

interface MissionTypes {
    DAILY_HABIT: number;
    HABIT: number;
    QUEST: number;
}

interface ActivityTypes {
    EXERCISE: number;
    SLEEP: number;
    DIET: number;
}


interface Task {
    name: string;
    category: string;
    reward: number;
    successRate: string;
    participants: string;
    status: string;
}
const logsData = [
    { date: "2023-04-01", value: 70 },
    { date: "2023-04-02", value: 10 },
    { date: "2023-04-03", value: 52 },
];

const taskData: Task[] = [
    { name: "ภารกิจ", category: "ออกกำลังกาย", reward: 150, successRate: "50%", participants: "10/99 คน", status: "เฉยๆ" },
    { name: "ภารกิจ", category: "ออกกำลังกาย", reward: 200, successRate: "75%", participants: "20/99 คน", status: "สดใส" },
    { name: "ภารกิจ", category: "พักผ่อน", reward: 300, successRate: "90%", participants: "50/99 คน", status: "ท้อแท้" },
    { name: "ภารกิจ", category: "พักผ่อน", reward: 300, successRate: "90%", participants: "50/99 คน", status: "กดดัน" },
    { name: "ภารกิจ", category: "พักผ่อน", reward: 300, successRate: "90%", participants: "50/99 คน", status: "พอใจ" },
];
const UserDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserProfileResponse | null>(null);
    // const UID = parseInt(params.id);
    // const { id } = router.query; // ดึง `id` จาก URL

    const UID = params?.UID ? parseInt(params.UID as string) : null;
    console.log("params.UID:", params.UID);
    console.log("Parsed UID:", UID); console.log("Parsed UID:", UID);

    // const UID = params.id ? parseInt(params.id) : null;
    // console.log("params.id:", params.id); // ตรวจสอบค่า params.id
    // console.log("Parsed UID:", UID); // ตรวจสอบค่าหลังจาก parse


    // useEffect Hook
    console.log("Before useEffect - UID:", UID);

    useEffect(() => {
        console.log("Current UID:", UID); // ตรวจสอบค่า UID

        if (!UID) {
            setError("Invalid UID or missing parameter");
            setLoading(false);
            return;
        }
        // Continue fetching data if UID is valid
        const fetchUsers = async () => {
            console.log("Fetching users...");
            try {
                const token = localStorage.getItem("accessToken");
                console.log("Token:", token); // ตรวจสอบ token ว่าได้มาหรือไม่

                if (!token) {
                    setError("No token found, please login.");
                    setLoading(false);
                    return;
                }
                const response = await fetch(`http://ce67-16.cloud.ce.kmitl.ac.th/api/v1/users/profile-deep/${UID}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                console.log("Response status:", response.status); // ดูว่าเซิร์ฟเวอร์ตอบกลับสถานะอะไร

                const data = await response.json();
                console.log("Fetched user data:", data); // ตรวจสอบข้อมูลที่ได้รับ

                setUserData(data);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch user data");
                setLoading(false);
            }
        };
        fetchUsers();
    }, [UID]);



    // Mock data
    // const user = {
    //     id: params.id,
    //     name: 'ฟ้า',
    //     email: 'fahfah123456@gmail.com',
    //     password: 'Hahahaa',
    //     username: 'flsa@dksl5dv45s',
    //     gender: 'หญิง',
    //     age: 22,
    //     height: 153,
    //     weight: 53,
    //     scores: {
    //         points: 150,
    //         gems: 150,
    //         level: 16,
    //     },
    //     achievements: [
    //         { title: 'เหรียญทอง', level: 1 },
    //         { title: 'เหรียญเงิน', level: 2 },
    //         { title: 'เหรียญทองแดง', level: 3 },
    //     ],
    //     healthData: {
    //         steps: 153,
    //         bloodPressure: 153,
    //         cholesterolHDL: 53,
    //         cholesterolLDL: 53,
    //     },
    //     risks: ['โรคเบาหวาน', 'โรคความดันโลหิตสูง', 'โรคอ้วน', 'โรคไขมันในเลือดสูง'],
    // };

    const [sortedData, setSortedData] = useState<Task[]>(taskData);
    const [sortConfig, setSortConfig] = useState<{ column: keyof Task | null; direction: number }>({
        column: null,
        direction: 0, // 0: default, 1: ascending, 2: descending
    });

    const handleSort = (column: keyof Task) => {
        // กำหนดลำดับที่ต้องการสำหรับความรู้สึก
        const feelingsOrder = ['กดดัน', 'ท้อแท้', 'เฉยๆ', 'พอใจ', 'สดใส'];

        setSortConfig((prev) => {
            const newDirection = prev.column === column ? (prev.direction + 1) % 3 : 1;
            const sorted = [...sortedData].sort((a, b) => {
                if (newDirection === 0) return 0; // Default (No Sort)
                if (typeof a[column] === "number") {
                    return newDirection === 1
                        ? (a[column] as number) - (b[column] as number)
                        : (b[column] as number) - (a[column] as number);
                }

                // กรณีที่ column เป็นความรู้สึก
                if (column === "status") {
                    const indexA = feelingsOrder.indexOf(a[column]);
                    const indexB = feelingsOrder.indexOf(b[column]);

                    return newDirection === 1
                        ? indexA - indexB
                        : indexB - indexA;
                }

                // สำหรับกรณีอื่น ๆ ใช้ localeCompare
                return newDirection === 1
                    ? String(a[column]).localeCompare(String(b[column]), 'th')
                    : String(b[column]).localeCompare(String(a[column]), 'th');
            });

            setSortedData(sorted);
            return { column, direction: newDirection };
        });
    };


    const getIcon = (column: keyof Task) => {
        if (sortConfig.column !== column) return <FaSort className="inline" />;
        if (sortConfig.direction === 1) return <FaSortUp className="inline" />;
        if (sortConfig.direction === 2) return <FaSortDown className="inline" />;
        return <FaSort className="inline" />;
    };

    // Return loading, error, or the actual user data UI
    // if (loading) return <div className="top-0 px-28 py-6 bg-gray-100 min-h-screen font-sans">
    //     <div className="rounded-lg p-6 mt-16 min-h-[200px] bg-white shadow-md">Loading...</div></div>;
    // if (error) return <div>{error}</div>;

    return (
        <div className="top-0 px-28 py-6 bg-gray-100 min-h-screen font-sans">
            <div className="rounded-lg p-6 mt-16 min-h-[200px] bg-white shadow-md">
                <p className="text-gray-600 text-sm pb-3 flex items-center cursor-pointer group">
                    <span className="hover:underline inline-flex items-center group-hover:text-black" onClick={() => router.back()} >
                        เพิ่มข้อมูล
                    </span>
                    <span style={{ margin: "0 8px" }}> &gt; </span>
                    <Image
                        src="/asset/article.svg"
                        alt="article"
                        width={16}
                        height={16}
                        className="mr-1"
                    />
                    <span className="text-black">ชื่อ [#UID45029{UID}]</span>
                </p>

                {/* รายละเอียดผู้ใช้ */}
                <div className="grid grid-cols-2 gap-4">

                    {userData ? (<div className="bg-white rounded-lg shadow p-6 flex flex-col mt-2 space-y-2 relative cursor-pointer border-2 border-gray-100">

                        <h2 className="text-lg font-semibold">รายละเอียดผู้ใช้</h2>
                        <div className="flex items-center space-x-3 pb-3 ">
                            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold mr-4">
                                OP
                            </div>
                            <div className="flex flex-col flex-grow">
                                <span className="text-xl font-bold">{userData.data.USERNAME}</span>
                                <p>#UID00000{UID}</p>
                            </div>
                            <span className="py-0.5 px-3 rounded text-sm border bg-green-100 text-green-500 border-green-500">
                                ใช้งานต่อเนื่อง 36 วัน
                            </span>
                        </div>
                        <div className="pb-2">
                            <table className="w-[150px]">
                                <tbody>
                                    <tr>
                                        <td className="text-gray-700">อีเมล</td>
                                        <td className="pl-1 text-left">: {userData.data.EMAIL}</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center border-t pb-3 "></div>
                        <div className="grid grid-cols-2 gap-x-8 pb-3 ">
                            <div>
                                <p><span className="text-gray-700 mr-4">เพศ</span>: {userData.data.GENDER}</p>
                                <p><span className="text-gray-700 mr-4">อายุ</span>: {userData.data.AGE} ปี</p>
                            </div>
                            <div>
                                <p><span className="text-gray-700 mr-4">ส่วนสูง</span>: {userData.data.HEIGHT} ซม.</p>
                                <p><span className="text-gray-700 mr-4">น้ำหนัก</span>: {userData.data.WEIGHT} กก.</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center border-t pb-3"></div>
                        <div className="pb-3">

                            <table className="w-[400px]">
                                <tbody>
                                    <tr>
                                        <td className="text-gray-700 pr-4">รอบเอว</td>
                                        {/* <td className="pl-1">: {user.age} ซม.</td> */}
                                    </tr>
                                    <tr>
                                        <td className="text-gray-700 pr-4">ความดันโลหิตขณะบีบตัว</td>
                                        {/* <td className="pl-1">: {user.height} มิลลิเมตรปรอท</td> */}
                                    </tr>
                                    <tr>
                                        <td className="text-gray-700 pr-4">ความดันโลหิตขณะคลายตัว</td>
                                        {/* <td className="pl-1">: {user.weight} มิลลิเมตรปรอท</td> */}
                                    </tr>
                                    <tr>
                                        <td className="text-gray-700 pr-4">คอเลสเตอรอลชนิดดี (HDL)</td>
                                        {/* <td className="pl-1">: {user.weight} มก./ดล.</td> */}
                                    </tr>
                                    <tr>
                                        <td className="text-gray-700 pr-4">คอเลสเตอรอลชนิดไม่ดี (LDL)</td>
                                        {/* <td className="pl-1">: {user.weight} มก./ดล.</td> */}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center border-t pb-3"></div>
                        <div className="flex space-x-2">
                            <div className="py-0.5 px-3 rounded  bg-green-100 text-green-500">โรคเบาหวาน</div>
                            <div className="py-0.5 px-3 rounded  bg-green-100 text-green-500">โรคความดันโลหิตสูง</div>
                            <div className="py-0.5 px-3 rounded  bg-green-100 text-green-500">โรคอ้วน</div>
                            <div className="py-0.5 px-3 rounded  bg-green-100 text-green-500">โรคไขมันในเลือดสูง</div>
                        </div>
                    </div>
                    ) : (
                        <p>No user data available dd</p>
                    )}

                    {/* คะแนนสะสม */}
                    <div className="flex mt-2 flex-col gap-4">
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col border-2 border-gray-100 h-fit">
                            <h2 className="text-lg font-semibold  mb-4">คะแนนสะสม</h2>
                            <div className="pl-2 flex space-x-2 justify-start items-center">
                                <Image
                                    src="/asset/EXP.svg"
                                    alt="EXP"
                                    width={32}
                                    height={32}
                                    className="mr-1"
                                />
                                <p className="pr-3">150</p>
                                <Image
                                    src="/asset/Gem.svg"
                                    alt="Gem"
                                    width={32}
                                    height={32}
                                    className="mr-1"
                                />
                                <p className="pr-3">150</p>
                                <div className="flex justify-between items-center border-l pr-2"></div>
                                <Image
                                    src="/asset/daimonLeague.svg"
                                    alt="daimonLeague"
                                    width={32}
                                    height={32}
                                    className="mr-1"
                                />
                                <p>ระดับไดมอนด์ อันดับที่ 16</p>
                            </div>
                        </div>

                        {/* ความสำเร็จภารกิจ */}
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col border-2 border-gray-100">
                            <h2 className="text-lg font-semibold mb-4">ความสำเร็จภารกิจ</h2>
                            <div className="grid grid-cols-3 gap-4 space-x-2 ">
                                <div className="place-items-center">
                                    <ProgressCircle percentage={87} />
                                </div>

                                <div>
                                    <p className="text-gray-700 text-left">ประเภทภารกิจ</p>
                                    <div className="relative pl-5 flex justify-between items-center">
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xl">•</span>
                                        <p className="ml-1">ภารกิจประจำวัน</p>
                                        <span className="text-right">80 %</span>
                                    </div>
                                    <div className="relative pl-5 flex justify-between items-center">
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xl">•</span>
                                        <p className="ml-1">ภารกิจปรับนิสัย</p>
                                        <span className="text-right">80 %</span>
                                    </div>
                                    <div className="relative pl-5 flex justify-between items-center">
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xl">•</span>
                                        <p className="ml-1">เควส</p>
                                        <span className="text-right">80 %</span>
                                    </div>
                                </div>


                                <div>
                                    <p className="text-gray-700 text-left">หมวดหมู่</p>
                                    <div className="relative pl-5 flex justify-between items-center">
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xl">•</span>
                                        <p className="ml-1">ภารกิจประจำวัน</p>
                                        <span className="text-right">80 %</span>
                                    </div>
                                    <div className="relative pl-5 flex justify-between items-center">
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xl">•</span>
                                        <p className="ml-1">ภารกิจปรับนิสัย</p>
                                        <span className="text-right">80 %</span>
                                    </div>
                                    <div className="relative pl-5 flex justify-between items-center">
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xl">•</span>
                                        <p className="ml-1">เควส</p>
                                        <span className="text-right">80 %</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ความสำเร็จ */}
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col border-2 border-gray-100">
                            <h2 className="text-lg font-semibold mb-4">ความสำเร็จ</h2>
                            <div className="grid grid-cols-5 gap-4 space-x-2 ">
                                <div className="place-items-center">
                                    <Image
                                        src="/asset/achievement/one.svg"
                                        alt="daimonLeague"
                                        width={64}
                                        height={64}
                                        className="mr-1"
                                    />
                                    <p className="pt-4">ชื่อรางวัล</p></div>
                                <div className="place-items-center">
                                    <Image
                                        src="/asset/achievement/one.svg"
                                        alt="daimonLeague"
                                        width={64}
                                        height={64}
                                        className="mr-1"
                                    />
                                    <p className="pt-4">ชื่อรางวัล</p></div>
                                <div className="place-items-center">
                                    <Image
                                        src="/asset/achievement/one.svg"
                                        alt="daimonLeague"
                                        width={64}
                                        height={64}
                                        className="mr-1"
                                    />
                                    <p className="pt-4">ชื่อรางวัล</p></div>
                                <div className="place-items-center">
                                    <Image
                                        src="/asset/achievement/one.svg"
                                        alt="daimonLeague"
                                        width={64}
                                        height={64}
                                        className="mr-1"
                                    />
                                    <p className="pt-4">ชื่อรางวัล</p></div>
                                <div className="place-items-center">
                                    <Image
                                        src="/asset/achievement/one.svg"
                                        alt="daimonLeague"
                                        width={64}
                                        height={64}
                                        className="mr-1"
                                    />
                                    <p className="pt-4">ชื่อรางวัล</p></div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* ประวัติสุขภาพ */}
                <h1 className="text-l font-bold mt-6">ประวัติสุขภาพ </h1>
                <div className="grid grid-cols-3 gap-4 mt-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="bg-white p-4 w-[360px] h-[300px] flex flex-col items-center rounded-lg shadow border-2 border-gray-100 text-left">
                            <p className="self-start w-full font-semibold text-gray-600">รอบเอว</p>
                            <LineChartSample2 logType={`logType-${index}`} logs={logsData} selectedPeriod={'selectedPeriod'} />
                        </div>

                    ))}
                </div>

                {/* ประวัติทำภารกิจ */}
                <h1 className="text-l font-bold mt-6">ประวัติทำภารกิจ </h1>
                <div className="mt-6"><table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-white">
                        <tr className="text-left text-gray-600">
                            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("name")}>
                                วันเดือนปี {getIcon("name")}
                            </th>
                            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("category")}>
                                ประเภทภารกิจ {getIcon("category")}
                            </th>
                            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("reward")}>
                                หมวดหมู่ {getIcon("reward")}
                            </th>
                            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("successRate")}>
                                รายละเอียด {getIcon("successRate")}
                            </th>
                            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("status")}>
                                สถานะ {getIcon("status")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((task, index) => (
                            <tr key={index} className="text-sm text-gray-700">
                                <td className="py-2 px-4 border-b">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">OP</div>
                                        <span>{task.name}</span>
                                    </div>
                                </td>
                                <td className="py-2 px-4 border-b">{task.category}</td>
                                <td className="py-2 px-8 border-b">{task.reward}</td>
                                <td className="py-2 px-14 border-b">{task.successRate}</td>
                                <td className="py-2 px-4 border-b">
                                    <span
                                        className={`py-0.5 px-3 rounded text-sm border 
                ${task.status === "กดดัน" ? "bg-red-100 text-red-600 border-red-600" : ""}
                ${task.status === "ท้อแท้" ? "bg-orange-100 text-orange-600 border-orange-600" : ""}
                ${task.status === "เฉยๆ" ? "bg-yellow-100 text-yellow-600 border-yellow-600" : ""}
                ${task.status === "พอใจ" ? "bg-green-100 text-green-500 border-green-500" : ""}
                ${task.status === "สดใส" ? "bg-green-200 text-green-700 border-green-700" : ""}
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


                {/* ประวัติการบันทึกสุขภาพ */}
                <h1 className="text-l font-bold mt-6">ประวัติการบันทึกสุขภาพ</h1>
                <div className="mt-6"><table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-white">
                        <tr className="text-left text-gray-600">
                            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("name")}>
                                วันเดือนปี {getIcon("name")}
                            </th>
                            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("category")}>
                                ประเภทการบันทึก {getIcon("category")}
                            </th>

                            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("successRate")}>
                                รายละเอียด {getIcon("successRate")}
                            </th>
                            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("status")}>
                                สถานะ {getIcon("status")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((task, index) => (
                            <tr key={index} className="text-sm text-gray-700">
                                <td className="py-2 px-4 border-b">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">OP</div>
                                        <span>{task.name}</span>
                                    </div>
                                </td>
                                <td className="py-2 px-4 border-b">{task.category}</td>
                                <td className="py-2 px-14 border-b">{task.successRate}</td>
                                <td className="py-2 px-4 border-b">
                                    <span
                                        className={`py-0.5 px-3 rounded text-sm border 
                ${task.status === "กดดัน" ? "bg-red-100 text-red-600 border-red-600" : ""}
                ${task.status === "ท้อแท้" ? "bg-orange-100 text-orange-600 border-orange-600" : ""}
                ${task.status === "เฉยๆ" ? "bg-yellow-100 text-yellow-600 border-yellow-600" : ""}
                ${task.status === "พอใจ" ? "bg-green-100 text-green-500 border-green-500" : ""}
                ${task.status === "สดใส" ? "bg-green-200 text-green-700 border-green-700" : ""}
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
            </div>

        </div >

    );
};
export default UserDetailPage;
