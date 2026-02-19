import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Accommodation from "../../../../../models/accommodation";
import Province from "../../../../../models/province";
import axios from "axios";

type AccommdationRating = { _id: number, count: number };

export async function POST(req: NextRequest) {
    try {
        const { provinceName, districtList, radius, centerLatitude, centerLongitude, rating, typeLists, facilityList, tagList, page } = await req.json();
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

        let aggregationPipeline: any[] = [
            {
                $match: {
                    "location.province": province.name,
                    "location.district": { $in: districtList },
                    ...(typeLists.length > 0 ? { "type": { $in: typeLists } } : {}),
                    ...(facilityList.length > 0 ? { "facility": { $in: facilityList } } : {}),
                    ...(tagList.length > 0 ? { "tag": { $in: tagList } } : {}),
                    $expr: {
                        $in: [{ $floor: "$rating.score" }, rating]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    facility: 1,
                    type: 1,
                    tag: 1,
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
                    ...(typeLists.length > 0 ? { "type": { $in: typeLists } } : {}),
                    ...(facilityList.length > 0 ? { "facility": { $in: facilityList } } : {}),
                    ...(tagList.length > 0 ? { "tag": { $in: tagList } } : {}),
                }
            },
            { $sort: { createdAt: -1 } }
        ];

        let aggregationPipelineRating: any[] = [
            {
                $match: {
                    "location.province": province.name,
                    "location.district": { $in: districtList },
                    ...(typeLists.length > 0 ? { "type": { $in: typeLists } } : {}),
                    ...(facilityList.length > 0 ? { "facility": { $in: facilityList } } : {}),
                    ...(tagList.length > 0 ? { "tag": { $in: tagList } } : {}),
                }
            },
            {
                $facet: {
                    accommodationRatings: [
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
            const allaccommodations = await Accommodation.aggregate(aggregationPipelineWithRadius);
            
            const accommodationPromises = allaccommodations.map(async (accommodation) => {
                const { longitude, latitude } = accommodation;
            
                try {
                    const response = await axios.post(
                        `${process.env.OSRM_API_HOST}/route/v1/driving/${longitude},${latitude};${centerLongitude},${centerLatitude}`
                    );
            
                    const distance = response.data.routes[0].distance;
                    if (distance <= radius) {
                        return accommodation;
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
                return null; 
            });
            
            const resolvedaccommodations = await Promise.all(accommodationPromises);
            
            const accommodationsWithinRadius = resolvedaccommodations.filter((accommodation) => accommodation !== null);
            
            const ratingMap = new Map<number, number>();
            accommodationsWithinRadius.forEach((accommodation) => {
                const roundedRating = Math.floor(accommodation.rating.score);
                ratingMap.set(roundedRating, (ratingMap.get(roundedRating) || 0) + 1);
            });
        
            const accommodationRatings = Array.from(ratingMap, ([_id, count]) => ({ _id, count })).sort((a, b) => b._id - a._id);
        

            const accommodationsWithRating = accommodationsWithinRadius.filter((accommodation) => {
                return rating.includes(Math.floor(accommodation.rating.score));
            });

            const sortedaccommodations = accommodationsWithRating.sort((a, b) => {
                return b.rating.score - a.rating.score;
            });

            const totalCount = sortedaccommodations.length;
            const totalPages = Math.ceil(totalCount / pageSize);
            const paginatedData = sortedaccommodations
            .slice(skip, skip + pageSize)
            .map((accommodation) => ({
                _id: accommodation._id,
                name: accommodation.name,
                facility: accommodation.facility,
                type: accommodation.type,
                tag: accommodation.tag,
                imgPath: accommodation.imgPath,
            }));

            const completeaccommodationRatings = allRatings.map(ratingId => {
                const rating = accommodationRatings.find(r => r._id === ratingId);
                return rating ? rating : { _id: ratingId, count: 0 };
            }).sort((a, b) => b._id - a._id);
            
            return NextResponse.json(
                { accommodations: paginatedData, totalCount, totalPages, currentPage: page, pageSize, completeaccommodationRatings },
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

        const aggregationResult = await Accommodation.aggregate(aggregationPipeline);
        const aggregationRatingResult = await Accommodation.aggregate(aggregationPipelineRating);
        const totalCount = aggregationResult[0].totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / pageSize);
        const accommodationsData = aggregationResult[0].data;
        const accommodationRatings = aggregationRatingResult[0].accommodationRatings || [];

        const completeaccommodationRatings = allRatings.map(ratingId => {
            const rating = accommodationRatings.find((r: AccommdationRating) => r._id === ratingId);
            return rating ? rating : { _id: ratingId, count: 0 };
        }).sort((a, b) => b._id - a._id);

        return NextResponse.json(
            { accommodations: accommodationsData, totalCount, totalPages, currentPage: page, pageSize, completeaccommodationRatings },
            { status: 200 }
        );

    } catch (error) {
        console.error("An error occurred:", error);
        return NextResponse.json(
            { message: `An error occurred while getting accommodation data: ${error}` },
            { status: 500 }
        );
    }
}
