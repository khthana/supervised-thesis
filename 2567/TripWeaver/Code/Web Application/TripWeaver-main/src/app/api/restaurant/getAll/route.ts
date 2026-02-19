export const revalidate = 0;
import { NextResponse } from "next/server"
import { connectMongoDB } from '../../../../../lib/mongodb'
import Restaurant from "../../../../../models/restaurant";

export async function GET() {
    await connectMongoDB();

    try {
        const restaurants = await Restaurant.find({});
        return NextResponse.json(restaurants, { status: 200 });
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}