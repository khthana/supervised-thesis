import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// API route สำหรับเพิ่มจำนวนครั้งของการ redirect
export async function GET() {
  const cookieStore = cookies();
  const redirectCount = parseInt((await cookieStore).get("redirectCount")?.value || "0", 10);

  // เพิ่มจำนวนครั้ง
  (await
        // เพิ่มจำนวนครั้ง
        cookieStore).set("redirectCount", (redirectCount + 1).toString());

  // ส่ง response กลับ
  return NextResponse.json({ redirectCount: redirectCount + 1 });
}
