"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

type PlaceMapProps = {
  latitude: number;
  longitude: number;
  placeName: string;
};

const PlaceMap: React.FC<PlaceMapProps> = ({ latitude, longitude, placeName }) => {
  const [mounted, setMounted] = useState(false);
  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    setMounted(true);

    import("leaflet").then((L) => {
      setCustomIcon(
        new L.Icon({
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        })
      );
    });
  }, []);

  if (!mounted) return <div className="w-full h-[400px] bg-gray-200 rounded-lg" />;

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <MapContainer center={[latitude, longitude]} zoom={15} className="w-full h-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {customIcon && (
          <Marker position={[latitude, longitude]} icon={customIcon}>
            <Popup className="kanit text-lg">{placeName}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default PlaceMap;
