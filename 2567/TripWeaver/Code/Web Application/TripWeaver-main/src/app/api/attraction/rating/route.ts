import { NextResponse,NextRequest } from "next/server"
import { connectMongoDB } from '../../../../../lib/mongodb'
import Attraction from "../../../../../models/attraction";
import Province from '../../../../../models/province'

export async function POST(req: NextRequest) {
    try {

        const { provinceName, districtList } = await req.json();
        await connectMongoDB();

        const province = await Province.findOne({name: provinceName});

        if (!province) {
            return NextResponse.json({ message: `province not found in database`}, {status: 404})
        }

        //"location.province_code": province.idRef
        const attractionsStarResult = await Attraction.aggregate([
            {
                $match: {
                    "location.province": province.name,
                    "location.district": { $in: districtList }
                }
            },
            {
                $project: {
                    ratingScore: { $floor: "$rating.score" }
                }
            },
            {
                $group: {
                    _id: "$ratingScore",
                    count: { $sum: 1 }
                }
            }, 
            {
                $sort: { _id: -1 }
            }
        ])

        const allRatings = [1, 2, 3, 4, 5];
        const ratingMap = new Map();
        attractionsStarResult.forEach((item) => {
            ratingMap.set(item._id, item.count);
        });
        allRatings.forEach((rating) => {
            if (!ratingMap.has(rating)) {
                ratingMap.set(rating, 0);
            }
        });
        const attractionRatings = Array.from(ratingMap, ([_id, count]) => ({ _id, count })).sort((a, b) => b._id - a._id);
        return NextResponse.json({ attractionRatings }, {status: 201})
    } catch(error) {
        return NextResponse.json({ message: `An error occured while get data district ${error}`}, {status: 500})
    }
}