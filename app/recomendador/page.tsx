import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import Recomendador from "@/components/Recomendador";

async function RecomendadorConDatos() {
  const { data, error } = await supabase
    .from("libros")
    .select(
      "id, titulo, anio_publicacion, sinopsis, portada_url, etiquetas, autores(nombre)",
    )
    .order("titulo");

  if (error) {
    return <p className="text-red-700">Error: {error.message}</p>;
  }

  const libros = (data ?? []).map((l) => {
    const autor = Array.isArray(l.autores) ? l.autores[0] : l.autores;
    return {
      id: l.id,
      titulo: l.titulo,
      anio_publicacion: l.anio_publicacion,
      sinopsis: l.sinopsis,
      portada_url: l.portada_url,
      etiquetas: l.etiquetas ?? [],
      autor: autor?.nombre ?? "",
    };
  });

  return <Recomendador libros={libros} />;
}

export default function RecomendadorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-titulo text-4xl font-bold text-bosque">
        Recomendador literario
      </h1>
      <p className="mt-2 mb-8 text-cafe">
        Cuéntanos qué buscas y te sugerimos libros del catálogo.
      </p>
      <Suspense fallback={<p className="text-cafe">Cargando...</p>}>
        <RecomendadorConDatos />
      </Suspense>
    </main>
  );
}