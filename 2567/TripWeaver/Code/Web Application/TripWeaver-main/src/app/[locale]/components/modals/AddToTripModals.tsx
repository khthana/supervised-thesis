import React, { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { PlanObject } from "../../interface/plantripObject";
import TripDate from "../TripDateComponent";

interface AddToTripModalProps {
  isOpen: boolean;
  selectedPlan: PlanObject|null;
  selectedLocation: string;
  dayIndex: number;
  locationType: string;
  searchPlan: string;
  isDropdownPlanOpen: boolean;
  planList: PlanObject[];
  onClose: () => void;
  onAddTrip: (planID: string, locationID: string) => void;
  onSelectPlan: (planID: string) => void;
  onInputPlanName: (planName: string) => void;
  onChangeDropdown: (isOpen: boolean) => void;
  onChangeDate: (index: number) => void;
}

const AddToTripModal: React.FC<AddToTripModalProps> = ({
  isOpen,
  searchPlan,
  selectedPlan,
  selectedLocation,
  locationType,
  dayIndex,
  planList,
  isDropdownPlanOpen,
  onClose,
  onAddTrip,
  onSelectPlan,
  onInputPlanName,
  onChangeDropdown,
  onChangeDate
}) => {

  const modalRef = useRef<HTMLDivElement>(null);
  const filteredTrips = planList.filter((trip) =>
    trip.tripName?.toLowerCase().startsWith(searchPlan.toLowerCase())
  );
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onChangeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-[90%] sm:w-[400px] p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="kanit text-xl font-semibold">เพิ่มเข้าทริป</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <Icon icon="iconoir:cancel" className="text-lg text-[#414141]" width={24} height={24} />
            </button>
          </div>

          <div className="relative">
            <div className="flex flex-col">
                <div className="flex items-center border border-gray-300 rounded-md p-2">
                <Icon icon="ph:magnifying-glass-bold" className="text-gray-500 mr-2" width={20} height={20} />
                <input
                    type="text"
                    placeholder="ค้นหาทริป"
                    value={searchPlan}
                    onFocus={() => onChangeDropdown(true)}
                    onChange={(e) => {
                    onInputPlanName(e.target.value);
                    onChangeDropdown(true);
                    }}
                    className="kanit w-full focus:outline-none"
                />
                </div>
            </div>

            {isDropdownPlanOpen && filteredTrips.length > 0 && (
              <div ref={modalRef} className="absolute mt-1 w-full bg-white border z-10 border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredTrips.map((trip) => (
                  <div
                    key={trip._id}
                    className="kanit p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      onSelectPlan(trip._id);
                      onChangeDropdown(false);
                    }}
                  >
                    {trip.tripName}
                  </div>
                ))}
              </div>
            )}
          </div>
          {
            selectedPlan && (
              <div className="flex w-full mt-5">
                <TripDate startDate={selectedPlan.startDate} durationDate={selectedPlan.dayDuration} onSelectDay={onChangeDate}/>
              </div>   
            )
          }
          {
            selectedPlan && locationType == "ACCOMMODATION" && selectedPlan.accommodations && selectedPlan.accommodations.length > 0 && selectedPlan.accommodations[dayIndex] && selectedPlan.accommodations[dayIndex].accommodationID != "" && (
              <div className="flex flex-row text-red-600 w-full mt-5">
                <div className="flex justify-center items-center mr-2">
                  <Icon icon="fe:warning" className="text-lg text-red-600" width={24} height={24} />
                </div> 
                <div className="kanit flex justify-center items-center kanit text-sm text-center">
                  วันดังกล่าวมีที่พักอยู่แล้วระบบจะทำการแทนที่ของที่พัก
                </div>
              </div>  
            )
          }

          <button
            onClick={() => selectedPlan && onAddTrip(selectedPlan._id, selectedLocation)}
            className="kanit mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={!selectedPlan}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    )
  );
};

export default AddToTripModal;
