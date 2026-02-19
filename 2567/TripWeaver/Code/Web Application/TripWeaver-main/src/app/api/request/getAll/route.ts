export const revalidate = 0;
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Request from "../../../../../models/request";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    const apiKey = req.headers.get("Authorization");
    const isApiKeyValid = apiKey === process.env.API_KEY;

    if (isApiKeyValid) {
        try {
            await connectMongoDB();
            const requests = await Request.find().populate("userId");
            return NextResponse.json(requests, { status: 200 });
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                { error: "Failed to fetch requests" },
                { status: 500 }
            );
        }
    }

    const session = await getServerSession({ req, ...authOptions });
    const currentUser = session?.user as { id: string; role: string };

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "admin") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        await connectMongoDB();
        const requests = await Request.find().populate("userId");
        return NextResponse.json(requests, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch requests" },
            { status: 500 }
        );
    }
}
