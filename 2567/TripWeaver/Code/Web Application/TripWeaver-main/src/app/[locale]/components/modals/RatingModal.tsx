"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeType: "attraction" | "restaurant" | "accommodation";
  placeId: string;
  userId: string;
  existingRating?: number;
  onRatingSubmit: (rating: number) => void;
  userHasRated: boolean;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  placeType,
  placeId,
  userId,
  existingRating = 0,
  onRatingSubmit,
  userHasRated,
}) => {
  const t = useTranslations();
  const router = useRouter();
  const [selectedRating, setSelectedRating] = useState<number>(existingRating);
  const [userRatedPlaces, setUserRatedPlaces] = useState<
    { placeId: string; rating_score: number }[]
  >([]);
  const [isFirstTimeRating, setIsFirstTimeRating] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedRating(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (placeType === "restaurant" || placeType === "accommodation") {
      const fetchUserRatings = async () => {
        try {
          const response = await fetch(`/api/user/getUser/${userId}`);
          if (!response.ok) throw new Error("Failed to fetch user data");
          const data = await response.json();
          const ratings = data.ratingPlaces || [];
          setUserRatedPlaces(ratings);
          const hasRated = ratings.some(
            (place: { placeId: string }) => place.placeId === placeId
          );
          setIsFirstTimeRating(!hasRated);
        } catch (error) {
          console.error("Error fetching user ratings:", error);
        }
      };
      fetchUserRatings();
    } else {
      setIsFirstTimeRating(!userHasRated);
    }
  }, [userId, placeType, placeId, userHasRated]);

  const calculateNewScore = (
    currentScore: number,
    currentCount: number,
    oldRating: number,
    newRating: number,
    isUpdate: boolean
  ) => {
    if (isUpdate) {
      return parseFloat(
        (((currentScore * currentCount) - oldRating + newRating) / currentCount).toFixed(1)
      );
    } else {
      return parseFloat(
        (((currentScore * currentCount) + newRating) / (currentCount + 1)).toFixed(1)
      );
    }
  };

  const awardBonusPoints = async (getUserEndpoint: string, updateUserEndpoint: string) => {
    const userResponse = await fetch(getUserEndpoint, { method: "GET" });
    if (!userResponse.ok) throw new Error("Failed to fetch user data");
    const userData = await userResponse.json();
    const currentPoints = userData.points || 0;
    await fetch(updateUserEndpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points: currentPoints + 10 }),
    });
  };


  const handleSubmit = async () => {
    if (!selectedRating) return;

    try {
      const getRatingEndpoint = `/api/${placeType}/get${placeType.charAt(0).toUpperCase() +
        placeType.slice(1)}/${placeId}`;
      const updateRatingEndpoint = `/api/${placeType}/update/${placeId}`;
      const getUserEndpoint = `/api/user/getUser/${userId}`;
      const updateUserEndpoint = `/api/user/update/${userId}`;
      const ratingResponse = await fetch(getRatingEndpoint, { method: "POST" });
      if (!ratingResponse.ok) throw new Error("Failed to fetch place rating data");
      const ratingData = await ratingResponse.json();
      const currentScore = ratingData[placeType]?.rating?.score || 0;
      const currentRatingCount = ratingData[placeType]?.rating?.ratingCount || 0;

      let newRatingCount = currentRatingCount;
      let newScore = currentScore;
      let showBonusAlert = false;

      if (placeType === "attraction") {
        if (userHasRated) {
          await fetch(`/api/userrating/update/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ attractionId: placeId, rating_score: selectedRating }),
          });
          newScore = calculateNewScore(currentScore, currentRatingCount, existingRating, selectedRating, true);
        } else {
          await fetch(`/api/userrating/patch/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ attractionId: placeId, rating_score: selectedRating }),
          });
          newRatingCount = currentRatingCount + 1;
          newScore = calculateNewScore(currentScore, currentRatingCount, 0, selectedRating, false);
          showBonusAlert = true;
          await awardBonusPoints(getUserEndpoint, updateUserEndpoint);
        }
      } else {
        const existingEntry = userRatedPlaces.find((place) => place.placeId === placeId);
        if (existingEntry) {
          newScore = calculateNewScore(
            currentScore,
            currentRatingCount,
            existingEntry.rating_score,
            selectedRating,
            true
          );
          const updatedRatingPlaces = userRatedPlaces.map((place) =>
            place.placeId === placeId ? { ...place, rating_score: selectedRating } : place
          );
          await fetch(updateUserEndpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ratingPlaces: updatedRatingPlaces }),
          });
        } else {
          newRatingCount = currentRatingCount + 1;
          newScore = calculateNewScore(currentScore, currentRatingCount, 0, selectedRating, false);
          const updatedRatingPlaces = [
            ...userRatedPlaces,
            { placeId, rating_score: selectedRating },
          ];
          await fetch(updateUserEndpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ratingPlaces: updatedRatingPlaces }),
          });
          if (isFirstTimeRating) {
            showBonusAlert = true;
            await awardBonusPoints(getUserEndpoint, updateUserEndpoint);
          }
        }
      }

      await fetch(updateRatingEndpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: {
            score: newScore,
            ratingCount: newRatingCount,
          },
        }),
      });

      await Swal.fire({
        icon: "success",
        title: showBonusAlert ? t("Rating.Congrats") : t("Rating.Success"),
        text: showBonusAlert ? t("Rating.FirstTimeBonus") : t("Rating.ThankYou"),
        confirmButtonText: "โอเค",
        confirmButtonColor: "#2563ea",
        customClass: {
          title: "kanit",
          popup: "kanit",
          confirmButton: "kanit",
          cancelButton: "kanit",
        },
      });
      window.location.reload();

      onRatingSubmit(selectedRating);
      onClose();
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
        <h2 className="kanit text-xl font-bold mb-4">
          {existingRating ? t("Rating.EditReview") : t("Rating.Title")}
        </h2>

        {/* Star Rating */}
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Icon
              key={star}
              icon={
                star <= selectedRating
                  ? "typcn:star-full-outline"
                  : "typcn:star-outline"
              }
              className="text-yellow-400 text-4xl cursor-pointer"
              onClick={() => handleStarClick(star)}
            />
          ))}
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="kanit px-4 py-2 bg-green-500 text-white rounded-lg"
            onClick={handleSubmit}
          >
            {t("Rating.Submit")}
          </button>
          <button
            className="kanit px-4 py-2 bg-red-500 text-white rounded-lg"
            onClick={onClose}
          >
            {t("Rating.Cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
