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

        const attractions = await Attraction.aggregate([
            {
                $match: {
                    "location.province": province.name,
                    "location.district": { $in: districtList }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    latitude: 1,
                    longitude: 1
                }
            }
        ])

        
        return NextResponse.json({ attractions }, {status: 201})
    } catch(error) {
        return NextResponse.json({ message: `An error occured while get data attraction ${error}`}, {status: 500})
    }
}