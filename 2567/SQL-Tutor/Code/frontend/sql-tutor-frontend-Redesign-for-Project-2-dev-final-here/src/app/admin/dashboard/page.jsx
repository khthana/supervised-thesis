'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import HeaderDashBoard from '@/components/admin_components/dashBoard/headerDashBoard';
import { Spinner } from '@heroui/react';
import GetTokenData from '@/components/GetTokenData';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token'); // ตรวจสอบ Token
    const role = GetTokenData(token, 'role'); // ดึงข้อมูล Role จาก Token
    if (!token || role !== '0') {
      router.push('/home'); // ถ้าไม่มี Token ให้ไปที่หน้า Login
    } else {
      setLoading(false);
    }
  }, []);

  if (loading)
    return (
      <div className='flex h-screen items-center justify-center'>
        <Spinner size='lg' variant='gradient' />
      </div>
    ); // ป้องกันการแสดง UI ก่อนตรวจสอบสิทธิ์เสร็จ

  return (
    <div>
      <HeaderDashBoard />
    </div>
  );
}
