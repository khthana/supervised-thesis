import { Schema } from "mongoose";

const ratingSchema = new Schema({
    score: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
}, { _id: false });

export default ratingSchema;