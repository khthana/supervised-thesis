import React from "react";
import { Icon } from "@iconify/react";
import { redirect } from "next/navigation";

interface LocationCard {
  placeID: string;
  placeName: string;
  placeImage: string;
  placeType: string;
  handleClickViewDetails: (placeID: string,locationType: string) => void;
  onClickAddTrip: (tripID: string) => void;
}

export default function LocationCard({
    placeID,
    placeName,
    placeType,
    handleClickViewDetails,
    placeImage,
    onClickAddTrip
  }: LocationCard) {

    return (
        <>
            <div className="flex relative w-full h-full flex-col justify-end cursor-pointer overflow-hidden rounded-xl group select-none " onClick={
                (e) => {
                  e.stopPropagation();
                  handleClickViewDetails(placeID,placeType)}}
            >
                <div 
                className={`flex absolute bg-cover bg-center w-full h-full rounded-xl group-hover:scale-110 transition-all duration-300`} 
                style={{ backgroundImage: `url('${placeImage && placeImage.trim() !== "" ? placeImage : '/images/no-img.png'}')` }} 
                />
                <div className="flex p-2 flex-col w-full h-12 bg-opacity-70 justify-center font-bold bg-black text-white kanit rounded-b-xl items-start z-10">
                    {placeName}
                </div>
                <div className="group-hover:flex hover:bg-[#555555] hidden flex-row absolute z-20 bg-[#484848] top-2 right-2 kanit text-white py-1 px-2 rounded-xl"onClick={
                (e) => {
                  e.stopPropagation();
                  onClickAddTrip(placeID)}}
                >
                    <div className="flex items-center justify-center">
                        <Icon
                            icon="ic:round-plus"
                            className="text-lg font-bold"
                            height={21}
                            width={20}
                        />
                    </div>
                    <div className="flex justify-center items-center text-sm">
                        เพิ่มในทริป
                    </div>
                </div>
            </div>
        </>
    );
}
