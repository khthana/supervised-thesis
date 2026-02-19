export const revalidate = 0;
import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import PlanTrips from "../../../../../../models/plans";
import Blogs from "../../../../../../models/blogs";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await connectMongoDB();
  
    const userId = params.id;
    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }
  
    try {
      const recentTrips = await PlanTrips.find({ tripCreator: userId }).sort({ createdAt: -1 }).limit(4);
      
      const recentBlogs = await Blogs.find({ blogCreator: userId }).sort({ createdAt: -1 }).limit(4);
  
      return NextResponse.json({
        recentTrips,
        recentBlogs,
      }, { status: 200 });
    } catch (error) {
      console.error("Error fetching recent profile data:", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  }
  
