import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from '../../../../../lib/mongodb';
import Restaurant from "../../../../../models/restaurant";


export async function POST(req: NextRequest) {
  try {
    const { currentPage } = await req.json();

    const pageSize = 10;
    const skipData = pageSize * (currentPage - 1);
    await connectMongoDB();

    const restaurants = await Restaurant.aggregate([
        {
          $skip: skipData,
        },
        {
          $limit: pageSize,
        }
    ]);

    return NextResponse.json({ restaurants }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `An error occurred while getting data: ${error}` }, { status: 500 });
  }
}
