import React from "react";

interface SearchComponentElementProps {
    elementName: string
    onClick: (name: string) => void;
}

export default function SearchComponentElement({elementName, onClick}: SearchComponentElementProps) {
    return(
        <>
            <div className="flex items-center kanit py-2 mr-2 px-2 rounded-lg hover:bg-[#E9ECEE] cursor-pointer" onClick={() => onClick(elementName)}>
                {elementName}
            </div>
        </>
    )
}