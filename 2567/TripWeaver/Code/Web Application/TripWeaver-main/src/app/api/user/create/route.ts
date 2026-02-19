import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import UserRating from "../../../../../models/userRating";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("Authorization");
  const isApiKeyValid = apiKey === process.env.API_KEY;

  if (isApiKeyValid) {
    return await handleApiKeyRequest(req);
  }

  const session = await getServerSession({ req, ...authOptions });
  const currentUser = session?.user as { id: string; role: string };

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (currentUser.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  return await handleApiKeyRequest(req);
}

async function handleApiKeyRequest(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password, attractionTagScore } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const displayName = `${username}_${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      displayName: displayName,
      attractionTagScore: attractionTagScore || {},
    });
    const savedUser = await newUser.save();

    const newUserRating = new UserRating({
      userId: savedUser._id,
      rating: [],
    });
    await newUserRating.save();

    return NextResponse.json(
      {
        message: "User and UserRating created successfully",
        user: savedUser,
        userRating: newUserRating,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
