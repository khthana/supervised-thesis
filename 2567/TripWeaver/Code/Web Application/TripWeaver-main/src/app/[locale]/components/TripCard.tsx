"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { PlanSummaryInterface } from "../interface/plantripObject";
import { TripCardInterface } from "../interface/plantripObject";
import { PlanningInformationDataInterface } from "../interface/plantripObject";
import TripCardElement from "./TripCardElement";
import AttractionData from "../interface/attraction";
import RestaurantData from "../interface/restaurant";
import AccommodationData from "../interface/accommodation";

interface TripCardProps {
  dayIndex: number;
  openIndex: number | null;
  plans: PlanSummaryInterface;
  tripData: TripCardInterface;
  dataTravel: PlanningInformationDataInterface[];
  setOpenIndex: (index: number | null) => void;
  handleClickLocationDetails: (locationID: string,locationType: string) => void;
  onClickLocationInfo: (location: AttractionData | RestaurantData | AccommodationData) => void;
}

const TripCard: React.FC<TripCardProps> = ({
  dayIndex,
  plans,
  tripData,
  openIndex,
  dataTravel,
  setOpenIndex,
  onClickLocationInfo,
  handleClickLocationDetails
}) => {
  const isOpen = openIndex === dayIndex - 1;
  
  return (
    <>
      {plans && (
        <div
          className="flex relative px-5 kanit flex-col w-full h-full"
          
        >
          <div className="flex flex-col w-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setOpenIndex(isOpen ? null : dayIndex - 1)
          }}>
          <div className="flex flex-row justify-between">
            <div className="flex text-black font-bold text-3xl">
              Day {dayIndex}
            </div>
            <div
              className="flex justify-center items-center cursor-pointer"
            >
              <Icon
                icon={
                  isOpen ? "icon-park-outline:down" : "icon-park-outline:right"
                }
                className="text-lg text-black"
                height={24}
                width={23}
              />
            </div>
          </div>
          <div className="flex w-full items-center text-[#878787] font-bold mt-2">
            {plans.plans.planName}
          </div>
          <div className="w-full border-t border-[#adadad] mt-5"></div>
          </div>

          {/* Content Section */}
          <div
            className={`overflow-hidden transition-all duration-500 mt-2 flex-col ${
              isOpen ? "max-h-[10000px]" : "max-h-0"
            }`}
          >
            {tripData &&
              tripData.location.map((data, index) => (
                <div className="flex" key={index}>
                  <TripCardElement
                    index={index}
                    location={data}
                    locationType={plans.plans.places[index].type}
                    stayDuration={plans.plans.places[index].duration}
                    travelTime={dataTravel ? dataTravel[index].timeTravel : 0}
                    locationDistance={dataTravel ? dataTravel[index].rangeBetween : 0}
                    onClickLocationInfo={onClickLocationInfo}
                    handleClickLocationDetails={handleClickLocationDetails}
                  />
                </div>
              ))}
            {tripData &&
              tripData.accommodation && (
                <div className="flex" key={tripData.accommodation._id}>
                  <TripCardElement
                    index={tripData.location.length}
                    location={tripData.accommodation}
                    travelTime={(dataTravel && dataTravel[tripData.location.length]) ? dataTravel[tripData.location.length].timeTravel : 0}
                    locationDistance={
                      (dataTravel && dataTravel[tripData.location.length]) ? dataTravel[tripData.location.length].rangeBetween : 0
                    }
                    locationType={"ACCOMMODATION"}
                    onClickLocationInfo={onClickLocationInfo}
                    handleClickLocationDetails={handleClickLocationDetails}
                  />
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
};

export default TripCard;
