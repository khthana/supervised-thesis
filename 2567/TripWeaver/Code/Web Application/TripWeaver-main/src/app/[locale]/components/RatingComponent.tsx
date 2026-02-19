import React, { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import Rating from "../interface/rating";
import RatingComponentElement from "./RatingComponentElement";

interface RatingComponentProps {
    ratingProps: Rating[],
    transaltionTitle: string;
    onCheckBoxSelect: (districts: Rating[]) => void;
}

export default function RatingComponent({ ratingProps, transaltionTitle, onCheckBoxSelect }: RatingComponentProps) {
    const t = useTranslations();
    const [ratings, setRatings] = useState<Rating[]>(ratingProps);

    useEffect(() => {
        setRatings(ratingProps);
    }, [ratingProps]);

    const handleCheckboxClick = (star: number) => {

        const updatedRating = ratings.map((rating) =>
            rating.star === star
              ? { ...rating, selected: !rating.selected } 
              : rating
          );
          setRatings(updatedRating);
          onCheckBoxSelect(updatedRating);
    
    };

    return (
        <>
            <div className="flex flex-col bg-[#F8F8F8] border border-[#E0E0E0] shadow-xl kanit p-5 w-full rounded-xl">
                <div className="flex text-sm">
                    {t(transaltionTitle)}
                </div>
                <div className="flex flex-col">
                    {
                        ratings.map((rating, index) => (
                            <RatingComponentElement
                                key={index}
                                ratingObject={rating}
                                checked={rating.selected}
                                onClick={handleCheckboxClick}
                            />
                        ))
                    }
                </div>
            </div>
        </>
    )
}
