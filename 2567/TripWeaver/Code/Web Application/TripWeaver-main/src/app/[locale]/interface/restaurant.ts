import dateOpen from "./dateOpen";
import LocationObject from "../interface/locationObject";
import RatingObject from "../interface/ratingObject";

export default interface RestaurantData {
    _id: string;
    uuid: string;
    name: string;
    description: string;
    type: string[];
    latitude: number;
    longitude: number;
    facility: string[];
    imgPath: string[];
    openingHour: dateOpen[];
    phone: string[];
    website: string;
    priceRange: string | undefined;
    location: LocationObject;
    rating: RatingObject;
}