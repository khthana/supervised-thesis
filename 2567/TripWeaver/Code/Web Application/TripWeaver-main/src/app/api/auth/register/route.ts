import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import bcrypt from "bcryptjs";
import User from "../../../../../models/user";
import UserRating from "../../../../../models/userRating";

export async function POST(request: Request) {
  await connectMongoDB();

  const { username, email, password } = await request.json();

  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      let duplicateField = existingUser.email === email ? "email" : "username";

      if (duplicateField === "username") {
        duplicateField = "ชื่อผู้ใช้";
      } else if (duplicateField === "email") {
        duplicateField = "อีเมล";
      }

      return NextResponse.json(
        { message: `${duplicateField}ดังกล่าวถูกใช้แล้ว` },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const displayName = `${username}_${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      displayName,
    });

    await newUser.save();

    const newUserRating = new UserRating({
      userId: newUser._id,
      rating: [],
    });

    await newUserRating.save();

    return NextResponse.json({ message: "User created successfully." }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "An unknown error occurred." },
      { status: 500 }
    );
  }
}
