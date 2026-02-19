import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Request from "../../../../../../models/request";
import Attraction from "../../../../../../models/attraction";
import Accommodation from "../../../../../../models/accommodation";
import Restaurant from "../../../../../../models/restaurant";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectMongoDB();
        const { id } = params;
        const body = await req.json();
        const { status, details } = body;

        if (!status || !["waiting", "approved", "rejected"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid or missing status" },
                { status: 400 }
            );
        }

        const request = await Request.findById(id);

        if (!request) {
            return NextResponse.json(
                { error: "Request not found" },
                { status: 404 }
            );
        }

        if (status === "approved") {
            if (!details) {
                return NextResponse.json(
                    { error: "Missing details for approved request" },
                    { status: 400 }
                );
            }

            if (request.type === "add") {
                let newPlace;
                if (request.placeType === "attraction") {
                    newPlace = await Attraction.create(details);
                } else if (request.placeType === "accommodation") {
                    newPlace = await Accommodation.create(details);
                } else if (request.placeType === "restaurant") {
                    newPlace = await Restaurant.create(details);
                }

                if (!newPlace) {
                    return NextResponse.json(
                        { error: `Failed to create ${request.placeType}` },
                        { status: 500 }
                    );
                }
            } else if (request.type === "edit") {
                if (!request.placeId) {
                    return NextResponse.json(
                        { error: "Missing placeId for edit request" },
                        { status: 400 }
                    );
                }

                let updatedPlace;
                if (request.placeType === "attraction") {
                    updatedPlace = await Attraction.findByIdAndUpdate(request.placeId, details, {
                        new: true,
                    });
                } else if (request.placeType === "accommodation") {
                    updatedPlace = await Accommodation.findByIdAndUpdate(request.placeId, details, {
                        new: true,
                    });
                } else if (request.placeType === "restaurant") {
                    updatedPlace = await Restaurant.findByIdAndUpdate(request.placeId, details, {
                        new: true,
                    });
                }

                if (!updatedPlace) {
                    return NextResponse.json(
                        { error: `Failed to update ${request.placeType}` },
                        { status: 500 }
                    );
                }
            } else {
                return NextResponse.json(
                    { error: "Invalid request type" },
                    { status: 400 }
                );
            }
        }

        request.status = status;
        await request.save();

        return NextResponse.json(request, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: `Failed to update the request` },
            { status: 500 }
        );
    }
}
