import React, { useState } from "react";
import { Icon } from "@iconify/react";
import OpenDateComponent from "./OpenDateComponent";
import dateOpen from "../interface/dateOpen";
import PerfectScrollbar from "react-perfect-scrollbar";
import RedirectLinkComponent from "./RedirectLinkComponent";
import "../plantrip/carousel.css";
import Image from "next/image";
import ReactLightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

interface PlanningCardDetailsProps {
  title: string;
  type: string[];
  address: string;
  dateOpen?: dateOpen[];
  imgPath: string[];
  phone: string;
}

export default function PlanningCardDetails({
  title,
  type,
  address,
  dateOpen,
  phone,
  imgPath,
  handleClick,
}: PlanningCardDetailsProps & { handleClick: () => void }) {
  const splitAddress = address.split(" ").slice(1).join(" ");
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  return (
    <>
      <div className="flex flex-col w-full h-full">
        <div className="flex mb-2 px-10 justify-end">
          <div
            className="flex rounded-full cursor-pointer bg-[#fafafa] hover:bg-[#cacaca]"
            onClick={handleClick}
          >
            <Icon
              icon="iconoir:cancel"
              className="text-lg text-[#414141]"
              width={24}
              height={24}
            />
          </div>
        </div>
        <div className="flex w-full h-full px-8">
          <PerfectScrollbar
            className="flex w-full h-72 flex-row rounded-xl bg-white p-5 kanit relative"
            style={{
              overflow: "auto",
            }}
          >
            <div className="flex flex-col w-[80%]">
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col">
                  <div className="flex font-bold text-lg">{title}</div>
                  <div className="flex text-[#9B9B9B]">{type}</div>
                </div>
              </div>
              <div className="flex flex-col gap-y-1">
                <div className="flex flex-row gap-x-1">
                  <div className="flex justify-center items-center">
                    <Icon
                      icon="tabler:map-pin-filled"
                      className="text-lg text-[#636363]"
                      width={18}
                      height={18}
                    />
                  </div>
                  <div className="flex text-[#9B9B9B]">
                    Address: {splitAddress}
                  </div>
                </div>
                {dateOpen && dateOpen.length > 0 && (
                  <div className="flex">
                    <OpenDateComponent dateOpen={dateOpen} />
                  </div>
                )}
                {phone && (
                  <div className="flex flex-row gap-x-1">
                    <div className="flex justify-center items-center">
                      <Icon
                        icon="solar:phone-bold"
                        className="text-lg text-[#636363]"
                        width={18}
                        height={18}
                      />
                    </div>
                    <div className="flex text-[#9B9B9B]">{phone}</div>
                  </div>
                )}
              </div>
              <div className="flex flex-col mt-5 kanit text-[#9B9B9B]">
                <div className="flex text-sm">ดูเพิ่มเติมที่:</div>
                <div className="flex flex-row w-full h-full mt-1 gap-x-2 mb-5">
                  <RedirectLinkComponent
                    icon="/th/images/google.webp"
                    label="Google"
                    link={`https://www.google.co.th/search?q=` + title}
                  />
                  <RedirectLinkComponent
                    icon="/th/images/googlemap.png"
                    label="Google Map"
                    link={`http://maps.google.com/?q=` + title}
                  />
                </div>
              </div>
            </div>
            <div className="flex absolute top-0 right-0 bottom-0 p-5">
              <div className="flex relative max-h-32 cursor-pointer text-white hover:text-[#a1a1a1]"
              onClick={() => {
                setPhotoIndex(0);
                setIsOpen(true);
              }}>
                <Image
                  alt="img-planning-card"
                  src={imgPath[0]}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="rounded-xl w-full max-w-32 max-h-32 cursor-pointer"
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
          </PerfectScrollbar>
        </div>
      </div>
      {isOpen && (
        <ReactLightbox
          mainSrc={imgPath[photoIndex]}
          nextSrc={imgPath[(photoIndex + 1) % imgPath.length]}
          prevSrc={imgPath[(photoIndex + imgPath.length - 1) % imgPath.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + imgPath.length - 1) % imgPath.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % imgPath.length)
          }
        />
      )}
    </>
  );
}
