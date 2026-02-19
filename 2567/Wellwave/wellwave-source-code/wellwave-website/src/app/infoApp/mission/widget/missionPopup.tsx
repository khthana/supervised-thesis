"use client";

import React, { useState } from 'react';
import FileUpload from '@/app/components/upload';

import CustomSelectPrice from '../../reward/widget/customSelectPrice';

interface PopupProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    amount: number;
    setAmount: (amount: number) => void;
    duration: number;
    setDuration: (duration: number) => void;
}
interface SelectDataPrice {
    PRICE_EXP?: number;
    PRICE_GEM?: number;
    GEM_REWARD?: number;
}
const MissionPopup: React.FC<PopupProps> = ({ isOpen, setIsOpen, amount, setAmount, duration, setDuration }) => {
    const [selectedType, setSelectedType] = useState<string>('ภารกิจปรับนิสัย'); // ใช้ติดตามประเภทที่เลือก
    const [title, setTitle] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
    const [description, setDescription] = useState('');

    const [selectedDataPrice, setSelectedDataPrice] = useState<SelectDataPrice | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // เก็บค่าไฟล์ที่เลือก
    const [selectedSubQuestCategory, setSelectedSubQuestCategory] = useState(''); // เพิ่ม state สำหรับเก็บค่าเควส
    const [timeUnit, setTimeUnit] = useState("duration"); // ตั้งค่าเริ่มต้นเป็น "duration"
    const [dayDuration, setDayDuration] = useState<string>(''); // เก็บค่า unit ที่เลือก

    if (!isOpen) return null;

    // ฟังก์ชันเพื่อส่งข้อมูลไปยัง API ตามประเภทภารกิจ
    const handleFileSelect = (file: File | null) => {
        if (!file) return;
        setSelectedFile(file); // เก็บไฟล์ใน state เพื่อให้สามารถส่งใน handleSubmit ได้
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };
    const handleSubCategoryChange = (subCategory: string) => {
        setSelectedSubCategory(subCategory);
    };
    const handleSubmit = async () => {
        const formData = new FormData();
        if (selectedFile) {
            formData.append('file', selectedFile); // เพิ่มไฟล์ลงใน FormData
        }
        formData.append('TITLE', title);


        if (selectedType === 'ภารกิจปรับนิสัย' || selectedType === 'ภารกิจประจำวัน') {
            formData.append('DEFAULT_DAILY_MINUTE_GOAL', amount.toString());
            formData.append('DEFAULT_DAYS_GOAL', duration.toString());
            formData.append('EXP_REWARD', selectedDataPrice?.PRICE_EXP?.toString() || '0');
            formData.append('GEM_REWARD', selectedDataPrice?.PRICE_GEM?.toString() || '0');
            formData.append('TRACKING_TYPE', 'duration');
        }

        if (selectedType === 'เควส') {

            formData.append('EXP_REWARDS', selectedDataPrice?.PRICE_EXP?.toString() || '0');
            formData.append('GEM_REWARDS', selectedDataPrice?.PRICE_GEM?.toString() || '0');
        }

        formData.append('DESCRIPTION', description);


        if (selectedCategory === 'exercise' && selectedSubCategory && selectedSubCategory !== "") {
            formData.append('EXERCISE_TYPE', selectedSubCategory);
        }
        if (selectedType === 'เควส') {
            formData.append('RQ_TARGET_VALUE', amount.toString()); // จำนวนที่ใส่ในช่อง input
            formData.append('TRACKING_TYPE', timeUnit); // จะส่งเป็น 'duration', 'distance', หรือ 'count'
            formData.append('DAY_DURATION', dayDuration);

        }
        // เพิ่มข้อมูลใน FormData ตามประเภท
        if (selectedType === 'ภารกิจประจำวัน') {
            formData.append('IS_DAILY', 'true'); // หากเป็นภารกิจประจำวัน
        }

        let url = '';
        if (selectedType === 'ภารกิจปรับนิสัย') {
            url = 'http://ce67-16.cloud.ce.kmitl.ac.th/api/v1/habit';
            formData.append('CATEGORY', selectedCategory);
        } else if (selectedType === 'เควส') {
            url = 'http://ce67-16.cloud.ce.kmitl.ac.th/api/v1/quest';
            formData.append('RELATED_HABIT_CATEGORY', selectedCategory);

            formData.append('QUEST_TYPE', selectedSubQuestCategory); // ส่งประเภทเควส
        } else if (selectedType === 'ภารกิจประจำวัน') {
            url = 'http://ce67-16.cloud.ce.kmitl.ac.th/api/v1/habit';
            formData.append('CATEGORY', selectedCategory);
        }
        console.log('Selected URL:', url);

        // ส่งข้อมูลไปยัง API
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            if (response.ok) {
                console.log('ส่งข้อมูลสำเร็จ!');
                setIsOpen(false);
            } else {
                console.log('เกิดข้อผิดพลาดในการส่งข้อมูล!');

            }
        } catch (error) {
            console.log('เกิดข้อผิดพลาดในการส่งข้อมูล!' + error);
        }
    };

    const handleChange = (data: SelectDataPrice) => {
        setSelectedDataPrice(data);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
            <div className="bg-white rounded-lg shadow max-h-[600px] p-6 m-18 ">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-semibold">เพิ่มภารกิจ</h2>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                        ✖
                    </button>
                </div>

                {/* Form ใน Popup */}
                <div className="mt-4 space-y-4 max-h-[500px] overflow-y-auto scrollbar-custom pr-2 ">
                    <label className="block text-gray-700">ประเภทภารกิจ</label>
                    <select
                        className="w-full border rounded p-2 pr-8"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option>ภารกิจปรับนิสัย</option>
                        <option>ภารกิจประจำวัน</option>
                        <option>เควส</option>
                    </select>
                    {selectedType === 'เควส' && (

                        <div>
                            <label className="block text-gray-700 mt-4">ประเภทของเควส</label>
                            <select
                                className="w-full border rounded p-2"
                                onChange={(e) => setSelectedSubQuestCategory(e.target.value)}
                            >
                                <option value="">ประเภทของเควส</option>
                                <option value="normal"> มีเป้าหมายที่กำหนด</option>
                                <option value="streak_based">ความต่อเนื่อง</option>
                                <option value="completion_based">ความสำเร็จมิชชัน</option>
                                <option value="daily_completion_based">ความสำเร็จบันทึกรายวัน</option>

                            </select>
                        </div>
                    )}
                    <label className="block text-gray-700">ชื่อภารกิจ</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        placeholder="ชื่อภารกิจ"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} // เก็บค่าใน state
                    />
                    {/* หมวดหมู่ */}
                    <label className="block text-gray-700">หมวดหมู่</label>
                    <div className="flex gap-4 mt-4">
                        <label className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 cursor-pointer">
                            <input
                                type="radio"
                                name="category"
                                value="exercise"
                                checked={selectedCategory === 'exercise'}
                                onChange={() => handleCategoryChange('exercise')}
                            />
                            ออกกำลังกาย
                        </label>

                        <label className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 cursor-pointer">
                            <input
                                type="radio"
                                name="category"
                                value="diet"
                                checked={selectedCategory === 'diet'}
                                onChange={() => handleCategoryChange('diet')}
                            />
                            รับประทานอาหาร
                        </label>

                        <label className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 cursor-pointer">
                            <input
                                type="radio"
                                name="category"
                                value="sleep"
                                checked={selectedCategory === 'sleep'}
                                onChange={() => handleCategoryChange('sleep')}
                            />
                            พักผ่อน
                        </label>
                    </div>


                    {selectedCategory === 'exercise' && (
                        <div>
                            <label className="block text-gray-700 mt-4">หมวดหมู่รอง</label>
                            <select
                                className="w-full border rounded p-2"
                                onChange={(e) => handleSubCategoryChange(e.target.value)}
                            >
                                <option value="">หมวดหมู่รอง</option>
                                <option value="walking">การเดิน</option>
                                <option value="running">การวิ่ง</option>
                                <option value="cycling">การปั่นจักรยาน</option>
                                <option value="swimming">การว่ายน้ำ</option>
                                <option value="strength">ออกกำลังกายแบบแรงต้าน</option>
                                <option value="hiit">HIIT</option>
                                <option value="yoga">โยคะ</option>
                                <option value="other">อื่นๆ</option>
                            </select>
                        </div>
                    )}
                    {(selectedType === 'เควส' && selectedCategory === 'exercise') && (
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Left section */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">ระยะเวลาภารกิจ</label>
                                <div className="flex items-center ">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(parseInt(e.target.value))}
                                        placeholder="30"
                                        className=" rounded-l-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <select
                                        value={timeUnit}
                                        onChange={(e) => setTimeUnit(e.target.value)}
                                        className="rounded-r-md border border-l-0 border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="duration">นาที</option>
                                        <option value="distance">ระยะทาง (กิโลเมตร)</option>
                                        <option value="count">ครั้ง</option>
                                    </select>
                                </div>
                            </div>

                            {/* Right section */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">ระยะเวลาภารกิจ</label>
                                <div className="flex items-center ">
                                    <input
                                        type="number"
                                        value={dayDuration}
                                        onChange={(e) => setDayDuration(e.target.value)}
                                        placeholder="30"
                                        className="w-full rounded-l-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <span className="rounded-r-md border border-l-0 border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">วัน</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {(selectedType === 'ภารกิจปรับนิสัย' || selectedType === 'ภารกิจประจำวัน') && (<div className="flex flex-col sm:flex-row gap-4">
                        {/* Left section */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">จำนวนภารกิจ</label>
                            <div className="flex">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(parseInt(e.target.value))}
                                    placeholder="30"
                                    className="w-full rounded-l-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <span className="rounded-r-md border border-l-0 border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">นาที</span>
                            </div>
                        </div>

                        {/* Right section */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">ระยะเวลาภารกิจ</label>
                            <div className="flex items-center ">
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(parseInt(e.target.value))}
                                    placeholder="30"
                                    className="w-full rounded-l-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <span className="rounded-r-md border border-l-0 border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">วัน</span>
                            </div>
                        </div>
                    </div>
                    )}


                    <label className="block text-gray-700">รายละเอียด</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        placeholder="รายละเอียด"
                        value={description} // value จาก state
                        onChange={(e) => setDescription(e.target.value)} // อัพเดตค่าของ description
                    />



                    {/* รางวัล */}
                    <label className="block text-gray-700">รางวัล</label>
                    <CustomSelectPrice onChange={handleChange} />


                    <label className="block text-gray-700">รูปภาพภารกิจ</label>
                    <FileUpload onFileSelect={(file) => handleFileSelect(file as File | null)} />
                    {/* ปุ่ม */}
                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700">
                            ยกเลิก
                        </button>
                        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            ยืนยัน
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissionPopup;
