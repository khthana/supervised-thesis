import React from "react";
import AccommodationData from "../interface/accommodation";
import AttractionData from "../interface/attraction";
import RestaurantData from "../interface/restaurant";
import { Icon } from "@iconify/react";
import FacilityComponent from "./facilityComponent";
import Image from "next/image";

interface TripCardElementProps {
  location: AccommodationData | RestaurantData | AttractionData;
  onClickLocationInfo: (location: AttractionData | RestaurantData | AccommodationData) => void;
  handleClickLocationDetails: (locationID: string,locationType: string) => void;
  locationType: string
  stayDuration?: number;
  travelTime: number;
  locationDistance: number;
  index: number;
}

const formattedDistance = (distance: number) => {
  return distance >= 1000
    ? `${(distance / 1000).toFixed(1)} กม.`
    : `${distance} ม.`;
};

const formattedDuration = (duration: number) => {
  return duration >= 3600
    ? `${Math.floor(duration / 3600)} ชม.${
        Math.floor((duration % 3600) / 60) !== 0
          ? ` ${Math.floor((duration % 3600) / 60)} น.`
          : ""
      }`
    : `${Math.floor(duration / 60)} น.`;
};

const formattedDurationPlace = (stayDuration: number) => {
  return stayDuration >= 60
    ? `${Math.floor(stayDuration / 60)} ชม.${
        stayDuration % 60 !== 0 ? ` ${stayDuration % 60} น.` : ""
      }`
    : `${stayDuration} น.`;
};

const TripCardElement: React.FC<TripCardElementProps> = ({
  location,
  travelTime,
  stayDuration,
  index,
  locationDistance,
  locationType,
  onClickLocationInfo,
  handleClickLocationDetails
}) => {
  return (
    <div className="flex relative pr-7 pl-10 py-2 flex-col w-full h-full cursor-pointer" 
    onClick={(e) => {
      e.stopPropagation();
      onClickLocationInfo(location);
    }}>
      {index != 0 && (
        <div className="flex flex-row items-center gap-2 mb-2">
          <div className="flex w-[20%] border-t-2 border-dashed border-gray-400"></div>
          <div className="flex flex-row w-[20%] items-center justify-center gap-x-2">
            <div className="flex">
              <Icon icon="mdi:car" className="text-gray-600 text-xl" />
            </div>
            <div className="flex text-[#878383] text-sm">
              {formattedDuration(travelTime)}
            </div>
            <div className="flex text-[#878383] text-sm">
              {formattedDistance(locationDistance)}
            </div>
          </div>
          <div className="flex w-[60%] border-t-2 border-dashed border-gray-400"></div>
        </div>
      )}
      {/*{location.name} --  - {stayDuration ? formattedDurationPlace(stayDuration) : "N/A"}*/}
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
          {stayDuration != null && stayDuration != 0 && (
            <>
              <div className="flex flex-row text-[#9B9B9B]">
                <div className="flex justify-center items-center mr-1">
                  <Icon icon="mdi:clock-outline" className="text-lg" />
                </div>
                <div className="flex justify-center items-center">
                  {formattedDurationPlace(stayDuration)}
                </div>
              </div>
            </>
          )}
          {location.facility != null && (
            <>
              <div className="flex flex-col text-[#595959]">
                <div className="flex mt-2 mr-1">สิ่งอำนวยความสะดวก</div>
                <div className="flex flex-wrap mt-2 gap-2">
                  {location.facility.map((item, index) => (
                    <FacilityComponent key={index} facility={item} />
                  ))}
                </div>
              </div>
            </>
          )}
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
      {index == 0 ? (
        <>
          <div className="flex absolute -top-0 -left-0">
            <Icon
              icon="fontisto:map-marker"
              className="text-lg text-[#9B9B9B]"
              width={36}
              height={36}
            />
          </div>
          <div className="flex text-lg absolute kanit font-bold text-white -top-0 left-[14px]">
            {index + 1}
          </div>
        </>
      ) : (
        <>
          <div className="flex absolute top-7 -left-0">
            <Icon
              icon="fontisto:map-marker"
              className="text-lg text-[#9B9B9B]"
              width={36}
              height={36}
            />
          </div>
          <div className="flex text-lg absolute kanit font-bold text-white top-7 left-[12px]">
            {index + 1}
          </div>
        </>
      )}
    </div>
  );
};

export default TripCardElement;
