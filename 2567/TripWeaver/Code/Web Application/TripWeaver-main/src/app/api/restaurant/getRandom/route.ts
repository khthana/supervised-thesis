export const revalidate = 0;
import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Restaurant from "../../../../../models/restaurant";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const randomRestaurants = await Restaurant.aggregate([
      { $sample: { size: 5 } }
    ]);
    return NextResponse.json(randomRestaurants, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch random restaurants" },
      { status: 500 }
    );
  }
}
