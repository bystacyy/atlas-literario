import { Suspense } from "react";
import { supabase } from "@/lib/supabase";

async function CatalogoLibros() {
  const { data: libros, error } = await supabase
    .from("libros")
    .select("id, titulo, anio_publicacion, sinopsis, autores(nombre)")
    .order("titulo");

  if (error) {
    return (
      <p className="text-red-700">Error al cargar los libros: {error.message}</p>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {libros?.map((libro) => {
        const autor = Array.isArray(libro.autores)
          ? libro.autores[0]
          : libro.autores;

        return (
          <li
            key={libro.id}
            className="rounded-lg border border-arena bg-pergamino p-6 shadow-sm"
          >
            <h2 className="font-titulo text-xl font-bold text-bosque">
              {libro.titulo}
            </h2>
            <p className="mt-1 text-sm text-dorado">
              {autor?.nombre} · {libro.anio_publicacion}
            </p>
            <p className="mt-3 text-sm text-cafe">{libro.sinopsis}</p>
          </li>
        );
      })}
    </ul>
  );
}

export default function LibrosPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-titulo text-4xl font-bold text-bosque">
        Catálogo de libros
      </h1>
      <p className="mt-2 text-cafe">
        Cinco clásicos para explorar con mapas, personajes y emociones.
      </p>

      <div className="mt-8">
        <Suspense fallback={<p className="text-cafe">Cargando libros...</p>}>
          <CatalogoLibros />
        </Suspense>
      </div>
    </main>
  );
}