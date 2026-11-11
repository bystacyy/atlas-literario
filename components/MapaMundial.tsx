"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export type Lugar = {
  id: number;
  nombre: string;
  pais: string | null;
  latitud: number;
  longitud: number;
  descripcion: string | null;
  libro: string;
};

const iconoDorado = L.divIcon({
  className: "",
  html: '<div style="width:18px;height:18px;border-radius:9999px;background:#b8923a;border:3px solid #1f3d2f;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -10],
});

export default function MapaMundial({ lugares }: { lugares: Lugar[] }) {
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

      {lugares.map((lugar) => (
        <Marker
          key={lugar.id}
          position={[lugar.latitud, lugar.longitud]}
          icon={iconoDorado}
        >
          <Popup>
            <strong>{lugar.nombre}</strong>
            {lugar.pais && <span> ({lugar.pais})</span>}
            <br />
            <em>{lugar.libro}</em>
            {lugar.descripcion && <p>{lugar.descripcion}</p>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}