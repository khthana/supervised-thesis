"use client";
import React, { useState, useEffect } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import NavBar from "../../components/NavBar";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import PlaceMap from "../../components/PlaceMap";
import RecommendedAttractions from "../../components/RecommendAttractions";
import { useSession } from "next-auth/react";
import { PlanObject } from "../../interface/plantripObject";
import { addLocationToTrip, fetchPlanAllData, fetchUserPlans } from "@/utils/apiService";
import Swal from "sweetalert2";
import AddToTripModal from "../../components/modals/AddToTripModals";
import RequestModal from "../../components/modals/RequestModal";
import RatingModal from "../../components/modals/RatingModal";
import FavoriteButton from "../../components/FavoriteButton";
import { useQuery } from "react-query";

interface OpeningHour {
  day: string;
  openingHour: string;
}

interface Rating {
  score: number;
  ratingCount: number;
}

interface Attraction {
  _id: string;
  name: string;
  type: string[];
  description?: string;
  latitude: number;
  longitude: number;
  imgPath?: string[];
  phone?: string;
  website?: string;
  openingHour?: OpeningHour[];
  attractionTag?: Record<string, number>;
  location?: {
    province: string;
    district: string;
    subDistrict: string;
  };
  rating?: Rating;
}

export default function AttractionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const placeType = "attraction";
  const t = useTranslations();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanObject | null>(null);
  const [plantripList, setPlantripList] = useState<PlanObject[]>([]);
  const [indexDate, setIndexDate] = useState<number>(0);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [searchPlan, setSearchPlan] = useState<string>("");
  const [isDropdownPlanOpen, setIsDropdownPlanOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [userHasRated, setUserHasRated] = useState(false);
  const [userRatingScore, setUserRatingScore] = useState<number>(0);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const userId: string | undefined = session?.user?.id;
  const placeId: string | undefined = id;

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
    const fetchAttraction = async () => {
      try {
        const response = await fetch(`/api/attraction/getAttraction/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch attraction data");

        const data = await response.json();
        if (!data || !data.attraction) {
          router.push("/");
        } else {
          setAttraction(data.attraction);
        }
      } catch (error) {
        console.error("Error fetching attraction:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchAttraction();
  }, [id, router]);

  useEffect(() => {
    if (!userId || !id) return;

    const fetchUserRating = async () => {
      try {
        const response = await fetch(`/api/userrating/get/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user rating");
        const data = await response.json();

        const userReview = data.rating.find((r: { attractionId: string }) => r.attractionId === id);
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

  if (!attraction) {
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
    const fillPercentage = rating % 1;
    for (let i = 1; i <= Math.floor(rating); i++) {
      stars.push(
        <span key={i}>
          <Icon icon="typcn:star-full-outline" />
        </span>
      );
    }
    if (fillPercentage) {
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
        <div className="flex px-20 mt-10 flex-col">
          <div className="flex flex-row text-lg">
            <div
              className="kanit font-regular hover:text-gray-500 cursor-pointer"
              onClick={() => window.location.href = "/"}
            >{t("AttractionPages.infoMain")}</div>
            <div
              className="kanit font-regular hover:text-gray-500 cursor-pointer"
              onClick={() => window.location.href = "/attraction_list"}
            >
              {t("AttractionPages.attraction")}
            </div>
            <div className="kanit font-bold">{attraction.name}</div>
          </div>
        </div>

        {/* Attraction Details */}
        <div className="flex flex-col px-20 mt-10">
          <div className="flex flex-col justify-self-center bg-white shadow-md rounded-lg">
            <img
              src={attraction.imgPath && attraction.imgPath.length > 0 && attraction.imgPath[0].trim() !== "" ? attraction.imgPath[0] : "/images/no-img.png"}
              alt="attraction"
              className="w-full h-[350px] object-cover object-center rounded-t-lg"
            />
            <div className="flex flex-col mx-12 mt-10">
              <div className="flex justify-between items-center">
                <div className="kanit font-bold text-5xl">{attraction.name}</div>
                <div className="flex gap-x-2 mr-2">
                  <FavoriteButton userId={userId!} placeId={placeId} />
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
                    placeType={placeType}
                    userId={userId!}
                    placeId={placeId!}
                    requestType="edit"
                    t={t}
                    onSuccess={() => {
                    }}
                  />
                  <button
                    className="kanit bg-[#484848] hover:bg-[#DDDDDD] hover:text-black text-white text-xl px-4 rounded-full font-regular h-10 flex items-center space-x-2"
                    onClick={() => handleAddTrip(attraction._id)}
                  >
                    <Icon icon="ic:outline-plus" />
                    <span>{t("DetailPages.addToTrip")}</span>
                  </button>
                </div>
              </div>

              {/* Rating Display */}
              <div className="flex flex-row mt-5 items-center text-2xl">
                {renderStars(attraction.rating?.score || 0)}
                <span className="ml-2">{attraction.rating?.score}</span>
                <span className="ml-2">({attraction.rating?.ratingCount})</span>
              </div>

              {/* Rating Action Text */}
              <div
                className="kanit mt-2 text-lg cursor-pointer text-blue-500 hover:text-blue-700 underline inline-block w-fit"
                onClick={() => setIsRatingModalOpen(true)}
              >
                {t("DetailPages.reviewAction")}
              </div>

              {/* Rating Modal */}
              <RatingModal
                isOpen={isRatingModalOpen}
                onClose={() => setIsRatingModalOpen(false)}
                placeType={placeType}
                placeId={id}
                userId={userId!}
                existingRating={userRatingScore}
                onRatingSubmit={handleRatingSubmit}
                userHasRated={userHasRated}
              />

              {/* Tags */}
              <div className="flex gap-x-2 mt-5">
                {attraction.type.map((tag: string, index: number) => (
                  <button key={index} className="kanit bg-[#F0F0F0] hover:bg-[#DDDDDD] hover:text-black text-[#636363] text-xl px-4 rounded-full font-regular h-10 flex items-center space-x-2">
                    <span>{tag}</span>
                  </button>
                ))}
              </div>

              {/* Map */}
              <div className="kanit font-bold text-2xl mt-5 mb-3">{t("DetailPages.map")}</div>
              <div className="flex justify-center z-0">
                <PlaceMap latitude={attraction.latitude} longitude={attraction.longitude} placeName={attraction.name} />
              </div>

              {/* Info */}
              <div className="kanit font-bold text-2xl mt-5">{t("DetailPages.info")}</div>
              <div className="flex">
                {/* Opening Hours Section */}
                <div className="mr-12">
                  <div className="flex">
                    <div className="kanit font-regular text-xl mt-3">
                      {t("DetailPages.openHour")}
                    </div>
                    <div className="kanit font-regular text-xl mt-3 ml-3">
                      {attraction.openingHour && attraction.openingHour.length > 0 ? (
                        attraction.openingHour.map((hour, index) => (
                          <div key={index} className="flex">
                            <div className="mr-6 w-32">{hour.day}</div>
                            <div>{hour.openingHour}</div>
                          </div>
                        ))
                      ) : (
                        <p className="kanit text-gray-500">ไม่มีข้อมูลในระบบ</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="kanit font-bold text-2xl mt-5">{t("DetailPages.contact")}</div>
              <div className="flex mb-5">
                <div>
                  <div className="flex">
                    <div className="kanit font-regular text-xl mt-3 w-40">
                      {t("DetailPages.phone")}
                    </div>
                    <div className="kanit font-regular text-xl mt-3">
                      {attraction.phone || "-"}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="kanit font-regular text-xl mt-3 w-40">
                      {t("DetailPages.website")}
                    </div>
                    <div className="kanit font-regular text-xl mt-3">
                      {attraction.website ? (
                        <a href={attraction.website} target="_blank" rel="noopener noreferrer">
                          {attraction.website}
                        </a>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="px-20 mt-4 h-full">
          <RecommendedAttractions />
        </div>

        {/* Add to Trip Modal */}
        <AddToTripModal
          isOpen={isModalOpen}
          searchPlan={searchPlan}
          selectedPlan={selectedPlan}
          locationType={"ATTRACTION"}
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

      </div >
    </>
  );
}
