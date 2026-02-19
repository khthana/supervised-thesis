"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import SearchRadiusComponentElement from "./SearchRadiusComponentElement";
import LocationInfo from "../interface/locationInfo";
import SearchComponentElement from "./SearchComponentElement";
import { Icon } from "@iconify/react/dist/iconify.js";

interface SearchRadiusComponentProps {
  locationList: LocationInfo[];
  translationPrefix: string;
  onSelectLocationMark: (location: LocationInfo|null) => void;
  onSelectLocationValue: (radius: number) => void;
}

export default function SearchRadiusComponent({
  locationList,translationPrefix,onSelectLocationMark,onSelectLocationValue
}: SearchRadiusComponentProps) {
  const t = useTranslations();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRange, setIsOpenRange] = useState(false);
  const [querySearchMark, setQuerySearchMark] = useState<string>("");
  const [locationQuery, setLocationQuery] = useState<LocationInfo[]>([]);
  const [markValue, setMarkValue] = useState<number>(5);
  const [locationFilter, setLocationFilter] = useState<LocationInfo[]>(
    []
  );
  const searchRadiusMarkerRef = useRef<HTMLDivElement>(null);
  const rangeRadiusMarkerRef = useRef<HTMLDivElement>(null);

  const kmList = ["5", "10", "15", "20", "30", "50"];

  useEffect(() => {
    setLocationQuery(locationList);
    setLocationFilter(locationList);
    setQuerySearchMark("");
    onSelectLocationMark(null);
  }, [locationList]);

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleClickOpenRadiusSelector = () => {
    setIsOpenRange(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRadiusMarkerRef.current &&
        !searchRadiusMarkerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }

      if (
        rangeRadiusMarkerRef.current &&
        !rangeRadiusMarkerRef.current.contains(event.target as Node)
      ) {
        setIsOpenRange(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRadiusMarkerRef, rangeRadiusMarkerRef]);

  useEffect(() => {
    const filteredLocation = locationQuery.filter((location) =>
      location.name.startsWith(querySearchMark)
    );

    if(querySearchMark.length == 0) {
      onSelectLocationMark(null);
    }

    setLocationFilter(filteredLocation);
  }, [querySearchMark]);

  const handleSelectMarkRadius = (element: LocationInfo) => {
    onSelectLocationMark(element);
    setQuerySearchMark(element.name);
    setIsOpen(false);
  };

  const handleSelectRadius = (range: string) => {
    onSelectLocationValue(parseInt(range))
    setMarkValue(parseInt(range))
    setIsOpenRange(false);
  };

  const handleChangeType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuerySearchMark(e.target.value);
  };
  return (
    <>
      <div className="flex relative flex-col bg-[#F8F8F8] border border-[#E0E0E0] shadow-xl kanit w-full rounded-xl">
        <div className="flex-col p-5">
          <div className="flex text-sm mb-1">
            {t(`${translationPrefix}.title_search_radius`)}
          </div>
          <div className="flex flex-col">
            <div className="flex mb-3">
              <input
                type="text"
                id="default-search"
                value={querySearchMark}
                onChange={handleChangeType}
                className="block w-full p-2 text-sm text-black border border-[#B9B9B9] rounded-xl bg-[#F0F0F0] focus:outline-none"
                placeholder={t(`${translationPrefix}.placeholder_search_radius`)}
                onFocus={handleFocus}
              />
            </div>
            <div className="flex w-full" onClick={handleClickOpenRadiusSelector}>
              <div className="flex p-2 justify-center text-center items-center w-full text-black bg-[#F0F0F0] border border-[#B9B9B9] rounded-xl cursor-pointer">
                <div className="flex flex-row justify-between w-full">
                  <div className="flex kanit text-sm">
                    {t(`${translationPrefix}.ranges.${markValue}km`)}
                  </div>
                  <div className=" flex items-center justify-center ml-2">
                    <Icon
                      icon="icon-park-outline:down-c"
                      className="text-lg text-[#828282] "
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          ref={searchRadiusMarkerRef}
          className={`z-10 absolute bg-white top-[105%] rounded-xl ${
            isOpen ? "flex w-full flex-col" : "hidden"
          }`}
        >
          <div className="relative w-full kanit">
            <div className="flex flex-col">
              {locationFilter && locationFilter.length > 0 ? (
                <div className="flex flex-col mt-2">
                  <div className="flex p-2 text-sm font-bold">
                    {t(`${translationPrefix}.subtitle_search_radius`)}
                  </div>
                  <ul className="overflow-y-auto max-h-48 w-full">
                    {locationFilter.map((location, index) => (
                      <li key={index}>
                        <SearchRadiusComponentElement
                          element={location}
                          onClick={handleSelectMarkRadius}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex flex-row justify-center text-center p-2 text-gray-500 text-sm">
                  <div className="flex mr-2">
                    {t("Result.search_not_found")}
                  </div>
                  {querySearchMark.length > 0 && (
                    <div className="flex">{'"' + querySearchMark + '"'}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          ref={rangeRadiusMarkerRef}
          className={`z-10 absolute bg-white top-[105%] rounded-xl ${
            isOpenRange ? "flex w-full flex-col" : "hidden"
          }`}
        >
          <div className="relative w-full kanit">
            <div className="flex mt-2">
              <ul className="overflow-y-auto max-h-48 w-full text-sm">
                {kmList.map((radiusKM, index) => (
                  <li key={index}>
                    <SearchComponentElement
                      elementName={t(`${translationPrefix}.ranges.${radiusKM}km`)}
                      onClick={handleSelectRadius}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
