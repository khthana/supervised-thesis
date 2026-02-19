import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from '../../../../../lib/mongodb';
import PlanTrips from "../../../../../models/plans";
import { ta } from "date-fns/locale";
import { t } from "i18next";

export async function POST(req: NextRequest) {
    try {
        const { page, creator ,tripSearchText } = await req.json();
        await connectMongoDB();

        const pageSize = 12;
        const skip = (page - 1) * pageSize;

        if (!page) {
            return NextResponse.json({ message: `page in request body not found` }, { status: 400 });
        }

        let aggregationPipeline: any[] = [];

        if (creator) {
            aggregationPipeline.push({
                $match: {
                   tripCreator: creator,
                },
            });
        }

        if (tripSearchText) {
            aggregationPipeline.push({
                $match: {
                    tripName: { $regex: tripSearchText, $options: 'i' },
                },
            });
        }

        aggregationPipeline.push({
            $sort: { createdAt: -1 },
          });

          aggregationPipeline.push({
            $lookup: {
                from: 'users', 
                localField: 'tripCreator', 
                foreignField: '_id', 
                as: 'tripCreator', 
            }
        });

        aggregationPipeline.push({
            $unwind: {
                path: '$tripCreator',
                preserveNullAndEmptyArrays: true, 
            }
        });

        aggregationPipeline.push({
            $project: {
                tripName: 1,
                tripImage: 1,
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


        const aggregationResult = await PlanTrips.aggregate(aggregationPipeline);
        const paginatedResults = aggregationResult[0]?.paginatedResults || [];
        const totalCount = aggregationResult[0]?.totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / pageSize);
        return NextResponse.json({ trips: paginatedResults, totalCount, totalPages, currentPage: page, pageSize }, { status: 200 });
    } catch (error) {
        console.error("Error fetching trips:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}