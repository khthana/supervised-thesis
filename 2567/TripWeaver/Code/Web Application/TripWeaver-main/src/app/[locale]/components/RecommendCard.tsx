
import React from "react";
import { Icon } from "@iconify/react";

interface RecommendCardProps {
    img: String
    title: String
    type: String
    rating: number
    ratingCount: number
    id: string
    clickAddTrip: (id: string) => void;
}

export default function RecommendCard({img,title,type,rating,ratingCount,clickAddTrip,id}: RecommendCardProps) {
    return(
        <>
            <div className="flex flex-col h-72 w-full p-2 bg-[#F0F0F0] cursor-pointer" onClick={() => clickAddTrip(id)}>
                <div className={`flex h-28 w-full bg-cover bg-center rounded-t-xl`} style={{ backgroundImage: `url('${img}')` }}/>
                <div className="flex flex-col h-36 bg-white p-2 rounded-b-xl">
                    <div className="block mt-1 w-48 kanit text-lg text-[#595959] text-ellipsis overflow-hidden whitespace-nowrap">{title}</div>

                    <div className="flex -mt-2 kanit text-[#9B9B9B]">{type}</div>
                    <div className="flex flex-row">

                        <div className="flex flex-row mr-1">
                            {Array.from({ length: Math.round(rating) }).map((_, index) => (
                                <div key={index} className="flex justify-center items-center">
                                    <Icon
                                        icon="mynaui:star-solid"
                                        className="text-lg text-[#666666]"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex kanit items-center justify-center font-bold text-[#666666] mr-1">
                            {rating}
                        </div>
                        <div className="flex kanit items-center justify-center font-bold text-[#8A8A8A]">
                            ({ratingCount})
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}