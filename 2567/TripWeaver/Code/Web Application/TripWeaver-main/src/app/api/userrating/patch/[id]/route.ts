import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import UserRating from "../../../../../../models/userRating";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectMongoDB();

  const { id } = params;
  const { attractionId, rating_score } = await request.json();

  if (!id || !attractionId || typeof rating_score !== "number") {
    return NextResponse.json(
      { message: "User ID, attraction ID, and rating score are required." },
      { status: 400 }
    );
  }

  try {
    const updatedUserRating = await UserRating.findOneAndUpdate(
      { userId: id },
      {
        $push: {
          rating: { attractionId, rating_score },
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedUserRating, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "An unknown error occurred." },
      { status: 500 }
    );
  }
}
