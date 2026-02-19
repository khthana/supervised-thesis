import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";

interface FavoriteButtonProps {
  userId: string;
  placeId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ userId, placeId }) => {
  const t = useTranslations();
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`/api/user/getUser/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();

        setIsFavorited(data.favoritePlaces.includes(placeId));
      } catch (error) {
        console.error("Error fetching favorite places:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId, placeId]);

  const handleToggleFavorite = async () => {
    try {
      const updateEndpoint = `/api/user/update/${userId}`;

      const updatedFavorites = isFavorited
        ? { $pull: { favoritePlaces: placeId } }
        : { $addToSet: { favoritePlaces: placeId } };

      const response = await fetch(updateEndpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFavorites),
      });

      if (!response.ok) throw new Error("Failed to update favorites");

      setIsFavorited((prev) => !prev);
    } catch (error) {
      console.error("Error updating favorite places:", error);
    }
  };

  return (
    <button
      className="kanit bg-[#EE6527] hover:bg-[#DDDDDD] hover:text-black text-white text-xl px-4 rounded-full font-regular h-10 flex items-center space-x-2"
      onClick={handleToggleFavorite}
      disabled={loading}
    >
      <Icon icon={isFavorited ? "bi:heart-fill" : "bi:heart"} />
      <span>{t(isFavorited ? "DetailPages.unlike" : "DetailPages.like")}</span>
    </button>
  );
};

export default FavoriteButton;
