import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import MapaCargador from "@/components/MapaCargador";

async function MapaConLugares() {
  const { data, error } = await supabase
    .from("lugares")
    .select("id, nombre, pais, latitud, longitud, descripcion, libros(titulo)")
    .order("orden");

  if (error) {
    return (
      <p className="text-red-700">Error al cargar los lugares: {error.message}</p>
    );
  }

  const lugares = (data ?? []).map((l) => {
    const libro = Array.isArray(l.libros) ? l.libros[0] : l.libros;
    return {
      id: l.id,
      nombre: l.nombre,
      pais: l.pais,
      latitud: l.latitud,
      longitud: l.longitud,
      descripcion: l.descripcion,
      libro: libro?.titulo ?? "",
    };
  });

  return <MapaCargador lugares={lugares} />;
}

export default function MapaPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-titulo text-4xl font-bold text-bosque">
        Mapa literario
      </h1>
      <p className="mt-2 mb-8 text-cafe">
        Recorre el mundo siguiendo los lugares de cada novela.
      </p>
      <Suspense fallback={<p className="text-cafe">Cargando lugares...</p>}>
        <MapaConLugares />
      </Suspense>
    </main>
  );
}