"use client";

import dynamic from "next/dynamic";
import type { Lugar } from "./MapaMundial";

const MapaMundial = dynamic(() => import("./MapaMundial"), {
  ssr: false,
  loading: () => <p className="text-texto-suave">Cargando mapa...</p>,
});

export default function MapaCargador({ lugares }: { lugares: Lugar[] }) {
  return <MapaMundial lugares={lugares} />;
}