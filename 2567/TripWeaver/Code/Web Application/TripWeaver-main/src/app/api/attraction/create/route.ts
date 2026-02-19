import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Attraction from "../../../../../models/attraction";

export async function POST(req: NextRequest) {
    try {
        const { name, type, description, latitude, longitude, imgPath, phone, website, openingHour, attractionTag, location, rating } = await req.json();
        
        await connectMongoDB();
        
        const newAttraction = await Attraction.create({
            name,
            type,
            description,
            latitude,
            longitude,
            imgPath,
            phone,
            website,
            openingHour,
            attractionTag,
            location,
            rating
        });

        const tagScorePayload = {
            name,
            latitude,
            longitude,
            imgPath
        };

        const tagScoreResponse = await fetch(`${process.env.NEXT_PUBLIC_REC_API_URL}/generate-attraction-tagScore`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tagScorePayload)
        });

        if (!tagScoreResponse.ok) {
            throw new Error("Failed to fetch attraction tag scores");
        }

        const tagScores = await tagScoreResponse.json();

        await Attraction.findByIdAndUpdate(newAttraction._id, { attractionTag: { attractionTagFields: tagScores } });

        await fetch(`${process.env.NEXT_PUBLIC_REC_API_URL}/retrain-model-content-based`, { method: "POST" });
        await fetch(`${process.env.NEXT_PUBLIC_REC_API_URL}/retrain-model-collaborative`, { method: "POST" });

        return NextResponse.json({ message: "Attraction created, tag scores updated, and models retrained" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
