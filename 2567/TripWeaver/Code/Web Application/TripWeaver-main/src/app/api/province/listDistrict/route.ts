import { NextResponse,NextRequest } from "next/server"
import { connectMongoDB } from '../../../../../lib/mongodb'
import District from '../../../../../models/district'
import Province from '../../../../../models/province'

export async function POST(req: NextRequest) {
    try {

        const { provinceName } = await req.json();
        await connectMongoDB();

        const province = await Province.findOne({name: provinceName});

        if (!province) {
            return NextResponse.json({ message: `data district not found`}, {status: 404})
        }

        const districts = await District.find({provinceRefID: province.idRef});

        return NextResponse.json({ districts }, {status: 201})
    } catch(error) {
        return NextResponse.json({ message: `An error occured while get data district ${error}`}, {status: 500})
    }
}