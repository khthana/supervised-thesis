import React from "react";

import Image from "next/image";

interface redirectProps {
    icon: string;
    label: string;
    link: string;
}

export default function RedirectLinkComponent({icon,label,link}: redirectProps) {

    const handleOnClick = () => {
        window.open(link, "_blank", "noreferrer");
    };

    return (
        <>
            <div className="flex w-fit h-full flex-row px-2 rounded-full bg-white border border-[#D2D2D2] cursor-pointer" onClick={handleOnClick}>
                <div className="flex justify-center items-center mr-1">
                    <Image
                    alt="img-planning-card"
                    src={icon}
                    width={24}
                    height={24}
                    />
                </div>
                <div className="flex justify-center items-center text-black kanit">
                    {label}
                </div>
            </div>
        </>
    )
}