import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const portadas = [
  "bg-mar text-papel",
  "bg-coral text-mar-oscuro",
  "bg-mar-oscuro text-papel",
  "border-2 border-mar bg-papel text-mar",
  "bg-[#2f7a74] text-papel",
];

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
    <ul className="grid gap-5 md:grid-cols-2">
      {libros?.map((libro) => {
        const autor = Array.isArray(libro.autores)
          ? libro.autores[0]
          : libro.autores;

        return (
          <li key={libro.id}>
            <Link
              href={`/libros/${libro.id}`}
              className="group flex h-full gap-5 rounded-2xl border border-arena-clara bg-papel p-5 transition-colors hover:border-mar"
            >
              <div
                aria-hidden="true"
                className={`flex h-32 w-24 shrink-0 items-center justify-center rounded-lg font-titulo text-5xl font-semibold ${portadas[libro.id % portadas.length]}`}
              >
                {libro.titulo.charAt(0)}
              </div>
              <div className="min-w-0">
                <h2 className="font-titulo text-2xl font-semibold leading-tight text-mar-oscuro transition-colors group-hover:text-mar">
                  {libro.titulo}
                </h2>
                <p className="mt-1 text-sm font-medium text-mar">
                  {autor?.nombre} · {libro.anio_publicacion}
                </p>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-texto-suave">
                  {libro.sinopsis}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function LibrosPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-titulo text-5xl font-semibold text-mar-oscuro">
        Catálogo
      </h1>
      <p className="mt-3 max-w-xl text-lg text-texto-suave">
        Clásicos para explorar con mapas, personajes y emociones.
      </p>

      <div className="mt-10">
        <Suspense
          fallback={<p className="text-texto-suave">Cargando libros...</p>}
        >
          <CatalogoLibros />
        </Suspense>
      </div>
    </main>
  );
}