import { NextResponse,NextRequest } from "next/server"
import { connectMongoDB } from '../../../../../lib/mongodb'
import Accommodation from "../../../../../models/accommodation";
import Province from '../../../../../models/province'

export async function POST(req: NextRequest) {
    try {

        const { provinceName, districtList } = await req.json();
        await connectMongoDB();

        const province = await Province.findOne({name: provinceName});

        if (!province) {
            return NextResponse.json({ message: `province not found in database`}, {status: 404})
        }

        console.log("Come here");

        const accommodations = await Accommodation.aggregate([
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

        
        return NextResponse.json({ accommodations }, {status: 201})
    } catch(error) {
        return NextResponse.json({ message: `An error occured while get data accommodation ${error}`}, {status: 500})
    }
}