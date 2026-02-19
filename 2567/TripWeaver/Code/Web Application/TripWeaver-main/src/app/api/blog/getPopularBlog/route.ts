import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Blogs from "../../../../../models/blogs";

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();

        const aggregationPipeline = [
            {
                $sort: {
                    blogViews: -1 as const,
                },
            },
            {
                $limit: 5,
            },
            {
                $lookup: {
                    from: 'users', // The collection to join
                    localField: 'blogCreator', // The field from the input documents
                    foreignField: '_id', // The field from the documents of the "from" collection
                    as: 'blogCreator', // The name of the new array field to add to the input documents
                }
            },
            {
                $unwind: {
                    path: '$blogCreator',
                    preserveNullAndEmptyArrays: true, // Optional: keep documents without a match
                }
            },
            {
                $project: {
                    blogName: 1,
                    blogImage: 1,
                    description: 1,
                    content: 1,
                    createdAt: 1,
                    tags: 1,
                    blogViews: 1,
                    blogLikes: 1,
                    blogCreator: '$blogCreator.displayName', // Include only the displayName field from blogCreator
                }
            }
        ];

        const popularBlogs = await Blogs.aggregate(aggregationPipeline);

        if (!popularBlogs || popularBlogs.length === 0) {
            return NextResponse.json({ message: `No popular blogs found` }, { status: 404 });
        }

        return NextResponse.json({ blogs: popularBlogs }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: `An error occurred while fetching popular blogs: ${errorMessage}` },
            { status: 500 }
        );
    }
}