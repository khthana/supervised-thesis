/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import FileUpload from "../../components/upload";
import AddRandomBox from "./widget/addRandomBox";
import AddExchange from "./widget/addExchange";

interface ExpBooster {
  ITEM_ID: number;
  BOOST_MULTIPLIER: number;
  BOOST_DAYS: number;
}

interface GemExchange {
  ITEM_ID: number;
  GEM_REWARD: number;
}

interface MysteryBox {
  BOX_NAME: string;
  BOX_DESCRIPTION: string;
  PRICE_GEM: number;
  PRICE_EXP: number;
  IMAGE_URL: string | null;
  IS_ACTIVE: boolean;
}

interface Item {
  ITEM_ID: number;
  ITEM_TYPE: 'exp_boost' | 'gem_exchange';
  ITEM_NAME: string;
  DESCRIPTION: string;
  PRICE_GEM: number;
  PRICE_EXP: number;
  IMAGE_URL: string | null;
  RARITY: number;
  IS_ACTIVE: boolean;
  expBooster: ExpBooster | null;
  gemExchange: GemExchange | null;
  mysteryBoxes?: MysteryBox[];
}



const ShopItems = () => {
  const [activeTab, setActiveTab] = useState<"randomBox" | "exchange">("randomBox");
  const router = useRouter();
  const [isRandomBoxModalOpen, setIsRandomBoxModalOpen] = useState(false);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");
      console.log("Token:", token);
      const url =
        activeTab === "randomBox"
          ? "http://ce67-16.cloud.ce.kmitl.ac.th/api/v1/shop/items?filter=inBox&page=1&limit=10"
          : "http://ce67-16.cloud.ce.kmitl.ac.th/api/v1/shop/items?filter=notInBox&page=1&limit=10";

      console.log("API Response:", url);

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log("API Response :", data);

        setItems(data.data || []);


      } catch (error) {
        setError('Failed to fetch items');

      };
    };

    fetchData();
  }, [activeTab]);
  useEffect(() => {
    console.log("Updated items:", items);
  }, [items]);

  const itemImages = {
    exp_boost: "/asset/boost.svg",
    gem_exchange: "/asset/Gem.svg",
    mystery_box: "/asset/boost.svg",
  };

  const handleConfirm = () => {
    console.log('ยืนยันแล้ว!');
    setIsRandomBoxModalOpen(false); // ปิด Modal เมื่อกดปุ่มยืนยัน
  };

  return (
    <div className="top-0 px-28 py-6 bg-gray-100 h-screen font-sans">
      <div className="bg-white shadow rounded-lg p-6 mt-16 h-[600px] flex flex-col ">
        <p
          className="text-gray-600 text-sm pb-3 flex items-center cursor-pointer group"
          onClick={() => router.back()} // ย้อนกลับ
        >
          <span className="hover:underline inline-flex items-center group-hover:text-black">
            เพิ่มข้อมูล</span>
          <span style={{ margin: "0 8px" }}> &gt; </span>
          <Image
            src="/asset/reward.svg"
            alt="reward"
            width={16}
            height={16}
            className="mr-1"
          />
          <span className="text-black">ของรางวัล</span>

        </p>
        <div className="flex justify-between items-center mb-2" ><h1 className="text-xl font-bold text-gray-800">ของรางวัลทั้งหมด</h1>
        </div>
        {/*แสดงรางวัลในระบบ */}
        <div className="flex items-center gap-4">
          <div className="w-36 h-36 rounded-xl flex flex-col items-center justify-center border border-gray-300">
            <Image
              src="/asset/EXP.svg"
              alt="EXP"
              width={64}
              height={64}
              className="mb-2" // เพิ่มช่องว่างระหว่างรูปภาพและข้อความ
            />
            <p >EXP</p>
          </div>
          <div className="w-36 h-36 rounded-xl flex flex-col items-center justify-center border border-gray-300">
            <Image
              src="/asset/Gem.svg"
              alt="GEM"
              width={56}
              height={56}
              className="mb-2" // เพิ่มช่องว่างระหว่างรูปภาพและข้อความ
            />
            <p >GEM</p>
          </div>
          <div className="w-36 h-36 rounded-xl flex flex-col items-center justify-center border border-gray-300">
            <Image
              src="/asset/boost.svg"
              alt="EXP"
              width={64}
              height={64}
              className="mb-2" // เพิ่มช่องว่างระหว่างรูปภาพและข้อความ
            />
            <p >Booster</p>
          </div>




        </div>
        {/* แถบสลับระหว่าง "กล่องสุ่ม" และ "แลกเปลี่ยน" */}
        <div className="flex  mt-1  items-center">
          <div className="flex">
            <button
              className={`px-4 py-2 ${activeTab === "randomBox" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"}`}
              onClick={() => setActiveTab("randomBox")}
            >
              กล่องสุ่ม
            </button>
            <button
              className={`px-4 py-2 ml-4 ${activeTab === "exchange" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"}`}
              onClick={() => setActiveTab("exchange")}
            >
              แลกเปลี่ยน
            </button>
          </div>
          {/* ส่วนของปุ่มเพิ่ม */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-auto"
            onClick={() => activeTab === "randomBox"
              ? setIsRandomBoxModalOpen(true)
              : setIsExchangeModalOpen(true)}
          >
            + {activeTab === "randomBox" ? "เพิ่มเกณฑ์รางวัล" : "เพิ่มรายการแลกเปลี่ยน"}
          </button>

          {isRandomBoxModalOpen && (
            <AddRandomBox
              isRandomBoxModalOpen={isRandomBoxModalOpen}
              setIsRandomBoxModalOpen={setIsRandomBoxModalOpen}
              onConfirm={handleConfirm}
            />
          )}

          {isExchangeModalOpen && (
            <AddExchange
              isExchangeModalOpen={isExchangeModalOpen}
              setIsExchangeModalOpen={setIsExchangeModalOpen}
            />)}
        </div>


        {activeTab === "randomBox" && (
          <div className="rounded">
            <table className="w-full border-collapse">
              <thead className="bg-white">
                <tr className="text-left text-gray-600">
                  <th className="py-2 px-4 border-b cursor-pointer w-3/4">
                    ของรางวัลที่จะได้รับ
                  </th>
                  <th className="py-2 px-14 border-b cursor-pointer w-1/4 text-center">
                    อัตราการเกิด
                  </th>
                </tr>
              </thead>
            </table>
            <div className="max-h-[220px] overflow-y-auto scrollbar-custom">
              <table className="w-full border-collapse">
                <tbody>
                  {Array.isArray(items) &&
                    items.map((item) => (
                      item.mysteryBoxes?.map((box, index) => (
                        <tr key={`${item.ITEM_ID}-${index}`} className="text-sm text-gray-700 hover:bg-gray-50">
                          <td className="py-2 px-4 border-b w-3/4">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-3">
                                <Image src={itemImages[item.ITEM_TYPE] || "/asset/boost.svg"} alt={item.ITEM_TYPE} width={24} height={24} />
                                <span>
                                  {item.ITEM_TYPE === 'gem_exchange' && (
                                    <p className="m-0">{item.gemExchange?.GEM_REWARD} Gem</p>
                                  )}
                                  {item.ITEM_TYPE === 'exp_boost' && (
                                    <p className="m-0">เพิ่ม EXP {item.expBooster?.BOOST_MULTIPLIER} เท่า เป็นจำนวน {item.expBooster?.BOOST_DAYS} วัน</p>
                                  )}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2  border-b w-1/4 text-center">{(item.RARITY * 100).toFixed(0)}%</td>
                        </tr>
                      ))
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "exchange" && (
          <div>
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left text-gray-600">
                  <th className="py-2 px-4 border-b cursor-pointer">
                    ของรางวัลที่จะได้รับ
                  </th>
                  <th className="py-2 px-4 border-b cursor-pointer">
                    เกณฑ์การแลกเปลี่ยน
                  </th>
                </tr>
              </thead>
            </table>

            {/* ใส่ div นี้ครอบ tbody เพื่อให้มี scrollbar */}
            <div className="max-h-[220px] overflow-y-auto scrollbar-custom">
              <table className="w-full border-collapse">
                <tbody>
                  {Array.isArray(items) &&
                    items.map((item) => (
                      <tr key={item.ITEM_ID} className="text-sm text-gray-700 ">
                        <td className="py-2 px-4 border-b">
                          <div className="flex items-center space-x-3">
                            <Image src={itemImages[item.ITEM_TYPE] || "/asset/EXP.svg"} alt={item.ITEM_TYPE} width={24} height={24} />
                            <span>{item.PRICE_EXP}</span>
                          </div>
                        </td>
                        <td className=" border-b ">
                          <div className="flex items-center space-x-2">
                            {item.PRICE_EXP > 0 ? (
                              <>
                                <Image src="/asset/EXP.svg" alt="EXP" width={24} height={24} />
                                <span>{item.PRICE_EXP} exp</span>
                              </>
                            ) : (
                              <>
                                <Image src="/asset/Gem.svg" alt="GEM" width={24} height={24} />
                                <span>{item.PRICE_GEM} Gems</span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default ShopItems;
