import { NextResponse, NextRequest } from "next/server"
import { connectMongoDB } from '../../../../lib/mongodb'
import SubDistricts from '../../../../models/subDistrict'

export async function POST(req: NextRequest) {
    try {
        const { name, idRef,districtRefID } = await req.json();
        
        await connectMongoDB();
        await SubDistricts.create({
            name,
            idRef,
            districtRefID
        });

        return NextResponse.json({ message: "Create Data Province"}, {status: 201})
    } catch(error) {
        return NextResponse.json({ message: `An error occured while insert data province ${error}`}, {status: 500})
    }
}