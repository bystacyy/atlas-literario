import { Suspense } from "react";
import { supabase } from "@/lib/supabase";

async function ListaLibros() {
  const { data: libros, error } = await supabase
    .from("libros")
    .select("id, titulo, anio_publicacion, autores(nombre)")
    .order("anio_publicacion");

  if (error) {
    return (
      <p className="mt-8 text-red-700">
        Error al cargar los libros: {error.message}
      </p>
    );
  }

  return (
    <ul className="mt-8 space-y-2 text-tinta">
      {libros?.map((libro) => (
        <li key={libro.id}>
          <span className="font-semibold">{libro.titulo}</span> (
          {libro.anio_publicacion})
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-pergamino px-6 text-center">
      <h1 className="font-titulo text-5xl font-bold text-bosque">
        Atlas Literario
      </h1>
      <p className="mt-4 max-w-xl text-lg text-cafe">
        Explora los libros clásicos a través de mapas, personajes y emociones.
      </p>

      <Suspense fallback={<p className="mt-8 text-cafe">Cargando libros...</p>}>
        <ListaLibros />
      </Suspense>
    </main>
  );
}