"use client";
import Image from 'next/image';
import Link from 'next/link';

interface Place {
    id: string;
    imageUrl: string;
    name: string;
    score: number;
    view: number;
}

interface PlaceCardProps {
    place: Place;
    basePath: string;
}

export default function MainPlaceCard({ place, basePath }: PlaceCardProps) {
    return (
        <Link href={`/${basePath}/${place.id}`} passHref>
            <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <Image
                    src={place.imageUrl}
                    alt={place.name}
                    width={250}
                    height={150}
                    className="w-full h-48 object-cover"
                    unoptimized
                />
                <div className="p-3">
                    <h3 className="kanit text-lg font-medium overflow-hidden text-ellipsis whitespace-nowrap">{place.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm">
                        <span className="kanit mr-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 28 28"><path fill="none" stroke="currentColor"
                                strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                d="M12.854 3.5a.979.979 0 0 0-1.708 0a27 27 0 0 0-2.057 4.762c-.139.431-.551.73-1.023.743a29.4 29.4 0 0 0-4.267.425c-.774.136-1.065 1.018-.515 1.556a31.5 31.5 0 0 0 3.41 2.892c.367.269.518.73.378 1.152a27 27 0 0 0-1.14 4.927c-.1.755.708 1.288 1.41.928a28.6 28.6 0 0 0 3.98-2.472a1.15 1.15 0 0 1 1.356 0a28.5 28.5 0 0 0 3.98 2.472c.701.36 1.51-.173 1.41-.928a27 27 0 0 0-1.14-4.928c-.14-.42.01-.882.378-1.151a31.5 31.5 0 0 0 3.41-2.892c.55-.538.26-1.42-.515-1.556a29 29 0 0 0-4.267-.425a1.1 1.1 0 0 1-1.023-.743a27 27 0 0 0-2.057-4.761" />
                            </svg>
                            <span className="ml-1">{place.score}</span>
                        </span>

                        <span className="kanit flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
                                <path d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 25c-5.3 0-10.9-3.93-12.93-9C5.1 10.93 10.7 7 16 7s10.9 3.93 12.93 9C26.9 21.07 21.3 25 16 25" />
                                <path d="M16 10a6 6 0 1 0 6 6a6 6 0 0 0-6-6m0 10a4 4 0 1 1 4-4a4 4 0 0 1-4 4" />
                            </svg>
                            <span className="ml-1">{place.view}</span>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}