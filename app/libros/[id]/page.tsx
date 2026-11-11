import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BotonesLectura from "@/components/BotonesLectura";
import Resenas from "@/components/Resenas";

const portadas = [
  "bg-mar text-papel",
  "bg-coral text-mar-oscuro",
  "bg-mar-oscuro text-papel",
  "border-2 border-mar bg-papel text-mar",
  "bg-[#2f7a74] text-papel",
];

async function DetalleLibro({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: libro } = await supabase
    .from("libros")
    .select("id, titulo, anio_publicacion, sinopsis, autores(nombre, pais)")
    .eq("id", id)
    .maybeSingle();

  if (!libro) {
    notFound();
  }

  const autor = Array.isArray(libro.autores) ? libro.autores[0] : libro.autores;

  return (
    <article>
      <div className="flex flex-wrap gap-10">
        <div
          aria-hidden="true"
          className={`flex aspect-[2/3] w-48 shrink-0 items-center justify-center rounded-lg p-4 text-center font-titulo text-2xl font-semibold ${portadas[libro.id % portadas.length]}`}
        >
          {libro.titulo}
        </div>

        <div className="min-w-0 flex-[1_1_320px]">
          <h1 className="font-titulo text-4xl font-semibold leading-tight text-mar-oscuro sm:text-5xl">
            {libro.titulo}
          </h1>
          <p className="mt-3 text-lg font-medium text-mar">
            {autor?.nombre} ({autor?.pais}) · {libro.anio_publicacion}
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-texto-suave">
            {libro.sinopsis}
          </p>
          <div className="mt-6">
            <BotonesLectura libroId={libro.id} />
          </div>
        </div>
      </div>

      <Resenas libroId={libro.id} />
    </article>
  );
}

export default function LibroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/libros"
        className="text-sm text-texto-suave transition-colors hover:text-mar"
      >
        ← Volver al catálogo
      </Link>

      <div className="mt-6">
        <Suspense
          fallback={<p className="text-texto-suave">Cargando libro...</p>}
        >
          <DetalleLibro params={params} />
        </Suspense>
      </div>
    </main>
  );
}