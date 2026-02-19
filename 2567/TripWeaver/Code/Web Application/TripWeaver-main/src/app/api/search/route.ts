export const revalidate = 0;
import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Attraction from "../../../../models/attraction";
import Accommodation from "../../../../models/accommodation";
import Restaurant from "../../../../models/restaurant";

interface Item {
    _id: string;
    name: string;
    imgPath: string[];
  }
  
  export interface SearchResult {
    id: string;
    name: string;
    thumbnail: string;
    category: "attraction" | "accommodation" | "restaurant";
  }
  
  export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
  
    if (!q || q.trim() === "") {
      return NextResponse.json({ error: "Missing search query" }, { status: 400 });
    }
  
    await connectMongoDB();
  
    const regex = new RegExp(q, "i");
  
    try {
      const [attractions, accommodations, restaurants] = await Promise.all([
        Attraction.find({ name: { $regex: regex } })
          .limit(5)
          .select("name imgPath")
          .lean(),
        Accommodation.find({ name: { $regex: regex } })
          .limit(5)
          .select("name imgPath")
          .lean(),
        Restaurant.find({ name: { $regex: regex } })
          .limit(5)
          .select("name imgPath")
          .lean(),
      ]);
  
      const attractionResults: SearchResult[] = (attractions as unknown as Item[]).map((item: Item) => ({
        id: item._id.toString(),
        name: item.name,
        thumbnail: item.imgPath[0],
        category: "attraction",
      }));
  
      const accommodationResults: SearchResult[] = (accommodations as unknown as Item[]).map((item: Item) => ({
        id: item._id.toString(),
        name: item.name,
        thumbnail: item.imgPath[0],
        category: "accommodation",
      }));
  
      const restaurantResults: SearchResult[] = (restaurants as unknown as Item[]).map((item: Item) => ({
        id: item._id.toString(),
        name: item.name,
        thumbnail: item.imgPath[0],
        category: "restaurant",
      }));
  
      const results: SearchResult[] = [
        ...attractionResults,
        ...accommodationResults,
        ...restaurantResults,
      ];
  
      return NextResponse.json(results, { status: 200 });
    } catch (error) {
      console.error("Error fetching search results:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }