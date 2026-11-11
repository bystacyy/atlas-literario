import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
      <h1 className="font-titulo text-4xl font-bold text-bosque">
        {libro.titulo}
      </h1>
      <p className="mt-2 text-dorado">
        {autor?.nombre} ({autor?.pais}) · {libro.anio_publicacion}
      </p>
      <p className="mt-6 max-w-2xl text-cafe">{libro.sinopsis}</p>
    </article>
  );
}

export default function LibroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/libros" className="text-sm text-cafe hover:text-dorado">
        ← Volver al catálogo
      </Link>

      <div className="mt-6">
        <Suspense fallback={<p className="text-cafe">Cargando libro...</p>}>
          <DetalleLibro params={params} />
        </Suspense>
      </div>
    </main>
  );
}