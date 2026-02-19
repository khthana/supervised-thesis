import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from '../../../../../lib/mongodb';
import Attraction from "../../../../../models/attraction";
import mongoose from "mongoose";


export async function POST(req: NextRequest) {
    try {
        const { tagLists, page, favoritePlaces, favoriteSearchText } = await req.json();
        await connectMongoDB();

        const pageSize = 12;
        const skip = (page - 1) * pageSize;

        if (!page) {
            return NextResponse.json({ message: `page in request body not found` }, { status: 400 });
        }

        let tagMatchConditions = [];

        if (tagLists.length > 0) {
            tagMatchConditions = tagLists.map((tag: string) => ({
                [`attractionTag.attractionTagFields.${tag}`]: { $gte: 0.7 }
            }));
        } else {
            tagMatchConditions = [{}];
        }

        let aggregationPipeline: any[] = [];

        if (favoritePlaces && favoritePlaces.length > 0) {
            const favoritePlaceIds = favoritePlaces.map((place: string) => new mongoose.Types.ObjectId(place));
            aggregationPipeline.push({
                $match: {
                    '_id': { $in: favoritePlaceIds },
                },
            });
        }

        if (favoriteSearchText) {
            aggregationPipeline.push({
                $match: {
                    name: { $regex: favoriteSearchText, $options: 'i' },
                },
            });
        }

        if (tagLists && tagLists.length > 0) {
            aggregationPipeline.push({
                $match: {
                    $or: tagMatchConditions,
                },
            });
        }

        aggregationPipeline.push({
            $sort: { createdAt: -1 },
        });


        aggregationPipeline.push({
            $project: {
                name: 1,
                imgPath: 1,
                _id: 1,
            }
        });

        aggregationPipeline.push({
            $facet: {
                paginatedResults: [
                    { $skip: skip },
                    { $limit: pageSize },
                ],
                totalCount: [
                    { $count: "count" },
                ],
            },
        });

        const aggregationResult = await Attraction.aggregate(aggregationPipeline);
        const paginatedResults = aggregationResult[0]?.paginatedResults || [];
        const totalCount = aggregationResult[0]?.totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / pageSize);
        return NextResponse.json({ attractions: paginatedResults, totalCount, totalPages, currentPage: page, pageSize }, { status: 200 });
    } catch (error) {
        console.error("Error fetching attractions:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}