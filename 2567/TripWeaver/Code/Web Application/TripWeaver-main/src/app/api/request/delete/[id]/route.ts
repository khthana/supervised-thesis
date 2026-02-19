import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Request from "../../../../../../models/request";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongoDB();
    const { id } = params;
    const deletedRequest = await Request.findByIdAndDelete(id);
    if (!deletedRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Request deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete request", details: error.message },
      { status: 500 }
    );
  }
}
