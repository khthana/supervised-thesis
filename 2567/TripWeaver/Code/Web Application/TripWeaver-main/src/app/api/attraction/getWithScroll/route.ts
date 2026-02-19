import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from '../../../../../lib/mongodb';
import Attraction from "../../../../../models/attraction";
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const { recommendIDList, currentPage } = await req.json();

    const pageSize = 10;
    const skipData = pageSize * (currentPage - 1);
    //const limitData = pageSize * currentPage;
    await connectMongoDB();

    const slicedRecommendIDList = recommendIDList.slice(skipData, pageSize);

    const idList = slicedRecommendIDList.map((id: string) => {
        if (!ObjectId.isValid(id)) {
            throw new Error(`Invalid ObjectId: ${id}`);
        }
        return new ObjectId(id);
    });

    if (skipData <= recommendIDList.length) {
        const attractions = await Attraction.find({
            _id: { $in: idList }
        });

        const sortedAttractions = attractions.sort((a, b) => {
            return slicedRecommendIDList.indexOf(a._id.toString()) - slicedRecommendIDList.indexOf(b._id.toString());
        });

        return NextResponse.json({ attractions: sortedAttractions }, { status: 200 });
    }

    /*const attractionsRecommend = await Attraction.find({
        _id: { $in: idList }
    });*/

    const attractions = await Attraction.aggregate([
        {
          $match: {
            _id: { $nin: idList },
          },
        },
        {
          $skip: skipData,
        },
        {
          $limit: pageSize,
        }
    ]);
    
    /*const sortedAttractions = attractionsRecommend.sort((a, b) => {
        return slicedRecommendIDList.indexOf(a._id.toString()) - slicedRecommendIDList.indexOf(b._id.toString());
    });

    sortedAttractions.push(...attractions);*/

    return NextResponse.json({ attractions }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `An error occurred while getting data: ${error}` }, { status: 500 });
  }
}
