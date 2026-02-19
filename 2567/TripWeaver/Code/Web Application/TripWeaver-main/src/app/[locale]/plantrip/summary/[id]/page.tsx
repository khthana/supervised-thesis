"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import NavBar from "../../../components/NavBar";
import { Icon } from "@iconify/react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PlanningCardDetails from "../../../components/PlanningCardDetails";
import { updatePlanLike } from "@/utils/apiService";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "react-query";
import TripCard from "@/app/[locale]/components/TripCard";
import { PlanSummaryInterface } from "@/app/[locale]/interface/plantripObject";
import { PlanningInformationDataInterface } from "@/app/[locale]/interface/plantripObject";
import CopyTripModal from "@/app/[locale]/components/modals/CopyTripModals";


import {
  fetchPlanData,
  fetchUserData,
  fetchAllData,
  fetchAccommodationData,
  fetchAttractionData,
  fetchRestaurantData,
} from "@/utils/apiService";


import "../../carousel.css";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { decode as decodePolyline } from "@mapbox/polyline";
import { MapUpdater } from "../../../components/MapUpdater";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import AttractionData from "../../../interface/attraction";
import RestaurantData from "../../../interface/restaurant";
import { TripCardInterface } from "@/app/[locale]/interface/plantripObject";

import L from "leaflet";
import AccommodationData from "@/app/[locale]/interface/accommodation";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

interface planInterface {
  planName: string;
  places: [
    {
      placeID: string;
      type: string;
      duration: number;
    }
  ];
}

interface MyArrowProps {
  type: string;
  onClick: () => void;
  isEdge: boolean;
}


