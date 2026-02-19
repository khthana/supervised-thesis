import { NextResponse, NextRequest } from "next/server"
import { connectMongoDB } from '../../../../../lib/mongodb'
import PlanTrips from "../../../../../models/plans";
import User from "../../../../../models/user";

export async function POST(req: NextRequest) {
    try {
        const { tripName, travelers, startDate, dayDuration, accommodations, plans, userID} = await req.json();
        
        await connectMongoDB();
        const createdPlan = await PlanTrips.create({
            tripName,
            tripCreator: userID,
            travelers,
            startDate,
            dayDuration,
            accommodations,
            plans
        });

        //console.log("accommodations",accommodations);
        //console.log("plans",plans);

        await User.findOneAndUpdate(
            { _id: userID },
            { $push: { planList: createdPlan._id.toString() } }
        );

        return NextResponse.json(
            {
                message: "Create Data Plantrip",
                planID: createdPlan._id.toString(),
            },
            { status: 201 }
        );
    } catch(error) {
        return NextResponse.json({ message: `An error occured while insert data plantrip ${error}`}, {status: 500})
    }
}