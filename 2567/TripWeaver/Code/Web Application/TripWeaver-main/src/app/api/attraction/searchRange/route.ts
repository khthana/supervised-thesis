import { NextResponse,NextRequest } from "next/server"
import { connectMongoDB } from '../../../../../lib/mongodb'
import Attraction from "../../../../../models/attraction";
import Province from '../../../../../models/province'
import axios from "axios";

export async function POST(req: NextRequest) {
    try {

        const { provinceName, districtList, radius, centerLatitude, centerLongitude } = await req.json();
        await connectMongoDB();

        const province = await Province.findOne({name: provinceName});

        if (!province) {
            return NextResponse.json({ message: `province not found in database`}, {status: 404})
        }

        const attractionsMatchCondition = await Attraction.aggregate([
            {
                $match: {
                    "location.province": province.name,
                    "location.district": { $in: districtList }
                }
            }
        ])

        let attractionsWithinRadius = [];


        for (const attraction of attractionsMatchCondition) {

            const { latitude, longitude } = attraction;

            try {   
                const response = await axios.post(`${process.env.OSRM_API_HOST}/route/v1/driving/${longitude},${latitude};${centerLongitude},${centerLatitude}`)
                const distance = response.data.routes[0].distance;
                
                if(distance <= radius) {
                    attractionsWithinRadius.push(attraction)
                }

            } catch(error) {
                console.error('Error fetching data:', error);
            }
        }
        
        return NextResponse.json({ attractions: attractionsWithinRadius }, {status: 201})
    } catch(error) {
        return NextResponse.json({ message: `An error occured while get data district ${error}`}, {status: 500})
    }
}