import { NextResponse,NextRequest } from "next/server"
import { connectMongoDB } from '../../../../../lib/mongodb'
import Attraction from "../../../../../models/attraction";

export async function DELETE(req: NextRequest) {
    try {

        await connectMongoDB();

        const result = await Attraction.deleteMany({});

        return NextResponse.json(
            { message: `Successfully deleted ${result.deletedCount} attractions.` },
            { status: 200 }
        );
    } catch(error) {
        return NextResponse.json({ message: `An error occured while delete data ${error}`}, {status: 500})
    }
}