import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const CustomSelect = ({
  onChange,
}: {
  onChange: (data: {
    itemType: string;
    gemValue?: number;
    boostPercentage?: number;
    boostDays?: number
  }) => void;
}) => {
  const [selectedOption, setSelectedOption] = useState("Gem");
  const [gemValue, setGemValue] = useState<number | undefined>(undefined);
  const [boostPercentage, setBoostPercentage] = useState<number | undefined>(undefined);
  const [boostDays, setBoostDays] = useState<number | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // เมื่อเลือก Gem หรือ Booster ให้ส่งค่าที่ถูกต้องไปยัง onChange
  useEffect(() => {
    onChange({
      itemType: selectedOption === "Gem" ? "gem_exchange" : "exp_boost",
      gemValue,
      boostPercentage,
      boostDays,
    });
  }, [selectedOption, gemValue, boostPercentage, boostDays, onChange]);
  const handleGemValueChange = (value: number | undefined) => {
    setGemValue(value);

    // Update the parent component's state
    onChange({
      itemType: selectedOption === "gem_exchange" ? "gem_exchange" : "exp_boost",
      gemValue: value,
      boostPercentage,
      boostDays,
    });
  };
  const handleSelectChange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const value = e.currentTarget.getAttribute("data-value");
    if (value) {
      setSelectedOption(value);
      setIsOpen(false);

      // Reset values when switching between types
      if (value === "gem_exchange" && selectedOption !== "gem_exchange") {
        setGemValue(undefined);
        setBoostPercentage(undefined);
        setBoostDays(undefined);
      } else if (value === "exp_boost" && selectedOption !== "exp_boost") {
        setGemValue(undefined);
        setBoostPercentage(undefined);
        setBoostDays(undefined);
      }
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <div className="relative inline-block w-28" ref={dropdownRef}>
        <div className="border rounded p-2 cursor-pointer w-28" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center">
            <Image src={selectedOption === "Gem" ? "/asset/Gem.svg" : "/asset/boost.svg"} alt={selectedOption} width={24} height={24} className="mr-2" />
            <span>{selectedOption === "Gem" ? "Gem" : "Booster"}</span>
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded w-full z-10">
            <div className="flex items-center p-2 cursor-pointer w-28" data-value="Gem" onClick={handleSelectChange}>
              <Image src="/asset/Gem.svg" alt="Gem" width={24} height={24} className="mr-2" />
              <span>Gem</span>
            </div>
            <div className="flex items-center p-2 cursor-pointer w-28" data-value="Booster" onClick={handleSelectChange}>
              <Image src="/asset/boost.svg" alt="Boost" width={24} height={24} className="mr-2" />
              <span>Booster</span>
            </div>
          </div>
        )}
      </div>

      {selectedOption === "Gem" && (
        <input
          type="number"
          className="w-full border rounded p-2"
          placeholder="จำนวน"
          value={gemValue ?? ""}
          onChange={(e) => {
            const parsedValue = e.target.value ? parseInt(e.target.value) : undefined;
            handleGemValueChange(parsedValue);
          }}
        />
      )}

      {selectedOption === "Booster" && (
        <div className="flex items-center">
          <input
            type="number"
            value={boostPercentage || ""}
            onChange={(e) => setBoostPercentage(e.target.value ? parseInt(e.target.value) : undefined)}
            min="1"
            className="w-28 rounded-l-md border border-gray-300 text-center text-gray-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="rounded-r-md border border-l-0 border-gray-300 bg-white px-5 py-1.5 text-lg text-gray-700">%</span>

          <input
            type="number"
            value={boostDays || ""}
            onChange={(e) => setBoostDays(e.target.value ? parseInt(e.target.value) : undefined)}
            min="1"
            className="ml-4 w-28 rounded-l-md border border-gray-300 text-center text-gray-400 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="rounded-r-md border border-l-0 border-gray-300 bg-white px-5 py-1.5 text-lg text-gray-700">วัน</span>
        </div>
      )}
    </div>
  );
};
export default CustomSelect;
