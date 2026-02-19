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

export default function RecommendedAttractions() {
    const { data: session } = useSession();
    const router = useRouter();
    const [recommendedPlaceIds, setRecommendedPlaceIds] = useState<string[]>([]);
    const [recommendedAttractions, setRecommendedAttractions] = useState<any[]>([]);
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
        const fetchRecommendations = async () => {
            if (!session?.user?.id) return;

            try {
                const ratingRes = await fetch(`/api/userrating/get/${session.user.id}`);
                if (!ratingRes.ok) throw new Error("Failed to fetch user ratings");
                const ratingData = await ratingRes.json();
                const ratingAmount = ratingData.rating?.length || 0;

                const userRes = await fetch(`/api/user/getUser/${session.user.id}`);
                if (!userRes.ok) throw new Error("Failed to fetch user details");
                const userData = await userRes.json();
                const attractionTagScore = userData?.attractionTagScore || {};

                const recommendRes = await fetch(`${process.env.NEXT_PUBLIC_REC_API_URL}/recommend-hybrid`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        _id: session.user.id,
                        rating_amount: ratingAmount,
                        attractionTagScore: attractionTagScore,
                    }),
                });

                if (!recommendRes.ok) throw new Error("Failed to fetch recommendations");
                const recommendData = await recommendRes.json();
                const shuffledRecommendations = recommendData.res_recommendation.sort(() => 0.5 - Math.random());
                setRecommendedPlaceIds(shuffledRecommendations.slice(0, 3));

            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };

        fetchRecommendations();
    }, [session]);

    useEffect(() => {
        const fetchAttractions = async () => {
            if (recommendedPlaceIds.length === 0) return;

            try {
                const fetchedAttractions = await Promise.all(
                    recommendedPlaceIds.map(async (placeId) => {
                        const res = await fetch(`/api/attraction/getAttraction/${placeId}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                        });
                        if (!res.ok) throw new Error("Failed to fetch attraction");
                        return res.json();
                    })
                );

                setRecommendedAttractions(fetchedAttractions.map((item) => item.attraction));

            } catch (error) {
                console.error("Error fetching recommended attractions:", error);
            }
        };

        fetchAttractions();
    }, [recommendedPlaceIds]);

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

        await addLocationToTrip(planID, locationID, indexDate, "ATTRACTION");
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
        } else {
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
                {recommendedAttractions.map((attraction) => (
                    <div className="flex w-full justify-end items-end pt-4 h-60" key={attraction._id}>
                        <LocationCard
                            placeID={attraction._id}
                            placeName={attraction.name}
                            placeImage={attraction.imgPath?.[0]}
                            onClickAddTrip={handleAddTrip}
                            handleClickViewDetails={handleClickViewDetails}
                            placeType="ATTRACTION"
                        />
                    </div>
                ))}
            </div>

            {/* Add to Trip Modal */}
            <AddToTripModal
                isOpen={isModalOpen}
                searchPlan={searchPlan}
                selectedPlan={selectedPlan}
                locationType="ATTRACTION"
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
