"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { SearchResult } from "@/app/api/search/route";

const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

export default function NavBar() {
  const t = useTranslations();
  const { data: session } = useSession();

  const [user, setUser] = useState<{
    name: string;
    email: string;
    image: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user as unknown as { name: string; email: string; image: string; role: string });
    } else {
      setUser(null);
    }
  }, [session]);
  
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleProfileToggle = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const handleProfileClickOutside = (event: MouseEvent) => {
    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target as Node)
    ) {
      setIsProfileDropdownOpen(false);
    }
  };

  const handleSearchClickOutside = (event: MouseEvent) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target as Node)
    ) {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleProfileClickOutside);
    document.addEventListener("mousedown", handleSearchClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleProfileClickOutside);
      document.removeEventListener("mousedown", handleSearchClickOutside);
    };
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim().length > 2) {
      fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        .then((res) => res.json())
        .then((data: SearchResult[]) => setSearchResults(data))
        .catch((err) => console.error("Search error:", err));
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  return (
    <nav className="flex w-full px-20 py-3 bg-white">
      <div className="flex flex-row items-center justify-between w-full">
        {/* Logo */}
        <Link href="/">
          <Image
            src="https://img2.pic.in.th/pic/tripweaver-high-resolution-logo-transparent.png"
            alt="TripWeaver Logo"
            unoptimized
            width={200}
            height={200}
          />
        </Link>

        {/* Search Box and Results Container */}
        <div ref={searchContainerRef} className="flex w-[45%] px-10 relative">
          <div className="flex rounded-3xl overflow-hidden w-full font-[sans-serif] shadow-lg">
            <input
              type="text"
              placeholder="ค้นหาสถานที่ท่องเที่ยว, ที่พัก และ ร้านอาหาร"
              className="kanit w-full outline-none bg-[#F0F0F0] text-md px-5 py-3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              className="flex items-center justify-center bg-[#F0F0F0] px-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 192.904 192.904"
                width="18px"
                className="fill-black"
              >
                <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z" />
              </svg>
            </button>
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div
              className="absolute top-full ml-5 w-[85%] bg-white shadow-lg rounded-b-lg max-h-96 overflow-y-auto z-50"
            >
              {searchResults.map((item) => (
                <Link
                  key={item.id}
                  href={`/${item.category}_detail/${item.id}`}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={item.thumbnail && item.thumbnail.trim() !== "" ? item.thumbnail : "images/no-img.png"}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="rounded-full mr-3 object-cover w-[50px] h-[50px]"
                  />

                  <span className="kanit text-lg">{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Links & Profile Dropdown */}
        <div className="flex items-center space-x-4">
          <Link href="/plantrip/create">
            <button className="kanit font-bold text-black py-2 px-4">
              {t("Navbar.createTrip")}
            </button>
          </Link>
          <Link href="/blog">
            <button className="kanit font-bold text-black py-2 px-4">
              {t("Navbar.blog")}
            </button>
          </Link>


          {session ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={handleProfileToggle}
                className="kanit font-bold text-black py-2 px-4 flex items-center space-x-2 border-2 rounded-xl"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="User Profile"
                    width={24}
                    height={24}
                    className="rounded-full w-[24px] h-[24px]"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2" />
                      <path d="M4.271 18.346S6.5 15.5 12 15.5s7.73 2.846 7.73 2.846M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                    </g>
                  </svg>
                )}
                <span>{user?.name}</span>
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <Link href="/profile">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 kanit">
                      โปรไฟล์ของฉัน
                    </button>
                  </Link>
                  {user?.role === "admin" && (
                    <Link href="/admin">
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 kanit">
                        จัดการเว็บไซต์
                      </button>
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 kanit"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="kanit font-bold text-black py-2 px-4 flex items-center space-x-2 border-2 rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2" />
                    <path d="M4.271 18.346S6.5 15.5 12 15.5s7.73 2.846 7.73 2.846M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                  </g>
                </svg>
                <span>{t("Navbar.login")}</span>
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
