import LocationObject from "../interface/locationObject";
import RatingObject from "../interface/ratingObject";
import dateOpen from "./dateOpen";

export default interface AccommodationData {
  _id: string;
  name: string;
  type: string[];
  description: string;
  latitude: number;
  longitude: number;
  imgPath: string[];
  phone: string;
  website: string;
  star: number;
  openingHour: dateOpen[];
  facility: string[];
  tag: string[];
  location: LocationObject;
  rating: RatingObject;
}
