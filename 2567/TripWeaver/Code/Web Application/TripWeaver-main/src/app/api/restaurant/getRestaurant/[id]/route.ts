import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Restaurant from "../../../../../../models/restaurant";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {

        const { id } = params;
        await connectMongoDB();

        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return NextResponse.json({ message: `Restaurant with id ${id} not found` }, { status: 404 });
        }
        return NextResponse.json({ restaurant }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: `An error occurred while fetching restaurant ${errorMessage}` },
            { status: 500 }
        );
    }
}
