import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from '../../../../../lib/mongodb';
import Blogs from "../../../../../models/blogs";

export async function POST(req: NextRequest) {
    try {
        const { blogId } = await req.json();
        await connectMongoDB();

        const blog = await Blogs.findById(blogId);
        if (!blog) {
            return NextResponse.json({ message: "Blog not found" }, { status: 404 });
        }

        blog.blogViews += 1;
        await blog.save();

        return NextResponse.json({ message: "View count updated", blogViews: blog.blogViews }, { status: 200 });
    } catch (error) {
        console.error("Error updating view count:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}