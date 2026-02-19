import { NextResponse } from "next/server"

export async function GET() {
    try {
        
        return NextResponse.json({tag: [
            'วิวเมือง', 'มีห้องพักแบบสูบบุหรี่ได้', 'วิวภูเขา', 'ห้องสวีท', 'วิวมหาสมุทร', 'ห้องพักปลอดบุหรี่', 'ห้องสำหรับครอบครัว', 'วิวสระว่ายน้ำ', 'ห้องสวีทสำหรับคู่แต่งงาน', 'วิวสถานที่สำคัญ'
            ]}, {status: 201})
    } catch(error) {
        return NextResponse.json({ message: `An error occured while insert data attraction ${error}`}, {status: 500})
    }
}