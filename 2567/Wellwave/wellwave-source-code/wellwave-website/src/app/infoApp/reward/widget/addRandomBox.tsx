import React, { useState } from 'react';
import CustomSelect from './customSelect';

interface AddRandomBoxProps {
  isRandomBoxModalOpen: boolean;
  setIsRandomBoxModalOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
}

const AddRandomBox: React.FC<AddRandomBoxProps> = ({ isRandomBoxModalOpen, setIsRandomBoxModalOpen, onConfirm }) => {
  const [inputValue, setInputValue] = useState<number | string>('');

  const [selectedData, setSelectedData] = useState<{
    itemType: string;
    gemValue?: number;
    boostPercentage?: number;
    boostDays?: number;
    rarity?: number;
  }>({
    itemType: "gem_exchange",
  });

  if (!isRandomBoxModalOpen) return null;

  const handleSelectChange = (data: {
    itemType: string;
    gemValue?: number;
    boostPercentage?: number;
    boostDays?: number;
  }) => {
    setSelectedData(prevData => ({
      ...prevData,
      ...data
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value); // เก็บค่า input ดิบ

    // แปลงค่าเป็นตัวเลขเมื่อมีค่า หรือเป็น undefined เมื่อไม่มีค่า
    const numericValue = value === '' ? undefined : Number(value);

    // อัปเดต rarity ใน selectedData
    setSelectedData(prevData => ({
      ...prevData,
      rarity: numericValue
    }));
  };

  const handleConfirm = async () => {
    let payload;
  
    if (selectedData.itemType === "exp_boost") {
      payload = {
        ITEM_TYPE: selectedData.itemType,
        PRICE_GEM: 0,
        PRICE_EXP: 0,
        RARITY: selectedData.rarity !== undefined ? selectedData.rarity : 0,
        BOOST_MULTIPLIER: selectedData.boostPercentage || 0,
        BOOST_DAYS: selectedData.boostDays || 0,
      };
    } else {
      payload = {
        ITEM_TYPE: selectedData.itemType,
        PRICE_GEM: 0,
        PRICE_EXP: 0,
        RARITY: selectedData.rarity !== undefined ? selectedData.rarity : 0,
        GEM_REWARD: selectedData.gemValue || 20,
      };
    }
  
    console.log('ข้อมูลที่ส่งไปยัง API:', payload);
    const token = localStorage.getItem("accessToken");
    console.log('token API:', token);
  
    try {
      const response = await fetch('http://ce67-16.cloud.ce.kmitl.ac.th/api/v1/shop/mystery-box/test', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
  
      if (response.ok) {
        console.log('ส่งข้อมูลสำเร็จ! : ', payload);
        onConfirm();
      } else {
        console.error('ส่งข้อมูลไม่สำเร็จ:', response.statusText);
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดขณะส่งข้อมูล:', error);
    }
  
    setIsRandomBoxModalOpen(false);
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow max-w-[700px] w-full max-h-[600px] p-6 m-18">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold">เพิ่มเกณฑ์รางวัล</h2>
          <button onClick={() => setIsRandomBoxModalOpen(false)} className="text-gray-500 hover:text-gray-700">
            ✖
          </button>
        </div>
        <div className="mt-4 space-y-4 max-h-[500px] overflow-y-auto scrollbar-custom pr-2">
          <label className="block text-gray-700">ของรางวัลที่จะได้รับ</label>
          <CustomSelect onChange={handleSelectChange} />
          <label className="block text-gray-700">เกณฑ์การแลก</label>
          <div className="flex items-center">
            <input
              type="number"
              className="w-3/4 border rounded p-2"
              placeholder="กรอกจำนวน"
              value={inputValue}
              onChange={handleInputChange}
            />
            <span className="rounded-r-md border text-center border-l-0 border-gray-300 bg-white w-1/4 py-1.5 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              เปอร์เซ็น(%)
            </span>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setIsRandomBoxModalOpen(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700">
              ยกเลิก
            </button>
            <button
              onClick={handleConfirm}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRandomBox;