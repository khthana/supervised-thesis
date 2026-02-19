
import React from "react";
import { Icon } from "@iconify/react";
interface dateProps {
    isExist: boolean
    dayName: string
}

export default function OpenDatePropsComponent({isExist,dayName}: dateProps) {
    return (
        <>
            <div className={` relative text-sm flex ${isExist ? 'bg-[#D1D1D1] text-[#717171]' : 'bg-[#F0F0F0] text-[#C0C0C0]'} rounded-full kanit justify-center items-center w-5 h-5`}>
                <div className="flex">
                    {dayName}
                </div>
                <div className={`absolute ${isExist ? 'hidden' : 'flex'}`}>
                    <Icon
                    icon="tdesign:slash"
                    className="text-lg text-[#D9D9D9]"
                    width={24}
                    height={24}
                    />
                </div>
            </div>
        
        </>
    )
}