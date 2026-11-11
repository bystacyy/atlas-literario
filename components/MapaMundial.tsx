"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

export default function MapaMundial() {
  return (
    <MapContainer
      center={[25, 10]}
      zoom={2}
      minZoom={2}
      scrollWheelZoom={true}
      className="h-[70vh] w-full rounded-lg border border-arena"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}