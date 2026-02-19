import { NextResponse, NextRequest } from "next/server"
import { connectMongoDB } from '../../../../../lib/mongodb'
import Restaurant from '../../../../../models/restaurant'

export async function POST(req: NextRequest) {
    try {
        const { name, description, type, latitude, longitude, facility, openingHour, imgPath, phone, website, priceRange, location, rating } = await req.json();
        
        await connectMongoDB();
        await Restaurant.create({
            name,
            description,
            type,
            latitude,
            longitude,
            imgPath,
            phone,
            website,
            openingHour,
            priceRange,
            location,
            rating,
            facility
        });

        return NextResponse.json({ message: "Create Data restaurant"}, {status: 201})
    } catch(error) {
        return NextResponse.json({ message: `An error occured while insert data restaurant ${error}`}, {status: 500})
    }
}