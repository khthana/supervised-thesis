export const revalidate = 0;
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/user";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const apiKey = req.headers.get("Authorization");
    const isApiKeyValid = apiKey === process.env.API_KEY;

    if (isApiKeyValid) {
        try {
            await connectMongoDB();
            const user = await User.findById(params.id);
            if (!user) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }

            return NextResponse.json({
                username: user.username,
                email: user.email,
                displayName: user.displayName,
                imgPath: user.imgPath,
                firstName: user.firstName,
                lastName: user.lastName,
                points: user.points,
                role: user.role,
                planList: user.planList,
                likePlanList: user.likePlanList,
                likeBlogList: user.likeBlogList,
                favoritePlaces: user.favoritePlaces,
                ratingPlaces: user.ratingPlaces,
                attractionTagScore: user.attractionTagScore,
                createdAt: user.createdAt,
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

    if (user.role !== "admin" && user.id !== params.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        await connectMongoDB();
        const user = await User.findById(params.id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            imgPath: user.imgPath,
            firstName: user.firstName,
            lastName: user.lastName,
            points: user.points,
            role: user.role,
            planList: user.planList,
            likePlanList: user.likePlanList,
            likeBlogList: user.likeBlogList,
            favoritePlaces: user.favoritePlaces,
            ratingPlaces: user.ratingPlaces,
            attractionTagScore: user.attractionTagScore,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
