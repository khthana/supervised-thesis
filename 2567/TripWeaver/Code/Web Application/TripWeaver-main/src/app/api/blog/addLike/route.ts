import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Blogs from "../../../../../models/blogs";
import User from "../../../../../models/user";

export async function POST(req: NextRequest) {
    try {
        const { blogID, statusType, userID } = await req.json(); 

        if (!["ADD", "DEC"].includes(statusType)) {
            return NextResponse.json(
                { message: "Invalid statusType, use 'ADD' or 'DEC'" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        const user = await User.findById(userID);
        if (!user) {
            return NextResponse.json(
                { message: `User with id ${userID} not found` },
                { status: 404 }
            );
        }

        const likeBlogList = user.likeBlogList || [];

        if (statusType === "ADD" && likeBlogList.includes(blogID)) {
            return NextResponse.json(
                { message: "Blog is already in likeBlogList" },
                { status: 400 }
            );
        }

        if (statusType === "DEC" && !likeBlogList.includes(blogID)) {
            return NextResponse.json(
                { message: "Blog is not in likeBlogList, cannot decrease" },
                { status: 400 }
            );
        }

        const incrementValue = statusType === "ADD" ? 1 : -1;

        const updatedBlogs = await Blogs.findByIdAndUpdate(
            blogID, 
            { $inc: { blogLikes: incrementValue } },
            { new: true, runValidators: true }
        );

        if (!updatedBlogs) {
            return NextResponse.json({ message: `Blog with id ${blogID} not found` }, { status: 404 });
        }

        if (statusType === "ADD") {
            await User.findByIdAndUpdate(
                userID, 
                { $addToSet: { likeBlogList: blogID } }, 
                { new: true }
            );
        } else {
            await User.findByIdAndUpdate(
                userID, 
                { $pull: { likeBlogList: blogID } }, 
                { new: true }
            );
        }

        return NextResponse.json(
            { message: `Blog like count ${statusType === "ADD" ? "increased" : "decreased"} successfully`, updatedBlogs },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.log(error);
        return NextResponse.json(
            { message: `An error occurred while updating blog like: ${errorMessage}` },
            { status: 500 }
        );
    }
}
