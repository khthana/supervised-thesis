import FileUpload from '@/app/components/upload';
import React, { useState } from 'react';
import { IoMdTrash } from 'react-icons/io';

interface Level {
    level: number;
    duration: number;
    rewards: {
        EXP: number;
        GEMS: number;
    };
    file?: File | null;
}

interface LevelItemProps {
    level: Level;
    index: number;
    deleteLevel: (level: number) => void;
    handleDurationChange: (index: number, duration: number) => void;
    handleRewardChange: (index: number, type: 'EXP' | 'GEMS', value: number) => void;
    handleFileSelect: (index: number, file: File | null) => void;
}

// Level Item Component
const LevelItem = ({ level, index, deleteLevel, handleDurationChange, handleRewardChange, handleFileSelect }: LevelItemProps) => {
    return (
        <div className="flex flex-col gap-4 mt-4">
            <div className="flex justify-between items-center gap-2">
                <label className="block text-gray-700">ระดับที่ {level.level}</label>
                <button
                    onClick={() => deleteLevel(level.level)}
                    className="text-gray-600 hover:text-gray-600 rounded p-2 border border-gray-300"
                    type="button"
                >
                    <IoMdTrash size={24} />
                </button>
            </div>
            <FileUpload
                onFileSelect={(file) => handleFileSelect(index, file)}
            />

            <div className="flex gap-2 items-center w-full">
                <div className="flex items-center">
                    <span className="mr-2">GEMS:</span>
                    <input
                        type="number"
                        value={level.rewards.GEMS}
                        onChange={(e) => handleRewardChange(index, 'GEMS', parseInt(e.target.value) || 0)}
                        min="0"
                        className="border rounded p-2 w-48"
                    />
                </div>
                <div className="flex items-center">
                    <span className="mr-2">EXP:</span>
                    <input
                        type="number"
                        value={level.rewards.EXP}
                        onChange={(e) => handleRewardChange(index, 'EXP', parseInt(e.target.value) || 0)}
                        min="0"
                        className="border rounded p-2 w-48"
                    />
                </div>

            </div>
            <div className="flex gap-2 items-center">
                <select className="border rounded p-2">
                    <option>Gem</option>
                    <option>EXP</option>
                </select>
                <select className="border rounded p-2">
                    <option>Gem</option>
                    <option>EXP</option>
                </select>
                <div className="flex items-center w-full">
                    <input
                        type="number"
                        value={level.duration}
                        onChange={(e) => handleDurationChange(index, parseInt(e.target.value) || 1)}
                        min="1"
                        className="w-full rounded-l-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="rounded-r-md border border-l-0 border-gray-300 bg-white px-3 py-2 text-gray-700">วัน</span>
                </div>
            </div>

        </div>
    );
};

// Achievement Popup Component
interface AchievementPopupProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AchievementPopup = ({ isOpen, setIsOpen }: AchievementPopupProps) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [levels, setLevels] = useState<Level[]>([
        { level: 1, duration: 2, rewards: { EXP: 100, GEMS: 10 }, file: undefined },
    ]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Add new level
    const addLevel = () => {
        const newLevel = {
            level: levels.length + 1,
            duration: levels.length + 2,
            rewards: { EXP: (levels.length + 1) * 100, GEMS: (levels.length + 1) * 10 },
            file: undefined
        };
        setLevels([...levels, newLevel]);
    };

    // Delete level
    const deleteLevel = (levelNumber: number) => {
        if (levels.length <= 1) return;

        const filteredLevels = levels.filter(level => level.level !== levelNumber);
        // Re-number the levels to be sequential
        const updatedLevels = filteredLevels.map((level, idx) => ({
            ...level,
            level: idx + 1
        }));

        setLevels(updatedLevels);
    };

    // Handle duration change
    const handleDurationChange = (index: number, duration: number) => {
        const updatedLevels = [...levels];
        updatedLevels[index].duration = duration;
        setLevels(updatedLevels);
    };

    // Handle reward change
    const handleRewardChange = (index: number, type: 'EXP' | 'GEMS', value: number) => {
        const updatedLevels = [...levels];
        updatedLevels[index].rewards[type] = value;
        setLevels(updatedLevels);
    };

    // Handle file select
    const handleFileSelect = (index: number, file: File | null) => {
        const updatedLevels = [...levels];
        updatedLevels[index].file = file || undefined;
        setLevels(updatedLevels);
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // ป้องกันการ submit form
        e.stopPropagation(); // เพิ่มบรรทัดนี้เพื่อป้องกันการ propagate ของ event

        console.log("Title ที่กรอก: ", title);
        if (!title.trim()) {
            alert('กรุณากรอกชื่อความสำเร็จ');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();

            // Add title
            formData.append('TITLE', title);
            formData.append('DESCRIPTION', description);
            formData.append('ACHIEVEMENTS_TYPE', 'leveled');

            // Add requirement
            const requirement = {
                FROM_ENTITY: "login_streak",
                TRACK_PROPERTY: "current_streak_day",
                TRACKING_TYPE: "streak"
            };
            formData.append('REQUIREMENT', JSON.stringify(requirement));

            // Create formatted levels data
            const formattedLevels = levels.map(level => ({
                LEVEL: level.level,
                TARGET_VALUE: level.duration,
                REWARDS: {
                    EXP: level.rewards.EXP,
                    GEMS: level.rewards.GEMS
                }
            }));

            // Add levels data
            formData.append('levels', JSON.stringify(formattedLevels));

            // Add level icons
            levels.forEach((level, index) => {
                if (level.file) {
                    formData.append(`levelIcon${index}`, level.file);
                }
            });

            // Log the value of TITLE
            console.log('TITLE value:', formData.get('TITLE'));

            // Log FormData entries to check all data
            for (const pair of formData.entries()) {
                console.log(pair[0] + ": " + pair[1]);
            }

            const token = localStorage.getItem("accessToken");

            // Send data to server
            const response = await fetch('http://ce67-16.cloud.ce.kmitl.ac.th/api/v1/achievement/', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Response sent:', response.body);

            if (response.ok) {
                setIsOpen(false);
                // Reset form
                setTitle('');
                setLevels([{ level: 1, duration: 2, rewards: { EXP: 100, GEMS: 10 }, file: undefined }]);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'เกิดข้อผิดพลาด');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow max-w-[600px] w-full max-h-[600px] p-6 m-18">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-semibold">เพิ่มความสำเร็จ</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                        type="button"
                    >
                        ✖
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mt-4 space-y-4 max-h-[500px] overflow-y-auto scrollbar-custom pr-2">
                        <div>
                            <label className="block text-gray-700">ชื่อความสำเร็จ</label>
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                placeholder="ชื่อความสำเร็จ"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">คำอธิบาย</label>
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                placeholder="คำอธิบาย"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700">เกณฑ์การเลื่อนขั้น (จำนวนวัน)</label>

                            {levels.map((level, index) => (
                                <LevelItem
                                    key={index}
                                    level={level}
                                    index={index}
                                    deleteLevel={deleteLevel}
                                    handleDurationChange={handleDurationChange}
                                    handleRewardChange={handleRewardChange}
                                    handleFileSelect={handleFileSelect}
                                />
                            ))}
                        </div>

                        <div className="flex justify-between mt-2">
                            <button
                                type="button"
                                onClick={addLevel}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                + เพิ่มระดับ
                            </button>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-gray-500 hover:text-gray-700"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'กำลังบันทึก...' : 'ยืนยัน'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AchievementPopup;