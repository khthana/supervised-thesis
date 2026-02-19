import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import PlanTrips from "../../../../../../models/plans";
import Attraction from "../../../../../../models/attraction";
import Restaurant from "../../../../../../models/restaurant";
import Accommodation from "../../../../../../models/accommodation";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { locationID, indexDate, locationType } = await req.json();

        await connectMongoDB();

        let location;

        if (locationType === "ATTRACTION") {
            location = await Attraction.findById(locationID);

            if (!location) {
                return NextResponse.json({ message: `Location with id ${locationID} not found in attraction` }, { status: 404 });
            }
        } else if (locationType === "RESTAURANT") {
            location = await Restaurant.findById(locationID);

            if (!location) {
                return NextResponse.json({ message: `Location with id ${locationID} not found in restaurant` }, { status: 404 });
            }
        } else if (locationType === "ACCOMMODATION") {
            location = await Accommodation.findById(locationID);

            if (!location) {
                return NextResponse.json({ message: `Location with id ${locationID} not found in accmmodation` }, { status: 404 });
            }
        }


        const plan = await PlanTrips.findById(id);
        if (!plan) {
            return NextResponse.json({ message: `Plan with id ${id} not found` }, { status: 404 });
        }

        if (indexDate < 0 || indexDate >= plan.plans.length) {
            return NextResponse.json({ message: `Invalid indexDate ${indexDate}` }, { status: 400 });
        }

        if (locationType === "ACCOMMODATION") {
            location = await Accommodation.findById(locationID);

            if (!location) {
                return NextResponse.json({ message: `Location with id ${locationID} not found in accmmodation` }, { status: 404 });
            }

            const planToUpdate = plan.accommodations[indexDate];
            planToUpdate.accommodationID = locationID;

            const updatedPlan = await PlanTrips.findByIdAndUpdate(id, { accommodations: plan.accommodations }, {
                new: true,
                runValidators: true,
            });
    
            return NextResponse.json(
                { message: "Plan updated successfully", updatedPlan },
                { status: 200 }
            );
        }


        const planToUpdate = plan.plans[indexDate];
        if (!planToUpdate) {
            return NextResponse.json({ message: `Plan at index ${indexDate} not found` }, { status: 404 });
        }

        planToUpdate.places.push({
            placeID: location._id, 
            type: locationType,   
            duration: 0,        
        });

        const updatedPlan = await PlanTrips.findByIdAndUpdate(id, { plans: plan.plans }, {
            new: true,
            runValidators: true,
        });

        return NextResponse.json(
            { message: "Plan updated successfully", updatedPlan },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.log(error);
        return NextResponse.json(
            { message: `An error occurred while updating plan: ${errorMessage}` },
            { status: 500 }
        );
    }
}
