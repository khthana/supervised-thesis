
import React, { useState } from 'react';
import CustomSelect from './customSelect';
import CustomSelectPrice from './customSelectPrice';


interface AddExchangeProps {
  isExchangeModalOpen: boolean;
  setIsExchangeModalOpen: (isOpen: boolean) => void;
}

interface SelectDataPrice {
  PRICE_EXP?: number;
  PRICE_GEM?: number;
  GEM_REWARD?: number;
}

interface RequestBody {
  ITEM_TYPE: string;
  PRICE_EXP: number;
  RARITY: number;
  GEM_REWARD: number;
  ITEM_NAME?: string;
  PRICE_GEM?: number;
  BOOST_MULTIPLIER?: number;
  BOOST_DAYS?: number;
}

const AddExchange: React.FC<AddExchangeProps> = ({ isExchangeModalOpen, setIsExchangeModalOpen }) => {
  const [selectedData, setSelectedData] = useState<{
    itemType: string;
    gemValue?: number;
    boostPercentage?: number;
    priceExp?: number;
    rarity?: number;
    itemName?: string;
    boostMultiplier?: number;
    boostDays?: number;
  }>({
    itemType: "gem_exchange", // Default selection
  });

  const [selectedDataPrice, setSelectedDataPrice] = useState<SelectDataPrice | null>(null);

  if (!isExchangeModalOpen) return null;

  // Update selectedData when CustomSelect changes
  const handleSelectChange = (data: {
    itemType: string;
    gemValue?: number;
    boostPercentage?: number;
    boostDays?: number;
  }) => {
    setSelectedData(data);
  };


  // Update price-related data when CustomSelectPrice changes
  const handleChange = (data: SelectDataPrice) => {
    setSelectedDataPrice(data);
  };

  const handleSubmit = async () => {
    console.log('Submitting...'); // ตรวจสอบว่าโค้ดนี้ทำงานหรือไม่
    console.log('Selected Data:', selectedData);
    console.log('Selected Data Price:', selectedDataPrice);

    const requestBody: RequestBody = {
      ITEM_TYPE: selectedData.itemType,
      PRICE_EXP: selectedDataPrice?.PRICE_EXP ?? selectedData.priceExp ?? 0,
      RARITY: selectedData.rarity ?? 0,
      GEM_REWARD: selectedDataPrice?.GEM_REWARD ?? selectedData.gemValue ?? 0,
      ITEM_NAME: selectedData.itemName,
      PRICE_GEM: selectedDataPrice?.PRICE_GEM,
      BOOST_MULTIPLIER: selectedData.boostPercentage,
      BOOST_DAYS: selectedData.boostDays,
    };

    console.log('Request Body:', requestBody);
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch('http://ce67-16.cloud.ce.kmitl.ac.th/api/v1/shop/items', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Response Data:', responseData);
        setIsExchangeModalOpen(false);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };



  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow w-full max-w-[600px] p-6 m-18 h-auto min-h-[300px]">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold">เพิ่มของรางวัล (Random Box)</h2>
          <button onClick={() => setIsExchangeModalOpen(false)} className="text-gray-500 hover:text-gray-700">
            ✖
          </button>
        </div>
        <div className="mt-4 space-y-4 w-full">
          <label className="block text-gray-700">ของรางวัลที่จะได้รับ</label>
          <CustomSelect onChange={handleSelectChange} />

          <label className="block text-gray-700">เกณฑ์การแลก</label>
          <CustomSelectPrice onChange={handleChange} />

          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setIsExchangeModalOpen(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700">
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

export default AddExchange;
