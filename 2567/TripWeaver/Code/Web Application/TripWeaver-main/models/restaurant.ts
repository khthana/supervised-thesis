import mongoose, { Schema } from "mongoose";
import locationSchema from "./location" 
import ratingSchema from "./rating"
import openingHourSchema from './dateOpen';

const restaurantSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: [String],
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    facility: {
        type: [String],
    },
    imgPath: {
        type: [String],
    },
    openingHour: {
        type: [openingHourSchema],
        default: () => ([])
    },
    phone: {
        type: [String],
    },
    website: {
        type: String,
    },
    priceRange: {
        type: String,
    },
    location: {
       type: locationSchema,
       default: () => ({})
    },
    rating: {
        type: ratingSchema,
        default: () => ({})
     }
},{ timestamps: true }
)

const Restaurant = mongoose.models.Restaurant || mongoose.model("Restaurant",restaurantSchema);

export default Restaurant