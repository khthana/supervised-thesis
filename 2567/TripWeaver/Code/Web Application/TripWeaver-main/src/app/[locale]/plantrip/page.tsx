"use client";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import NavBar from "../components/NavBar";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Icon } from "@iconify/react";
import Carousel from "react-elastic-carousel";
import RecommendCard from "../components/RecommendCard";
import PlanningCard from "../components/PlanningCard";
import PerfectScrollbar from "react-perfect-scrollbar";
import PlanningCardDetails from "../components/PlanningCardDetails";
import SearchPlaceObjectComponent from "../components/SearchPlaceObjectComponent";
import AccommodationCard from "../components/AccommodationCard";
import AccommodationData from "../interface/accommodation";
import EditDurationModal from "../components/modals/EditDurationModals";
import AddToTripModalOnlyDate from "../components/modals/AddToTripModalOnlyDate";
import { useTranslations } from "next-intl";
import ScrollLocationCard from "../components/ScrollLocationCard";
import { useQuery } from "react-query";
import {
  fetchPlanData,
  fetchUserData,
  fetchAllData,
  updateUserPlans,
  fetchRecommendAttraction,
  fetchUserRating,
  fetchAttractionData,
  fetchAttractionRecommend,
  fetchRestaurantRecommend,
  fetchAccommodationRecommend
} from "@/utils/apiService";
import { useSearchParams } from "next/navigation";
import DropzoneModal from "../components/modals/DropzoneModal";

import { v4 as uuidv4 } from "uuid";
import "./carousel.css";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { decode as decodePolyline } from "@mapbox/polyline";
import { MapUpdater } from "../components/MapUpdater";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import AttractionData from "../interface/attraction";
import RestaurantData from "../interface/restaurant";

import haversine from "haversine-distance";
import L from "leaflet";

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

interface planningInformationData {
  timeTravel: number;
  rangeBetween: number;
}

interface planningPlacesDuration {
  uuid: string;
  time: number;
}
interface accommodationPlanInterface {
  accommodationID: string;
}

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

interface modalEditorProps {
  placeID: string;
  isOpen: boolean;
}

interface selectedLocationProps {
  placeID: string;
  placeType: string;
}

interface MyArrowProps {
  type: string;
  onClick: () => void;
  isEdge: boolean;
}


