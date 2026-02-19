import { NextResponse,NextRequest } from "next/server"
import { connectMongoDB } from '../../../../../lib/mongodb'
import District from '../../../../../models/district'
import SubDistricts from '../../../../../models/subDistrict'

export async function POST(req: NextRequest) {
    try {

        const { DistrictName, DistrictID } = await req.json();
        await connectMongoDB();

        const district = await District.findOne({name: DistrictName, idRef: DistrictID});

        if (!district) {
            return NextResponse.json({ message: `data subdistrict not found`}, {status: 404})
        }

        const subDistricts = await SubDistricts.find({districtRefID: district.idRef});

        return NextResponse.json({ subDistricts }, {status: 201})
    } catch(error) {
        return NextResponse.json({ message: `An error occured while get data district ${error}`}, {status: 500})
    }
}