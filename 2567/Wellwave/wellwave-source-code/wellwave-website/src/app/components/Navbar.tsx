"use client";

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { usePathname } from 'next/navigation';
import { handleLogout } from '../services/auth/auth';

const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center p-3 bg-white border-b border-gray-300 font-sans z-10">

      <div className="flex items-center mr-10">
        <Image
          src="/wellwave.svg"
          alt="Logo"
          width={50}
          height={50}
          className="mr-3"
        />
      </div>


      <ul className="flex space-x-6 justify-start flex-grow">
        <li>
          <Link
            href="/"
            className={`px-4 py-3 rounded-lg ${pathname === '/' ? 'bg-blue-100 text-blue-500' : 'text-gray-500'
              } font-bold text-sm`}
          >
            เพิ่มข้อมูล
          </Link>
        </li>
        <li>
          <Link
            href="/User-info"
            className={`px-4 py-3 rounded-lg ${pathname === '/user-info' ? 'bg-blue-100 text-blue-500' : 'text-gray-500'
              } font-bold text-sm`}
          >
            ข้อมูลผู้ใช้
          </Link>
        </li>
      </ul>

      <button
        className="px-6 py-2 text-sm font-semi bg-white text-gray-500 border-2 border-gray-500 rounded-lg hover:bg-red-600 hover:text-white flex items-center justify-between"
        onClick={handleLogout}
      >
        <span>ออกจากระบบ</span>
        <Image
          src="/asset/out.svg"
          alt="fire"
          width={18}
          height={24}
          className="ml-3"
        />
      </button>
    </nav>
  );
};

export default Navbar;
