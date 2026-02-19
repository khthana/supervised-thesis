// // app/client-layout.tsx (Client-Side Component)
// "use client";
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';  // ใช้ useRouter เพื่อทำการ redirect

// export default function ClientLayout({ children }: { children: React.ReactNode }) {
//     const router = useRouter();

//     useEffect(() => {
//         const token = localStorage.getItem("accessToken");
//         if (!token) {
//             // ถ้าไม่มี token จะทำการ redirect ไปหน้า login
//             router.push('/login');  // เปลี่ยนเส้นทางไปหน้า Login
//         }
//     }, [router]);

//     return (
//         <>
//             {children}  {/* ถ้าผู้ใช้ล็อกอินแล้ว ให้แสดงเนื้อหาหลัก */}
//         </>
//     );
// }
