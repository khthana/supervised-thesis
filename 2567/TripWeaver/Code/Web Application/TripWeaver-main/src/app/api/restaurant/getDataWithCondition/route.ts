import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Restaurant from "../../../../../models/restaurant";
import Province from "../../../../../models/province";
import axios from "axios";

type RestaurantRating = { _id: number, count: number };

export async function POST(req: NextRequest) {
    try {
        const { provinceName, districtList, radius, centerLatitude, centerLongitude, rating, typeLists, facilityList, page } = await req.json();
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
                    $or: [
                        { "type": { $in: typeLists } },
                        { "facility": { $in: facilityList } },
                        { $expr: { $and: [{ $eq: [typeLists.length, 0] }, { $eq: [facilityList.length, 0] }] } }
                    ],
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
                    $or: [
                        { "type": { $in: typeLists } },
                        { "facility": { $in: facilityList } },
                        { $expr: { $and: [{ $eq: [typeLists.length, 0] }, { $eq: [facilityList.length, 0] }] } }
                    ],
                }
            },
            { $sort: { createdAt: -1 } }
        ];

        let aggregationPipelineRating: any[] = [
            {
                $match: {
                    "location.province": province.name,
                    "location.district": { $in: districtList },
                    $or: [
                        { "type": { $in: typeLists } },
                        { "facility": { $in: facilityList } },
                        { $expr: { $and: [{ $eq: [typeLists.length, 0] }, { $eq: [facilityList.length, 0] }] } }
                    ],
                }
            },
            {
                $facet: {
                    restaurantRatings: [
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
            const allrestaurants = await Restaurant.aggregate(aggregationPipelineWithRadius);
            
            const restaurantPromises = allrestaurants.map(async (restaurant) => {
                const { longitude, latitude } = restaurant;
            
                try {
                    const response = await axios.post(
                        `${process.env.OSRM_API_HOST}/route/v1/driving/${longitude},${latitude};${centerLongitude},${centerLatitude}`
                    );
            
                    const distance = response.data.routes[0].distance;
                    if (distance <= radius) {
                        return restaurant;
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
                return null; 
            });
            
            const resolvedrestaurants = await Promise.all(restaurantPromises);
            
            const restaurantsWithinRadius = resolvedrestaurants.filter((restaurant) => restaurant !== null);
            
            const ratingMap = new Map<number, number>();
            restaurantsWithinRadius.forEach((restaurant) => {
                const roundedRating = Math.floor(restaurant.rating.score);
                ratingMap.set(roundedRating, (ratingMap.get(roundedRating) || 0) + 1);
            });
        
            const restaurantRatings = Array.from(ratingMap, ([_id, count]) => ({ _id, count })).sort((a, b) => b._id - a._id);
        

            const restaurantsWithRating = restaurantsWithinRadius.filter((restaurant) => {
                return rating.includes(Math.floor(restaurant.rating.score));
            });

            const sortedrestaurants = restaurantsWithRating.sort((a, b) => {
                return b.rating.score - a.rating.score;
            });

            const totalCount = sortedrestaurants.length;
            const totalPages = Math.ceil(totalCount / pageSize);
            const paginatedData = sortedrestaurants
            .slice(skip, skip + pageSize)
            .map((restaurant) => ({
                _id: restaurant._id,
                name: restaurant.name,
                imgPath: restaurant.imgPath,
            }));

            const completerestaurantRatings = allRatings.map(ratingId => {
                const rating = restaurantRatings.find(r => r._id === ratingId);
                return rating ? rating : { _id: ratingId, count: 0 };
            }).sort((a, b) => b._id - a._id);
            
            return NextResponse.json(
                { restaurants: paginatedData, totalCount, totalPages, currentPage: page, pageSize, completerestaurantRatings },
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

        const aggregationResult = await Restaurant.aggregate(aggregationPipeline);
        const aggregationRatingResult = await Restaurant.aggregate(aggregationPipelineRating);
        const totalCount = aggregationResult[0].totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / pageSize);
        const restaurantsData = aggregationResult[0].data;
        const restaurantRatings = aggregationRatingResult[0].restaurantRatings || [];

        const completerestaurantRatings = allRatings.map(ratingId => {
            const rating = restaurantRatings.find((r: RestaurantRating) => r._id === ratingId);
            return rating ? rating : { _id: ratingId, count: 0 };
        }).sort((a, b) => b._id - a._id);

        return NextResponse.json(
            { restaurants: restaurantsData, totalCount, totalPages, currentPage: page, pageSize, completerestaurantRatings },
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
