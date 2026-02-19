export const revalidate = 0;
import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Attraction from "../../../../../models/attraction";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const randomAccommodations = await Attraction.aggregate([
      { $sample: { size: 5 } }
    ]);
    return NextResponse.json(randomAccommodations, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch random accommodations" },
      { status: 500 }
    );
  }
}
