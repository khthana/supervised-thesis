import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Attraction from "../../../../../../models/attraction";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const data = await req.json();

        await connectMongoDB();
        
        const updatedAttraction = await Attraction.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!updatedAttraction) {
            return NextResponse.json({ message: `Attraction with id ${id} not found` }, { status: 404 });
        }

        await fetch(`${process.env.NEXT_PUBLIC_REC_API_URL}/retrain-model-content-based`, { method: "POST" });
        await fetch(`${process.env.NEXT_PUBLIC_REC_API_URL}/retrain-model-collaborative`, { method: "POST" });
        
        return NextResponse.json(
            { message: "Attraction updated successfully", updatedAttraction },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: `An error occurred while updating attraction: ${errorMessage}` },
            { status: 500 }
        );
    }
}
