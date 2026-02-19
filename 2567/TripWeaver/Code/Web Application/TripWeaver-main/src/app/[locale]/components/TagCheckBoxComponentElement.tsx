import React from "react";
import {useTranslations} from 'next-intl';

interface TagsCheckboxComponentElementProps {
    name: string;
    checked: boolean;
    translationPrefix: string;
    onClick: (name: string) => void;
}

export default function TagCheckBoxComponentElement({ name, checked, translationPrefix, onClick }: TagsCheckboxComponentElementProps) {
    const t = useTranslations();

    const handleCheckboxChange = () => {
        onClick(name); 
    };

    return (
        <div className="flex items-center kanit py-2 mr-2 px-2 rounded-lg hover:bg-[#E9ECEE] cursor-pointer" onClick={handleCheckboxChange}>
            <input
                id={`checkbox-item-${name}`}
                type="checkbox"
                checked={checked}
                onChange={handleCheckboxChange} 
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <div
                className="kanit w-full ms-2 text-sm font-medium rounded text-black cursor-pointer"
            >
                {t(`${translationPrefix}${name}`)}
            </div>
        </div>
    );
}
