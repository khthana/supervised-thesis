import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import PlanTrips from "../../../../../../models/plans";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {

        const { id } = params;
        await connectMongoDB();

        const plan = await PlanTrips.findById(id);

        if (!plan) {
            return NextResponse.json({ message: `Plan with id ${id} not found` }, { status: 404 });
        }
        return NextResponse.json({ plan }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: `An error occurred while fetching attraction ${errorMessage}` },
            { status: 500 }
        );
    }
}
