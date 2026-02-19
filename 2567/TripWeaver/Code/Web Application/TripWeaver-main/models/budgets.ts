import mongoose, { Schema } from "mongoose";
import expenseSchema from "./expense";

const budgetsSchema = new Schema({

    totalBudget: {
        type: Number,
        required: true
    },
    priceSection: {
       type: [expenseSchema],
       required: true
    }
},{ timestamps: false }
)

const Budget = mongoose.models.Budget || mongoose.model("Budget",budgetsSchema);

export default Budget