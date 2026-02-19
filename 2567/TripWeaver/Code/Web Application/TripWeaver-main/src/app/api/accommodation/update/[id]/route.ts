import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Accommodation from "../../../../../../models/accommodation";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const data = await req.json();

        await connectMongoDB();

        const updatedAccommodation = await Accommodation.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!updatedAccommodation) {
            return NextResponse.json({ message: `Accommodation with id ${id} not found` }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Accommodation updated successfully", updatedAccommodation },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: `An error occurred while updating accommodation: ${errorMessage}` },
            { status: 500 }
        );
    }
}
