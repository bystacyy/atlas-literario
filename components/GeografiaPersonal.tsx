"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { crearClienteNavegador } from "@/lib/supabase-browser";
import MapaCargador from "@/components/MapaCargador";
import type { Lugar } from "@/components/MapaMundial";

type LugarBD = {
  id: number;
  nombre: string;
  pais: string | null;
  latitud: number;
  longitud: number;
  descripcion: string | null;
};

type LibroBD = { titulo: string; lugares: LugarBD[] | null };

type Fila = {
  estado: string;
  libros: LibroBD | LibroBD[] | null;
};

export default function GeografiaPersonal() {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [librosLeidos, setLibrosLeidos] = useState(0);
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
        .select(
          "estado, libros(titulo, lugares(id, nombre, pais, latitud, longitud, descripcion))",
        )
        .in("estado", ["leido", "leyendo"]);

      if (error) {
        setError(error.message);
        setEstado("listo");
        return;
      }

      const filas = (data ?? []) as unknown as Fila[];
      const todos: Lugar[] = [];
      filas.forEach((f) => {
        const libro = Array.isArray(f.libros) ? f.libros[0] : f.libros;
        if (!libro) return;
        (libro.lugares ?? []).forEach((l) => {
          todos.push({ ...l, libro: libro.titulo });
        });
      });

      setLibrosLeidos(filas.length);
      setLugares(todos);
      setEstado("listo");
    }
    cargar();
  }, []);

  if (estado === "cargando") {
    return <p className="text-texto-suave">Cargando...</p>;
  }

  if (estado === "sin-sesion") {
    return (
      <p className="text-texto-suave">
        <Link href="/acceso" className="font-semibold text-mar underline">
          Inicia sesión
        </Link>{" "}
        para ver tu geografía literaria.
      </p>
    );
  }

  if (error) return <p className="text-red-700">Error: {error}</p>;

  if (lugares.length === 0) {
    return (
      <p className="text-texto-suave">
        Todavía no hay lugares que mostrar. Marca un libro como{" "}
        <strong>Leído</strong> o <strong>Leyendo</strong> en el{" "}
        <Link href="/libros" className="font-semibold text-mar underline">
          catálogo
        </Link>{" "}
        y aparecerá aquí.
      </p>
    );
  }

  // Los océanos no son países: se cuentan como lugares, no como países.
  const paises = Array.from(
    new Set(
      lugares
        .map((l) => l.pais)
        .filter((p): p is string => !!p && !p.startsWith("Océano")),
    ),
  ).sort();

  const tarjeta =
    "rounded-2xl border border-arena-clara bg-papel p-4 text-center";

  return (
    <div>
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className={tarjeta}>
          <p className="font-titulo text-4xl font-semibold text-mar">
            {librosLeidos}
          </p>
          <p className="text-sm text-texto-suave">libros</p>
        </div>
        <div className={tarjeta}>
          <p className="font-titulo text-4xl font-semibold text-mar">
            {paises.length}
          </p>
          <p className="text-sm text-texto-suave">países</p>
        </div>
        <div className={tarjeta}>
          <p className="font-titulo text-4xl font-semibold text-mar">
            {lugares.length}
          </p>
          <p className="text-sm text-texto-suave">lugares</p>
        </div>
      </div>

      <MapaCargador lugares={lugares} />

      <h2 className="mt-10 font-titulo text-3xl font-semibold text-mar-oscuro">
        Países explorados
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {paises.map((p) => (
          <li
            key={p}
            className="rounded-full border border-mar bg-papel px-3 py-1 text-sm text-mar"
          >
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}