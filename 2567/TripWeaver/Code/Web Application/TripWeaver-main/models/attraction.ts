import mongoose, { Schema } from "mongoose";
import locationSchema from "./location"
import openingHourSchema from './dateOpen';
import ratingSchema from "./rating"
import attractionTagFields from "../schemaFields/attractionTagsFields";

const attractionTagSchema = new Schema({attractionTagFields}, { _id: false });

const attractionSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    type: {
        type: [String],
        required: true
    },
    description: {
        type: String,
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    imgPath: {
        type: [String],
    },
    phone: {
        type: String,
    },
    website: {
        type: String,
    },
    openingHour: {
        type: [openingHourSchema],
        default: () => ([])
    },
    attractionTag: {
       type: attractionTagSchema,
       default: () => ({})
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

const Attraction = mongoose.models.Attraction || mongoose.model("Attraction",attractionSchema);

export default Attraction