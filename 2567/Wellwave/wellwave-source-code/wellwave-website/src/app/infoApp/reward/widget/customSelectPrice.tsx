import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const CustomSelectPrice = ({
    onChange,
}: {
    onChange: (data: { PRICE_EXP?: number; PRICE_GEM?: number }) => void;
}) => {
    const [selectedOption, setSelectedOption] = useState("Gem");
    const [gemValue, setGemValue] = useState<number | undefined>(undefined);
    const [expValue, setExpValue] = useState<number | undefined>(undefined);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // ส่งค่าไปยัง parent component เมื่อมีการเลือก และกรอกค่าต่างๆ
        if (selectedOption === "Gem" && gemValue) {
            onChange({
                PRICE_GEM: gemValue, // ส่งค่า PRICE_GEM
            });
        } else if (selectedOption === "Exp" && expValue) {
            onChange({
                PRICE_EXP: expValue, // ส่งค่า PRICE_EXP
            });
        }
    }, [selectedOption, gemValue, expValue, onChange]);

    const handleSelectChange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const value = e.currentTarget.getAttribute("data-value");
        if (value) {
            setSelectedOption(value);
            setIsOpen(false);

            // Reset ค่าเมื่อสลับไปเลือกตัวเลือกอื่น
            if (value === "Gem" && selectedOption !== "Gem") {
                setGemValue(undefined);
            } else if (value === "Exp" && selectedOption !== "Exp") {
                setExpValue(undefined);
            }
        }
    };

    return (
        <div className="flex gap-4 items-center">
            <div className="relative inline-block" ref={dropdownRef}>
                <div className="border rounded p-2 cursor-pointer w-28" onClick={() => setIsOpen(!isOpen)}>
                    <div className="flex items-center">
                        <Image
                            src={selectedOption === "Gem" ? "/asset/Gem.svg" : "/asset/EXP.svg"}
                            alt={selectedOption}
                            width={24}
                            height={24}
                            className="mr-2"
                        />
                        <span>{selectedOption === "Gem" ? "Gem" : "Exp"}</span>
                    </div>
                </div>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded w-full z-10">
                        <div className="flex items-center p-2 cursor-pointer w-full" data-value="Gem" onClick={handleSelectChange}>
                            <Image src="/asset/Gem.svg" alt="Gem" width={24} height={24} className="mr-2" />
                            <span>Gem</span>
                        </div>
                        <div className="flex items-center p-2 cursor-pointer w-full" data-value="Exp" onClick={handleSelectChange}>
                            <Image src="/asset/EXP.svg" alt="EXP" width={24} height={24} className="mr-2" />
                            <span>Exp</span>
                        </div>
                    </div>
                )}
            </div>

            {selectedOption === "Gem" && (
                <div className="w-full">
                    <input
                        type="number"
                        className="w-full border rounded p-2"
                        placeholder="จำนวน"
                        value={gemValue ?? ""}
                        onChange={(e) => {
                            const parsedValue = e.target.value ? parseInt(e.target.value) : undefined;
                            setGemValue(parsedValue);
                        }}
                    />
                </div>
            )}

            {selectedOption === "Exp" && (
                <div className="w-full">
                    <input
                        type="number"
                        className="w-full border rounded p-2"
                        placeholder="จำนวน"
                        value={expValue ?? ""}
                        onChange={(e) => {
                            const parsedValue = e.target.value ? parseInt(e.target.value) : undefined;
                            setExpValue(parsedValue);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default CustomSelectPrice;
