"use client";
import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Category {
    icon: React.ReactNode;
    label: string;
    path: string;
}

export default function MainCategoryComponent(): JSX.Element {
    const t = useTranslations();

    const categories: Category[] = [
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2q3.65 0 6.388 2.288t3.412 5.737h-2.05q-.475-1.825-1.713-3.262T15 4.6V5q0 .825-.587 1.413T13 7h-2v2q0 .425-.288.713T10 10H8v2h2v3H9l-4.8-4.8q-.075.45-.137.9T4 12q0 3.275 2.3 5.625T12 20zm9.1-.5l-3.2-3.2q-.525.3-1.125.5T15.5 19q-1.875 0-3.187-1.312T11 14.5t1.313-3.187T15.5 10t3.188 1.313T20 14.5q0 .675-.2 1.275t-.5 1.125l3.2 3.2zM15.5 17q1.05 0 1.775-.725T18 14.5t-.725-1.775T15.5 12t-1.775.725T13 14.5t.725 1.775T15.5 17" /></svg>)
            , label: t('MainPage.attraction'), path: '/attraction_list' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="currentColor" d="M1 19V4h2v10h8V6h8q1.65 0 2.825 1.175T23 10v9h-2v-3H3v3zm6-6q-1.25 0-2.125-.875T4 10t.875-2.125T7 7t2.125.875T10 10t-.875 2.125T7 13"/></svg>)
            , label: t('MainPage.accommodation'), path: '/accommodation_list' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="currentColor" d="M7 22v-9.15q-1.275-.35-2.137-1.4T4 9V2h2v7h1V2h2v7h1V2h2v7q0 1.4-.862 2.45T9 12.85V22zm10 0v-8h-3V7q0-2.075 1.463-3.537T19 2v20z"/></svg>)
            , label: t('MainPage.restaurant'), path: '/restaurant_list' },
        { icon: (<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 20 20"><path fill="currentColor" d="M3 17a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2zM15 5h-5V4h5zm0 2h-5V6h5zm0 2h-5V8h5zM5 14h10v1H5zm0-2h10v1H5zm0-2h10v1H5zm0-6h4v5H5z"/></svg>)
            , label: t('MainPage.blog'), path: '/blog' },
    ];

    return (
        <div className="container mx-auto px-32 pt-10 flex flex-wrap justify-center">
            {categories.map((category) => (
                <div
                    key={category.label}
                    className="w-1/4 md:w-1/5 lg:w-1/6 flex flex-col items-center mb-8"
                >
                    <Link href={category.path}>
                        <div className="bg-white rounded-3xl p-4 shadow-lg cursor-pointer flex flex-col items-center justify-center w-28 h-28 transition-transform transform hover:scale-105 hover:shadow-xl">
                            {category.icon}
                            <span className="kanit mt-4 text-md font-bold text-gray-800 text-center">
                                {category.label}
                            </span>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}