import mongoose, { Schema } from "mongoose";


const subDistrictSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    districtRefID: {
        type: Number,
        required: true
    },
    idRef: {
        type: Number,
        required: true
    },
},{ timestamps: true }
)

const SubDistricts = mongoose.models.subDistricts || mongoose.model("subDistricts",subDistrictSchema);

export default SubDistricts