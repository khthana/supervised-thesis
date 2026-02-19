import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Accommodation from "../../../../../../models/accommodation";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {

        const { id } = params;
        await connectMongoDB();

        const accommodation = await Accommodation.findById(id);

        if (!accommodation) {
            return NextResponse.json({ message: `Accommodation with id ${id} not found` }, { status: 404 });
        }
        return NextResponse.json({ accommodation }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: `An error occurred while fetching accommodation ${errorMessage}` },
            { status: 500 }
        );
    }
}
