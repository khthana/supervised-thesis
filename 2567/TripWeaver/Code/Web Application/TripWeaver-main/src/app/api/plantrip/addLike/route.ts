import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import PlanTrips from "../../../../../models/plans";
import User from "../../../../../models/user";

export async function POST(req: NextRequest) {
    try {
        const { planID, statusType, userID } = await req.json(); 

        if (!["ADD", "DEC"].includes(statusType)) {
            return NextResponse.json(
                { message: "Invalid statusType, use 'ADD' or 'DEC'" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        const user = await User.findById(userID);
        if (!user) {
            return NextResponse.json(
                { message: `User with id ${userID} not found` },
                { status: 404 }
            );
        }

        const likePlanList = user.likePlanList || [];

        if (statusType === "ADD" && likePlanList.includes(planID)) {
            return NextResponse.json(
                { message: "Plan is already in likePlanList" },
                { status: 400 }
            );
        }

        if (statusType === "DEC" && !likePlanList.includes(planID)) {
            return NextResponse.json(
                { message: "Plan is not in likePlanList, cannot decrease" },
                { status: 400 }
            );
        }

        const incrementValue = statusType === "ADD" ? 1 : -1;

        const updatedPlans = await PlanTrips.findByIdAndUpdate(
            planID, 
            { $inc: { tripLike: incrementValue } },
            { new: true, runValidators: true }
        );

        if (!updatedPlans) {
            return NextResponse.json({ message: `Plan with id ${planID} not found` }, { status: 404 });
        }

        if (statusType === "ADD") {
            await User.findByIdAndUpdate(
                userID, 
                { $addToSet: { likePlanList: planID } }, 
                { new: true }
            );
        } else {
            await User.findByIdAndUpdate(
                userID, 
                { $pull: { likePlanList: planID } }, 
                { new: true }
            );
        }

        return NextResponse.json(
            { message: `Plan like count ${statusType === "ADD" ? "increased" : "decreased"} successfully`, updatedPlans },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.log(error);
        return NextResponse.json(
            { message: `An error occurred while updating trip like: ${errorMessage}` },
            { status: 500 }
        );
    }
}
