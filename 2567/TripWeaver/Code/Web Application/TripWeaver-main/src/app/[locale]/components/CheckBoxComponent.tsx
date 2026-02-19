"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import CheckBoxComponentElement from "./CheckBoxComponentElement";
import District from "../interface/district";
import { fetchDistrict } from "@/utils/apiService";
import { useQuery } from "react-query";

interface CheckBoxComponentProps {
  provinceName: string;
  onCheckBoxSelect: (districts: District[]) => void;
}

export default function CheckBoxComponent({
  provinceName,
  onCheckBoxSelect,
}: CheckBoxComponentProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [districtsFromQuery, setDistrictsFromQuery] = useState<District[]>([]);

  const handleCheckboxClick = (name: string) => {
    const updatedDistricts = districtsFromQuery.map((district) =>
      district.name === name
        ? { ...district, selected: !district.selected }
        : district
    );
    setDistrictsFromQuery(updatedDistricts);
    onCheckBoxSelect(updatedDistricts);
  };

  const {
    data: districtList,
    isLoading: isDistrictLoading,
    isError: isDistrictError,
  } = useQuery(
    ["districtList", provinceName],
    () => fetchDistrict(provinceName),
    {
      enabled: !!provinceName,
      retry: 0,
    }
  );

  useEffect(() => {
    if(districtList) {
      const districtsWithDefaultSelected = districtList.districts.map(
        (district: District) => ({
          ...district,
          selected: district.selected ?? true,
        })
      );
      setDistrictsFromQuery(districtsWithDefaultSelected);
      onCheckBoxSelect(districtsWithDefaultSelected);
    }
  }, [districtList]);

  const handleClickOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="flex flex-col relative w-44">
        <div className="flex justify-center">
          <div
            className="flex px-2.5 py-2.5 justify-center text-center items-center text-black shadow-xl bg-white rounded-2xl cursor-pointer min-w-44"
            onClick={handleClickOpen}
          >
            <div className="flex flex-row justify-between w-full">
              <div className="flex justify-between items-center mr-2">
                <Icon
                  icon="heroicons:map-pin"
                  className="text-xl text-[#828282]"
                />
              </div>
              <div className="flex kanit">{t("CheckboxComponent.title")}</div>
              <div className=" flex items-center justify-center ml-2">
                <Icon
                  icon="icon-park-outline:down-c"
                  className="text-lg text-[#828282] "
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={`z-10 absolute bg-white p-3 top-14 rounded-xl ${
            isOpen ? "flex w-full flex-col" : "hidden"
          }`}
        >
          <div className="relative w-full">
            <ul className="overflow-y-auto max-h-48 w-full">
              {districtsFromQuery.map((districts, index) => (
                <li key={index}>
                  <CheckBoxComponentElement
                    elementName={districts.name}
                    checked={districts.selected}
                    onClick={handleCheckboxClick}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
