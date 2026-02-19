export const revalidate = 0;
import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import UserRating from "../../../../../models/userRating";

export async function GET() {
  await connectMongoDB();

  try {
    const userRatings = await UserRating.find({});

    if (!userRatings || userRatings.length === 0) {
      return NextResponse.json({ message: "No user ratings found." }, { status: 404 });
    }

    return NextResponse.json(userRatings, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "An unknown error occurred." },
      { status: 500 }
    );
  }
}
