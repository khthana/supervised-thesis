import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/user";
import UserRating from "../../../../../../models/userRating";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const apiKey = req.headers.get("Authorization");
    const isApiKeyValid = apiKey === process.env.API_KEY;

    if (isApiKeyValid) {
        try {
            await connectMongoDB();

            const userResult = await User.findByIdAndDelete(params.id);
            if (!userResult) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }

            const ratingResult = await UserRating.findOneAndDelete({ userId: params.id });

            return NextResponse.json({
                message: "User and associated user rating deleted successfully",
                deletedUserRating: !!ratingResult,
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

    if (user.role !== "admin") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        await connectMongoDB();

        const userResult = await User.findByIdAndDelete(params.id);
        if (!userResult) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const ratingResult = await UserRating.findOneAndDelete({ userId: params.id });

        return NextResponse.json({
            message: "User and associated user rating deleted successfully",
            deletedUserRating: !!ratingResult,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
