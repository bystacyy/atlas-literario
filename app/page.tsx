import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const modulos = [
  {
    href: "/mapa",
    titulo: "Mapa literario",
    texto: "Recorre el mundo siguiendo los lugares y rutas de cada novela.",
  },
  {
    href: "/personajes",
    titulo: "Grafo de personajes",
    texto: "Descubre quién es amigo, rival o familia de quién.",
  },
  {
    href: "/recomendador",
    titulo: "Recomendador con IA",
    texto: "Cuéntanos cómo te sientes y te sugerimos qué leer.",
  },
  {
    href: "/emociones",
    titulo: "Mapa emocional",
    texto: "Mira cómo sube y baja la tensión capítulo a capítulo.",
  },
];

async function LibrosDestacados() {
  const { data: libros, error } = await supabase
    .from("libros")
    .select("id, titulo, anio_publicacion")
    .order("anio_publicacion");

  if (error) {
    return <p className="text-red-700">Error: {error.message}</p>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {libros?.map((libro) => (
        <li key={libro.id}>
          <Link
            href={`/libros/${libro.id}`}
            className="block h-full rounded-lg border border-arena bg-crema p-4 transition-colors hover:border-dorado"
          >
            <p className="font-titulo font-bold text-bosque">{libro.titulo}</p>
            <p className="mt-1 text-sm text-dorado">{libro.anio_publicacion}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main>
      <section className="bg-bosque px-6 py-24 text-center">
        <p className="text-sm uppercase tracking-widest text-dorado">
          Cartografía de la lectura
        </p>
        <h1 className="mt-4 font-titulo text-5xl font-bold text-crema sm:text-6xl">
          Atlas Literario
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-arena">
          Explora los libros clásicos a través de mapas, personajes y emociones.
        </p>
        <Link
          href="/libros"
          className="mt-8 inline-block rounded-full bg-dorado px-8 py-3 font-semibold text-tinta transition-opacity hover:opacity-90"
        >
          Explorar el catálogo
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-titulo text-3xl font-bold text-bosque">
          Cuatro maneras de leer
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {modulos.map((modulo) => (
            <Link
              key={modulo.href}
              href={modulo.href}
              className="rounded-lg border border-arena bg-pergamino p-6 transition-colors hover:border-dorado"
            >
              <h3 className="font-titulo text-xl font-bold text-bosque">
                {modulo.titulo}
              </h3>
              <p className="mt-2 text-cafe">{modulo.texto}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="font-titulo text-3xl font-bold text-bosque">
          Los cinco clásicos
        </h2>
        <div className="mt-8">
          <Suspense fallback={<p className="text-cafe">Cargando libros...</p>}>
            <LibrosDestacados />
          </Suspense>
        </div>
      </section>
    </main>
  );
}