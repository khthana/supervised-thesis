"use client";
import React, { useState, useEffect } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import NavBar from "../../components/NavBar";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import AddToTripModal from "../../components/modals/AddToTripModals";
import RequestModal from "../../components/modals/RequestModal";
import RatingModal from "../../components/modals/RatingModal";
import FavoriteButton from "../../components/FavoriteButton";
import PlaceMap from "../../components/PlaceMap";
import RandomPlaceCard from "../../components/RandomPlaceCard";
import { fetchUserPlans, fetchPlanAllData } from "@/utils/apiService";
import { useQuery } from "react-query";
import { PlanObject } from "../../interface/plantripObject";

interface Rating {
  score: number;
  ratingCount: number;
}

interface Accommodation {
  _id: string;
  name: string;
  star: number;
  rating?: Rating;
  tag: string[];
  imgPath: [string];
  map: string;
  priceRange: string;
  openHour: string;
  phone: [string];
  website: string;
  facility: string[];
  latitude: number;
  longitude: number;
  location?: {
    province: string;
    district: string;
    subDistrict: string;
  };
}

export default function AccommodationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [plantripList, setPlantripList] = useState<any[]>([]);
  const [indexDate, setIndexDate] = useState<number>(0);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [searchPlan, setSearchPlan] = useState<string>("");
  const [isDropdownPlanOpen, setIsDropdownPlanOpen] = useState<boolean>(false);

  const [showModal, setShowModal] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userHasRated, setUserHasRated] = useState(false);
  const [userRatingScore, setUserRatingScore] = useState<number>(0);

  const userId: string | undefined = session?.user?.id;

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
  } = useQuery(["planData", userPlans], () => fetchPlanAllData({ "planList": userPlans }), {
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
    const fetchAccommodation = async () => {
      try {
        const response = await fetch(`/api/accommodation/getAccommodation/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch accommodation data");
        const data = await response.json();
        if (!data || !data.accommodation) {
          router.push("/");
        } else {
          setAccommodation(data.accommodation);
        }
      } catch (error) {
        console.error("Error fetching accommodation:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodation();
  }, [id, router]);

  useEffect(() => {
    if (!userId || !id) return;
    const fetchUserRating = async () => {
      try {
        const response = await fetch(`/api/userrating/get/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user rating");
        const data = await response.json();
        const userReview = data.rating.find(
          (r: { accommodationId: string }) => r.accommodationId === id
        );
        if (userReview) {
          setUserHasRated(true);
          setUserRatingScore(userReview.rating_score);
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    fetchUserRating();
  }, [userId, id]);

  const handleRatingSubmit = (rating: number) => {
    setUserHasRated(true);
    setUserRatingScore(rating);
  };

  if (loading) {
    return;
  }

  if (!accommodation) {
    return <p className="kanit text-center text-xl">{t("DetailPages.notFound")}</p>;
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

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
    await fetch(`/api/plantrip/addLocation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planID,
        locationID,
        dayIndex: indexDate,
        locationType: "ACCOMMODATION",
      }),
    });
  };

  const handleSetPlanID = (planID: string) => {
    const selectedTrip = plantripList.find((plan: any) => plan._id === planID);
    if (selectedTrip) {
      setSelectedPlan(selectedTrip);
      setSearchPlan(selectedTrip.tripName);
    } else {
      setSelectedPlan(null);
    }
    setIndexDate(0);
  };

  const handleSetSearchPlan = (planName: string) => {
    setSearchPlan(planName);
  }

  const handleChangeDropdown = (isOpen: boolean) => {
    setIsDropdownPlanOpen(isOpen);
  }

  const handleChangeDateIndex = (dateIndex: number) => {
    setIndexDate(dateIndex);
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 > 0;
    for (let i = 1; i <= fullStars; i++) {
      stars.push(
        <span key={i}>
          <Icon icon="typcn:star-full-outline" />
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half">
          <Icon icon="typcn:star-half" />
        </span>
      );
    }
    return stars;
  };

  return (
    <>
      <div className="flex flex-col bg-[#F4F4F4] w-screen h-full">
        <NavBar />
        {/* Header */}
        <div className="flex px-20 mt-10 flex-col">
          <div className="flex flex-row text-lg">
            <div
              className="kanit font-regular hover:text-gray-500 cursor-pointer"
              onClick={() => window.location.href = "/"}
            >{t("AccommodationPages.infoMain")}</div>
            <div
              className="kanit font-regular hover:text-gray-500 cursor-pointer"
              onClick={() => window.location.href = "/accommodation_list"}
            >{t("AccommodationPages.accommodation")}</div>
            <div className="kanit font-bold">{accommodation.name}</div>
          </div>
        </div>

        {/* Accommodation Details */}
        <div className="flex flex-col px-20 mt-10">
          <div className="flex flex-col bg-white shadow-md rounded-lg">
            <img
              src={accommodation.imgPath && accommodation.imgPath.length > 0 && accommodation.imgPath[0].trim() !== "" ? accommodation.imgPath[0] : "/images/no-img.png"}
              alt="accommodation"
              className="w-full h-[350px] object-cover object-center rounded-t-lg"
            />
            <div className="flex flex-col mx-12 mt-10 mb-10">
              <div className="flex justify-between items-center">
                <div className="kanit font-bold text-5xl">{accommodation.name}</div>
                <div className="flex gap-x-2 mr-2">
                  {/* <FavoriteButton userId={userId!} placeId={id!} /> */}
                  <button
                    className="kanit bg-[#DDDDDD] hover:bg-[#484848] hover:text-white text-black text-xl px-4 rounded-full font-regular h-10 flex items-center space-x-2"
                    onClick={() => setShowModal(true)}
                  >
                    <Icon icon="lucide:edit" />
                    <span>{t("DetailPages.editInfo")}</span>
                  </button>
                  <RequestModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    placeType="accommodation"
                    userId={userId!}
                    placeId={id!}
                    requestType="edit"
                    t={t}
                    onSuccess={() => { }}
                  />
                  <button
                    className="kanit bg-[#484848] hover:bg-[#DDDDDD] hover:text-black text-white text-xl px-4 rounded-full font-regular h-10 flex items-center space-x-2"
                    onClick={() => handleAddTrip(accommodation._id)}
                  >
                    <Icon icon="ic:outline-plus" />
                    <span>{t("DetailPages.addToTrip")}</span>
                  </button>
                </div>
              </div>

              {/* Rating Section */}
              <div className="flex flex-row mt-5 items-center text-2xl">
                {renderStars(accommodation.rating?.score || 0)}
                <span className="ml-2">{accommodation.rating?.score}</span>
                <span className="ml-2">({accommodation.rating?.ratingCount})</span>
              </div>
              <div
                className="kanit mt-2 text-lg cursor-pointer text-blue-500 hover:text-blue-700 underline w-fit"
                onClick={() => setIsRatingModalOpen(true)}
              >
                {t("DetailPages.reviewAction")}
              </div>

              {/* Tags */}
              <div className="flex gap-x-2 mt-5">
                {accommodation.tag?.map((tag, index) => (
                  <button
                    key={index}
                    className="kanit bg-[#F0F0F0] hover:bg-[#DDDDDD] hover:text-black text-[#636363] text-xl px-4 rounded-full font-regular h-10 flex items-center space-x-2"
                  >
                    <span>{tag}</span>
                  </button>
                ))}
              </div>

              {/* Map */}
              <div className="kanit font-bold text-2xl mt-5 mb-3">{t("DetailPages.map")}</div>
              <div className="flex justify-center z-0">
                <PlaceMap latitude={accommodation.latitude} longitude={accommodation.longitude} placeName={accommodation.name} />
              </div>

              {/* Info Section */}
              <div className="kanit font-bold text-2xl mt-5">{t("DetailPages.contact")}</div>
              <div className="flex">
                <div>
                  <div className="flex">
                    <div className="kanit font-regular text-xl mt-3 w-40">
                      {t("DetailPages.phone")}
                    </div>
                    <div className="kanit font-regular text-xl mt-3">
                      {accommodation.phone?.join(", ") || "-"}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="kanit font-regular text-xl mt-3 w-40">
                      {t("DetailPages.website")}
                    </div>
                    <div className="kanit font-regular text-xl mt-3">
                      {accommodation.website ? (
                        <a href={accommodation.website} target="_blank" rel="noopener noreferrer">
                          {accommodation.website}
                        </a>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Facilities */}
              {accommodation.facility && accommodation.facility.length > 0 && (
                <div className="kanit font-bold text-2xl mt-5">{t("DetailPages.facilities")}</div>
              )}
              <div className="flex flex-col">
                {accommodation.facility?.map((facility, index) => (
                  <div key={index} className="kanit font-regular text-xl mt-3 mr-8 flex gap-x-2">
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>


        </div>

        <div className="px-20 mt-4 h-full">
          <RandomPlaceCard placeType={"ACCOMMODATION"} />
        </div>

        {/* Modals */}
        <AddToTripModal
          isOpen={isModalOpen}
          searchPlan={searchPlan}
          selectedPlan={selectedPlan}
          locationType="ACCOMMODATION"
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

        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          placeType="accommodation"
          placeId={id}
          userId={userId!}
          existingRating={userRatingScore}
          onRatingSubmit={handleRatingSubmit}
          userHasRated={userHasRated}
        />
      </div>
    </>
  );
}
