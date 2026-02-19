import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Blogs from "../../../../../../models/blogs";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const data = await req.json();

        await connectMongoDB();
        const updatedBlogs = await Blogs.findByIdAndUpdate(id, data, {
            new: true,   
            runValidators: true, 
        });

        if (!updatedBlogs) {
            return NextResponse.json({ message: `Blog with id ${id} not found` }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Blog updated successfully", updatedBlogs },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.log(error);
        return NextResponse.json(
            { message: `An error occurred while updating attraction: ${errorMessage}` },
            { status: 500 }
        );
    }
}