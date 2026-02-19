import React from "react";
import AccommodationData from "../interface/accommodation";
import AttractionData from "../interface/attraction";
import RestaurantData from "../interface/restaurant";
import { Icon } from "@iconify/react";
import Image from "next/image";

interface TripCardElementProps {
  location: AccommodationData | RestaurantData | AttractionData;
  locationType: string
  onClickLocationInfo: (location: AttractionData | RestaurantData | AccommodationData) => void;
  handleClickLocationDetails: (locationID: string,locationType: string) => void;
  handleClickAddLocationToTrip: (locationID: string,locationType: string) => void;
  index: number;
}
const ScrollLocationCard: React.FC<TripCardElementProps> = ({
  location,
  index,
  locationType,
  handleClickLocationDetails,
  onClickLocationInfo,
  handleClickAddLocationToTrip
}) => {
  return (
    <div className="flex relative pr-7 pl-10 py-2 flex-col w-full h-full cursor-pointer" 
    onClick={(e) => {
      e.stopPropagation();
      onClickLocationInfo(location);
    }}>
      <div className="flex justify-between flex-row">
        <div className="flex text-lg">{location.name}</div>
        <div
          className="flex text-sm flex-row bg-[#636363] rounded-2xl text-white px-2 py-1 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleClickLocationDetails(location._id,locationType)
          }}
        >
          <div className="flex mr-1">ข้อมูลสถานที่</div>
          <div className="flex">
            <Icon
              icon="mdi:compass"
              className="text-lg text-white"
              height={21}
              width={20}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row mt-1">
        <div className="flex flex-col w-[65%]">
          <div className="flex text-sm text-[#9B9B9B]">{location.type}</div>
          <div className="flex flex-row">
            <div className="flex flex-row mr-1">
              {Array.from({ length: Math.round(location.rating.score) }).map(
                (_, index) => (
                  <div key={index} className="flex justify-center items-center">
                    <Icon
                      icon="mynaui:star-solid"
                      className="text-lg text-[#666666]"
                    />
                  </div>
                )
              )}
            </div>
            <div className="flex kanit items-center justify-center font-bold text-[#666666] mr-1">
              {location.rating.score}
            </div>
            <div className="flex kanit items-center justify-center font-bold text-[#8A8A8A]">
              ({location.rating.ratingCount})
            </div>
          </div>
          <div className="flex mt-5 text-white kanit">
            <div className="flex flex-row px-3 py-1 rounded-lg bg-[#484848] hover:bg-[#585858] gap-x-2"           
            onClick={(e) => {
                e.stopPropagation();
                handleClickAddLocationToTrip(location._id,locationType)
            }}>
                <div className="flex justify-center items-center">
                    <Icon
                      icon="ic:baseline-plus"
                      className="text-lg"
                      width={20}
                      height={20}
                    />
                </div>
                <div className="flex justify-center items-center">
                    เพิ่มที่เที่ยว
                </div>
            </div>
          </div>
        </div>
        <div className="flex w-[35%] justify-end">
          {location.imgPath[0] && location.imgPath[0].trim() !== "" ? (
            <Image
              alt={`${location.imgPath[0]}-0`}
              src={location.imgPath[0]}
              width={0}
              height={0}
              sizes="100vw"
              className="rounded-xl w-full max-w-40 max-h-36 "
            />
          ) : (
            <Image
              alt={`${location.imgPath[0]}-1`}
              src="/th/images/no-img.png"
              width={0}
              height={0}
              sizes="100vw"
              className="rounded-xl w-full max-w-48 max-h-36"
            />
          )}
        </div>
      </div>
      <>
          <div className="flex absolute -top-0 -left-0">
            <Icon
              icon="fontisto:map-marker"
              className="text-lg text-[#9B9B9B]"
              width={36}
              height={36}
            />
          </div>
          <div className={`flex absolute kanit font-bold text-white -top-0 ${index < 9 ? 'left-[14px] text-lg ' : 'left-[10px]'}`}>
            {index + 1}
          </div>
        </>
    </div>
  );
};

export default ScrollLocationCard;
