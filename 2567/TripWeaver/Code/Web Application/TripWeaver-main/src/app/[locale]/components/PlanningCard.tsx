import React from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import AttractionData from "../interface/attraction";
import RestaurantData from "../interface/restaurant";


type PlanningCardProps = (AttractionData | RestaurantData) & {
  priceRange?: string;
  description?: string;
  facility?: string[];
  phone?: string[];
  website?: string;
  onDelete: (id: string) => void;
  handleClickEditDuration: (id: string) => void;
  handleClick: (location: AttractionData | RestaurantData) => void;
  index: number;
  distance: number;
  duration: number;
  stayDuration: number;
};

export default function PlanningCard({
  _id,
  uuid,
  name,
  type,
  rating,
  imgPath,
  latitude,
  longitude,
  location,
  openingHour,
  description,
  facility,
  phone,
  website,
  priceRange,
  onDelete,
  handleClick,
  handleClickEditDuration,
  index,
  distance = 0,
  duration = 0,
  stayDuration,
}: PlanningCardProps) {

  const formattedDistance =
    distance >= 1000 ? `${(distance / 1000).toFixed(1)} กม.` : `${distance} ม.`;

  const formattedDuration =
    duration >= 3600
      ? `${Math.floor(duration / 3600)} ชม.${
          Math.floor((duration % 3600) / 60) !== 0
            ? ` ${Math.floor((duration % 3600) / 60)} น.`
            : ""
        }`
      : `${Math.floor(duration / 60)} น.`;

      const formattedDurationPlace =
      stayDuration >= 60
        ? `${Math.floor(stayDuration / 60)} ชม.${
          stayDuration % 60 !== 0 ? ` ${stayDuration % 60} น.` : ""
          }`
        : `${stayDuration} น.`;

  return (
    <>
      <div
        onClick={() =>
            handleClick({
            _id,
            name,
            uuid,
            type,
            rating,
            imgPath,
            latitude,
            longitude,
            openingHour,
            location,
            description,
            facility,
            phone,
            website,
            priceRange: priceRange ?? "",
          })
        }
        className="relative group flex w-full h-full flex-row justify-between pr-5"
      >
        <div className="flex absolute top-[40%] -left-8">
          <Icon
            icon="lsicon:drag-outline"
            className="text-lg text-[#9B9B9B]"
            width={36}
            height={36}
          />
        </div>
        <div className="flex flex-row bg-[#F2F2F2] hover:bg-[#e6e6e6] w-full rounded-lg justify-between">
        <div className="flex w-[60%] flex-col h-auto p-4 ml-2">
          <div className="flex flex-col">
            <div className="flex text-lg kanit text-[#595959]">{name}</div>
            <div className="flex kanit text-[#9B9B9B]">{type}</div>
            <div className="flex flex-row">
              <div className="flex flex-row mr-1">
                {Array.from({ length: Math.round(rating.score) }).map((_, index) => (
                  <div key={index} className="flex justify-center items-center">
                    <Icon
                      icon="mynaui:star-solid"
                      className="text-lg text-[#666666]"
                    />
                  </div>
                ))}
              </div>
              <div className="flex kanit items-center justify-center font-bold text-[#666666] mr-1">
                {rating.score}
              </div>
              <div className="flex kanit items-center justify-center font-bold text-[#8A8A8A]">
                ({rating.ratingCount})
              </div>
            </div>
          </div>
          <div className="flex flex-row mt-2 justify-start w-full ">
            <div className="flex flex-row w-[33%]">
              <div className="flex items-center justify-center mr-1">
                <Icon
                  icon="material-symbols:flag-outline"
                  className="text-lg text-[#9B9B9B]"
                />
              </div>
              <div className="flex items-center justify-center kanit text-[#9B9B9B]">
                {index === 0 ? "จุดเริ่มต้น" : `${formattedDuration}`}
              </div>
            </div>
            <div className="flex flex-row w-[33%]">
              <div className="flex items-center justify-center mr-1">
                <Icon
                  icon="teenyicons:pin-outline"
                  className="text-lg text-[#9B9B9B]"
                />
              </div>
              <div className="flex items-center justify-center kanit text-[#9B9B9B]">
                {index === 0 ? "จุดเริ่มต้น" : `${formattedDistance}`}
              </div>
            </div>
            <div className="flex flex-row cursor-pointer hover:text-[#595959] text-[#9B9B9B]  w-[33%]" onClick={
                (e) => {
                  e.stopPropagation();
                  handleClickEditDuration(uuid)}}>
              <div className="flex items-center justify-center mr-1">
                <Icon icon="mdi:clock-outline" className="text-lg" />
              </div>
              <div className="flex items-center justify-center kanit"
                >
                {formattedDurationPlace}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-[40%] justify-end">
          {
            imgPath[0] && imgPath[0].trim() !== "" ? (
              <Image
                alt={`${imgPath[0]}-0`}
                src={imgPath[0]}
                width={0}
                height={0}
                sizes="100vw"
                className="rounded-xl w-full max-w-48 max-h-36 "
              />
            ) : (
              <Image
                alt={`${imgPath[0]}-1`}
                src="/th/images/no-img.png"
                width={0}
                height={0}
                sizes="100vw"
                className="rounded-xl w-full max-w-48 max-h-36"
              />
            )
          }

        </div>
        </div>
        <div className="flex absolute -top-3 -left-2">
          <Icon
            icon="fontisto:map-marker"
            className="text-lg text-[#9B9B9B]"
            width={36}
            height={36}
          />
        </div>
        <div className="flex absolute kanit font-bold text-white -top-2 left-[6px]">
          {index + 1}
        </div>
        <div
          className="flex absolute top-[40%] -right-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={(e) => { 
            e.stopPropagation();
            onDelete(uuid);
            }}
        >
          <Icon
            icon="gravity-ui:trash-bin"
            className="text-lg text-[#9B9B9B]"
            width={24}
            height={24}
          />
        </div>
      </div>
    </>
  );
}
