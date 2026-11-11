"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { crearClienteNavegador } from "@/lib/supabase-browser";

type Fila = {
  libro_id: number;
  estado: "pendiente" | "leyendo" | "leido";
  es_favorito: boolean;
  libros: { titulo: string } | { titulo: string }[] | null;
};

const secciones = [
  { clave: "leido", titulo: "Leídos" },
  { clave: "leyendo", titulo: "Leyendo" },
  { clave: "pendiente", titulo: "Pendientes" },
] as const;

export default function BibliotecaPersonal() {
  const [filas, setFilas] = useState<Fila[]>([]);
  const [estado, setEstado] = useState<"cargando" | "sin-sesion" | "listo">(
    "cargando",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = crearClienteNavegador();
    async function cargar() {
      const { data: auth, error: errorAuth } = await supabase.auth.getUser();
      if (errorAuth || !auth.user) {
        setEstado("sin-sesion");
        return;
      }
      const { data, error } = await supabase
        .from("lecturas")
        .select("libro_id, estado, es_favorito, libros(titulo)");
      if (error) {
        setError(error.message);
      } else {
        setFilas((data ?? []) as Fila[]);
      }
      setEstado("listo");
    }
    cargar();
  }, []);

  const titulo = (f: Fila) =>
    (Array.isArray(f.libros) ? f.libros[0] : f.libros)?.titulo ?? "";

  if (estado === "cargando") {
    return <p className="text-texto-suave">Cargando...</p>;
  }

  if (estado === "sin-sesion") {
    return (
      <p className="text-texto-suave">
        <Link href="/acceso" className="font-semibold text-mar underline">
          Inicia sesión
        </Link>{" "}
        para ver tu biblioteca.
      </p>
    );
  }

  const favoritos = filas.filter((f) => f.es_favorito);

  const lista = (items: Fila[]) => (
    <ul className="mt-3 border-t-2 border-mar">
      {items.map((f) => (
        <li key={f.libro_id} className="border-b border-arena-clara">
          <Link
            href={`/libros/${f.libro_id}`}
            className="block py-3 font-titulo text-xl font-semibold text-mar transition-colors hover:text-coral"
          >
            {titulo(f)}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-10">
      {error && <p className="text-red-700">{error}</p>}

      {filas.length === 0 && (
        <p className="text-texto-suave">
          Aún no guardaste ningún libro. Entra a un libro del{" "}
          <Link href="/libros" className="font-semibold text-mar underline">
            catálogo
          </Link>{" "}
          y márcalo.
        </p>
      )}

      {favoritos.length > 0 && (
        <section>
          <h2 className="font-titulo text-3xl font-semibold text-mar-oscuro">
            ★ Favoritos
          </h2>
          {lista(favoritos)}
        </section>
      )}

      {secciones.map((s) => {
        const items = filas.filter((f) => f.estado === s.clave);
        if (items.length === 0) return null;
        return (
          <section key={s.clave}>
            <h2 className="font-titulo text-3xl font-semibold text-mar-oscuro">
              {s.titulo}
            </h2>
            {lista(items)}
          </section>
        );
      })}
    </div>
  );
}