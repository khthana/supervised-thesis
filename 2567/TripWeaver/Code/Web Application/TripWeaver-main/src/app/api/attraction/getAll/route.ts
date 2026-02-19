export const revalidate = 0;
import { NextResponse } from "next/server"
import { connectMongoDB } from '../../../../../lib/mongodb'
import Attraction from "../../../../../models/attraction";

export async function GET() {
    await connectMongoDB();

    try {
        const attractions = await Attraction.find({});
        return NextResponse.json(attractions, { status: 200 });
    } catch (error) {
        console.error("Error fetching attractions:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
