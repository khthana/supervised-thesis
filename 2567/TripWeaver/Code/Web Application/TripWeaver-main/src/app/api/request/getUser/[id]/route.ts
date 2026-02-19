export const revalidate = 0;
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Request from "../../../../../../models/request";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectMongoDB();
        const { id: userid } = params;

        const requests = await Request.find({ userId: userid }).sort({ date: -1 }).populate("placeId").populate("userId");

        if (!requests.length) {
            return NextResponse.json(
                { error: "No requests found for this user" },
                { status: 404 }
            );
        }

        return NextResponse.json(requests, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch user requests" },
            { status: 500 }
        );
    }
}