export default function Home() {
  
  const searchParams = useSearchParams();
  const planID = searchParams.get("planID");
  const router = useRouter();

  const formatDate = (date: Date) =>
    date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isOpenAddLocationModal, setIsOpenAddLocationModal] = useState<boolean>(false);
  const [travelers, setTravelers] = useState<number>(0);
  const [dateRangeFormatted, setDateRangeFormatted] = useState<string>("");
  const [planDuration, setPlanDuration] = useState<number>(0);
  const [scrollPage, setScrollPage] = useState<number[]>([1,1,1]);

  const [planDateObject, setPlanDateObject] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<selectedLocationProps>();
  const [currentSelectIndex, setCurrentSelectIndexDate] = useState<number>(0);

  const [currentIndexDate, setCurrentIndexDate] = useState<number>(0);
  const [isSearchAccommodationOpen, setIsSearchAccommodationOpen] =
    useState(false);
  const searchPlacesRef = useRef<HTMLDivElement>(null);
  const selectLocationTypeRef = useRef<HTMLDivElement>(null);
  const searchAccommodationRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();
  const [polyline, setPolyline] = useState<any[]>([]);
  const [waypoints, setWaypoints] = useState<number[][]>([]);
  const [planningInformationDataList, setPlanningInformationDataList] =
    useState<planningInformationData[]>([]);
  const [accommodationData, setAccommodationData] = useState<
    (AccommodationData | null)[]
  >([]);
  const [locationPlanning, setLocationPlanning] = useState<
    (AttractionData | RestaurantData)[][]
  >([]);
  const [placesStayDurationList, setPlacesStayDurationList] = useState<
    planningPlacesDuration[][]
  >([]);
  const [locationRecommend, setLocationRecommend] = useState<AttractionData[]>(
    []
  );
  const scrollbarRef = useRef(null);
  const [isAllLocationPageOpen, setIsAllLocationPageOpen] =
    useState<boolean>(false);
  const [isDropDownSelectLocationOpen, setIsDropDownSelectLocationOpen] =
    useState<boolean>(false);
  const [filterLocationType, setFilterLocationType] =
    useState<string>("ที่ท่องเที่ยว");

  const [showRecommendPage, setShowRecommendPage] = useState<boolean>(true);
  const [showPlanning, setShowPlanning] = useState<boolean>(true);
  const [showUploadImageModal, setShowUploadImageModal] =
    useState<boolean>(false);
  const [showAccommodation, setShowAccommodation] = useState<boolean>(true);
  const [inputTitleWidth, setInputTitleWidth] = useState(0);
  const inputTitle = useRef<HTMLInputElement | null>(null);
  const [selectedLocationInfo, setSelectedLocationInfo] = useState<
    AttractionData | RestaurantData | AccommodationData | null
  >(null);

  const [planName, setPlanName] = useState<(string | undefined)[]>([]);
  const [searchPlace, setSearchPlace] = useState<string>("");
  const [searchAccommodation, setSearchAccommodation] = useState<string>("");
  const [attractionScrollList, setAttractionScrollList] = useState<
    AttractionData[]
  >([]);
  const [restaurantScrollList, setRestaurantScrollList] = useState<
  RestaurantData[]
  >([]);
  const [accommodationScrollList, setAccommodationScrollList] = useState<
  AccommodationData[]
  >([]);

  const [filteredAccomodations, setFilteredAccommodations] = useState<
    AccommodationData[]
  >([]);
  const [accommodationsData, setAccommodationsData] = useState<
    AccommodationData[]
  >([]);
  const [placesData, setPlacesData] = useState<
    (AttractionData | RestaurantData)[]
  >([]);
  const [filteredLocations, setFilteredLocations] = useState<
    (AttractionData | RestaurantData)[]
  >([]);

  const [duration, setDuration] = useState<number>(120);
  const [isModalOpen, setIsModalOpen] = useState<modalEditorProps>({
    placeID: "",
    isOpen: false,
  });

  const [isDataSaved, setIsDataSaved] = useState<boolean>(true);

  const accommodationRef =
    useRef<(AccommodationData | null)[]>(accommodationData);
  const planLocationRef =
    useRef<(AttractionData | RestaurantData | null)[][]>(locationPlanning);
  const planDurationRef = useRef<planningPlacesDuration[][]>(
    placesStayDurationList
  );
  const dataSaveRef = useRef<boolean>(true);
  const planNameRef = useRef<(string | undefined)[]>(planName);

  const {
    data: planData,
    isLoading: isPlanLoading,
    isError: isPlanError,
  } = useQuery(["planData", planID], () => fetchPlanData(planID!), {
    enabled: !!planID,
  });

  const {
    data: userPlans,
    isLoading: isUserPlansLoading,
    isError: isUserPlansError,
  } = useQuery(
    ["userPlans", session?.user?.id],
    () => fetchUserData(session?.user?.id!),
    {
      enabled: !!session?.user?.id,
    }
  );

  const {
    data: userRating,
    isLoading: isuserRatingLoading,
    isError: isuserRatingError,
  } = useQuery(
    ["userRating", session?.user?.id],
    () => fetchUserRating(session?.user?.id!),
    {
      enabled: !!session?.user?.id,
    }
  );

  const {
    data: recommendLocation,
    isLoading: isRecommendLocationLoading,
    isError: isRecommendLocationError,
  } = useQuery(
    ["RecommendLocation", session?.user?.id, userPlans, userRating],
    () =>
      fetchRecommendAttraction(
        session?.user?.id!,
        userRating.rating.length,
        userPlans.attractionTagScore.attractionTagFields
      ),
    {
      enabled: !!session?.user?.id && !!userPlans && !!userRating,
    }
  );

  const {
    data: attractionScrollData,
    isLoading: isAttractionScrollDataLoading,
    isError: isAttractionScrollDataError,
  } = useQuery(
    ["attractionScrollData", recommendLocation, scrollPage[0]],
    () =>
      fetchAttractionRecommend(
        recommendLocation.res_recommendation,
        scrollPage[0]
      ),
    {
      enabled: !!session?.user?.id && !!recommendLocation && !!scrollPage,
    }
  );

  const {
    data: accommodationScrollData,
    isLoading: isAccommodationScrollDataLoading,
    isError: isAccommodationScrollDataError,
  } = useQuery(
    ["accommodationScrollData", scrollPage[1]],
    () =>
      fetchAccommodationRecommend(
        scrollPage[1]
      ),
    {
      enabled: !!session?.user?.id && !!recommendLocation && !!scrollPage,
    }
  );

  const {
    data: restaurantScrollData,
    isLoading: isRestaurantScrollDataLoading,
    isError: isRestaurantScrollDataError,
  } = useQuery(
    ["restaurantScrollData", scrollPage[2]],
    () =>
      fetchRestaurantRecommend(
        scrollPage[2]
      ),
    {
      enabled: !!session?.user?.id && !!recommendLocation && !!scrollPage,
    }
  );


  useEffect(() => {
    if (accommodationScrollData) {
      setAccommodationScrollList((prevList) => [
        ...prevList,
        ...accommodationScrollData.accommodations,
      ]);
    }
  }, [accommodationScrollData]);

  useEffect(() => {
    if (restaurantScrollData) {
      //console.log(attractionScrollData);
      setRestaurantScrollList((prevList) => [
        ...prevList,
        ...restaurantScrollData.restaurants,
      ]);
    }
  }, [restaurantScrollData]);

  useEffect(() => {
    if (attractionScrollData) {
      //console.log(attractionScrollData);
      setAttractionScrollList((prevList) => [
        ...prevList,
        ...attractionScrollData.attractions,
      ]);
    }
  }, [attractionScrollData]);

  useEffect(() => {
    if (recommendLocation) {
      const fetchData = async () => {
        try {
          const response = await Promise.all(
            recommendLocation.res_recommendation
              .slice(0, 10)
              .map(async (placeID: string) => {
                return fetchAttractionData(placeID).then(
                  (data) => data.attraction
                );
              })
          );

          //console.log(response);
          setLocationRecommend(response);
        } catch (error) {
          console.error("Error fetching attraction data:", error);
        }
      };

      fetchData();
    }
  }, [recommendLocation]);

  const {
    data: allData,
    isLoading: isAllDataLoading,
    isError: isAllDataError,
  } = useQuery("allData", fetchAllData);

  if (status === "unauthenticated") {
    redirect("/login");
  }

  useEffect(() => {
    if (allData) {
      const { attractions, restaurants, accommodations } = allData;
      const attractionsData = attractions || [];
      const restaurantsData = restaurants || [];
      const accommodationsData = accommodations || [];

      setSearchPlace("");
      setAccommodationsData(accommodationsData);
      setFilteredAccommodations(accommodationsData);
      setPlacesData([...attractionsData, ...restaurantsData]);
      setFilteredLocations([...attractionsData, ...restaurantsData]);
    }
  }, [allData]);

  useEffect(() => {
    if (planData && userPlans && placesData.length > 0) {
      setTravelers(planData.plan.travelers);
      const startDate = new Date(planData.plan.startDate);
      const durationInDay = planData.plan.dayDuration + 1;
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + durationInDay - 1);

      const dateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;

      setPlanDuration(durationInDay);
      setDateRangeFormatted(dateRange);

      const dateItems = Array.from({ length: durationInDay }, (_, index) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);
        return date.toLocaleDateString("th-TH", {
          day: "numeric",
          month: "short",
          year: "2-digit",
        });
      });

      setPlanDateObject(dateItems);

      const allLocationPlanningData: (AttractionData | RestaurantData)[][] = [];
      const allAccommodationPlanningData: (AccommodationData | null)[] = [];
      const planPlacesDurationData: planningPlacesDuration[][] = [];
      const planNameListData: (string | undefined)[] = [];

      planData.plan.plans.map((plan: planInterface) => {
        const planName = plan.planName;
        //console.log(planName);

        planNameListData.push(planName);

        const updatedPlacesData: (AttractionData | RestaurantData)[] = [];
        const placesDuration: planningPlacesDuration[] = [];
        plan.places.map((place) => {
          const placeID = place.placeID;
          //const type = place.type;
          const duration = place.duration;
          const placeData = placesData.find((place) => place._id === placeID);
         // console.log("Place ", place);
          if (placeData) {
            //console.log()
            const uuid = uuidv4();
            const placeWithUUID = { ...placeData, uuid: uuid };
            const placeDurationWithUUID = { uuid: uuid, time: duration };
            updatedPlacesData.push(placeWithUUID);
            placesDuration.push(placeDurationWithUUID);
          }
        });

        allLocationPlanningData.push(updatedPlacesData);
        planPlacesDurationData.push(placesDuration);
      });

      planData.plan.accommodations.map(
        (accommodation: accommodationPlanInterface) => {
          const accommodationData = accommodationsData.find(
            (data) => data._id === accommodation.accommodationID
          );
          if (accommodationData) {
            allAccommodationPlanningData.push(accommodationData);
          } else {
            allAccommodationPlanningData.push(null);
          }
        }
      );

      const lengthToFill = durationInDay - allLocationPlanningData.length;
      if (lengthToFill > 0) {
        allLocationPlanningData.push(...Array(lengthToFill).fill([]));
        planPlacesDurationData.push(...Array(lengthToFill).fill([]));
        planNameListData.push(...Array(lengthToFill).fill(undefined));
      }

      const lengthToFillAccommodation =
        durationInDay - allAccommodationPlanningData.length;
      if (lengthToFillAccommodation > 0) {
        allAccommodationPlanningData.push(
          ...Array(lengthToFillAccommodation).fill(null)
        );

      }/*
      console.log("-----------------");
      console.log("All data ---> ");
      console.log(allLocationPlanningData);
      console.log("-----------------");*/
      /*console.log(allLocationPlanningData);
      console.log("-----------------");
      console.log(planPlacesDurationData);
      console.log(allAccommodationPlanningData);
      console.log(planNameListData);*/

      setLocationPlanning(allLocationPlanningData);
      setPlacesStayDurationList(planPlacesDurationData);
      setAccommodationData(allAccommodationPlanningData);
      setPlanName(planNameListData);
    }
  }, [planData, userPlans, placesData]);

  useEffect(() => {
    if (status === "authenticated" && planID) {
      const autoUpdate = setInterval(() => {
        if (!dataSaveRef.current.valueOf()) {
          // if not saved

          const accommodations = accommodationRef.current
            ? accommodationRef.current.map((accommodation) =>
                accommodation
                  ? { accommodationID: accommodation._id }
                  : { accommodationID: "" }
              )
            : [];

          const plans = planLocationRef.current.map((dayPlans, dayIndex) => ({
            planName: planNameRef.current[dayIndex] ?? "",
            places: dayPlans.map((place, placeIndex) => ({
              placeID: place?._id ?? "",
              type: isRestaurantData(place!) ? "RESTAURANT" : "ATTRACTION",
              duration: planDurationRef.current[dayIndex][placeIndex].time,
            })),
          }));

          setIsDataSaved(true);

          /*if (accommodations.length == 0 && plans.length == 0) {
            return;
          } else {
            console.log(accommodations);
            console.log("------------------------");
            console.log(plans);
          }*/

          const plantripDataPayload = {
            accommodations,
            plans,
          };

          updateUserPlans(planID, plantripDataPayload);
          //console.log("Save....");
        } else {
          //console.log("HERE....");
        }
      }, 1 * 3 * 1000);
      return () => clearInterval(autoUpdate);
    } else {
      //console.log("ComeHE...",status,planID)
    }
  }, [status]);

  useEffect(() => {
    dataSaveRef.current = isDataSaved;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDataSaved) {
        const message =
          "You have unsaved changes. Do you want to save before leaving?";
        event.returnValue = message;
        return message;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDataSaved]);

  useEffect(() => {
    accommodationRef.current = accommodationData;
    planLocationRef.current = locationPlanning;
    planDurationRef.current = placesStayDurationList;
    planNameRef.current = planName;
    setIsDataSaved(false);
  }, [accommodationData, locationPlanning, placesStayDurationList, planName]);

  useEffect(() => {
    if (placesData && placesData.length != 0) {
      const filtered = placesData.filter((item) =>
        item.name
          .toLocaleLowerCase()
          .startsWith(searchPlace.toLocaleLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchPlace]);

  useEffect(() => {
    if (accommodationsData && accommodationData.length != 0) {
      const filtered = accommodationsData.filter((item) =>
        item.name
          .toLocaleLowerCase()
          .startsWith(searchAccommodation.toLocaleLowerCase())
      );
      setFilteredAccommodations(filtered);
    }
  }, [searchAccommodation]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPlace(e.target.value);
  };

  const handleSearchAccommodationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchAccommodation(e.target.value);
  };

  const breakPoints = [{ width: 1, itemsToShow: 3, itemsToScroll: 2 }];

  const handleInput = () => {
    if (inputTitle.current) {
      const textLength =
        inputTitle.current.value.replace(/\s+/g, "").length || 0;

      const updatedPlanName = [...planName];
      updatedPlanName[currentIndexDate] = inputTitle.current.value || undefined;
      setPlanName(updatedPlanName);

      setInputTitleWidth(textLength);
    }
  };
  const onDragEnd = (result: any) => {
    const { destination, source } = result;

    if (!destination) return;

    const reorderedItems = [...locationPlanning];

    if (reorderedItems[currentIndexDate]) {
      const currentItems = reorderedItems[currentIndexDate];

      const [removed] = currentItems.splice(source.index, 1);
      currentItems.splice(destination.index, 0, removed);
      reorderedItems[currentIndexDate] = currentItems;

      setLocationPlanning(reorderedItems);
      updateWaypoints(reorderedItems);
    }
  };

  const handleSaveDuration = (newDuration: number): void => {
    setPlacesStayDurationList((prev) => {
      const currentData = [...prev];
      const placeIndex = currentData[currentIndexDate].findIndex(
        (place) => place.uuid === isModalOpen.placeID
      );

      if (placeIndex !== -1) {
        currentData[currentIndexDate][placeIndex].time = newDuration;
      }
      return currentData;
    });
  };

  const updateWaypoints = (newLocations: typeof locationPlanning) => {
    const newWaypoints = newLocations[currentIndexDate].map((loc) => [
      loc.latitude,
      loc.longitude,
    ]);

    if (accommodationData[currentIndexDate]) {
      newWaypoints.push([
        accommodationData[currentIndexDate].latitude,
        accommodationData[currentIndexDate].longitude,
      ]);
    }

    setWaypoints(newWaypoints);
    setPolyline(newWaypoints);
  };

  const handleFocus = () => {
    setIsSearchOpen(true);
  };

  const handleAccommodationFocus = () => {
    setIsSearchAccommodationOpen(true);
  };

  useEffect(() => {
    if (locationPlanning.length == 0 && accommodationData.length == 0) {
      return;
    }

    const textLength =
      planName[currentIndexDate]?.replace(/\s+/g, "").length || 0;
    setInputTitleWidth(textLength);

    const coordinates = [
      ...locationPlanning[currentIndexDate].map(
        (loc) => `${loc.longitude},${loc.latitude}`
      ),
      ...(accommodationData[currentIndexDate]
        ? [
            `${accommodationData[currentIndexDate].longitude},${accommodationData[currentIndexDate].latitude}`,
          ]
        : []),
    ].join(";");

    if (
      locationPlanning[currentIndexDate].length == 1 &&
      !accommodationData[currentIndexDate]
    ) {
      setPolyline([]);
      setWaypoints([
        [
          locationPlanning[currentIndexDate][0].latitude,
          locationPlanning[currentIndexDate][0].longitude,
        ],
      ]);
      return;
    } else if (
      accommodationData[currentIndexDate] &&
      locationPlanning[currentIndexDate].length == 0
    ) {
      setPolyline([]);
      setWaypoints([
        [
          accommodationData[currentIndexDate].latitude,
          accommodationData[currentIndexDate].longitude,
        ],
      ]);
      return;
    } else if (
      !accommodationData[currentIndexDate] &&
      locationPlanning[currentIndexDate].length == 0
    ) {
      setPolyline([]);
      setWaypoints([]);
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_OSRM_API_URL}/route/v1/driving/${coordinates}`;
    axios
      .get(url)
      .then((response) => {
        const { geometry, legs } = response.data.routes[0];
        if (geometry) {
          const decodedPolyline = decodePolyline(geometry);
          setPolyline(decodedPolyline.map(([lat, lng]) => [lat, lng]));
        }
        const updatedWaypoints = locationPlanning[currentIndexDate].map(
          (loc) => [loc.latitude, loc.longitude]
        );

        if (accommodationData[currentIndexDate]) {
          updatedWaypoints.push([
            accommodationData[currentIndexDate].latitude,
            accommodationData[currentIndexDate].longitude,
          ]);
        }

        setWaypoints(updatedWaypoints);

        const planningData = legs.map((leg: any) => ({
          timeTravel: leg.duration,
          rangeBetween: leg.distance,
        }));
        planningData.unshift({ timeTravel: 0, rangeBetween: 0 });

        setPlanningInformationDataList(planningData);
      })
      .catch((error) => {
        console.error("Error fetching route data:", error);
      });
  }, [locationPlanning, accommodationData, currentIndexDate]);

  const onDelete = (uuid: string) => {
    const locationToDelete = locationPlanning[currentIndexDate].find(
      (location) => location.uuid === uuid
    );

    if (
      selectedLocationInfo &&
      selectedLocationInfo.name === locationToDelete?.name
    ) {
      setSelectedLocationInfo(null);
    }

    setLocationPlanning((prev) => {
      const updatedPlanning = [...prev];
      updatedPlanning[currentIndexDate] = updatedPlanning[
        currentIndexDate
      ].filter((location) => location.uuid !== uuid);
      return updatedPlanning;
    });

    setPlacesStayDurationList((prev) => {
      const currentPlacesStayDuration = [...prev];
      currentPlacesStayDuration[currentIndexDate] = currentPlacesStayDuration[
        currentIndexDate
      ].filter((element) => element.uuid !== uuid);
      return currentPlacesStayDuration;
    });
  };

  const onDeleteAccommodation = () => {
    setAccommodationData((prevData) => {
      const updatedData = [...prevData];
      updatedData[currentIndexDate] = null;
      return updatedData;
    });
  };

  const onClick = (location: AttractionData | RestaurantData | AccommodationData) => {
    setSelectedLocationInfo(location);
  };

  

  const handleClickEditDuration = (id: string) => {
    setDuration(120);

    setIsModalOpen({ placeID: id, isOpen: true });
  };

  const createCustomIcon = (number: number, isAccommodation: boolean) => {
    if (typeof window !== "undefined") {
      const L = require("leaflet");
      const ReactDOMServer = require("react-dom/server");
  
      // ตรวจสอบว่า number มากกว่าจำนวน locationPlanning[currentIndexDate].length หรือไม่
      const isExtraMarker = number > locationPlanning[currentIndexDate].length;
  
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
      ) : isExtraMarker ? (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 256 256"
          >
            <path
              fill="red"
              d="M128 60a44 44 0 1 0 44 44a44.05 44.05 0 0 0-44-44m0 64a20 20 0 1 1 20-20a20 20 0 0 1-20 20m0-112a92.1 92.1 0 0 0-92 92c0 77.36 81.64 135.4 85.12 137.83a12 12 0 0 0 13.76 0a259 259 0 0 0 42.18-39C205.15 170.57 220 136.37 220 104a92.1 92.1 0 0 0-92-92m31.3 174.71a249.4 249.4 0 0 1-31.3 30.18a249.4 249.4 0 0 1-31.3-30.18C80 167.37 60 137.31 60 104a68 68 0 0 1 136 0c0 33.31-20 63.37-36.7 82.71"
            />
          </svg>
          <span className="absolute top-[5px] left-[20px] transform -translate-x-1/2 bg-white text-black rounded-full px-2 py-1 text-xs font-bold border border-black z-20">
            {number}
          </span>
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
        className: "custom-icon",
        html: ReactDOMServer.renderToString(iconHtml),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
    }
  };
  

  const handleClickSelectInfo = () => {
    setSelectedLocationInfo(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectLocationTypeRef.current &&
        !selectLocationTypeRef.current.contains(event.target as Node)
      ) {
        setIsDropDownSelectLocationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectLocationTypeRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchPlacesRef.current &&
        !searchPlacesRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchPlace("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchPlacesRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ( 
        searchAccommodationRef.current &&
        !searchAccommodationRef.current.contains(event.target as Node)
      ) {
        setIsSearchAccommodationOpen(false);
        setSearchAccommodation("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchAccommodationRef]);

  const handleSetAccommodation = (id: string, selectIndex?: number) => {
    //console.log("ID ", id);

    const dateIndex = selectIndex ? selectIndex : currentIndexDate;

    const accommodation = accommodationsData.find((item) => item._id === id);
    if (!accommodation) {
      console.error(`Accommodation with id ${id} not found`);
      return;
    }

    setAccommodationData((prevData) => {
      if (!prevData) return prevData;

      const updatedData = [...prevData];
      updatedData[dateIndex] = accommodation;
      return updatedData;
    });

    setIsSearchAccommodationOpen(false);
    setSearchAccommodation("");
  };

  const handleClickAutoPlan = () => {
    if (
      locationPlanning[currentIndexDate].length === 0 &&
      !accommodationData[currentIndexDate]
    ) {
      console.log("Error: No data available.");
      return;
    }

    const allLocations: { latitude: number; longitude: number }[] = [];

    allLocations.push(
      ...locationPlanning[currentIndexDate].map((location) => ({
        latitude: location.latitude,
        longitude: location.longitude,
      }))
    );

    // console.log("All Locations:", allLocations);

    // คำนวณระยะทางระหว่างสถานที่ทั้งหมด
    const distances = allLocations.map((loc1) =>
      allLocations.map((loc2) => {
        const lat1 = loc1.latitude ?? 0;
        const lon1 = loc1.longitude ?? 0;
        const lat2 = loc2.latitude ?? 0;
        const lon2 = loc2.longitude ?? 0;

        const distance = haversine(
          { latitude: lat1, longitude: lon1 },
          { latitude: lat2, longitude: lon2 }
        );
        //console.log(`Distance from (${lat1}, ${lon1}) to (${lat2}, ${lon2}): ${distance} km`);
        return distance;
      })
    );

    let visited = [0];
    let totalDistance = 0;

    // คำนวณการเยี่ยมชมสถานที่ตามวิธี Nearest Neighbor
    while (visited.length < allLocations.length) {
      let lastVisited = visited[visited.length - 1];
      let nearestNeighbor = -1;
      let minDistance = Infinity;

      for (let i = 0; i < allLocations.length; i++) {
        if (!visited.includes(i) && distances[lastVisited][i] < minDistance) {
          nearestNeighbor = i;
          minDistance = distances[lastVisited][i];
        }
      }

      visited.push(nearestNeighbor);
      totalDistance += minDistance;

      //console.log(`Visited: ${nearestNeighbor}, Distance from ${lastVisited} to ${nearestNeighbor}: ${minDistance} km`);
    }

    if (accommodationData[currentIndexDate]) {
      const accommodationLocation = {
        latitude: accommodationData[currentIndexDate].latitude,
        longitude: accommodationData[currentIndexDate].longitude,
      };

      const lastLocationIndex = visited[visited.length - 1];
      const lastLocation = allLocations[lastLocationIndex];

      const lastToAccommodationDistance = haversine(
        { latitude: lastLocation.latitude, longitude: lastLocation.longitude },
        accommodationLocation
      );

      totalDistance += lastToAccommodationDistance;
      visited.push(allLocations.length);

      //console.log(`Accommodation Location: (${accommodationLocation.latitude}, ${accommodationLocation.longitude})`);
      //console.log(`Distance from last location to accommodation: ${lastToAccommodationDistance} km`);
      //console.log("Best Path (Including Accommodation):", visited);
      //console.log("Total Distance using Nearest Neighbor (Including Accommodation):", totalDistance);
    }

    const updatedLocations = visited
      .filter((index) => index < allLocations.length)
      .map((index) => locationPlanning[currentIndexDate][index]);

    setLocationPlanning((prev) => {
      const updatedLocationPlanning = [...prev];
      updatedLocationPlanning[currentIndexDate] = updatedLocations;
      return updatedLocationPlanning;
    });
  };

  const handleClickBackToPlan = () => {
    setIsDropDownSelectLocationOpen(false);
    setIsAllLocationPageOpen(false);
    setSelectedLocationInfo(null);
  };

  function isRestaurantData(
    location: AttractionData | RestaurantData
  ): location is RestaurantData {
    return (location as RestaurantData).priceRange !== undefined;
  }
  function isAttractionData(
    location: AttractionData | RestaurantData
  ): location is AttractionData {
    return (location as AttractionData).attractionTag !== undefined;
  }

  const handleAddLocation = (id: string,selectIndex?: number) => {
    const location = placesData.find((item) => item._id === id);

    if (!location) {
      console.log("Location not found");
      return;
    }

    const dateIndex = selectIndex ? selectIndex : currentIndexDate;

    const newLocation = { ...location, uuid: uuidv4() };
    let updatedLocation: AttractionData | RestaurantData;

    if (isRestaurantData(newLocation)) {
      updatedLocation = {
        _id: newLocation._id,
        uuid: newLocation.uuid,
        name: newLocation.name ?? "",
        latitude: newLocation.latitude ?? 0,
        longitude: newLocation.longitude ?? 0,
        type: newLocation.type ?? [],
        rating: newLocation.rating ?? { rating: 0, count: 0 },
        location: newLocation.location ?? { latitude: 0, longitude: 0 },
        imgPath: newLocation.imgPath ?? [],
        openingHour: newLocation.openingHour ?? [],
        description: newLocation.description ?? "",
        facility: newLocation.facility ?? [],
        phone: newLocation.phone ?? "",
        website: newLocation.website ?? "",
        priceRange: newLocation.priceRange ?? "",
      };
    } else if (isAttractionData(newLocation)) {
      updatedLocation = {
        _id: newLocation._id,
        uuid: newLocation.uuid,
        name: newLocation.name ?? "",
        latitude: newLocation.latitude ?? 0,
        longitude: newLocation.longitude ?? 0,
        type: newLocation.type ?? [],
        rating: newLocation.rating ?? { rating: 0, count: 0 },
        location: newLocation.location ?? { latitude: 0, longitude: 0 },
        imgPath: newLocation.imgPath ?? [],
        openingHour: newLocation.openingHour ?? [],
        description: newLocation.description ?? "",
        facility: newLocation.facility ?? [],
        phone: newLocation.phone ?? "",
        website: newLocation.website ?? "",
        attractionTag: newLocation.attractionTag,
      };
    }

    setLocationPlanning((prev) => {
      const updatedLocationPlanning = [...prev];

      updatedLocationPlanning[dateIndex] = [
        ...updatedLocationPlanning[dateIndex],
        updatedLocation,
      ];

      return updatedLocationPlanning;
    });

    setPlacesStayDurationList((prev) => {
      const currentPlacesStayDuration = [...prev];
      currentPlacesStayDuration[dateIndex] = [
        ...currentPlacesStayDuration[dateIndex],
        { uuid: newLocation.uuid, time: 0 },
      ];
      return currentPlacesStayDuration;
    });

    setIsSearchOpen(false);
    setSearchPlace("");
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

  const handleClickChangeDate = (index: number) => {
    setCurrentIndexDate(index);
    setSelectedLocationInfo(null);
  };

  const handleClickChangeImage = () => {
    setShowUploadImageModal(true);
  };

  if (
    userPlans &&
    userPlans.planList &&
    Array.isArray(userPlans.planList) &&
    planData?.plan?._id
  ) {
    if (!userPlans.planList.includes(planData.plan._id)) {
      redirect("/plantrip/create");
    }
  }

  const handleScroll = () => {
    const scrollbar = scrollbarRef.current as any;
    if (scrollbar) {
      if(scrollbar._ps.reach.y == "end") {

        let index = 0;
        if(filterLocationType == "ที่พัก") {
          index = 1;
        } else if(filterLocationType == "ร้านอาหาร") {
          index = 2;
        }
        setScrollPage((prev) => {
          const currentData = [...prev];
          currentData[index] = currentData[index]+1;
          return currentData;
        });
      }
    }
  };

  const handleShowRecommendPage = () => {
    setSelectedLocationInfo(null);
    setIsAllLocationPageOpen(true);
    setFilterLocationType("ที่ท่องเที่ยว");
    //setScrollPage(1);
    const scrollbar = scrollbarRef.current as any;
    if (scrollbar) {
      const psInstance = scrollbar._ps;
      if (psInstance && psInstance.element) {
        psInstance.element.scrollTop = 0;
        psInstance.update(); 
      }
    }
  };

  const handleClickLocationDetails = (locationID: string,locationType: string) => {
    if(locationType === "ATTRACTION") {
      router.push(`/th/attraction_detail/${locationID}`)
    } else if(locationType === "RESTAURANT") {
      router.push(`/th/restaurant_detail/${locationID}`)
    } else {
      router.push(`/th/accommodation_detail/${locationID}`)
    }
  }
  
  const handleClickAddLocation = (locationID: string,locationType: string) => {
    setCurrentSelectIndexDate(0);
    setSelectedLocation({
      placeID: locationID,
      placeType: locationType
    })
    setIsOpenAddLocationModal(true);
  }

  const handleCloseAddLocationModal = () => {
    setIsOpenAddLocationModal(false);
  }

  const handleAddLocationFromModal = (placeID: string, placeType: string) => {
    setIsOpenAddLocationModal(false);
    //console.log(placeID,placeType,currentSelectIndex);

    if(placeType != "ACCOMMODATION") {
      handleAddLocation(placeID,currentSelectIndex);
    } else {
      handleSetAccommodation(placeID,currentSelectIndex);
    }
  }

  const handleChangeDate = (indexDate: number) => {
   // console.log("Change to date", indexDate);
    setCurrentSelectIndexDate(indexDate);
  }

  const getScrollList = () => {
    if (filterLocationType === "ที่พัก") {
      return accommodationScrollList;
    } else if (filterLocationType === "ร้านอาหาร") {
      return restaurantScrollList;
    } else {
      return attractionScrollList;
    }
  };

  const getLocationTypeByFilter = () => {
    if (filterLocationType === "ที่พัก") {
      return "ACCOMMODATION";
    } else if (filterLocationType === "ร้านอาหาร") {
      return "RESTAURANT";
    } else {
      return "ATTRACTION";
    }
  };

  const handleChangeType = (locationType: string) => {
    const scrollbar = scrollbarRef.current as any;
    if (scrollbar) {
      const psInstance = scrollbar._ps;
      if (psInstance && psInstance.element) {
        psInstance.element.scrollTop = 0;
        psInstance.update(); 
      }
    }

    setFilterLocationType(locationType)

  }


  if (isPlanLoading || isUserPlansLoading || isAllDataLoading) {
    return ;
  }

  if (isPlanError || isUserPlansError || isAllDataError || !planID) {
    return <div>Error occurred!</div>;
  }
  

  return (
    <div className="flex flex-col bg-[#F4F4F4] w-full h-screen">
      <NavBar />
      <div className="flex relative flex-row w-full h-[calc(100vh-70px)]">
        <>
          <div
            className={`h-full absolute bg-white transition-all duration-700 ${
              isAllLocationPageOpen
                ? "w-[50%] opacity-100 visibility-visible z-40"
                : "w-0 opacity-0 visibility-hidden "
            }`}
          >
            <div className="flex w-full h-full kanit">
              <div className="flex flex-col h-full w-full">
                <div className="flex flex-col p-5 pb-7 border-b-2 border-[#B7B7B7]">
                  <div className="flex flex-row gap-x-2 ">
                    <div
                      className="flex justify-center items-center cursor-pointer"
                      onClick={handleClickBackToPlan}
                    >
                      <Icon
                        icon="ion:arrow-back"
                        className="text-xl text-black "
                        height={28}
                        width={28}
                      />
                    </div>
                    <div className="flex justify-center items-center font-bold text-2xl">
                      จัดการแผนท่องเที่ยว
                    </div>
                  </div>
                  <div className="flex flex-row w-full justify-end mt-5 gap-x-5">
                    <div
                      className="flex relative px-2 py-0.5 flex-row justify-center items-center rounded-lg bg-white cursor-pointer mr-5"
                      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)" }}
                      onClick={() =>
                        setIsDropDownSelectLocationOpen(
                          !isDropDownSelectLocationOpen
                        )
                      }
                    >
                      <Icon
                        icon="tabler:map-pin-filled"
                        className="text-lg text-[#828282] mr-1"
                        height={20}
                        width={20}
                      />
                      <div className="flex kanit text-[#828282] mr-1 w-20 justify-center items-center">
                        {" "}
                        {filterLocationType}{" "}
                      </div>
                      <Icon
                        icon="icon-park-outline:down-c"
                        className="text-lg text-[#828282]"
                        height={20}
                        width={20}
                      />
                      {isDropDownSelectLocationOpen && (
                        <div
                          ref={selectLocationTypeRef}
                          className="flex flex-col absolute z-50 -bottom-40 w-full bg-white shadow-lg rounded-lg border border-[#B7B7B7] mt-2"
                        >
                          <div
                            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() =>
                              handleChangeType("ที่ท่องเที่ยว")
                            }
                          >
                            <Icon
                              icon="tabler:map-pin-filled"
                              className="text-lg text-[#828282] mr-3"
                              height={16}
                              width={16}
                            />
                            <span className="kanit text-[#828282]">
                              ที่ท่องเที่ยว
                            </span>
                          </div>
                          <div
                            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleChangeType("ที่พัก")}
                          >
                            <Icon
                              icon="tabler:home"
                              className="text-lg text-[#828282] mr-3"
                              height={16}
                              width={16}
                            />
                            <span className="kanit text-[#828282]">ที่พัก</span>
                          </div>
                          <div
                            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleChangeType("ร้านอาหาร")}
                          >
                            <Icon
                              icon="famicons:restaurant"
                              className="text-lg text-[#828282] mr-3"
                              height={16}
                              width={16}
                            />
                            <span className="kanit text-[#828282]">
                              ร้านอาหาร
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col h-full overflow-hidden">
                  <PerfectScrollbar
                     ref={scrollbarRef}
                     onScrollY={handleScroll}
                    className="flex flex-col gap-y-5 mt-5 w-full max-h-[720px] relative bg-white overflow-hidden">
                      {getScrollList().map((data, index) => (
                        <div className="flex" key={index}>
                          <ScrollLocationCard
                            onClickLocationInfo={onClick}
                            location={data}
                            locationType={getLocationTypeByFilter()}
                            index={index}
                            handleClickAddLocationToTrip={handleClickAddLocation}
                            handleClickLocationDetails={handleClickLocationDetails}
                          />
                        </div>
                      ))}
                  </PerfectScrollbar>
                </div>
                <div className={`${(isAttractionScrollDataLoading||isRestaurantScrollDataLoading||isAccommodationScrollDataLoading) ? 'flex justify-center items-center': 'hidden'} `}>
                   Loading....
                </div>
              </div>
            </div>
          </div>
        </>
        <div className={`flex h-full transition-all w-[50%]`}>
          <div className="flex flex-col w-[16%] kanit mt-5">
            <div className="flex w-full justify-center">
              <div className="flex w-full justify-center rounded-tr-xl rounded-br-xl border border-[#B7B7B7] bg-[#3B3B3B] text-white font-bold mr-3 py-2">
                ภาพรวม
              </div>
            </div>
            <div className="flex h-[100%] w-full">
              <div className="flex flex-col w-full items-center mt-40 kanit">
                <div className="flex bg-[#070707] rounded-full p-[10px]">
                  <Icon
                    icon="tdesign:calendar-2"
                    className="text-lg text-white "
                    height={32}
                    width={32}
                  />
                </div>
                <div className="flex flex-col w-full items-center font-bold">
                  <div className="flex">วางแผน</div>
                  <div className="flex">การเดินทาง</div>
                </div>
                <PerfectScrollbar
                  className="flex flex-col w-full max-h-72 relative bg-white mt-2"
                  style={{
                    overflow: "auto",
                  }}
                >
                  {planDateObject.map((item, index) => (
                    <div
                      key={index}
                      className={`flex border-b border-gray-300 p-2 hover:bg-[#929191] cursor-pointer justify-center items-center transition-all ${
                        currentIndexDate == index
                          ? "bg-[#929191]"
                          : "bg-[#F4F4F4]"
                      }`}
                      onClick={() => handleClickChangeDate(index)}
                    >
                      {item}
                    </div>
                  ))}
                </PerfectScrollbar>
              </div>
            </div>
          </div>
          <PerfectScrollbar
            className="flex flex-col w-[84%] h-full relative bg-white"
            style={{
              overflow: "hidden",
            }}
          >
            <div className="flex flex-col">
              <div
                className="flex h-36 w-full relative"
                id="section-1"
                style={{
                  backgroundImage: `url(${planData.plan.tripImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div
                  className="absolute h-[70%] w-[80%] bottom-[-20%] left-[10%] rounded-2xl"
                  style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)" }}
                >
                  <div className="flex w-full h-full rounded-2xl bg-white">
                    <div className="flex flex-col w-full h-full p-6">
                      <div className="flex font-bold text-2xl kanit">
                        {planData.plan.tripName}
                      </div>
                      <div className="flex flex-row mt-3 kanit">
                        <div className="flex justify-center items-center mr-1">
                          <Icon
                            icon="cuida:calendar-outline"
                            className="text-lg text-[#828282] "
                            height={21}
                            width={20}
                          />
                        </div>
                        <div className="flex justify-center items-center text-[#828282] kanit mr-4">
                          {dateRangeFormatted}
                        </div>
                        <div className="flex justify-center items-center mr-1">
                          <Icon
                            icon="material-symbols:person"
                            className="text-lg text-[#828282] "
                            height={24}
                            width={23}
                          />
                        </div>
                        <div className="flex justify-center items-center text-[#828282] kanit">
                          {travelers}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="absolute top-[5%] left-[94%]  justify-center items-center cursor-pointer"
                  onClick={handleClickChangeImage}
                >
                  <Icon
                    icon="akar-icons:edit"
                    className="text-lg text-white"
                    height={30}
                    width={30}
                  />
                </div>
                {showUploadImageModal && (
                  <DropzoneModal
                    tripID={planID}
                    isOpen={showUploadImageModal}
                    setIsOpen={setShowUploadImageModal}
                  />
                )}
              </div>
              <div className={`flex flex-col px-5 bg-[#F0F0F0]`} id="section-2">
                <div className="flex w-full flex-row mt-11 justify-between">
                  <div className="flex">
                    <div
                      className="flex cursor-pointer justify-center items-center mr-2"
                      onClick={() => setShowRecommendPage(!showRecommendPage)}
                    >
                      <Icon
                        icon={
                          showRecommendPage
                            ? "icon-park-outline:down"
                            : "icon-park-outline:right"
                        }
                        className="text-lg text-black"
                        height={24}
                        width={23}
                      />
                    </div>
                    <div className="flex font-bold kanit justify-center items-center">
                      สถานที่แนะนำ
                    </div>
                  </div>
                  <div
                    className="flex px-2 py-0.5 flex-row justify-center items-center rounded-lg bg-white cursor-pointer"
                    onClick={handleShowRecommendPage}
                    style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)" }}
                  >
                    <Icon
                      icon="iconamoon:search"
                      className="text-lg text-[#828282] mr-1"
                      height={16}
                      width={16}
                    />
                    <div className="flex kanit text-[#828282]">
                      {" "}
                      แสดงทั้งหมด{" "}
                    </div>
                  </div>
                </div>
                <div
                  className={`flex flex-col  ${
                    showRecommendPage
                      ? "max-h-screen transition-all duration-500"
                      : "max-h-0 transition-all duration-500"
                  } overflow-hidden`}
                >
                  <div className="flex mt-2">
                    <Carousel
                      breakPoints={breakPoints}
                      pagination={false}
                      renderArrow={myArrow}
                    >
                      {locationRecommend.map((item) => (
                        <RecommendCard
                          key={item._id}
                          id={item._id}
                          title={item.name}
                          type={item.type[0]}
                          img={item.imgPath[0]}
                          rating={item.rating.score}
                          ratingCount={item.rating.ratingCount}
                          clickAddTrip={handleAddLocation}
                        />
                      ))}
                    </Carousel>
                  </div>
                </div>
                <div className="flex bg-[#F0F0F0] mb-6" />
              </div>
              <div
                className="flex flex-col bg-white pl-5 py-5 mt-2"
                id="section-3"
              >
                <div className="flex w-full kanit justify-between font-bold pr-10">
                  <div className="flex relative items-center rounded-lg group">
                    <input
                      ref={inputTitle}
                      type="text"
                      maxLength={30}
                      className={`flex w-full text-lg kanit justify-start font-bold p-2 focus:outline-none rounded-lg hover:bg-[#F7F7F7] focus:bg-[#F7F7F7] pr-8 ${
                        inputTitleWidth === 0 ? "min-w-96" : "max-w-[450px]"
                      }`}
                      placeholder="เพื่มชื่อทริปของคุณ (เช่น ทริปเดินทางสู่...)"
                      value={planName[currentIndexDate] ?? ""}
                      size={inputTitleWidth}
                      onInput={handleInput}
                    />
                    <Icon
                      icon="mdi:pencil"
                      className="text-lg text-[#666666] absolute right-2 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity duration-200"
                      height={16}
                      width={16}
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      className="flex kanit -mt-1 font-normal border border-gray-300 bg-[#fd8433]  text-white rounded-md px-4 py-2 hover:bg-[#f59c60] focus:outline-none transition"
                      onClick={handleClickAutoPlan}
                    >
                      จัดเส้นทางอัติโนมัติ
                    </button>
                  </div>
                </div>
                <div className="flex flex-col mt-2 h-full">
                  <div className="flex flex-row">
                    <div
                      className="flex cursor-pointer justify-center items-center mr-2"
                      onClick={() => setShowPlanning(!showPlanning)}
                    >
                      <Icon
                        icon={
                          showPlanning
                            ? "icon-park-outline:down"
                            : "icon-park-outline:right"
                        }
                        className="text-lg text-black"
                        height={24}
                        width={23}
                      />
                    </div>
                    <div className="flex font-bold kanit justify-center items-center">
                      แผนการเดินทาง
                    </div>
                  </div>
                  <div
                    className={`flex flex-col w-full overflow-hidden transition-all duration-500 ${
                      showPlanning ? "max-h-[10000px]" : "max-h-0"
                    }`}
                  >
                    {planningInformationDataList.length >= 0 &&
                      locationPlanning.length > 0 && (
                        <div className="flex flex-col h-full">
                          <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="locations">
                              {(provided) => (
                                <ul
                                  className="characters text-black pt-2 px-3 h-full"
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                >
                                  {locationPlanning[currentIndexDate].map(
                                    (location, index) => {
                                      const filteredStayDuration =
                                        placesStayDurationList[
                                          currentIndexDate
                                        ].find(
                                          (place) =>
                                            place.uuid === location.uuid
                                        );

                                      return (
                                        <Draggable
                                          key={location.uuid}
                                          draggableId={location.uuid}
                                          index={index}
                                        >
                                          {(provided) => (
                                            <li
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              className="p-2 mb-2 bg-white"
                                            >
                                              <PlanningCard
                                                onDelete={onDelete}
                                                handleClick={onClick}
                                                handleClickEditDuration={
                                                  handleClickEditDuration
                                                }
                                                distance={
                                                  planningInformationDataList[
                                                    index
                                                  ]?.rangeBetween ?? 0
                                                }
                                                duration={
                                                  planningInformationDataList[
                                                    index
                                                  ]?.timeTravel ?? 0
                                                }
                                                stayDuration={
                                                  filteredStayDuration?.time ??
                                                  0
                                                }
                                                uuid={location.uuid}
                                                _id={location._id}
                                                index={index}
                                                name={location.name}
                                                type={location.type}
                                                rating={location.rating}
                                                imgPath={location.imgPath}
                                                latitude={location.latitude}
                                                longitude={location.longitude}
                                                openingHour={
                                                  location.openingHour
                                                }
                                                location={location.location}
                                                priceRange={
                                                  isRestaurantData(location)
                                                    ? location.priceRange
                                                    : undefined
                                                }
                                                description={
                                                  location.description
                                                }
                                                facility={location.facility}
                                                phone={location.phone}
                                                website={location.website}
                                              />
                                            </li>
                                          )}
                                        </Draggable>
                                      );
                                    }
                                  )}
                                  {provided.placeholder}
                                </ul>
                              )}
                            </Droppable>
                          </DragDropContext>
                        </div>
                      )}
                  </div>
                  <div
                    className={`flex flex-col w-full kanit pr-10 pl-5 transition-all duration-500 ${
                      showPlanning ? "max-h-[500px]" : "max-h-0 overflow-hidden"
                    }`}
                  >
                    <div className="relative w-full">
                      <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-[#F2F2F2] shadow-sm">
                        <span className="text-gray-500 mr-2">
                          <Icon
                            icon="ri:map-pin-line"
                            className="text-lg text-[#9B9B9B]"
                          />
                        </span>
                        <input
                          type="text"
                          placeholder="ค้นหาเพื่อเพิ่มสถานที่ของคุณ"
                          className="flex-grow outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                          onFocus={handleFocus}
                          value={searchPlace}
                          onChange={handleSearchChange}
                        />
                      </div>

                      <div
                        className={`absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 ${
                          isSearchOpen ? "flex w-full flex-col" : "hidden"
                        }`}
                        ref={searchPlacesRef}
                      >
                        <ul className="divide-y divide-gray-200">
                          {filteredLocations.slice(0, 5).map((item) => (
                            <SearchPlaceObjectComponent
                              key={item._id}
                              id={item._id}
                              title={item.name}
                              address={item.location.address}
                              onClick={() => handleAddLocation(item._id)}
                            />
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mt-5">
                  <div className="flex flex-row">
                    <div
                      className="flex cursor-pointer justify-center items-center mr-2"
                      onClick={() => setShowAccommodation(!showAccommodation)}
                    >
                      <Icon
                        icon={
                          showAccommodation
                            ? "icon-park-outline:down"
                            : "icon-park-outline:right"
                        }
                        className="text-lg text-black"
                        height={24}
                        width={23}
                      />
                    </div>
                    <div className="flex font-bold kanit justify-center items-center">
                      ที่พักสำหรับการท่องเที่ยว
                    </div>
                  </div>
                  <div
                    className={`flex flex-col w-full ${
                      showAccommodation
                        ? "h-full overflow-visible"
                        : "h-0 overflow-hidden"
                    } transition-all duration-500`}
                  >
                    <div className="flex w-full">
                      {accommodationData[currentIndexDate] ? (
                        <div className="flex p-5 w-full">
                          <AccommodationCard
                            onDelete={onDeleteAccommodation}
                            data={accommodationData[currentIndexDate]}
                            distance={
                              planningInformationDataList[
                                planningInformationDataList.length - 1
                              ]?.rangeBetween ?? 0
                            }
                            duration={
                              planningInformationDataList[
                                planningInformationDataList.length - 1
                              ]?.timeTravel ?? 0
                            }
                          />
                        </div>
                      ) : (
                        <div
                          className={`flex flex-col w-full kanit pr-10 pl-5 mt-2 h-full`}
                        >
                          <div
                            className={`relative h-full w-full ${
                              isSearchAccommodationOpen
                                ? "overflow-visible"
                                : "overflow-hidden"
                            }`}
                          >
                            <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-[#F2F2F2] shadow-sm">
                              <span className="text-gray-500 mr-2">
                                <Icon
                                  icon="ri:map-pin-line"
                                  className="text-lg text-[#9B9B9B]"
                                />
                              </span>
                              <input
                                type="text"
                                placeholder="ค้นหาเพื่อเพิ่มสถานที่พักของคุณ"
                                className="flex-grow outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                                onFocus={handleAccommodationFocus}
                                value={searchAccommodation}
                                onChange={handleSearchAccommodationChange}
                              />
                            </div>
                            <div
                              className={`absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 ${
                                isSearchAccommodationOpen
                                  ? "flex w-full flex-col"
                                  : "hidden"
                              }`}
                              ref={searchAccommodationRef}
                            >
                              <ul className="divide-y divide-gray-200">
                                {filteredAccomodations
                                  .slice(0, 5)
                                  .map((item) => (
                                    <SearchPlaceObjectComponent
                                      key={item._id}
                                      id={item._id}
                                      title={item.name}
                                      address={item.location.address}
                                      onClick={() =>
                                        handleSetAccommodation(item._id)
                                      }
                                    />
                                  ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PerfectScrollbar>
        </div>
        <div className="flex relative flex-col h-full w-[50%]">
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
                {polyline.length > 0 && (
                  <Polyline
                    positions={polyline}
                    pathOptions={{ color: "green" }}
                  />
                )}
                {waypoints.map((position, idx) => {
                  const isLastWaypointWithAccommodation =
                    idx === waypoints.length - 1 &&
                    accommodationData[currentIndexDate] !== null;

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
                          ? `${accommodationData[currentIndexDate]?.name}`
                          : `${locationPlanning[currentIndexDate][idx]?.name}`}
                      </Popup>
                    </Marker>
                  );
                })}
                {
                  selectedLocationInfo && isAllLocationPageOpen && (
                    <Marker position={[selectedLocationInfo.latitude, selectedLocationInfo.longitude]} icon={createCustomIcon(locationPlanning[currentIndexDate].length+1, false)}>
                      <Popup>📍 {selectedLocationInfo.name}</Popup>
                    </Marker>
                  )
                }
                <MapUpdater
                  locationPlanning={locationPlanning[currentIndexDate]}
                  selectedLocationDetails={selectedLocationInfo}
                  accommodationData={accommodationData[currentIndexDate]}
                />
              </MapContainer>
            }
          </div>
        </div>
      </div>
      <EditDurationModal
        isOpen={isModalOpen.isOpen}
        onClose={() => setIsModalOpen({ placeID: "", isOpen: false })}
        onSave={handleSaveDuration}
        duration={duration}
      />
      {
        planData && selectedLocation && (
          <AddToTripModalOnlyDate
          isOpen={isOpenAddLocationModal}
          selectedLocation={selectedLocation}
          startDate={planData.plan.startDate}
          locationType={getLocationTypeByFilter()}
          accommodationData={accommodationData}
          dayDuration={planData.plan.dayDuration}
          onClose={handleCloseAddLocationModal}
          onChangeDate={handleChangeDate}
          onAddTrip={handleAddLocationFromModal}
          dayIndex={currentSelectIndex}
        />
        )
      }
    </div>
  );
}
