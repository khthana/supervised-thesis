import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from '../../../../../lib/mongodb';
import Blogs from "../../../../../models/blogs";
import { ta } from "date-fns/locale";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    try {
        const { provinceName, tagLists, page, creator ,blogSearchText } = await req.json();
        await connectMongoDB();

        const pageSize = 12;
        const skip = (page - 1) * pageSize;

        if (!page) {
            return NextResponse.json({ message: `page in request body not found` }, { status: 400 });
        }

        let aggregationPipeline: any[] = [];

        if (creator && mongoose.Types.ObjectId.isValid(creator)) {
            aggregationPipeline.push({
                $match: {
                    'blogCreator': new mongoose.Types.ObjectId(creator),
                },
            });
        }

        if (blogSearchText) {
            aggregationPipeline.push({
                $match: {
                    blogName: { $regex: blogSearchText, $options: 'i' },
                },
            });
        }

        if (tagLists && tagLists.length > 0) {
            aggregationPipeline.push({
                $match: {
                    tags: { $in: tagLists },
                },
            },
            {
                $sort: {
                    createdAt: -1,
                }
            },
        );
        }

        aggregationPipeline.push({
            $sort: { createdAt: -1 },
          });

          aggregationPipeline.push({
            $lookup: {
                from: 'users', 
                localField: 'blogCreator', 
                foreignField: '_id', 
                as: 'blogCreator', 
            }
        });

        aggregationPipeline.push({
            $unwind: {
                path: '$blogCreator',
                preserveNullAndEmptyArrays: true, 
            }
        });

        aggregationPipeline.push({
            $project: {
                blogName: 1,
                blogImage: 1,
                description: 1,
                content: 1,
                createdAt: 1,
                tags: 1,
                blogViews: 1,
                blogLikes:1,
                blogCreator: '$blogCreator.displayName',
            }
        });

        aggregationPipeline.push(
            {
                $facet: {
                    paginatedResults: [
                        { $skip: skip },
                        { $limit: pageSize },
                    ],
                    totalCount: [
                        { $count: "count" },
                    ],
                },
            }
        );


        const aggregationResult = await Blogs.aggregate(aggregationPipeline);
        const paginatedResults = aggregationResult[0]?.paginatedResults || [];
        const totalCount = aggregationResult[0]?.totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / pageSize);
        return NextResponse.json({ blogs: paginatedResults, totalCount, totalPages, currentPage: page, pageSize }, { status: 200 });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}