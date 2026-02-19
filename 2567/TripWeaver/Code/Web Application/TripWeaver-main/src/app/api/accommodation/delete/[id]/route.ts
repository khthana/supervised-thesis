import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Accommodation from "../../../../../../models/accommodation";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await connectMongoDB();

        const deletedAccommodation = await Accommodation.findByIdAndDelete(id);

        if (!deletedAccommodation) {
            return NextResponse.json(
                { message: `Accommodation with id ${id} not found` },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: `Successfully deleted accommodation with id ${id}` },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: `An error occurred while deleting accommodation: ${errorMessage}` },
            { status: 500 }
        );
    }
}