"use client";
import React from "react";
import PageNumberComponent from "./PageNumber";
import { Icon } from "@iconify/react/dist/iconify.js";

interface PageNumberProps {
  currentPage: number;
  maxPage: number;
  onSelectPage: (page: number) => void;
}

export default function PaginationComponent({
  currentPage,
  maxPage,
  onSelectPage
}: PageNumberProps) {
  
  const maxDisplayPages = 5;
  let startPage = Math.max(currentPage - 2, 1);
  let endPage = Math.min(startPage + maxDisplayPages - 1, maxPage); 

  if (endPage - startPage < maxDisplayPages - 1) {
    startPage = Math.max(endPage - (maxDisplayPages - 1), 1);
  }

  if (startPage > endPage) {
    startPage = 1;
    endPage = 1;
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-row pl-20 justify-end w-full h-full pr-2">
        <div
          className={`${currentPage !== 1 && startPage !== endPage ? "cursor-pointer" : "cursor-not-allowed"} 
          flex mr-3 select-none justify-center w-[35px] bg-[#939393] h-[35px] border border-[#8D8D8D] rounded-md items-center`}
          onClick={() => currentPage !== 1 && startPage !== endPage && onSelectPage(currentPage - 1)}
        >
          <Icon
            icon="mingcute:left-fill"
            className="text-lg text-white"
          />
        </div>

        <div className="flex gap-x-3">
          {pages.map((page) => (
            <PageNumberComponent
              key={page}
              currentPage={currentPage}
              thisPage={page}
              onSelectPage={onSelectPage}
            />
          ))}
        </div>

        <div
          className={`${currentPage !== maxPage && startPage !== endPage ? "cursor-pointer" : "cursor-not-allowed"} 
          flex ml-3 select-none justify-center w-[35px] bg-[#939393] h-[35px] border border-[#8D8D8D] rounded-md items-center`}
          onClick={() => currentPage !== maxPage && startPage !== endPage && onSelectPage(currentPage + 1)}
        >
          <Icon
            icon="mingcute:right-fill"
            className="text-lg text-white"
          />
        </div>
      </div>
    </div>
  );
}
