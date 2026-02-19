import { NextResponse } from "next/server"
import { connectMongoDB } from '../../../../../lib/mongodb'
import Province from '../../../../../models/province'

export async function POST() {
    try {
        await connectMongoDB();
        const provinces = await Province.find({});
        return NextResponse.json({ provinces }, {status: 201})
    } catch(error) {
        return NextResponse.json({ message: `An error occured while get data province ${error}`}, {status: 500})
    }
}