import { NextResponse, NextRequest } from "next/server"
import { connectMongoDB } from '../../../../../lib/mongodb'
import Blog from "../../../../../models/blogs";


export async function POST(req: NextRequest) {
    try {
        const { blogName,blogImage,userID,description,tags,content  } = await req.json();
        
        await connectMongoDB();
        const createdBlog = await Blog.create({
            blogName,
            blogImage,
            blogCreator : userID,
            description,
            tags,
            content
        });

        return NextResponse.json(
            {
                message: "Create Data Blog",
                BlogID: createdBlog._id.toString(),
            },
            { status: 201 }
        );
    } catch(error) {
        return NextResponse.json({ message: `An error occured while insert data blog ${error}`}, {status: 500})
    }
}

