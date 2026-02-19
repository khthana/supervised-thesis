import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from '../../../../../lib/mongodb';
import PlanTrips from "../../../../../models/plans";
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();

        const { planList } = await req.json();

        if (!Array.isArray(planList)) {
            return NextResponse.json({ message: "Invalid planList format" }, { status: 400 });
        }

        let plans;
        if (planList.length === 0) {
            plans = [];
        } else {

            const idList = planList.map((id: string) => {
                if (!ObjectId.isValid(id)) {
                    throw new Error(`Invalid ObjectId: ${id}`);
                }
                return new ObjectId(id);
            });

            plans = await PlanTrips.find({
                _id: { $in: idList }
            });
        }

        return NextResponse.json({ plans }, { status: 200 });

    } catch (error) {
        console.error("Error fetching plans:", error);
        return NextResponse.json({ message: `An error occurred while fetching data: ${error}` }, { status: 500 });
    }
}