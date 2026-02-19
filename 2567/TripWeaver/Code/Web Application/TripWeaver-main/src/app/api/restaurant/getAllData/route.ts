import { NextResponse,NextRequest } from "next/server"
import { connectMongoDB } from '../../../../../lib/mongodb'
import Restaurant from "../../../../../models/restaurant";

export async function POST(req: NextRequest) {
    try {

        await connectMongoDB();

        const restaurants = await Restaurant.find({});

        
        return NextResponse.json({ restaurants }, {status: 201})
    } catch(error) {
        return NextResponse.json({ message: `An error occured while get data restaurant ${error}`}, {status: 500})
    }
}