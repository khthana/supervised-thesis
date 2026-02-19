import React from "react";
import { Icon } from "@iconify/react";

interface LocationProps {
  id: string;
  title: string;
  address: string;
  onClick: (id: string) => void;
}

export default function SearchPlaceObjectComponent({ id, title, address,onClick }: LocationProps) {
  return (
    <>
      <li className="p-3 hover:bg-gray-100 cursor-pointer flex items-start" onClick={() => onClick(id)}>
        <span className="text-gray-500 mr-3">
          <Icon icon="ri:map-pin-line" className="text-lg" />
        </span>
        <div>
          <p className="font-medium text-gray-800">{title}</p>
          <p className="text-sm text-gray-500">
            {address}
          </p>
        </div>
      </li>
    </>
  );
}
