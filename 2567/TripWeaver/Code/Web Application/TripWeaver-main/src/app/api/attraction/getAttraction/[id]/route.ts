import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Attraction from "../../../../../../models/attraction";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {

        const { id } = params;
        await connectMongoDB();

        const attraction = await Attraction.findById(id);

        if (!attraction) {
            return NextResponse.json({ message: `Attraction with id ${id} not found` }, { status: 404 });
        }
        return NextResponse.json({ attraction }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: `An error occurred while fetching attraction ${errorMessage}` },
            { status: 500 }
        );
    }
}
