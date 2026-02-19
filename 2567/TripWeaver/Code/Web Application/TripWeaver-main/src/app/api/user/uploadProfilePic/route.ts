import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user"; // Use your user model
import axios from "axios";

function generateRandomFilename(extension: string): string {
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${randomString}.${extension}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imgFile = formData.get("imgFile");
    const profileID = formData.get("profileID");

    if (!imgFile || !(imgFile instanceof File)) {
      return NextResponse.json({ message: "No valid file provided" }, { status: 400 });
    }
    
    await connectMongoDB();
    const profile = await User.findById(profileID);

    if (!profile) {
      return NextResponse.json({ message: `Profile with id ${profileID} not found` }, { status: 404 });
    }

    const fileExtension = imgFile.name.split('.').pop();
    const randomFilename = generateRandomFilename(fileExtension || 'jpg'); 

    const apiKey = process.env.IMGBB_API_KEY;
    const uploadFormData = new FormData();
    uploadFormData.append("image", imgFile, randomFilename); 

    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, uploadFormData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });

    if (response.data.success) {
      const uploadedImageUrl = response.data.data.url;
      profile.imgPath = uploadedImageUrl;
      await profile.save();

      return NextResponse.json({ message: "Update profile image success", uploadedImageUrl }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Update failed", error: response.data.error.message }, { status: 500 });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ message: `An error occurred while uploading: ${error}` }, { status: 500 });
  }
}
