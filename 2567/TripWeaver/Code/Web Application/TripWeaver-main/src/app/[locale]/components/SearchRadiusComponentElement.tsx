import React from "react";
import { Icon } from "@iconify/react";
import AttractionInfo from "../interface/locationInfo";

interface SearchRadiusComponentElementProps {
    element: AttractionInfo
    onClick: (attraction: AttractionInfo) => void;
}

export default function SearchRadiusComponentElement({element, onClick}: SearchRadiusComponentElementProps) {
    return(
        <>
            <div className="flex flex-row text-sm items-center kanit py-2 px-2 hover:bg-[#E9ECEE] cursor-pointer" onClick={() => onClick(element)}>
                <div className="flex w-[15%] text-lg justify-center">
                    <Icon icon="fa-solid:map-marker-alt" />
                </div>
                <div className="flex w-[85%]">
                    {element.name}
                </div>
            </div>
        </>
    )
}