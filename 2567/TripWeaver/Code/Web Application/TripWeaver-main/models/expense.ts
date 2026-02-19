import { Schema } from "mongoose";

const expenseSchema = new Schema({
    expenseTitle: { type: String, required: true },
    activityID: { type: String, required: true },
    activityName: { type: String, required: true },
    activityType: { 
        type: String, 
        required: true, 
        enum: ['TRAVEL', 'FOOD', 'SHOPPING', 'ACTIVITY', 'HOTEL', 'DRINK', 'OTHER']
    },
    paidBy: { type: [String], required: true },
    splitType: { 
        type: String, 
        required: true, 
        enum: ['NOT_SPLIT', 'INDIVIDUALS', 'EVERYONE']
    },
    date: { type: Date, required: true },
}, { _id: false });

export default expenseSchema;