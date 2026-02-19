import mongoose, { Schema } from "mongoose";


const provinceSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    idRef: {
        type: Number,
        required: true
    },
},{ timestamps: true }
)

const Province = mongoose.models.Provinces || mongoose.model("Provinces",provinceSchema);

export default Province