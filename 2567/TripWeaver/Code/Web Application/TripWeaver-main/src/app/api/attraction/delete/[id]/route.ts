import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Attraction from "../../../../../../models/attraction";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await connectMongoDB();

        const deletedAttraction = await Attraction.findByIdAndDelete(id);

        if (!deletedAttraction) {
            return NextResponse.json(
                { message: `Attraction with id ${id} not found` },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: `Successfully deleted attraction with id ${id}` },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: `An error occurred while deleting attraction: ${errorMessage}` },
            { status: 500 }
        );
    }
}