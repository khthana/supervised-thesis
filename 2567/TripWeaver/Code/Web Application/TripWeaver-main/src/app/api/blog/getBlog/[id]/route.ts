import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Blogs from "../../../../../../models/blogs";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {

        const { id } = params;
        await connectMongoDB();

        const blog = await Blogs.findById(id).populate("blogCreator", "displayName imgPath _id");

        if (!blog) {
            return NextResponse.json({ message: `Blog with id ${id} not found` }, { status: 404 });
        }
        return NextResponse.json({ blog }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: `An error occurred while fetching attraction ${errorMessage}` },
            { status: 500 }
        );
    }
}