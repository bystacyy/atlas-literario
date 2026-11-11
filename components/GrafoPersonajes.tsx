"use client";

import { useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type Edge,
  type Node,
  type NodeProps,
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
  amistad: "#1f5f5b",
  familia: "#8a6d3b",
  rivalidad: "#b3261e",
  romance: "#c2528b",
};

type DatosNodo = {
  nombre: string;
  central: boolean;
  estado: "normal" | "activo" | "atenuado";
};

function NodoPersonaje({ data }: NodeProps<Node<DatosNodo>>) {
  const { nombre, central, estado } = data;
  return (
    <div
      className="text-center font-titulo shadow-sm transition-all"
      style={{
        padding: central ? "14px 22px" : "10px 16px",
        fontSize: central ? 16 : 14,
        fontWeight: central ? 700 : 500,
        borderRadius: 10,
        background:
          estado === "activo" ? "#e8735a" : central ? "#1f5f5b" : "#fcfaf5",
        color:
          estado === "activo" ? "#12312f" : central ? "#fcfaf5" : "#12312f",
        border: `2px solid ${estado === "activo" ? "#12312f" : "#1f5f5b"}`,
        opacity: estado === "atenuado" ? 0.25 : 1,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, top: "50%" }}
      />
      {nombre}
      <Handle
        type="source"
        position={Position.Top}
        style={{ opacity: 0, top: "50%" }}
      />
    </div>
  );
}

const tiposNodo = { personaje: NodoPersonaje };

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

  const ids = useMemo(() => new Set(delLibro.map((p) => p.id)), [delLibro]);

  const relacionesLibro = useMemo(
    () =>
      relaciones.filter(
        (r) => ids.has(r.personaje_a_id) && ids.has(r.personaje_b_id),
      ),
    [relaciones, ids],
  );

  // El personaje con más relaciones va al centro.
  const centralId = useMemo(() => {
    const cuenta = new Map<number, number>();
    relacionesLibro.forEach((r) => {
      cuenta.set(r.personaje_a_id, (cuenta.get(r.personaje_a_id) ?? 0) + 1);
      cuenta.set(r.personaje_b_id, (cuenta.get(r.personaje_b_id) ?? 0) + 1);
    });
    let mejor = delLibro[0]?.id;
    let max = -1;
    delLibro.forEach((p) => {
      const c = cuenta.get(p.id) ?? 0;
      if (c > max) {
        max = c;
        mejor = p.id;
      }
    });
    return mejor;
  }, [delLibro, relacionesLibro]);

  const relacionadosConSeleccion = useMemo(() => {
    const set = new Set<number>();
    if (seleccionado === null) return set;
    set.add(seleccionado);
    relacionesLibro.forEach((r) => {
      if (r.personaje_a_id === seleccionado) set.add(r.personaje_b_id);
      if (r.personaje_b_id === seleccionado) set.add(r.personaje_a_id);
    });
    return set;
  }, [seleccionado, relacionesLibro]);

  const nodos: Node<DatosNodo>[] = useMemo(() => {
    const otros = delLibro.filter((p) => p.id !== centralId);
    return delLibro.map((p) => {
      let position = { x: 0, y: 0 };
      if (p.id !== centralId) {
        const i = otros.findIndex((o) => o.id === p.id);
        const angulo = (2 * Math.PI * i) / otros.length - Math.PI / 2;
        position = { x: 280 * Math.cos(angulo), y: 220 * Math.sin(angulo) };
      }
      let estado: DatosNodo["estado"] = "normal";
      if (seleccionado !== null) {
        if (p.id === seleccionado) estado = "activo";
        else if (!relacionadosConSeleccion.has(p.id)) estado = "atenuado";
      }
      return {
        id: String(p.id),
        type: "personaje",
        position,
        data: { nombre: p.nombre, central: p.id === centralId, estado },
        draggable: true,
      };
    });
  }, [delLibro, centralId, seleccionado, relacionadosConSeleccion]);

  const aristas: Edge[] = useMemo(
    () =>
      relacionesLibro.map((r) => {
        const relacionada =
          seleccionado === null ||
          r.personaje_a_id === seleccionado ||
          r.personaje_b_id === seleccionado;
        return {
          id: String(r.id),
          source: String(r.personaje_a_id),
          target: String(r.personaje_b_id),
          type: "straight",
          style: {
            stroke: colores[r.tipo],
            strokeWidth: relacionada && seleccionado !== null ? 4 : 2.5,
            opacity: relacionada ? 1 : 0.12,
          },
        };
      }),
    [relacionesLibro, seleccionado],
  );

  const personaje = delLibro.find((p) => p.id === seleccionado);
  const vinculos = relacionesLibro
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
        ? "border-mar bg-mar text-papel"
        : "border-arena-clara bg-papel text-texto-suave hover:border-mar"
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

      <div className="mb-4 flex flex-wrap gap-5 text-sm">
        {Object.entries(colores).map(([tipo, color]) => (
          <span
            key={tipo}
            className="flex items-center gap-2 capitalize text-texto-suave"
          >
            <span
              className="inline-block h-1 w-7 rounded"
              style={{ background: color }}
            />
            {tipo}
          </span>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="h-[65vh] rounded-2xl border border-arena-clara bg-papel">
          <ReactFlow
            key={libroActivo}
            nodes={nodos}
            edges={aristas}
            nodeTypes={tiposNodo}
            onNodeClick={(_, nodo) => setSeleccionado(Number(nodo.id))}
            onPaneClick={() => setSeleccionado(null)}
            fitView
            fitViewOptions={{ padding: 0.25 }}
            nodesConnectable={false}
          >
            <Background gap={28} color="#e9dfc8" />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>

        <aside className="rounded-2xl border border-arena-clara bg-papel p-5">
          {personaje ? (
            <>
              <h2 className="font-titulo text-2xl font-semibold text-mar-oscuro">
                {personaje.nombre}
              </h2>
              <p className="mt-2 text-sm text-texto-suave">
                {personaje.descripcion}
              </p>
              <h3 className="mt-5 font-semibold text-mar">Relaciones</h3>
              <ul className="mt-2 space-y-3 text-sm text-texto-suave">
                {vinculos.map((v) => (
                  <li key={v.id} className="flex gap-2">
                    <span
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: colores[v.tipo] }}
                    />
                    <span>
                      <strong className="text-mar-oscuro">{v.nombre}</strong>{" "}
                      <span className="capitalize">· {v.tipo}</span>
                      <br />
                      {v.descripcion}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-texto-suave">
              Haz clic en un personaje para ver su descripción y resaltar sus
              relaciones. Haz clic en el fondo para quitar la selección.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}