export const revalidate = 0;
import { NextResponse } from "next/server";
import { connectMongoDB } from '../../../../../lib/mongodb'
import Accommodation from "../../../../../models/accommodation";

export async function GET() {
    await connectMongoDB();

    try {
        const accommodations = await Accommodation.find({});
        return NextResponse.json(accommodations, { status: 200 });
    } catch (error) {
        console.error("Error fetching accommodations:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}