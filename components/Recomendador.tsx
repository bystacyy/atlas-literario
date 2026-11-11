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
        <label htmlFor="deseo" className="block font-semibold text-bosque">
          ¿Cómo te sientes o qué historia quieres leer?
        </label>
        <textarea
          id="deseo"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={3}
          placeholder="Ej: quiero una aventura divertida con viajes..."
          className="mt-2 w-full rounded-lg border border-arena bg-crema p-3 text-tinta focus:border-dorado focus:outline-none"
        />
        <button
          type="submit"
          className="mt-3 rounded-full bg-bosque px-6 py-2 font-semibold text-crema transition-opacity hover:opacity-90"
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
            className="rounded-full border border-arena bg-pergamino px-3 py-1 text-sm text-cafe hover:border-dorado"
          >
            {ej}
          </button>
        ))}
      </div>

      {resultados !== null && (
        <section className="mt-10">
          {resultados.length === 0 ? (
            <p className="text-cafe">
              No encontré coincidencias. Prueba con palabras como aventura,
              terror, amor, tristeza, humor, mar o filosofía.
            </p>
          ) : (
            <ul className="space-y-5">
              {resultados.map(({ libro, coincidencias }) => (
                <li
                  key={libro.id}
                  className="flex gap-5 rounded-lg border border-arena bg-pergamino p-5"
                >
                  <div className="flex h-32 w-24 shrink-0 items-center justify-center rounded bg-bosque font-titulo text-4xl text-dorado">
                    {libro.titulo.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-titulo text-xl font-bold text-bosque">
                      <Link
                        href={`/libros/${libro.id}`}
                        className="hover:text-dorado"
                      >
                        {libro.titulo}
                      </Link>
                    </h2>
                    <p className="text-sm text-dorado">
                      {libro.autor} · {libro.anio_publicacion}
                    </p>
                    <p className="mt-2 text-sm text-cafe">
                      <strong>Por qué te lo recomiendo:</strong> encaja con lo
                      que buscas en {coincidencias.join(", ")}.
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}