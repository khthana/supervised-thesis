"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function MainCarousel() {
  const images: string[] = [
    '/images/main-banner-1.jpg',
    '/images/main-banner-2.jpg',
    '/images/main-banner-3.jpg',
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <div className="relative w-full h-[350px] overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`${
            index === currentImage ? 'block' : 'hidden'
          } absolute top-0 left-0 w-full h-full`}
        >
          <Image
            src={image}
            alt={`Banner ${index + 1}`}
            unoptimized
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
};