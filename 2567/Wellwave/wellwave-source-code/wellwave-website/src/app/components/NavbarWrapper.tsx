"use client"; // ทำให้ไฟล์นี้เป็น Client Component

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // ถ้าเป็นหน้า /login ไม่ต้องแสดง Navbar
  if (pathname === "/login") {
    return null;
  }

  return <Navbar />;
}
