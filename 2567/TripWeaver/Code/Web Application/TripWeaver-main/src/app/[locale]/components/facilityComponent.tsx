import React from "react";
import { Icon } from "@iconify/react";

type FacilityComponentProps = {
    facility: string;
};

export default function FacilityComponent({ facility }: FacilityComponentProps) {

    const facilityIcons: Record<string, string> = {
        "ที่จอดรถ": "mdi:parking",
        "ที่จอดรถฟรี": "mdi:parking",
        "WiFi ฟรี": "mdi:wifi",
        "ศูนย์บริการธุรกิจพร้อมบริการอินเทอร์เน็ต": "mdi:wifi",
        "อินเตอร์เน็ตความเร็วสูง (WiFi) ฟรี": "mdi:wifi",
        "บริการรถรับ-ส่งสนามบิน": "mdi:plane-train",
        "สระว่ายน้ำ": "material-symbols:pool",
        "อินเทอร์เน็ตฟรี": "material-symbols:wifi-rounded",
        "บาร์ / เลานจ์": "material-symbols:local-bar",
        "การดำน้ำ": "material-symbols:scuba-diving-rounded",
        "ชายหาด": "majesticons:beach-line",
        "เครื่องปรับอากาศ": "streamline:hotel-air-conditioner",
        "ระเบียงส่วนตัว": "iconoir:balcony",
        "บริการรูมเซอร์วิส": "mdi:customer-service",
        "ตู้เย็น": "mdi:fridge",
        "ทีวีจอแบน": "weui:tv-filled",
        "มินิบาร์": "material-symbols:table-bar",
        "ไดร์เป่าผม": "icon-park-solid:hair-dryer",
        "บริการทำความสะอาด": "carbon:clean",
        "บริการดูแลเด็กเล็ก": "mingcute:baby-fill",
        "ฟิตเนสเซนเตอร์พร้อมห้องออกกำลังกาย": "ic:baseline-fitness-center",
        "ห้องพักแบบเก็บเสียง": "mdi:home-sound-out-outline",
        "เครื่องชงกาแฟ / ชา": "ic:baseline-coffee-maker",
        "เคเบิลทีวี / ทีวีดาวเทียม": "weui:tv-filled",
        "อ่างอาบน้ำ / ฝักบัวอาบน้ำ": "solar:bath-bold",
        "เรือ": "mdi:boat",
        "เด็กเข้าพักฟรี": "icon-park-solid:baby",
        "ม่านกันแสง": "mingcute:curtain-fill",
        "ชายหาดส่วนตัว": "majesticons:beach-line",
        "กิจกรรมสำหรับเด็ก (เป็นมิตรกับเด็กและครอบครัว)": "material-symbols:family-restroom",
        "บริการรถรับส่งฟรีหรือแท็กซี่": "mdi:car",
        "ปลอดภัย": "mdi:safe",
        "สโมสรสำหรับเด็ก": "mingcute:baby-fill",
        "น้ำบรรจุขวด": "solar:bottle-bold",
        "อาหารเช้าฟรี": "fluent:food-16-filled",
        "เฉลียงบนดาดฟ้า": "cbi:roomsbalcony",
        "บริการซักรีด": "maki:laundry",
        "โรงแรมปลอดบุหรี่": "material-symbols:smoke-free",
        "เตียงยาวเสริม": "material-symbols-light:bed-rounded",
        "บริการให้เช่าจักรยาน": "mdi:bicycle",
        "โถชำระล้าง": "mdi:bidet",
        "โซฟาเบด": "solar:sofa-bold",
        "ร้านกาแฟ": "carbon:cafe",
        "โต๊ะทำงาน": "game-icons:table",
        "ห้องประชุม": "guidance:meeting-room",
        "ห้องน้ำเพิ่มเติม": "icon-park-outline:public-toilet",
        "สระว่ายน้ำสำหรับเด็ก": "teenyicons:pool-outline",
        "เสื้อคลุมอาบน้ำ": "map:clothing-store",
        "ความบันเทิงยามค่ำคืน": "map:night-club",
        "พื้นที่รับประทานอาหาร": "fluent:food-16-filled",
        "การดำน้ำตื้น": "tabler:scuba-mask",
        "Visa": "tabler:credit-card",
        "Wifi ฟรี": "tabler:wifi", 
        "การจอง": "tabler:calendar-check", 
        "ซื้อกลับบ้าน": "tabler:shopping-bag",
        "ที่นั่ง": "ph:chair-fill", 
        "บริการส่ง": "tabler:truck-delivery",
        "บริการเสิร์ฟถึงโต๊ะ": "tabler:table",
        "มีที่จอดรถ": "tabler:parking",
        "มีเก้าอี้สูงสำหรับเด็ก": "tabler:baby-carriage", 
        "รับบัตรเครดิต": "tabler:credit-card", 
        "ร้านอาหารปลอดบุหรี่": "tabler:smoking-no", 
        "แบบครอบครัว": "tabler:users-group", 
        "สะดวกสำหรับผู้ใช้รถเข็น": "tabler:wheelchair", 
        "Default": "mdi:help-circle-outline"
    };

    const facilityName: Record<string, string> = {
        "บริการรถรับ-ส่งสนามบิน": "รถรับส่งสนามบิน",
        "อินเตอร์เน็ตความเร็วสูง (WiFi) ฟรี": "WiFi ฟรี",
        "อ่างอาบน้ำ / ฝักบัวอาบน้ำ": "อ่างอาบน้ำ",
        "เคเบิลทีวี / ทีวีดาวเทียม": "ทีวีดาวเทียม",
        "ฟิตเนสเซนเตอร์พร้อมห้องออกกำลังกาย": "ฟิตเนส",
        "ความบันเทิงยามค่ำคืน": "ไนท์คลับ",
        "สะดวกสำหรับผู้ใช้รถเข็น": "มีที่สำหรับผู้พิการ",
        "ร้านอาหารปลอดบุหรี่": "ปลอดบุหรี่",
        "กิจกรรมสำหรับเด็ก (เป็นมิตรกับเด็กและครอบครัว)": "กิจกรรมครอบครัว",
        "บริการรถรับส่งฟรีหรือแท็กซี่": "บริการรถรับส่ง",
        "ปลอดภัย": "ตู้เซฟ",
        "เฉลียงบนดาดฟ้า": "ดาดฟ้า",
        "พื้นที่รับประทานอาหาร": "ห้องอาหาร",
        "ห้องพักปลอดสารก่อภูมิแพ้": "ปลอดสารก่อภูมิแพ้",
        "ศูนย์บริการธุรกิจพร้อมบริการอินเทอร์เน็ต": "WiFi ฟรี"
    };
    
    const iconName = facilityIcons[facility] || facilityIcons["Default"];
    const facilityDisplayName = facilityName[facility] || facility;

    return(
        <>
          <div className="flex text-sm items-center h-8 justify-center w-[calc(33.333%-8px)] bg-gray-200 text-[#555555] rounded-md flex-row">
            <div className="flex mr-1">
                <Icon
                    icon={iconName}
                    className="text-lg mb-1"
                    width={16}
                    height={16}
                />
            </div>
            <div className="flex">
                {facilityDisplayName}
            </div>
          </div>
        </>
    )
}