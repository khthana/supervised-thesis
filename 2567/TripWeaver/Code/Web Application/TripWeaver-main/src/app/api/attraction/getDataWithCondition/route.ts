import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Attraction from "../../../../../models/attraction";
import Province from "../../../../../models/province";
import axios from "axios";

type AttractionRating = { _id: number, count: number };

export async function POST(req: NextRequest) {
    try {
        const { provinceName, districtList, radius, centerLatitude, centerLongitude, rating, tagLists, page } = await req.json();
        await connectMongoDB();

        const pageSize = 20;
        const skip = (page - 1) * pageSize;
        const allRatings = [0, 1, 2, 3, 4, 5];

        if (!page) {
            return NextResponse.json({ message: `page in request body not found` }, { status: 400 });
        }

        const province = await Province.findOne({ name: provinceName });

        if (!province) {
            return NextResponse.json({ message: `province not found in database` }, { status: 404 });
        }

        let tagMatchConditions = [];

        if (tagLists.length > 0) {
            tagMatchConditions = tagLists.map((tag: string) => ({
                [`attractionTag.attractionTagFields.${tag}`]: { $gte: 0.7 }
            }));
        } else {
            tagMatchConditions = [{}];
        }
        

        let aggregationPipeline: any[] = [
            {
                $match: {
                    "location.province": province.name,
                    "location.district": { $in: districtList },
                    $or: tagMatchConditions,
                    $expr: {
                        $in: [{ $floor: "$rating.score" }, rating]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    imgPath: 1
                }
            },
            {
                $sort: { "rating.score": -1, createdAt: -1 }
            }
        ];

        let aggregationPipelineWithRadius: any[] = [
            {
                $match: {
                    "location.province": province.name,
                    "location.district": { $in: districtList },
                    $or: tagMatchConditions,
                }
            },
            { $sort: { createdAt: -1 } }
        ];

        let aggregationPipelineRating: any[] = [
            {
                $match: {
                    "location.province": province.name,
                    "location.district": { $in: districtList },
                    $or: tagMatchConditions,
                }
            },
            {
                $facet: {
                    attractionRatings: [
                        {
                            $group: {
                                _id: { $floor: "$rating.score" },
                                count: { $sum: 1 } 
                            }
                        },
                        { $sort: { _id: -1 } } 
                    ]
                }
            },
            { $sort: { createdAt: -1 } }
        ];
        

        
        if (radius && centerLongitude && centerLatitude) {
            const allAttractions = await Attraction.aggregate(aggregationPipelineWithRadius);
            
            const attractionPromises = allAttractions.map(async (attraction) => {
                const { longitude, latitude } = attraction;
            
                try {
                    const response = await axios.post(
                        `${process.env.OSRM_API_HOST}/route/v1/driving/${longitude},${latitude};${centerLongitude},${centerLatitude}`
                    );
            
                    const distance = response.data.routes[0].distance;
                    if (distance <= radius) {
                        return attraction;
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
                return null; 
            });
            
            const resolvedAttractions = await Promise.all(attractionPromises);
            
            const attractionsWithinRadius = resolvedAttractions.filter((attraction) => attraction !== null);
            
            const ratingMap = new Map<number, number>();
            attractionsWithinRadius.forEach((attraction) => {
                const roundedRating = Math.floor(attraction.rating.score);
                ratingMap.set(roundedRating, (ratingMap.get(roundedRating) || 0) + 1);
            });
        
            const attractionRatings = Array.from(ratingMap, ([_id, count]) => ({ _id, count })).sort((a, b) => b._id - a._id);
        

            const attractionsWithRating = attractionsWithinRadius.filter((attraction) => {
                return rating.includes(Math.floor(attraction.rating.score));
            });

            const sortedAttractions = attractionsWithRating.sort((a, b) => {
                return b.rating.score - a.rating.score;
            });

            const totalCount = sortedAttractions.length;
            const totalPages = Math.ceil(totalCount / pageSize);
            const paginatedData = sortedAttractions
            .slice(skip, skip + pageSize)
            .map((attraction) => ({
                _id: attraction._id,
                name: attraction.name,
                imgPath: attraction.imgPath,
            }));

            const completeAttractionRatings = allRatings.map(ratingId => {
                const rating = attractionRatings.find(r => r._id === ratingId);
                return rating ? rating : { _id: ratingId, count: 0 };
            }).sort((a, b) => b._id - a._id);
            
            return NextResponse.json(
                { attractions: paginatedData, totalCount, totalPages, currentPage: page, pageSize, completeAttractionRatings },
                { status: 200 }
            );
        }

        aggregationPipeline.push(
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    data: [{ $skip: skip }, { $limit: pageSize }],
                }
            }
        );

        const aggregationResult = await Attraction.aggregate(aggregationPipeline);
        const aggregationRatingResult = await Attraction.aggregate(aggregationPipelineRating);
        const totalCount = aggregationResult[0].totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / pageSize);
        const attractionsData = aggregationResult[0].data;
        const attractionRatings = aggregationRatingResult[0].attractionRatings || [];

        const completeAttractionRatings = allRatings.map(ratingId => {
            const rating = attractionRatings.find((r: AttractionRating) => r._id === ratingId);
            return rating ? rating : { _id: ratingId, count: 0 };
        }).sort((a, b) => b._id - a._id);

        return NextResponse.json(
            { attractions: attractionsData, totalCount, totalPages, currentPage: page, pageSize, completeAttractionRatings },
            { status: 200 }
        );

    } catch (error) {
        console.error("An error occurred:", error);
        return NextResponse.json(
            { message: `An error occurred while getting district data: ${error}` },
            { status: 500 }
        );
    }
}
