import { NextResponse } from "next/server"

export async function GET() {
    try {
        
        return NextResponse.json({type: [
            "โรงแรมขนาดเล็ก", "ที่พักพร้อมอาหารเช้า", "โรงแรม", "รีสอร์ท", "ที่พักแบบพิเศษ", "บ้านพัก", "คอนโด", "วิลล่า", "โฮสเทล", "รวมค่าใช้จ่ายทุกอย่างแล้ว",
            "พื้นที่ตั้งแคมป์", "คอทเทจ", "ฟาร์มปศุสัตว์", "โมเตล", "เพนชัน"
        ]}, {status: 201})
    } catch(error) {
        return NextResponse.json({ message: `An error occured while insert data attraction ${error}`}, {status: 500})
    }
}