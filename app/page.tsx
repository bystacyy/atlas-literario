import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: libros, error } = await supabase
    .from("libros")
    .select("id, titulo, anio_publicacion, autores(nombre)")
    .order("anio_publicacion");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-amber-50 px-6 text-center">
      <h1 className="text-5xl font-bold text-emerald-900">Atlas Literario</h1>
      <p className="mt-4 max-w-xl text-lg text-stone-700">
        Explora los libros clásicos a través de mapas, personajes y emociones.
      </p>

      {error && (
        <p className="mt-8 text-red-700">Error al cargar los libros: {error.message}</p>
      )}

      <ul className="mt-8 space-y-2 text-stone-800">
        {libros?.map((libro) => (
          <li key={libro.id}>
            <span className="font-semibold">{libro.titulo}</span> ({libro.anio_publicacion})
          </li>
        ))}
      </ul>
    </main>
  );
}