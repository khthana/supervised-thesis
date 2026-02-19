// // src/app/page.tsx (หน้าแรกที่ผู้ใช้จะเห็นคือหน้าเพิ่มข้อมูล)
// "use client";

// import React from 'react';
// import CardGrid from "./components/CardGrid";
// const Page: React.FC = () => {
//   return (
//     <div className=" bg-gray-100">

//     <CardGrid />
//   </div>
//   );
// };

// export default Page;
"use client"; // ✅ ใช้ client-side rendering
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
import React from "react";
import CardGrid from "./components/CardGrid";


const Page: React.FC = () => {
//   const token = (await cookies()).get("accessToken"); // ดึง Token จาก cookies

// if (!token) {
//   redirect("/login"); // ถ้าไม่มี Token → ไป Login
// }
  return (
    <div className="bg-gray-100">
      <CardGrid /> {/* ✅ แสดงเนื้อหาหลัก */}
    </div>
  );
};

export default Page;
