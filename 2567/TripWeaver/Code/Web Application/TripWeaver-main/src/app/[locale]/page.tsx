"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import NavBar from "./components/NavBar";
import MainCarousel from "./components/MainCarousel";
import MainCategoryComponent from "./components/MainCategoryComponent";
import MainPlaceCard from "./components/MainPlaceCard";
import SearchComponent from "./components/SearchComponent";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

interface Rating {
  score: number;
  ratingCount: number;
}

interface Place {
  _id: string;
  name: string;
  rating?: Rating;
  imgPath: string[];
}

export default function Main() {
  const t = useTranslations();
  const { data: session , status } = useSession();
  const userId = session?.user?.id;

  const [selectedProvince, setSelectedProvince] = useState<string>("ภูเก็ต");
  const [recommendedAttractions, setRecommendedAttractions] = useState<Place[]>([]);
  const [accommodationPlaces, setAccommodationPlaces] = useState<Place[]>([]);
  const [restaurantPlaces, setRestaurantPlaces] = useState<Place[]>([]);

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province);
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (userId && status === "authenticated") {
          const ratingRes = await fetch(`/api/userrating/get/${userId}`);
          if (!ratingRes.ok) throw new Error("Failed to fetch user ratings");
          const ratingData = await ratingRes.json();
          const ratingAmount = ratingData?.rating?.length ?? 0;
  
          const userRes = await fetch(`/api/user/getUser/${userId}`);
          if (!userRes.ok) throw new Error("Failed to fetch user details");
          const userData = await userRes.json();
          const attractionTagScore = userData?.attractionTagScore ?? {};
  
          const recommendRes = await fetch(
            `${process.env.NEXT_PUBLIC_REC_API_URL}/recommend-hybrid`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                _id: userId,
                rating_amount: ratingAmount,
                attractionTagScore,
              }),
            }
          );
  
          if (!recommendRes.ok)
            throw new Error("Failed to fetch personalized recommendations");
          const recommendData = await recommendRes.json();
  
          const recommendations: string[] = Array.isArray(
            recommendData.res_recommendation
          )
            ? recommendData.res_recommendation
            : [];
  
          const shuffledRecommendations = recommendations
            .slice(0, 15)
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
  
          const fetchedAttractions = await Promise.all(
            shuffledRecommendations.map(async (placeId: string) => {
              const res = await fetch(`/api/attraction/getAttraction/${placeId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
              });
              if (!res.ok) {
                console.error(`Failed to fetch attraction with id: ${placeId}`);
                return null;
              }
              const data = await res.json();
              return data?.attraction ?? null;
            })
          );
  
          const validAttractions = fetchedAttractions.filter(
            (item): item is Place => item !== null
          );
          setRecommendedAttractions(validAttractions);
        } else {
          const randomRes = await fetch("/api/attraction/getRandom");
          if (!randomRes.ok)
            throw new Error("Failed to fetch random attractions");
          const randomData = await randomRes.json();
          setRecommendedAttractions(randomData);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };
  
    fetchRecommendations();
  }, [userId]);  

  useEffect(() => {
    const fetchData = async <T,>(
      url: string,
      setter: React.Dispatch<React.SetStateAction<T>>
    ) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch data from ${url}`);
        const data = await res.json();
        setter(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData<Place[]>("/api/accommodation/getRandom", setAccommodationPlaces);
    fetchData<Place[]>("/api/restaurant/getRandom", setRestaurantPlaces);
  }, []);

  return (
    <main className="bg-[#F4F4F4]">
      <NavBar />
      <MainCarousel />
      <MainCategoryComponent />

      <div className="container mx-auto">
        <div className="mb-4">
          <SearchComponent
            defaultValue={selectedProvince}
            onProvinceSelect={handleProvinceSelect}
          />
        </div>
      </div>

      <div className="space-y-16">
        {/* Recommended Attractions */}
        <div className="container mx-auto px-6 py-4 rounded-2xl shadow-lg bg-white">
          <h2 className="kanit text-xl font-bold mb-4">
            {t("MainPage.recommendAttraction")}
          </h2>
          {selectedProvince === "ภูเก็ต" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {recommendedAttractions.map((place, index) => (
                <MainPlaceCard
                  key={index}
                  place={{
                    id: place._id,
                    imageUrl: place.imgPath?.[0] || "/images/no-img.png",
                    name: place.name,
                    score: place.rating?.score || 0,
                    view: place.rating?.ratingCount || 0,
                  }}
                  basePath="attraction_detail"
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-24">
              <p className="kanit text-xl text-center">ไม่พบข้อมูล</p>
            </div>
          )}
          <div className="text-right mt-4">
            <Link href="/attraction_list" passHref>
              <button className="bg-[#F4F4F4] kanit font-semibold text-[#181818] shadow-md px-4 py-2 rounded-md">
                {t("MainPage.see_more")}
              </button>
            </Link>
          </div>
        </div>

        {/* Recommended Accommodations */}
        <div className="container mx-auto px-6 py-4 rounded-2xl shadow-lg bg-white">
          <h2 className="kanit text-xl font-bold mb-4">
            {t("MainPage.recommendAccommodation")}
          </h2>
          {selectedProvince === "ภูเก็ต" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {accommodationPlaces.slice(0, 5).map((place, index) => (
                <MainPlaceCard
                  key={index}
                  place={{
                    id: place._id,
                    imageUrl: place.imgPath?.[0] || "/images/no-img.png",
                    name: place.name,
                    score: place.rating?.score || 0,
                    view: place.rating?.ratingCount || 0,
                  }}
                  basePath="accommodation_detail"
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-24">
              <p className="kanit text-xl text-center">ไม่พบข้อมูล</p>
            </div>
          )}
          <div className="text-right mt-4">
            <Link href="/accommodation_list" passHref>
              <button className="bg-[#F4F4F4] kanit font-semibold text-[#181818] shadow-md px-4 py-2 rounded-md">
                {t("MainPage.see_more")}
              </button>
            </Link>
          </div>
        </div>

        {/* Recommended Restaurants */}
        <div className="container mx-auto px-6 py-4 rounded-2xl shadow-lg bg-white">
          <h2 className="kanit text-xl font-bold mb-4">
            {t("MainPage.recommendRestaurant")}
          </h2>
          {selectedProvince === "ภูเก็ต" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {restaurantPlaces.slice(0, 5).map((place, index) => (
                <MainPlaceCard
                  key={index}
                  place={{
                    id: place._id,
                    imageUrl: place.imgPath?.[0] || "/images/no-img.png",
                    name: place.name,
                    score: place.rating?.score || 0,
                    view: place.rating?.ratingCount || 0,
                  }}
                  basePath="restaurant_detail"
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-24">
              <p className="kanit text-xl text-center">ไม่พบข้อมูล</p>
            </div>
          )}
          <div className="text-right mt-4">
            <Link href="/restaurant_list" passHref>
              <button className="bg-[#F4F4F4] kanit font-semibold text-[#181818] shadow-md px-4 py-2 rounded-md">
                {t("MainPage.see_more")}
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="h-32"></div>
    </main>
  );
}
