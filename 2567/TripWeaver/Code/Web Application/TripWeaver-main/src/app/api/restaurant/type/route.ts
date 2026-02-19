import { NextResponse } from "next/server"

export async function GET() {
    try {
        
        return NextResponse.json({type: [
            "อาหารฟิวชั่น",
            "อาหารไทย",
            "อาหารอิตาเลี่ยน",
            "ร้านเหล้า/บาร์",
            "สเต็ก",
            "อาหารทะเล",
            "อาหารเวียดนาม",
            "อาหารจีน",
            "อาหารนานาชาติ",
            "ฟาสต์ฟู้ด/จานด่วน",
            "ปิ้งย่าง",
            "ร้านกาแฟ/ชา",
            "อาหารอเมริกัน",
            "อาหารอินเดีย",
            "อาหารคลีน/สลัด",
            "อาหารรัสเซีย",
            "ซูชิ",
            "อาหารญี่ปุ่น",
            "อาหารฝรั่งเศส",
            "อาหารตุรกี",
            "สตรีตฟู้ด/รถเข็น",
            "อาหารเม็กซิกัน",
            "อาหารเกาหลี",
            "อาหารเยอรมัน"
        ]}, {status: 201})
    } catch(error) {
        return NextResponse.json({ message: `An error occured while insert data attraction ${error}`}, {status: 500})
    }
}