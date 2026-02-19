import mongoose, { Schema } from "mongoose";
import locationSchema from "./location" 
import ratingSchema from "./rating"

const accomodationSchema = new Schema({

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
    star: {
        type: Number,
    },
    tag: {
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
    phone: {
        type: [String],
    },
    website: {
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

const Accommodation = mongoose.models.Accommodation || mongoose.model("Accommodation",accomodationSchema);

export default Accommodation