export default function Home() {
  const { id } = useParams();
  const planID = id as string;
  const router = useRouter();

  const { data: session, status } = useSession();
  const [polyline, setPolyline] = useState<any[][]>([]);
  const [waypoints, setWaypoints] = useState<number[][][]>([]);
  const [planningInformationDataList, setPlanningInformationDataList] = useState<PlanningInformationDataInterface[][]>([]);
  const [isHoveredLike, setIsHoveredLike] = useState<boolean>(false);
  const [isLikePlan, setIsLikePlan] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);


  const [selectedLocationInfo, setSelectedLocationInfo] = useState<
    AttractionData | RestaurantData | AccommodationData | null
  >(null);

  const [tripLocation, setTripLocation] = useState<
    (PlanSummaryInterface)[]
  >([]);

  const [tripCardDataList, setTripCardDataList] = useState<(TripCardInterface)[]>([]);

  const {
    data: planData,
    isLoading: isPlanLoading,
    isError: isPlanError,
    refetch: refetchPlanData,
  } = useQuery(["planData", planID], () => fetchPlanData(planID!), {
    enabled: !!planID,
    retry: 0,
  });

  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: isUserDataError,
    refetch: refetchUserData,
  } = useQuery(
    ["userData", session?.user?.id],
    () => fetchUserData(session?.user?.id!),
    {
      enabled: !!session?.user?.id,
    }
  );

  const {
    data: allData,
    isLoading: isAllDataLoading,
    isError: isAllDataError,
  } = useQuery("allData", fetchAllData);

  if (status === "unauthenticated") {
    redirect("/login");
  }

  useEffect(() => {
    if (planData && userData) {
      //console.log(planData);
      //console.log(userData);

      const formattedPlanData: PlanSummaryInterface[] = planData.plan.plans.map((plan: planInterface, index: number) => ({
        accommodations: {
          accommodationID: planData.plan.accommodations?.[index]?.accommodationID || "",
        },
        plans: {
          planName: plan.planName || "",
          places: plan.places?.map(place => ({
            placeID: place.placeID || "",
            type: place.type || "",
            duration: place.duration || 0,
          })) || [],
        },
      }));

      /*
            console.log(planData);
            console.log("--------------")
            console.log(formattedPlanData);*/

      setTripLocation(formattedPlanData);

      const fetchData = async () => {
        try {
          const accommodationPromises = formattedPlanData.map(async (plan) => {
            if (plan.accommodations.accommodationID && plan.accommodations.accommodationID != "") {
              try {
                const data = await fetchAccommodationData(plan.accommodations.accommodationID);
                return data ? data.accommodation : null;
              } catch (error) {
                console.error(`Error fetching accommodation for ${plan.accommodations.accommodationID}:`, error);
                return null;
              }
            }
            return null;
          });

          const locationPromises = formattedPlanData.map(async (plan) => {
            const placePromises = plan.plans.places.map(async (location) => {
              try {
                const placeID = location.placeID;
                const type = location.type;
                if (type === "ATTRACTION") {
                  const data = await fetchAttractionData(placeID);
                  return data ? data.attraction : null;
                } else if (type === "RESTAURANT") {
                  const data = await fetchRestaurantData(placeID);
                  return data ? data.restaurant : null;
                }
                return null;
              } catch (error) {
                console.error(`Error fetching data for placeID ${location.placeID}:`, error);
                return null;
              }
            });

            return await Promise.all(placePromises);
          });

          const accommodationResults = await Promise.all(accommodationPromises);
          const locationResults = await Promise.all(locationPromises);

          const tripCardData = formattedPlanData.map((plan, index) => ({
            accommodation: accommodationResults[index],
            location: locationResults[index].filter((place) => place !== null),
          }));

          setTripCardDataList(tripCardData);
        } catch (error) {
          console.error("Error fetching trip data:", error);
        }
      };

      fetchData();

      const isLiked = userData?.likePlanList?.includes(planID) ?? false;

      setIsLikePlan(isLiked);
      setIsHoveredLike(isLiked);

    }
  }, [planData, userData]);


  /*useEffect(() => {
    console.log(openIndex);
    if(polyline && waypoints && openIndex != null) {
      console.log(polyline[openIndex])
      console.log(waypoints[openIndex]);
      console.log(":-----------:");
    }
  }, [polyline,waypoints,openIndex]);*/


  useEffect(() => {
    if (!tripCardDataList) {
      return;
    }

    tripCardDataList.map((trip, index) => {
      if (trip.location.length == 0 && !trip.accommodation) {
        return;
      }

      const coordinates = [
        ...trip.location.map(
          (attraction) => `${attraction.longitude},${attraction.latitude}`
        ),
        ...(trip.accommodation
          ? [
            `${trip.accommodation.longitude},${trip.accommodation.latitude}`,
          ]
          : []),
      ].join(";");

      if (
        trip.location.length == 1 &&
        !trip.accommodation
      ) {
        setPolyline((prev) => {
          const newPolyline = [...prev];
          newPolyline[index] = [];
          return newPolyline;
        });
        setWaypoints((prev) => {
          const newWaypoints = [...prev];
          newWaypoints[index] = [[trip.location[0].latitude, trip.location[0].longitude]];
          return newWaypoints;
        });
        return;
      } else if (trip.accommodation && trip.location.length === 0) {
        const accommodation = trip.accommodation;

        setPolyline((prev) => {
          const newPolyline = [...prev];
          newPolyline[index] = [];
          return newPolyline;
        });

        setWaypoints((prev) => {
          const newWaypoints = [...prev];
          newWaypoints[index] = [[accommodation.latitude, accommodation.longitude]];
          return newWaypoints;
        });

        return;
      } else if (
        !trip.accommodation &&
        trip.location.length == 0
      ) {
        setPolyline((prev) => {
          const newPolyline = [...prev];
          newPolyline[index] = [];
          return newPolyline;
        });

        setWaypoints((prev) => {
          const newWaypoints = [...prev];
          newWaypoints[index] = [];
          return newWaypoints;
        });

        return;
      }

      const url = `${process.env.NEXT_PUBLIC_OSRM_API_URL}/route/v1/driving/${coordinates}`;
      axios
        .get(url)
        .then((response) => {
          const { geometry, legs } = response.data.routes[0];
          if (geometry) {
            const decodedPolyline = decodePolyline(geometry);
            /*setPolyline(
              decodedPolyline.map(([lat, lng]) => [lat, lng])
            );*/

            setPolyline((prev) => {
              const newPolyline = [...prev];
              newPolyline[index] = decodedPolyline.map(([lat, lng]) => [lat, lng]);
              return newPolyline;
            });
          }
          const updatedWaypoints = trip.location.map(
            (loc) => [loc.latitude, loc.longitude]
          );

          if (trip.accommodation) {
            updatedWaypoints.push([
              trip.accommodation.latitude,
              trip.accommodation.longitude,
            ]);
          }

          setWaypoints((prev) => {
            const newWaypoints = [...prev];
            newWaypoints[index] = updatedWaypoints;
            return newWaypoints;
          });

          const planningData = legs.map((leg: any) => ({
            timeTravel: leg.duration,
            rangeBetween: leg.distance,
          }));
          planningData.unshift({ timeTravel: 0, rangeBetween: 0 });
          setPlanningInformationDataList((prev) => {
            const newData = [...prev];
            newData[index] = planningData;
            return newData;
          })
        })
        .catch((error) => {
          console.error("Error fetching route data:", error);
        });
    })

  }, [tripCardDataList]);

  const createCustomIcon = (number: number, isAccommodation: boolean) => {
    if (typeof window !== "undefined") {
      const L = require("leaflet");
      const ReactDOMServer = require("react-dom/server");
      const iconHtml = isAccommodation ? (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M1 19V4h2v10h8V6h8q1.65 0 2.825 1.175T23 10v9h-2v-3H3v3zm6-6q-1.25 0-2.125-.875T4 10t.875-2.125T7 7t2.125.875T10 10t-.875 2.125T7 13"
            />
          </svg>
        </div>
      ) : (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 256 256"
          >
            <path
              fill="currentColor"
              d="M128 60a44 44 0 1 0 44 44a44.05 44.05 0 0 0-44-44m0 64a20 20 0 1 1 20-20a20 20 0 0 1-20 20m0-112a92.1 92.1 0 0 0-92 92c0 77.36 81.64 135.4 85.12 137.83a12 12 0 0 0 13.76 0a259 259 0 0 0 42.18-39C205.15 170.57 220 136.37 220 104a92.1 92.1 0 0 0-92-92m31.3 174.71a249.4 249.4 0 0 1-31.3 30.18a249.4 249.4 0 0 1-31.3-30.18C80 167.37 60 137.31 60 104a68 68 0 0 1 136 0c0 33.31-20 63.37-36.7 82.71"
            />
          </svg>
          <span className="absolute top-[5px] left-[20px] transform -translate-x-1/2 bg-white text-black rounded-full px-2 py-1 text-xs font-bold border border-black z-20">
            {number}
          </span>
        </div>
      );

      return L.divIcon({
        className: "custom icon",
        html: ReactDOMServer.renderToString(iconHtml),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
    }
  };

  const onClickChangeIndex = (index: number | null) => {
    setOpenIndex(index);
    setSelectedLocationInfo(null);
  };

  const onClickSelectLocation = (location: AttractionData | RestaurantData | AccommodationData) => {
    setSelectedLocationInfo(location);
  };

  const handleClickSelectInfo = () => {
    setSelectedLocationInfo(null);
  };

  const handleClickLike = async () => {

    if (userData?.likePlanList?.includes(planID)) {
      await updatePlanLike(planID, session?.user?.id!, "DEC");
      setIsLikePlan(false);
    } else {
      await updatePlanLike(planID, session?.user?.id!, "ADD");
      setIsLikePlan(true);
    }
    refetchPlanData();
    refetchUserData();

  };




  const handleClickShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("บันทึกไปยังคลิปบอร์ดแล้ว ✅");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const myArrow: React.FC<MyArrowProps> = ({ type, onClick, isEdge }) => {
    const pointer =
      type === "PREV" ? (
        <div className="flex items-center justify-center rounded-full bg-[#D9D9D9] w-8 h-8">
          <Icon
            icon="mingcute:left-fill"
            className="text-lg text-[#828282]"
            height={21}
            width={20}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-full bg-[#D9D9D9] w-8 h-8">
          <Icon
            icon="mingcute:right-fill"
            className="text-lg text-[#828282]"
            height={21}
            width={20}
          />
        </div>
      );
    return (
      <button onClick={onClick} disabled={isEdge}>
        {pointer}
      </button>
    );
  };

  const handleMouseEnter = () => {
    setIsHoveredLike(!isLikePlan);
  };

  const handleMouseLeave = () => {
    setIsHoveredLike(isLikePlan);
  };

  const handleEditTrip = () => {
    router.push(`/plantrip?planID=${planID}`);
  };


  const handleCopyTrip = () => {
    console.log("-----START COPY-----")
    console.log(tripLocation);
    setIsModalOpen(true);
  };

  const handleCloseModals = async () => {

    setIsModalOpen(false);

  };

  const formatDate = (date: string | Date) => {
    if (!date) return "-";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateEndDate = (startDate: string, dayDuration: number) => {
    if (!startDate || isNaN(dayDuration)) return "-";

    if (dayDuration === 1) return "";

    const start = new Date(startDate);
    if (isNaN(start.getTime())) return "-";

    start.setDate(start.getDate() + dayDuration);
    return formatDate(start);
  };

  const handleClickLocationDetails = (locationID: string, locationType: string) => {
    if (locationType === "ATTRACTION") {
      router.push(`/th/attraction_detail/${locationID}`)
    } else if (locationType === "RESTAURANT") {
      router.push(`/th/restaurant_detail/${locationID}`)
    } else {
      router.push(`/th/accommodation_detail/${locationID}`)
    }
  }

  if (isPlanLoading || isUserDataLoading || isAllDataLoading) {
    return;
  }

  if (isPlanError || isUserDataError || isAllDataError || !planID) {
    return <div>Error occurred! -- {planID}</div>;
  }

  return (
    <div className="flex flex-col bg-[#F4F4F4] w-full h-full">
      <NavBar />
      <div className="flex flex-row w-full h-[calc(100vh-84px)]">
        <PerfectScrollbar
          className="flex flex-col w-[40%] h-full relative bg-white"
          style={{
            overflow: "hidden",
          }}
        >
          <div className="flex flex-col">
            <div
              className="flex h-52 w-full relative"
              id="section-1"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0)), url(${planData.plan.tripImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="flex kanit flex-col w-full h-full px-8 justify-end select-none">
                <div className="flex flex-col mb-5 w-full h-full justify-end">
                  <div className="flex text-5xl text-white mb-5 font-bold">
                    {planData.plan.tripName}
                  </div>
                  <div className="flex flex-row gap-x-5">
                    <div className="flex text-white text-sm font-bold bg-[#8D8D8D] bg-opacity-90 px-2 py-1 rounded-2xl">
                      {planData.plan.dayDuration + 1}-Day Trip

                    </div>
                    <div className="flex text-white text-sm font-bold bg-[#8D8D8D] bg-opacity-90 px-2 py-1 rounded-2xl">
                      {planData.plan.travelers}{" "}
                      {planData.plan.travelers > 1 ? "Persons" : "Person"}
                    </div>
                    <div className="flex text-white text-sm font-bold bg-[#8D8D8D] bg-opacity-90 px-2 py-1 rounded-2xl">
                      {formatDate(planData.plan.startDate)}
                      {planData.plan.dayDuration > 1 && ` - ${calculateEndDate(planData.plan.startDate, planData.plan.dayDuration)}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full justify-end px-5 mt-5 gap-x-3">
            {session?.user?.id! == planData.plan.tripCreator && (
              <div className="flex text-white text-sm font-bold justify-center kanit items-center bg-[#636363] bg-opacity-90 px-2 py-1 rounded-2xl cursor-pointer"
                onClick={handleEditTrip}>
                แก้ไขทริป
              </div>
            )}
            <div className="flex text-white justify-center items-center kanit text-sm font-bold bg-[#636363] bg-opacity-90 px-2 py-1 rounded-2xl cursor-pointer"
              onClick={handleCopyTrip}>
              คัดลอกทริป
            </div>
            <div
              className="flex text-white text-sm font-bold bg-opacity-90 py-1 justify-center items-center cursor-pointer"
              onClick={handleClickLike}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Icon
                icon={isHoveredLike ? "mdi:heart" : "mdi:heart-outline"}
                className="text-lg text-[#db3f3f] h-full w-full"
                height={26}
                width={26}
              />
              <div className="kanit flex text-black justify-center items-center text-lg ml-1 font-bold">
                {planData.plan.tripLike}
              </div>
            </div>
            <div
              className="flex text-white text-sm font-bold bg-opacity-90 py-1 justify-center items-center cursor-pointer"
              onClick={handleClickShare}
            >
              <Icon
                icon={"majesticons:share"}
                className="text-lg text-[#828282] h-full w-full "
                height={26}
                width={26}
              />
            </div>
          </div>
          <div className="flex flex-col mt-10 w-full gap-y-5">
            {
              tripLocation.map((data, index) => (
                <div className="flex w-full h-full" key={index} >
                  <TripCard dayIndex={index + 1} handleClickLocationDetails={handleClickLocationDetails} plans={data} onClickLocationInfo={onClickSelectLocation} openIndex={openIndex} setOpenIndex={onClickChangeIndex} tripData={tripCardDataList[index]} dataTravel={planningInformationDataList[index]} />
                </div>
              ))
            }

          </div>
        </PerfectScrollbar>

        <div className="flex relative flex-col h-full w-[60%]">
          {selectedLocationInfo && (
            <div
              className="flex w-full absolute bottom-5"
              style={{ zIndex: 1 }}
            >
              <PlanningCardDetails
                title={selectedLocationInfo.name}
                type={selectedLocationInfo.type}
                address={selectedLocationInfo.location.address}
                dateOpen={selectedLocationInfo.openingHour}
                phone={selectedLocationInfo.phone[0]}
                imgPath={selectedLocationInfo.imgPath}
                handleClick={handleClickSelectInfo}
              />
            </div>
          )}
          <div className="flex" style={{ zIndex: 0 }}>
            {
              <MapContainer
                center={[7.9843109, 98.3307468]}
                zoom={11}
                className="h-[calc(100vh-84px)]"
                style={{ width: "100%" }}
              >
                <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {openIndex != null && polyline[openIndex] && polyline[openIndex].length > 0 && (
                  <Polyline
                    positions={polyline[openIndex]}
                    pathOptions={{ color: "green" }}
                  />
                )}
                {openIndex != null && waypoints[openIndex] && waypoints[openIndex].map((position, idx) => {
                  const isLastWaypointWithAccommodation =
                    idx === waypoints[openIndex].length - 1 &&
                    tripCardDataList[openIndex].accommodation !== null;


                  return (
                    <Marker
                      key={idx}
                      position={position as L.LatLngTuple}
                      icon={
                        isLastWaypointWithAccommodation
                          ? createCustomIcon(idx + 99, true)
                          : createCustomIcon(idx + 1, false)
                      }
                    >
                      <Popup>
                        {isLastWaypointWithAccommodation
                          ? `${tripCardDataList[openIndex].accommodation?.name}`
                          : `${tripCardDataList[openIndex].location[idx]?.name}`}
                      </Popup>
                    </Marker>
                  );
                })}
                {
                  openIndex != null && tripCardDataList[openIndex] && (
                    <MapUpdater
                      locationPlanning={tripCardDataList[openIndex].location}
                      selectedLocationDetails={selectedLocationInfo}
                    />
                  )
                }
              </MapContainer>
            }
          </div>
        </div>
      </div>
      <CopyTripModal isOpen={isModalOpen} onClose={handleCloseModals} tripLocation={tripLocation} userID={session?.user?.id} />
    </div>
  );
}
