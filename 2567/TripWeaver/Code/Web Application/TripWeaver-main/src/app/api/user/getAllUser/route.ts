export const revalidate = 0;
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    const apiKey = req.headers.get("Authorization");
    const isApiKeyValid = apiKey === process.env.API_KEY;

    if (isApiKeyValid) {
        try {
            await connectMongoDB();
            const users = await User.find({});
            return NextResponse.json(users);
        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: "Internal server error" }, { status: 500 });
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
        const users = await User.find({});
        return NextResponse.json(users);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
