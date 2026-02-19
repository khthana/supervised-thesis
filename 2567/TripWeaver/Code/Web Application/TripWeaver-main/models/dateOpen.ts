import { Schema } from "mongoose";

const dateSchema = new Schema({
    day: { type: String},
    openingHour: {type: String}
}, { _id: false });

export default dateSchema;