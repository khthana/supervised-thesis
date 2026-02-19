"use client";
import React, { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import {useTranslations} from 'next-intl';
import SearchComponent from "../components/SearchComponent";
import CheckBoxComponent from "../components/CheckBoxComponent";
import RatingComponent from "../components/RatingComponent";
import TagCheckBoxComponent from "../components/TagCheckBoxComponent";
import SearchRadiusComponent from "../components/SearchRadiusComponent";
import District from '../interface/district'
import Rating from "../interface/rating";
import CheckboxElement from "../interface/checkboxElement";
import LocationInfo from "../interface/locationInfo";
import LocationCard from "../components/LocationCard";
import { fetchRestaurantType, fetchRestaurantFacility, fetchRestaurantKeyList, fetchRestaurant, fetchPlanAllData, fetchUserPlans, addLocationToTrip} from '@/utils/apiService';
import { useQuery } from "react-query";
import PaginationComponent from "../components/PaginationComponent";
import AddToTripModal from "../components/modals/AddToTripModals";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { PlanObject } from "../interface/plantripObject";
import Swal from "sweetalert2";

interface LocationCardInterface {
    _id: string;
    name: string;
    imgPath: string[];
}

export default function Home() {
    const t = useTranslations();
    const router = useRouter();

    const [selectedProvince, setSelectedProvince] = useState("ภูเก็ต");
    const [selectedDistrict, setSelectedDistrict] = useState<District[]>([]);
    const [locationCardList, setLocationCardList] = useState<LocationCardInterface[]>([]);
    const [plantripList, setPlantripList] = useState<PlanObject[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [selectedPlan, setSelectedPlan] = useState<PlanObject|null>(null);
    const [searchPlan, setSearchPlan] = useState<string>("");
    const [indexDate, setIndexDate] = useState<number>(0);
    const [isDropdownPlanOpen, setIsDropdownPlanOpen] = useState<boolean>(false);

    const [selectedMarkRadiusValue, setSelectedMarkRadiusValue] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [maxPage, setMaxPage] = useState<number>(1);
    const [selectedMarkRadiusRestaurant, setSelectedMarkRadiusRestaurant] = useState<LocationInfo|null>(null);

    const [ratingObject, setRatingObject] = useState<Rating[]>([]);
    const [ratingCheckData, setRatingCheckData] = useState<boolean[]>(Array(6).fill(false));
    
    const [typesList, setTypesList] = useState<CheckboxElement[]>([]);
    const [facilityList, setFacilityList] = useState<CheckboxElement[]>([]);
    const [searchRadiusMarker,setSearchRadiusMarker] = useState<LocationInfo[]>([])

  const { data: session, status } = useSession();

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

    const {
        data: restaurantList,
        isLoading: isRestaurantLoading,
        isError: isRestaurantError,
    } = useQuery(
        ["restaurantData", selectedProvince, selectedDistrict],
        () => fetchRestaurantKeyList(
            selectedProvince,
            selectedDistrict
                .filter((district) => district.selected)
                .map((district) => district.name)
        ),
        {
            enabled: !!selectedProvince && selectedDistrict.length > 0,
            retry: 0
        }
    );

    const {
        data: restaurantType,
        isLoading: isRestaurantTypeLoading,
        isError: isRestaurantTypeError,
    } = useQuery(
        ["restaurantType"],
        () => fetchRestaurantType(),
        {
            retry: 0
        }
    );

    const {
        data: restaurantFacility,
        isLoading: isRestaurantFacilityLoading,
        isError: isRestaurantFacilityError,
    } = useQuery(
        ["restaurantFacility"],
        () => fetchRestaurantFacility(),
        {
            retry: 0
        }
    );

    const {
        data: restaurantDataFromFilter,
        isLoading: isRestaurantDataFromFilterLoading,
        isError: isRestaurantDataFromFilterError,
    } = useQuery(
        ["restaurantDataFromFilter", selectedProvince, selectedDistrict, typesList, facilityList, ratingCheckData,selectedMarkRadiusRestaurant,selectedMarkRadiusValue
            ,currentPage
        ],
        () => fetchRestaurant(
            selectedProvince,
            selectedDistrict
                .filter((district) => district.selected)
                .map((district) => district.name),
            typesList.filter((type) => type.selected).map((type) => type.name),
            facilityList.filter((facility) => facility.selected).map((facility) => facility.name),
            ratingObject.filter((rating) => rating.selected).map((rating) => rating.star),
            currentPage,
            selectedMarkRadiusValue*1000,
            selectedMarkRadiusRestaurant?.latitude,
            selectedMarkRadiusRestaurant?.longitude
        ),
        {
            retry: 0
        }
    );

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
        setCurrentPage(1);
    }, [selectedProvince, selectedDistrict, facilityList, typesList, ratingCheckData,selectedMarkRadiusRestaurant,selectedMarkRadiusValue]);


    const handleClickViewDetails = (locationID: string,locationType: string) => {
        if(locationType === "ATTRACTION") {
          router.push(`/th/attraction_detail/${locationID}`)
        } else if(locationType === "RESTAURANT") {
          router.push(`/th/restaurant_detail/${locationID}`)
        } else {
          router.push(`/th/accommodation_detail/${locationID}`)
        }
      }

    useEffect(() => {
        if (restaurantDataFromFilter) {

            

            setRatingObject(
                restaurantDataFromFilter.completerestaurantRatings.map((rating: any,index: number) => ({
                    star: rating._id,
                    count: rating.count,
                    selected: ratingCheckData[index],
                }))
            );

            setLocationCardList(restaurantDataFromFilter.restaurants.map((data: LocationCardInterface)=>({
                _id: data._id,
                name: data.name,
                imgPath: data.imgPath
            }))

            );
            setMaxPage(restaurantDataFromFilter.totalPages);
        }
    }, [restaurantDataFromFilter]);

    useEffect(() => {
        if (restaurantList) {
            setSearchRadiusMarker(restaurantList.restaurants);
        }

        if (restaurantType) {
            setTypesList(
                restaurantType.type.map((type: string) => ({
                    name: type,
                    selected: false,
                }))
            );
        }

        if(restaurantFacility) {
            setFacilityList(
                restaurantFacility.facility.map((facility: string) => ({
                    name: facility,
                    selected: false,
                }))
            );
        }
    }, [restaurantList, restaurantType, restaurantFacility]);
    

    const handleProvinceSelect = (province: string) => {
        setSelectedProvince(province); 
    };

    const handleMarkRadiusAttractionSelect = (markAttaction: LocationInfo|null) => {
        setSelectedMarkRadiusRestaurant(markAttaction); 
    };

    const handleMarkRadiusValueSelect = (markValue: number) => {
        setSelectedMarkRadiusValue(markValue); 
    };

    const handleDistrictSelect = (districts: District[]) => {
        setSelectedDistrict(districts); 
    };

    const handleRating = (ratings: Rating[]) => {
        setRatingObject(ratings); 
        setRatingCheckData(ratings.map((rating) => {
            return rating.selected;
        }))
    };

    const handleChangeDateIndex= (dateIndex: number) => {
        setIndexDate(dateIndex);
    }

    const handleType = (tags: CheckboxElement[]) => {
        setTypesList(tags); 
    };

    const handleFacility = (tags: CheckboxElement[]) => {
        setFacilityList(tags); 
    };
    

    const handleSelectPage = (page: number) => {
        if(page==currentPage) {
            return;
        }
        if(page > maxPage) {
            return;
        }

        if(page <= 0) {
            return;
        }

        setCurrentPage(page);
    }

    const handleAddTrip = (locationID: string) => {
        if(plantripList.length == 0) { 
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
    }

    const handleAddTripToPlan = (planID: string,locationID: string) => {
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
        
       addLocationToTrip(planID,locationID,indexDate,"RESTAURANT");
    }

    const handleSetPlanID = (planID: string) => {
        const selectedTrip = plantripList.find((plan) => plan._id === planID);
        if (selectedTrip) {
            setSelectedPlan(selectedTrip);
            setSearchPlan(selectedTrip.tripName);
        } else {
            setSelectedPlan(null);
        }
        setIndexDate(0);
    }

    
    const handleSetSearchPlan = (planName: string) => {
        setSearchPlan(planName);
    }

    const handleChangeDropdown = (isOpen: boolean) => {
        setIsDropdownPlanOpen(isOpen);
    }

    if (status === "unauthenticated") {
        redirect("/login");
    }


    return (
        <>
            <div className="flex flex-col bg-[#F4F4F4] w-full h-full">
                <NavBar/> 
                <div className="flex px-20 mt-10 flex-col">
                    <div className="flex flex-row text-lg">
                    <div
                        className="kanit font-regular hover:text-gray-500 cursor-pointer"
                        onClick={() => window.location.href = "/"}
                        >{t("RestaurantPages.infoMain")}</div>
                        <div className="kanit font-bold">
                            {t('RestaurantPages.restaurant')}
                        </div>
                    </div>
                    <div className="flex w-full flex-row justify-end">
                        <div className="flex flex-row mr-5">
                            <SearchComponent defaultValue={selectedProvince} onProvinceSelect={handleProvinceSelect}/>
                        </div>
                        <div className="flex flex-row ">
                            <CheckBoxComponent provinceName={selectedProvince} onCheckBoxSelect={handleDistrictSelect}/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col px-20 h-full">
                    <div className="flex kanit text-center text-xl font-bold mb-2">
                        {t('RestaurantPages.filter')}
                    </div>
                    <div className="flex flex-row h-full">
                        <div className="flex flex-col w-[15%]">
                            <div className="flex mb-5">
                                <SearchRadiusComponent translationPrefix={"RestaurantPages"} locationList={searchRadiusMarker} onSelectLocationMark={handleMarkRadiusAttractionSelect} onSelectLocationValue={handleMarkRadiusValueSelect}/>
                            </div>
                            <div className="flex mb-5">
                                <RatingComponent transaltionTitle={"RestaurantPages.title_star"} ratingProps={ratingObject} onCheckBoxSelect={handleRating}/>
                            </div>
                            <div className="flex mb-5">
                                <TagCheckBoxComponent maxHeight={144} element={typesList} onCheckBoxSelect={handleType} translationPrefix={"Types."} translationTagTitle={"RestaurantPages.title_type"}/>
                            </div>
                            <div className="flex">
                                <TagCheckBoxComponent maxHeight={144} element={facilityList} onCheckBoxSelect={handleFacility} translationPrefix={"Facilities."} translationTagTitle={"RestaurantPages.title_facility"}/>
                            </div>
                        </div>
                        <div className="flex flex-wrap w-[85%] pl-16 h-full">
                        {
                            locationCardList.map((location, index) => (
                                <div className="flex w-1/4 justify-end items-end px-2 pt-4 h-48" key={index}>
                                    <LocationCard 
                                        placeImage={location.imgPath[0]} 
                                        placeID={location._id}
                                        placeName={location.name}
                                        onClickAddTrip={handleAddTrip}
                                        handleClickViewDetails={handleClickViewDetails}
                                        placeType="RESTAURANT"
                                    />
                                </div>
                            ))
                        }
                        </div>
                    </div>
                </div>
                <div className="flex px-20 justify-end w-full h-full mb-5 mt-2">
                    <PaginationComponent currentPage={currentPage} maxPage={maxPage} onSelectPage={handleSelectPage} />
                </div>
                <AddToTripModal
                    isOpen={isModalOpen}
                    searchPlan={searchPlan}
                    selectedPlan={selectedPlan}
                    locationType={"RESTAURANT"}
                    dayIndex={indexDate}
                    onClose={() => setIsModalOpen(false)}
                    onAddTrip={handleAddTripToPlan}
                    onSelectPlan={handleSetPlanID}
                    onInputPlanName={handleSetSearchPlan}
                    selectedLocation={selectedLocation}
                    planList={plantripList}
                    isDropdownPlanOpen={isDropdownPlanOpen}
                    onChangeDropdown={handleChangeDropdown}
                    onChangeDate={handleChangeDateIndex}
                />
            </div>
            
        </>
    );
}