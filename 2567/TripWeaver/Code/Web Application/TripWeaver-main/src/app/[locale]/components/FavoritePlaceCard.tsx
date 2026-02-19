import React from "react";
import { Icon } from "@iconify/react";
import { redirect } from "next/navigation";
import { useRouter } from 'next/navigation';

interface FavoritePlaceCard {
  attractionID: string;
  attractionName: string;
  attractionImage: string;
}

export default function FavoritePlaceCard({
    attractionID,
    attractionName,
    attractionImage,
  }: FavoritePlaceCard) {

    const handleClickViewDetails = (attractionID: string) => {
        console.log("Navigate to",attractionID);
    }

    const router = useRouter();


    return (
        <>
            <div className="flex relative w-full h-full flex-col justify-end cursor-pointer overflow-hidden rounded-xl group select-none " onClick={
                (e) => {
                  e.stopPropagation();
                  handleClickViewDetails(attractionID)
                  router.push(`/attraction_detail/${attractionID}`)}}
                
            >
                <div 
                className={`flex absolute bg-cover bg-center w-full h-full rounded-xl group-hover:scale-110 transition-all duration-300`} 
                style={{ backgroundImage: `url('${attractionImage && attractionImage.trim() !== "" ? attractionImage : '/images/no-img.png'}')` }} 
                />
                <div className="flex p-2 flex-col w-full h-12 bg-opacity-70 justify-center font-bold bg-black text-white kanit rounded-b-xl items-start z-10">
                    {attractionName}
                </div>
            </div>
        </>
    );
}
