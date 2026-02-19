import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Restaurant from "../../../../../../models/restaurant";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const data = await req.json();

        await connectMongoDB();

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!updatedRestaurant) {
            return NextResponse.json({ message: `Restaurant with id ${id} not found` }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Restaurant updated successfully", updatedRestaurant },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: `An error occurred while updating restaurant: ${errorMessage}` },
            { status: 500 }
        );
    }
}
