"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type Momento = {
  libro: string;
  numero: number;
  titulo: string;
  intensidad: number;
  explicacion: string;
};

export default function MapaEmocional({ momentos }: { momentos: Momento[] }) {
  const libros = Array.from(new Set(momentos.map((m) => m.libro)));
  const [libroActivo, setLibroActivo] = useState(libros[0]);
  const [seleccionado, setSeleccionado] = useState<number | null>(null);

  const datos = momentos
    .filter((m) => m.libro === libroActivo)
    .sort((a, b) => a.numero - b.numero);

  const momento = datos.find((m) => m.numero === seleccionado) ?? null;

  const claseBoton = (activo: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition-colors ${
      activo
        ? "border-mar bg-mar text-papel"
        : "border-arena-clara bg-papel text-texto-suave hover:border-mar"
    }`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
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

      <div className="h-80 rounded-2xl border border-arena-clara bg-papel p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={datos}
            margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
            onClick={(estado) => {
              const indice = Number(estado?.activeTooltipIndex);
              if (!Number.isNaN(indice) && datos[indice]) {
                setSeleccionado(datos[indice].numero);
              }
            }}
          >
            <CartesianGrid stroke="#e9dfc8" strokeDasharray="4 4" />
            <XAxis
              dataKey="numero"
              stroke="#3f5654"
              label={{
                value: "Etapa de la historia",
                position: "insideBottom",
                offset: -5,
                fill: "#3f5654",
              }}
            />
            <YAxis
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              stroke="#3f5654"
              label={{
                value: "Tensión",
                angle: -90,
                position: "insideLeft",
                fill: "#3f5654",
              }}
            />
            <Tooltip
              formatter={(valor) => [valor, "Intensidad"]}
              labelFormatter={(numero) => {
                const m = datos.find((d) => d.numero === Number(numero));
                return m ? `${numero}. ${m.titulo}` : String(numero);
              }}
            />
            <Line
              type="monotone"
              dataKey="intensidad"
              stroke="#1f5f5b"
              strokeWidth={3}
              dot={{ r: 5, fill: "#e8735a", stroke: "#12312f", strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 rounded-2xl border border-arena-clara bg-arena-clara/40 p-5">
        {momento ? (
          <>
            <p className="text-sm font-medium text-mar">
              Etapa {momento.numero} · Intensidad {momento.intensidad}/10
            </p>
            <h2 className="font-titulo text-2xl font-semibold text-mar-oscuro">
              {momento.titulo}
            </h2>
            <p className="mt-2 text-texto-suave">{momento.explicacion}</p>
          </>
        ) : (
          <p className="text-sm text-texto-suave">
            Haz clic en un punto del gráfico para leer qué ocurre en ese
            momento de la historia.
          </p>
        )}
      </div>

      <ol className="mt-6 flex flex-wrap gap-2">
        {datos.map((m) => (
          <li key={m.numero}>
            <button
              onClick={() => setSeleccionado(m.numero)}
              className={claseBoton(seleccionado === m.numero)}
            >
              {m.numero}. {m.titulo}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}