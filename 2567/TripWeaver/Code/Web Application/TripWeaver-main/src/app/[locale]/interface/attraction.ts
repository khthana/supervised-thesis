import dateOpen from "./dateOpen";
import LocationObject from "../interface/locationObject";
import RatingObject from "../interface/ratingObject";
import AttractionTag  from "../interface/attractionTag"

export default interface AttractionData {
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
    attractionTag: AttractionTag;
    location: LocationObject;
    rating: RatingObject;
}