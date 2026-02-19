import mongoose, { Schema } from "mongoose";

const RequestSchema = new Schema({
    type: { 
        type: String, 
        enum: ["add", "edit"], 
        required: true 
    },
    placeType: { 
        type: String, 
        enum: ["attraction", "accommodation", "restaurant"], 
        required: true 
    },
    placeId: { 
        type: Schema.Types.ObjectId, 
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["waiting", "approved", "rejected"], 
        default: "waiting" 
    },
    details: { 
        type: Schema.Types.Mixed, 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
});

export default mongoose.models.Request || mongoose.model("Request", RequestSchema);
