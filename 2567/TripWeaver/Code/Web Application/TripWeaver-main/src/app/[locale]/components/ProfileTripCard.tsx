import React from "react";
import { Icon } from "@iconify/react";
import { redirect } from "next/navigation";
import { useRouter } from 'next/navigation';

interface BlogCard {
  tripID: string;
  tripName: string;
  tripImage: string;
}

export default function BlogCard({
    tripID,
    tripName,
    tripImage,
  }: BlogCard) {

    const handleClickViewDetails = (tripID: string) => {
        console.log("Navigate to",tripID);
    }

    const router = useRouter();


    return (
        <>
            <div className="flex relative w-full h-full flex-col justify-end cursor-pointer overflow-hidden rounded-xl group select-none " onClick={
                (e) => {
                  e.stopPropagation();
                  handleClickViewDetails(tripID)
                  router.push(`/plantrip/summary/${tripID}`)}}
            >
                <div 
                className={`flex absolute bg-cover bg-center w-full h-full rounded-xl group-hover:scale-110 transition-all duration-300`} 
                style={{ backgroundImage: `url('${tripImage && tripImage.trim() !== "" ? tripImage : '/images/no-img.png'}')` }} 
                />
                <div className="flex p-2 flex-col w-full h-12 bg-opacity-70 justify-center font-bold bg-black text-white kanit rounded-b-xl items-start z-10">
                    {tripName}
                </div>
            </div>
        </>
    );
}
