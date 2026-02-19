import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { DateRange } from "react-date-range";
import { PlanSummaryInterface } from "../../interface/plantripObject";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../../plantrip/create/calendar.css";
import { useRouter } from 'next/navigation';

interface CopyTripModalsProps {
  isOpen: boolean;
  tripLocation: (PlanSummaryInterface)[];
  userID: string|undefined;
  onClose: () => void;
}

const CopyTripModal: React.FC<CopyTripModalsProps> = ({ isOpen, onClose, tripLocation,userID }) => {
    const router = useRouter();
    const [tripName, setTripName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [travelers, setTravelers] = useState(1);
    const [dateRange, setDateRange] = useState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault(); 

      
      const timeDifference = (dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime()) / (1000 * 3600 * 24);

      if (timeDifference + 1 < tripLocation.length) {
        setErrorMessage(`แพลนการท่องเที่ยวดังกล่าวไม่น้อยกว่า ${tripLocation.length} วัน`);
        return;
      }

      if(userID === undefined) {
        setErrorMessage(`พบข้อผิดพลาดเกี่ยวกับ UserID`);
        return;
      }
      

      const planData = {
        tripName: tripName,
        travelers: travelers,
        startDate: dateRange[0].startDate,
        dayDuration: Math.floor(timeDifference),
        accommodations: Array.from({ length: timeDifference }, (_, i) => ({
          accommodationID: tripLocation[i]?.accommodations?.accommodationID || "",
        })),
        plans: Array.from({ length: timeDifference }, (_, i) => ({
          planName: tripLocation[i]?.plans?.planName || "",
          places: tripLocation[i]?.plans?.places.map((place) => ({
            placeID: place.placeID,
            type: place.type,
            duration: place.duration,
          })) || [],
        })),
        userID: userID,
      };
      
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/plantrip/create`, planData);
        const responseData = response.data; 
  
        if (response.status === 201) {
          router.push(`/th/plantrip?planID=${responseData.planID}`);
        }
        
      } catch (error) {
        console.error("Error creating plan:", error);
      }

      onClose();
    };
  
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
  
    useEffect(() => {
      if (isCalendarOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isCalendarOpen]);
  
    const handleDateChange = (ranges: any) => {
      const newStartDate = ranges.selection.startDate;
      const newEndDate = ranges.selection.endDate;
  
      const maxDuration = 90;
      const timeDifference = (newEndDate.getTime() - newStartDate.getTime()) / (1000 * 3600 * 24);
  
      if (timeDifference > maxDuration) {
        setErrorMessage("ไม่สามารถมีวันในการวางแผนเกิน 90 วันได้");
      } else {
        if (timeDifference + 1 < tripLocation.length) {
          setErrorMessage(`แพลนการท่องเที่ยวดังกล่าวไม่น้อยกว่า ${tripLocation.length} วัน`);
          return;
        }
        setErrorMessage("");
        setDateRange([ranges.selection]);
      }
    };
  
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("th-TH", {
        day: "numeric",
        month: "short",
        year: "2-digit",
      }).format(date);
    };
  
    const dateText = `${formatDate(dateRange[0].startDate)} - ${formatDate(dateRange[0].endDate)}`;
  
    return (
      isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] sm:w-[400px] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Copy Trip</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <Icon icon="iconoir:cancel" className="text-lg text-[#414141]" width={24} height={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* ชื่อทริป */}
              <div className="flex flex-col mb-4">
                <label className="font-bold mb-2">ชื่อทริป</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="กรอกชื่อทริป"
                  value={tripName}
                  maxLength={30}
                  onChange={(e) => setTripName(e.target.value)}
                  required
                />
              </div>
  
              <div className="flex flex-col mb-4">
                <label className="font-bold mb-2">จำนวนคน</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                  min="1"
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                />
              </div>

              <div className="flex flex-col mb-4 relative">
                <label className="font-bold mb-2">วันที่ท่องเที่ยว</label>
                <input
                  type="text"
                  readOnly
                  value={dateText}
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200 cursor-pointer"
                />
                {isCalendarOpen && (
                  <div ref={pickerRef} className="absolute top-16 z-50 bg-white p-4 shadow-lg rounded-lg">
                    <DateRange
                      onChange={handleDateChange}
                      moveRangeOnFirstSelection={false}
                      ranges={dateRange}
                      minDate={new Date()}
                      rangeColors={["#3b82f6"]}
                    />
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="text-red-500 mt-2 text-sm">
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="submit"
                  className="py-2 px-4 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Create Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    );
  };
  
export default CopyTripModal;