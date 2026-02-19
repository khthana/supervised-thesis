import { NextResponse } from "next/server"
import attractionTagFields from "../../../../../schemaFields/attractionTagsFields"


export async function POST() {
    try {
        const attractionTagKeys = Object.keys(attractionTagFields);
        return NextResponse.json({attractionTagKeys}, {status: 201})
    } catch(error) {
        return NextResponse.json({ message: `An error occured while insert data attraction ${error}`}, {status: 500})
    }
}