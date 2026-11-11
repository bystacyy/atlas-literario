"use client";

import { useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export type Personaje = {
  id: number;
  nombre: string;
  descripcion: string | null;
  libro: string;
};

export type Relacion = {
  id: number;
  personaje_a_id: number;
  personaje_b_id: number;
  tipo: "amistad" | "familia" | "rivalidad" | "romance";
  descripcion: string | null;
};

const colores: Record<Relacion["tipo"], string> = {
  amistad: "#1f3d2f",
  familia: "#5b4030",
  rivalidad: "#b3261e",
  romance: "#c2528b",
};

export default function GrafoPersonajes({
  personajes,
  relaciones,
}: {
  personajes: Personaje[];
  relaciones: Relacion[];
}) {
  const libros = Array.from(new Set(personajes.map((p) => p.libro)));
  const [libroActivo, setLibroActivo] = useState(libros[0]);
  const [seleccionado, setSeleccionado] = useState<number | null>(null);

  const delLibro = useMemo(
    () => personajes.filter((p) => p.libro === libroActivo),
    [personajes, libroActivo],
  );

  const nodos: Node[] = useMemo(
    () =>
      delLibro.map((p, i) => {
        const angulo = (2 * Math.PI * i) / delLibro.length;
        return {
          id: String(p.id),
          position: {
            x: 300 + 230 * Math.cos(angulo),
            y: 250 + 200 * Math.sin(angulo),
          },
          data: { label: p.nombre },
          style: {
            background: seleccionado === p.id ? "#b8923a" : "#f6efe0",
            border: "2px solid #1f3d2f",
            borderRadius: 9999,
            padding: "8px 14px",
            fontSize: 13,
            color: "#2b2118",
          },
        };
      }),
    [delLibro, seleccionado],
  );

  const ids = new Set(delLibro.map((p) => p.id));
  const aristas: Edge[] = relaciones
    .filter((r) => ids.has(r.personaje_a_id) && ids.has(r.personaje_b_id))
    .map((r) => ({
      id: String(r.id),
      source: String(r.personaje_a_id),
      target: String(r.personaje_b_id),
      label: r.tipo,
      style: { stroke: colores[r.tipo], strokeWidth: 2 },
      labelStyle: { fill: colores[r.tipo], fontSize: 11 },
    }));

  const personaje = delLibro.find((p) => p.id === seleccionado);
  const vinculos = relaciones
    .filter(
      (r) =>
        r.personaje_a_id === seleccionado || r.personaje_b_id === seleccionado,
    )
    .map((r) => {
      const otroId =
        r.personaje_a_id === seleccionado ? r.personaje_b_id : r.personaje_a_id;
      return {
        id: r.id,
        tipo: r.tipo,
        nombre: personajes.find((p) => p.id === otroId)?.nombre ?? "",
        descripcion: r.descripcion,
      };
    });

  const claseBoton = (activo: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition-colors ${
      activo
        ? "border-bosque bg-bosque text-crema"
        : "border-arena bg-pergamino text-cafe hover:border-dorado"
    }`;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {libros.map((libro) => (
          <button
            key={libro}
            onClick={() => {
              setLibroActivo(libro);
              setSeleccionado(null);
            }}
            className={claseBoton(libroActivo === libro)}
          >
            {libro}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        {Object.entries(colores).map(([tipo, color]) => (
          <span key={tipo} className="flex items-center gap-2 text-cafe">
            <span
              className="inline-block h-1 w-6 rounded"
              style={{ background: color }}
            />
            {tipo}
          </span>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="h-[65vh] rounded-lg border border-arena bg-crema">
          <ReactFlow
            key={libroActivo}
            nodes={nodos}
            edges={aristas}
            onNodeClick={(_, nodo) => setSeleccionado(Number(nodo.id))}
            fitView
            nodesConnectable={false}
          >
            <Background />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>

        <aside className="rounded-lg border border-arena bg-pergamino p-5">
          {personaje ? (
            <>
              <h2 className="font-titulo text-xl font-bold text-bosque">
                {personaje.nombre}
              </h2>
              <p className="mt-2 text-sm text-cafe">{personaje.descripcion}</p>
              <h3 className="mt-4 font-semibold text-bosque">Relaciones</h3>
              <ul className="mt-2 space-y-2 text-sm text-cafe">
                {vinculos.map((v) => (
                  <li key={v.id}>
                    <span style={{ color: colores[v.tipo] }}>●</span>{" "}
                    <strong>{v.nombre}</strong> ({v.tipo}): {v.descripcion}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-cafe">
              Haz clic en un personaje para ver su descripción y sus relaciones.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}