"use client";
import React from "react";

interface PageNumberProps {
  currentPage: number;
  thisPage: number;
  onSelectPage: (page: number) => void;
}

export default function PageNumberComponent({
    currentPage,thisPage, onSelectPage
}: PageNumberProps) {
  return(
    <>
        <div className={`flex kanit select-none justify-center w-[35px] h-[35px] border border-[#8D8D8D] rounded-md items-center ${currentPage == thisPage ? 'bg-[#DDDDDD]' : "bg-[#FFFDFD] cursor-pointer"}`}
            onClick={() => onSelectPage(thisPage)}>
            <div className="flex text-[#8D8D8D] text-xl">
                {thisPage}
            </div>
        </div>
    </>
  )
}