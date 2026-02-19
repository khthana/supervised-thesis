import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Request from "../../../../../models/request";

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();
        const body = await req.json();

        const { type, placeType, placeId, userId, details } = body;

        if (!type || !placeType || !userId || !details) {
            return NextResponse.json(
                { error: "Missing required fields: type, placeType, userId, details" },
                { status: 400 }
            );
        }

        const newRequest = new Request({
            type,
            placeType,
            placeId,
            userId,
            details,
            status: "waiting",
        });

        await newRequest.save();

        return NextResponse.json(newRequest, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: (error) },
            { status: 500 }
        );
    }
}
