import mongoose, { Schema } from "mongoose";


const districtSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    idRef: {
        type: Number,
        required: true
    },
    provinceRefID: {
        type: Number,
        required: true
    },
},{ timestamps: true }
)

const District = mongoose.models.Districts || mongoose.model("Districts",districtSchema);

export default District