import { NextResponse,NextRequest } from "next/server"
import { connectMongoDB } from '../../../../../lib/mongodb'
import Accommodation from "../../../../../models/accommodation";

export async function DELETE(req: NextRequest) {
    try {

        await connectMongoDB();

        const result = await Accommodation.deleteMany({});

        return NextResponse.json(
            { message: `Successfully deleted ${result.deletedCount} accommodation.` },
            { status: 200 }
        );
    } catch(error) {
        return NextResponse.json({ message: `An error occured while delete data ${error}`}, {status: 500})
    }
}