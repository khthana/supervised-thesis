import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import AccommodationData from "../interface/accommodation";
import FacilityComponent from "./facilityComponent";
import ReactLightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

export default function AccommodationCard({
  data,
  distance,
  duration,
  onDelete,
}: {
  data: AccommodationData;
  distance: number;
  duration: number;
  onDelete: () => void;
}) {
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

  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  return (
    <>
      <div className="relative group flex w-full h-full flex-row justify-between pr-5">
        <div className="flex w-[70%] flex-col h-auto p-4 rounded-lg bg-[#F2F2F2] justify-between kanit">
          <div className="flex flex-col">
            <div className="flex text-lg kanit text-[#595959]">{data.name}</div>
            <div className="flex kanit text-[#9B9B9B]">{data.type}</div>
            <div className="flex flex-row">
              <div className="flex flex-row mr-1">
                {Array.from({ length: Math.round(data.star) }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="flex justify-center items-center"
                    >
                      <Icon
                        icon="mynaui:star-solid"
                        className="text-lg text-[#666666]"
                      />
                    </div>
                  )
                )}
              </div>
              <div className="flex kanit items-center justify-center font-bold text-[#666666] mr-1">
                {data.star}
              </div>
              <div className="flex kanit items-center justify-center font-bold text-[#8A8A8A]">
                ({data.rating.ratingCount})
              </div>
            </div>
          </div>
          <div className="flex flex-row mt-2 w-[50%] justify-between">
            <div className="flex flex-row">
              <div className="flex items-center justify-center mr-1">
                <Icon
                  icon="material-symbols:flag-outline"
                  className="text-lg text-[#9B9B9B]"
                />
              </div>
              <div className="flex items-center justify-center kanit text-[#9B9B9B]">
                {formattedDuration}
              </div>
            </div>
            <div className="flex flex-row">
              <div className="flex items-center justify-center mr-1">
                <Icon
                  icon="teenyicons:pin-outline"
                  className="text-lg text-[#9B9B9B]"
                />
              </div>
              <div className="flex items-center justify-center kanit text-[#9B9B9B]">
                {formattedDistance}
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-2">
            <div className="flex text-[#595959]">สิ่งอำนวยความสะดวก</div>
            <div className="flex flex-wrap mt-2 gap-2">
              {data.facility.map((item, index) => (
                <FacilityComponent key={index} facility={item} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-[30%] justify-end">
          <div
            className="flex w-full justify-end max-w-48 max-h-40 relative cursor-pointer text-white hover:text-[#a1a1a1]"
            onClick={() => {
              setPhotoIndex(0);
              setIsOpen(true);
            }}
          >
            <Image
              alt="img-planning-card"
              src={data.imgPath[0]}
              width={0}
              height={0}
              sizes="100vw"
              className="rounded-xl w-full max-w-48 max-h-40"
            />
            <div className="flex absolute justify-center items-center bottom-2 right-2">
              <Icon
                icon="ic:outline-zoom-in"
                className="text-lg font-bold"
                width={28}
                height={28}
              />
            </div>
          </div>
        </div>
        <div
          className="flex absolute top-[50%] -right-3 opacity-0 group-hover:opacity-100 group-hover/hover:opacity-0 transition-opacity cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
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

      {isOpen && (
        <ReactLightbox
          mainSrc={data.imgPath[photoIndex]}
          nextSrc={data.imgPath[(photoIndex + 1) % data.imgPath.length]}
          prevSrc={
            data.imgPath[
              (photoIndex + data.imgPath.length - 1) % data.imgPath.length
            ]
          }
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex(
              (photoIndex + data.imgPath.length - 1) % data.imgPath.length
            )
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % data.imgPath.length)
          }
        />
      )}
    </>
  );
}
