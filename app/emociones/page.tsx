import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import MapaEmocional, { type Momento } from "@/components/MapaEmocional";

async function EmocionesConDatos() {
  const { data, error } = await supabase
    .from("capitulos")
    .select("numero, titulo, libros(titulo), datos_emocionales(intensidad, explicacion)")
    .order("numero");

  if (error) {
    return <p className="text-red-700">Error: {error.message}</p>;
  }

  const momentos: Momento[] = (data ?? []).flatMap((c) => {
    const libro = Array.isArray(c.libros) ? c.libros[0] : c.libros;
    const emo = Array.isArray(c.datos_emocionales)
      ? c.datos_emocionales[0]
      : c.datos_emocionales;
    if (!libro || !emo) return [];
    return [
      {
        libro: libro.titulo,
        numero: c.numero,
        titulo: c.titulo ?? "",
        intensidad: emo.intensidad,
        explicacion: emo.explicacion ?? "",
      },
    ];
  });

  return <MapaEmocional momentos={momentos} />;
}

export default function EmocionesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-titulo text-4xl font-bold text-bosque">
        Mapa emocional
      </h1>
      <p className="mt-2 mb-8 text-cafe">
        Mira cómo sube y baja la tensión a lo largo de cada novela.
      </p>
      <Suspense fallback={<p className="text-cafe">Cargando gráfico...</p>}>
        <EmocionesConDatos />
      </Suspense>
    </main>
  );
}