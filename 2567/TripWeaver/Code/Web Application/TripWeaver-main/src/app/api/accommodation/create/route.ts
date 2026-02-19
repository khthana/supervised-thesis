import { NextResponse, NextRequest } from "next/server"
import { connectMongoDB } from '../../../../../lib/mongodb'
import Accommodation from '../../../../../models/accommodation'

export async function POST(req: NextRequest) {
    try {
        const { name, description, type, latitude, longitude, facility, star, tag, imgPath, phone, website, location, rating } = await req.json();
        
        await connectMongoDB();
        await Accommodation.create({
            name,
            description,
            type,
            latitude,
            longitude,
            imgPath,
            phone,
            tag,
            website,
            star,
            location,
            rating,
            facility
        });

        return NextResponse.json({ message: "Create Data accommodation"}, {status: 201})
    } catch(error) {
        return NextResponse.json({ message: `An error occured while insert data accommodation ${error}`}, {status: 500})
    }
}