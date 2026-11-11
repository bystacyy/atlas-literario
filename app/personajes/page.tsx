import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import GrafoPersonajes, {
  type Relacion,
} from "@/components/GrafoPersonajes";

async function GrafoConDatos() {
  const [pers, rels] = await Promise.all([
    supabase
      .from("personajes")
      .select("id, nombre, descripcion, libros(titulo)")
      .order("id"),
    supabase
      .from("relaciones_personajes")
      .select("id, personaje_a_id, personaje_b_id, tipo, descripcion"),
  ]);

  if (pers.error || rels.error) {
    return (
      <p className="text-red-700">
        Error al cargar el grafo: {pers.error?.message ?? rels.error?.message}
      </p>
    );
  }

  const personajes = (pers.data ?? []).map((p) => {
    const libro = Array.isArray(p.libros) ? p.libros[0] : p.libros;
    return {
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      libro: libro?.titulo ?? "",
    };
  });

  return (
    <GrafoPersonajes
      personajes={personajes}
      relaciones={(rels.data ?? []) as Relacion[]}
    />
  );
}

export default function PersonajesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-titulo text-4xl font-bold text-bosque">
        Grafo de personajes
      </h1>
      <p className="mt-2 mb-8 text-cafe">
        Descubre quién es amigo, rival, familia o amor de quién.
      </p>
      <Suspense fallback={<p className="text-cafe">Cargando personajes...</p>}>
        <GrafoConDatos />
      </Suspense>
    </main>
  );
}