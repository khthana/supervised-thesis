import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import axios from "axios";

function generateRandomFilename(extension: string): string {
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${randomString}.${extension}`;
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const imgFile = formData.get("imgFile");

        if (!imgFile || !(imgFile instanceof File)) {
            return NextResponse.json({ message: "No valid file provided" }, { status: 400 });
        }
        await connectMongoDB();


        const fileExtension = imgFile.name.split('.').pop();
        const randomFilename = generateRandomFilename(fileExtension || 'jpg'); 

        const apiKey = process.env.IMGBB_API_KEY;
        console.log("apiKey:", apiKey);

        const uploadFormData = new FormData();
        uploadFormData.append("image", imgFile, randomFilename); 
        console.log("uploadFormData:", uploadFormData);


        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, uploadFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 120000,
        });

        if (response.data.success) {
            const uploadedImageUrl = response.data.data.url;


            return NextResponse.json({ uploadedImageUrl }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Update failed", error: response.data.error.message }, { status: 500 });
        }

    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ message: `An error occurred while uploading: ${error}` }, { status: 500 });
    }
}
