

import AccommodationData from "../interface/accommodation";
import AttractionData from "../interface/attraction";
import RestaurantData from "../interface/restaurant";

export interface PlanUpdateInterface {
    accommodations: {
      accommodationID: string;
    }[];
    plans: {
      planName: string;
      places: {
        placeID: string;
        type: string;
        duration: number;
      }[];
    }[];
  }

  export interface PlanSummaryInterface {
    accommodations: {
      accommodationID: string;
    };
    plans: {
      planName: string;
      places: {
        placeID: string;
        type: string;
        duration: number;
      }[];
    };
  }

export interface PlanObject {
    
    _id: string;
    startDate: Date;
    dayDuration: number;
    accommodations: {
        accommodationID: string;
    }[];
    tripName: string;
}
  
export interface TripCardInterface {
  accommodation: AccommodationData | null;
  location: (AttractionData | RestaurantData)[];
}

export interface PlanningInformationDataInterface {
  timeTravel: number;
  rangeBetween: number;
}