export const revalidate = 0;
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Request from "../../../../../../models/request";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectMongoDB();
        const { id } = params;

        const request = await Request.findById(id).populate("placeId").populate("userId");

        if (!request) {
            return NextResponse.json(
                { error: "Request not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(request, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch the request" },
            { status: 500 }
        );
    }
}
