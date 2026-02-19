"use client";
import React, { useEffect, useState } from "react";
import LocationCard from "./LocationCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import AddToTripModal from "../components/modals/AddToTripModals";
import { fetchUserPlans, addLocationToTrip, fetchPlanAllData } from "@/utils/apiService";
import { PlanObject } from "../interface/plantripObject";
import { useQuery } from "react-query";

interface RandomPlaceCardProps {
  placeType: "ATTRACTION" | "RESTAURANT" | "ACCOMMODATION";
}

export default function RandomPlaceCard({ placeType }: RandomPlaceCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [randomPlaces, setRandomPlaces] = useState<any[]>([]);
  const [plantripList, setPlantripList] = useState<PlanObject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanObject | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [indexDate, setIndexDate] = useState<number>(0);
  const [searchPlan, setSearchPlan] = useState<string>("");
  const [isDropdownPlanOpen, setIsDropdownPlanOpen] = useState<boolean>(false);

  const {
        data: userPlans,
        isLoading: isUserPlansLoading,
        isError: isUserPlansError,
    } = useQuery(
        ["userPlans", session?.user?.id],
        () => fetchUserPlans(session?.user?.id!),
        {
        enabled: !!session?.user?.id,
        }
    );
  
  const {
      data: planListData,
      isLoading: isPlanListLoading,
      isError: isPlanListError,
  } = useQuery(["planData", userPlans], () => fetchPlanAllData({"planList": userPlans}), {
      enabled: !!userPlans,
      retry: 0
  });

  useEffect(() => {
      if (planListData) {
          const mappedPlans: PlanObject[] = planListData.plans.map((plan: PlanObject) => ({
              _id: plan._id,
              startDate: plan.startDate,
              dayDuration: plan.dayDuration,
              accommodations: plan.accommodations,
              tripName: plan.tripName
          }));
  
          setPlantripList(mappedPlans);
      }
  }, [planListData]);
    
  useEffect(() => {
    const fetchRandomPlaces = async () => {
      let endpoint = "";
      if (placeType === "RESTAURANT") {
        endpoint = "/api/restaurant/getRandom";
      } else if (placeType === "ACCOMMODATION") {
        endpoint = "/api/accommodation/getRandom";
      } else {
        endpoint = "/api/attraction/getRandom";
      }

      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch random places");
        const data = await res.json();
        setRandomPlaces(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching random places:", error);
      }
    };

    fetchRandomPlaces();
  }, [placeType]);

  const handleAddTrip = (locationID: string) => {
    if (plantripList.length === 0) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "คุณยังไม่มีทริปใด ๆ กรุณาสร้างทริปก่อน!",
        confirmButtonText: "โอเค",
        confirmButtonColor: "#2563ea",
        customClass: {
          title: "kanit",
          popup: "kanit",
          confirmButton: "kanit",
          cancelButton: "kanit",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/plantrip/create");
        }
      });
      return;
    }

    setSearchPlan("");
    setSelectedPlan(null);
    setIndexDate(0);
    setIsModalOpen(true);
    setSelectedLocation(locationID);
  };

  const handleAddTripToPlan = async (planID: string, locationID: string) => {
    setIsModalOpen(false);
    setSelectedLocation("");

    Swal.fire({
      icon: "success",
      title: "สำเร็จ",
      text: "สถานที่นี้ถูกเพิ่มไปยังทริปของคุณแล้ว",
      confirmButtonText: "โอเค",
      confirmButtonColor: "#2563ea",
      customClass: {
        title: "kanit",
        popup: "kanit",
        confirmButton: "kanit",
        cancelButton: "kanit",
      },
    });

    await addLocationToTrip(planID, locationID, indexDate, placeType);
  };

  const handleSetPlanID = (planID: string) => {
    const selectedTrip = plantripList.find((plan) => plan._id === planID);
    if (selectedTrip) {
      setSelectedPlan(selectedTrip);
      setSearchPlan(selectedTrip.tripName);
    } else {
      setSelectedPlan(null);
    }
    setIndexDate(0);
  };

  const handleClickViewDetails = (locationID: string, locationType: string) => {
    if (locationType === "ATTRACTION") {
      router.push(`/th/attraction_detail/${locationID}`);
    } else if (locationType === "RESTAURANT") {
      router.push(`/th/restaurant_detail/${locationID}`);
    } else if (locationType === "ACCOMMODATION") {
      router.push(`/th/accommodation_detail/${locationID}`);
    }
  };

  const handleSetSearchPlan = (planName: string) => {
    setSearchPlan(planName);
  }

  const handleChangeDropdown = (isOpen: boolean) => {
  setIsDropdownPlanOpen(isOpen);
  }

  const handleChangeDateIndex= (dateIndex: number) => {
    setIndexDate(dateIndex);
  }

  return (
    <div className="flex flex-col mt-10">
      <h2 className="kanit font-bold text-2xl mb-4">สถานที่แนะนำอื่น ๆ ในภูเก็ต</h2>
      <div className="grid grid-cols-3 gap-4">
        {randomPlaces.map((place) => (
          <div className="flex w-full justify-end items-end pt-4 h-60" key={place._id}>
            <LocationCard
              placeID={place._id}
              placeName={place.name}
              placeImage={place.imgPath?.[0]}
              onClickAddTrip={handleAddTrip}
              handleClickViewDetails={handleClickViewDetails}
              placeType={placeType}
            />
          </div>
        ))}
      </div>

      {/* Add To Trip Modal */}
      <AddToTripModal
        isOpen={isModalOpen}
        searchPlan={searchPlan}
        selectedPlan={selectedPlan}
        locationType={placeType}
        onClose={() => setIsModalOpen(false)}
        onAddTrip={handleAddTripToPlan}
        dayIndex={indexDate}
        onSelectPlan={handleSetPlanID}
        onInputPlanName={handleSetSearchPlan}
        selectedLocation={selectedLocation}
        planList={plantripList}
        isDropdownPlanOpen={isDropdownPlanOpen}
        onChangeDropdown={handleChangeDropdown}
        onChangeDate={handleChangeDateIndex}
      />
    </div>
  );
}
