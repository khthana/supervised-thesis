import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Restaurant from "../../../../../../models/restaurant";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await connectMongoDB();

        const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

        if (!deletedRestaurant) {
            return NextResponse.json(
                { message: `Restaurant with id ${id} not found` },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: `Successfully deleted restaurant with id ${id}` },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: `An error occurred while deleting restaurant: ${errorMessage}` },
            { status: 500 }
        );
    }
}