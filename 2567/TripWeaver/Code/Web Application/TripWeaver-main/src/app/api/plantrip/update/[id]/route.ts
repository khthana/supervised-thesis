import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import PlanTrips from "../../../../../../models/plans";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const data = await req.json();

        //console.log(data.accommodations);
        //console.log(data.plans);

        await connectMongoDB();
        const updatedPlans = await PlanTrips.findByIdAndUpdate(id, data, {
            new: true,   
            runValidators: true, 
        });

        if (!updatedPlans) {
            return NextResponse.json({ message: `Plan with id ${id} not found` }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Plan updated successfully", updatedPlans },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.log(error);
        return NextResponse.json(
            { message: `An error occurred while updating attraction: ${errorMessage}` },
            { status: 500 }
        );
    }
}
