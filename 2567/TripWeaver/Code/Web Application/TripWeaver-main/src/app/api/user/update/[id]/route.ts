import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/user";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const apiKey = req.headers.get("Authorization");
    const isApiKeyValid = apiKey === process.env.API_KEY;

    if (isApiKeyValid) {
        try {
            const body = await req.json();
            await connectMongoDB();
            const updatedUser = await User.findByIdAndUpdate(params.id, body, { new: true });
            if (!updatedUser) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }

            return NextResponse.json({
                message: "User updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: "Internal server error" }, { status: 500 });
        }
    }

    const session = await getServerSession({ req, ...authOptions });
    const user = session?.user as { id: string; name: string; email: string; image: string; role: string };

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (user.role !== "admin" && user.id !== id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await req.json();
        await connectMongoDB();
        const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
