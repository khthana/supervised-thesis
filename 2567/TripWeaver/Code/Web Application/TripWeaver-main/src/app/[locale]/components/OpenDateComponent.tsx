"use client";
import React, { useState } from "react";
import OpenDatePropsComponent from "./OpenDatePropsComponent";
import { Icon } from "@iconify/react";
import dateOpen from "../interface/dateOpen";

const dayData = [
  { realName: "อาทิตย์", subName: "อา" },
  { realName: "จันทร์", subName: "จ" },
  { realName: "อังคาร", subName: "อ" },
  { realName: "พุธ", subName: "พ" },
  { realName: "พฤหัสบดี", subName: "พฤ" },
  { realName: "ศุกร์", subName: "ศ" },
  { realName: "เสาร์", subName: "ส" },
];

interface PlanningCardDetailsProps {
  dateOpen: dateOpen[];
}

export default function OpenDateComponent({
  dateOpen,
}: PlanningCardDetailsProps) {
  const [isOpen, SetIsOpen] = useState<boolean>(false);

  const currentDay = new Date().getDay();
  const currentDayInThai = dayData[currentDay].realName;
  const currentDayData = dateOpen.find(
    (day) => day.day === currentDayInThai
  );
  const openingRange = currentDayData ? currentDayData.openingHour : "หยุด";

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row gap-x-1">
          <div className="flex justify-center items-center">
            <Icon
              icon="mdi:clock-outline"
              className="text-lg text-[#636363]"
              width={18}
              height={18}
            />
          </div>
          <div className="flex text-[#9B9B9B]">
            {currentDayInThai}: {openingRange}
          </div>
        </div>
        <div
          className={`flex ${
            isOpen ? "flex-col gap-y-2 " : "flex-row gap-x-2 "
          } mt-1 ml-4 `}
        >
          {dayData.map((day, index) => {
            const existsDate = dateOpen.find(
                (openDay) => openDay.day === day.realName
            );
            var isExist = !!existsDate;

            if(existsDate && existsDate.openingHour === "ปิด") {
              isExist = false;
            }

            return (
              <div className="flex flex-row" key={index}>
                <div className="flex">
                    <OpenDatePropsComponent
                    key={index}
                    isExist={isExist}
                    dayName={day.subName}
                    />
                </div>
                <div className={`${isOpen ? 'flex' : 'hidden'} ml-2 text-sm flex-row text-[#717171]`}>
                    <div className="flex mr-1">
                        {day.realName}: 
                    </div>   
                    <div className="flex">
                        {existsDate ? existsDate.openingHour : "หยุด"}
                    </div>   
                </div>
              </div>
            );
          })}
          <div
            className="flex text-sm hover:underline cursor-pointer"
            onClick={() => SetIsOpen(!isOpen)}
          >
            {isOpen ? "ซ่อนเนื้อหา" : "แสดงเพิ่มเติม"}
          </div>
        </div>
      </div>
    </>
  );
}
