import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import UserRating from "../../../../../../models/userRating";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectMongoDB();

  const { id } = params;
  const { attractionId, rating_score } = await request.json();

  if (!id || !attractionId || rating_score === undefined) {
    return NextResponse.json(
      { message: "User ID, attraction ID, and a valid rating score are required." },
      { status: 400 }
    );
  }

  try {
    const userRating = await UserRating.findOne({ userId: id });

    if (!userRating) {
      return NextResponse.json({ message: "User rating entry not found." }, { status: 404 });
    }

    const existingRatingIndex = userRating.rating.findIndex(
      (r: { attractionId: string} ) => r.attractionId === attractionId
    );

    if (existingRatingIndex !== -1) {
      userRating.rating[existingRatingIndex].rating_score = rating_score;
    } else {
      return NextResponse.json(
        { message: "User has not rated this attraction yet." },
        { status: 400 }
      );
    }

    await userRating.save();

    return NextResponse.json(userRating, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "An unknown error occurred." },
      { status: 500 }
    );
  }
}
