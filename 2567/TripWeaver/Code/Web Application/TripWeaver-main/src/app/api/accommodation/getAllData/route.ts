import { NextResponse,NextRequest } from "next/server"
import { connectMongoDB } from '../../../../../lib/mongodb'
import Accommodation from "../../../../../models/accommodation";

export async function POST(req: NextRequest) {
    try {

        await connectMongoDB();

        const accommodations = await Accommodation.find({});

        
        return NextResponse.json({ accommodations }, {status: 201})
    } catch(error) {
        return NextResponse.json({ message: `An error occured while get data accommodation ${error}`}, {status: 500})
    }
}