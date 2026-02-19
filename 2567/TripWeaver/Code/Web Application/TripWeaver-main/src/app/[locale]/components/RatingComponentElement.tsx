import React from "react";
import Rating from "../interface/rating";
import { Icon } from "@iconify/react/dist/iconify.js";

interface RatingComponentElementProps {
    ratingObject: Rating;
    checked: boolean;
    onClick: (star: number) => void;
}

export default function RatingComponentElement({ ratingObject, checked, onClick }: RatingComponentElementProps) {

    const handleCheckboxChange = () => {
        onClick(ratingObject.star); 
    };

    const stars = Array.from({ length: ratingObject.star }, (_, index) => (
        <Icon key={index} icon="heroicons:star-solid" className='text-orange-500' />
    ));

    return (
        <div className="flex items-center kanit py-2 mr-2 px-2 rounded-lg hover:bg-[#E9ECEE] cursor-pointer" onClick={handleCheckboxChange} >
            <input
                id={`checkbox-item-${ratingObject.star}`}
                type="checkbox"
                checked={checked}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <div
                className="kanit w-full ms-2 text-sm font-medium rounded text-black cursor-pointer"
            >
                <div className="flex w-full flex-row">
                    <div className="flex items-center w-[10%]">
                        {ratingObject.star}
                    </div>
                    <div className="flex items-center w-[30%]">
                        ({ratingObject.count})
                    </div>
                    <div className="flex items-center w-[60%]">
                        {stars}
                    </div>
                </div>
            </div>
        </div>
    );
}
