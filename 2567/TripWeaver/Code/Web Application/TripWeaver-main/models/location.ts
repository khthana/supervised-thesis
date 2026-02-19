import { Schema } from "mongoose";

const locationSchema = new Schema({
    address: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    subDistrict: { type: String },
    province_code: { type: Number, required: true },
    district_code: { type: Number, required: true },
    sub_district_code: { type: Number },
}, { _id: false });

export default locationSchema;