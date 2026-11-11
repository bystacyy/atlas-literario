"use client";

import { useState } from "react";
import Link from "next/link";
import {
  recomendar,
  type LibroConEtiquetas,
  type Recomendacion,
} from "@/lib/recomendador";

const ejemplos = [
  "Quiero una aventura divertida con viajes",
  "Me siento triste y quiero algo profundo",
  "Busco terror y suspenso en la noche",
  "Algo sobre obsesión y venganza en el mar",
];

const portadas = [
  "bg-mar text-papel",
  "bg-coral text-mar-oscuro",
  "bg-mar-oscuro text-papel",
  "border-2 border-mar bg-papel text-mar",
  "bg-[#2f7a74] text-papel",
];

export default function Recomendador({
  libros,
}: {
  libros: LibroConEtiquetas[];
}) {
  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState<Recomendacion[] | null>(null);

  function buscar(valor: string) {
    setResultados(recomendar(valor, libros));
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          buscar(texto);
        }}
      >
        <label htmlFor="deseo" className="block font-semibold text-mar">
          ¿Cómo te sientes o qué historia quieres leer?
        </label>
        <textarea
          id="deseo"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={3}
          placeholder="Ej: quiero una aventura divertida con viajes..."
          className="mt-2 w-full rounded-xl border border-arena-clara bg-papel p-3 text-mar-oscuro focus:border-mar focus:outline-none"
        />
        <button
          type="submit"
          className="mt-3 inline-flex min-h-12 items-center rounded-full bg-coral px-7 font-bold text-mar-oscuro transition-opacity hover:opacity-90"
        >
          Recomiéndame un libro
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {ejemplos.map((ej) => (
          <button
            key={ej}
            onClick={() => {
              setTexto(ej);
              buscar(ej);
            }}
            className="rounded-full border border-arena-clara bg-papel px-3 py-1 text-sm text-texto-suave transition-colors hover:border-mar"
          >
            {ej}
          </button>
        ))}
      </div>

      {resultados !== null && (
        <section className="mt-10" aria-live="polite">
          {resultados.length === 0 ? (
            <p className="text-texto-suave">
              No encontré coincidencias. Prueba con palabras como aventura,
              terror, amor, tristeza, humor, mar o filosofía.
            </p>
          ) : (
            <ul className="space-y-5">
              {resultados.map(({ libro, coincidencias }) => (
                <li key={libro.id}>
                  <Link
                    href={`/libros/${libro.id}`}
                    className="group flex gap-5 rounded-2xl border border-arena-clara bg-papel p-5 transition-colors hover:border-mar"
                  >
                    <div
                      aria-hidden="true"
                      className={`flex h-32 w-24 shrink-0 items-center justify-center rounded-lg font-titulo text-5xl font-semibold ${portadas[libro.id % portadas.length]}`}
                    >
                      {libro.titulo.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-titulo text-2xl font-semibold text-mar-oscuro transition-colors group-hover:text-mar">
                        {libro.titulo}
                      </h2>
                      <p className="text-sm font-medium text-mar">
                        {libro.autor} · {libro.anio_publicacion}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-texto-suave">
                        <strong className="text-mar-oscuro">
                          Por qué te lo recomiendo:
                        </strong>{" "}
                        encaja con lo que buscas en {coincidencias.join(", ")}.
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}