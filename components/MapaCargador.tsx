"use client";

import dynamic from "next/dynamic";

const MapaMundial = dynamic(() => import("./MapaMundial"), {
  ssr: false,
  loading: () => <p className="text-cafe">Cargando mapa...</p>,
});

export default function MapaCargador() {
  return <MapaMundial />;
}