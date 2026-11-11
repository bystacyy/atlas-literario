"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { crearClienteNavegador } from "@/lib/supabase-browser";

type Estado = "pendiente" | "leyendo" | "leido";

const opciones: { valor: Estado; texto: string }[] = [
  { valor: "pendiente", texto: "Quiero leerlo" },
  { valor: "leyendo", texto: "Leyendo" },
  { valor: "leido", texto: "Leído" },
];

export default function BotonesLectura({ libroId }: { libroId: number }) {
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [cargado, setCargado] = useState(false);
  const [estado, setEstado] = useState<Estado | null>(null);
  const [favorito, setFavorito] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = crearClienteNavegador();
    async function cargar() {
      const { data: auth, error: errorAuth } = await supabase.auth.getUser();
      if (errorAuth || !auth.user) {
        setUsuarioId(null);
        setCargado(true);
        return;
      }
      setUsuarioId(auth.user.id);
      const { data } = await supabase
        .from("lecturas")
        .select("estado, es_favorito")
        .eq("libro_id", libroId)
        .maybeSingle();
      if (data) {
        setEstado(data.estado as Estado);
        setFavorito(data.es_favorito);
      }
      setCargado(true);
    }
    cargar();
  }, [libroId]);

  async function guardar(nuevoEstado: Estado, nuevoFavorito: boolean) {
    if (!usuarioId) return;
    setError(null);
    const supabase = crearClienteNavegador();
    const { error } = await supabase.from("lecturas").upsert(
      {
        usuario_id: usuarioId,
        libro_id: libroId,
        estado: nuevoEstado,
        es_favorito: nuevoFavorito,
      },
      { onConflict: "usuario_id,libro_id" },
    );
    if (error) {
      setError(error.message);
      return;
    }
    setEstado(nuevoEstado);
    setFavorito(nuevoFavorito);
  }

  async function quitar() {
    if (!usuarioId) return;
    const supabase = crearClienteNavegador();
    const { error } = await supabase
      .from("lecturas")
      .delete()
      .eq("libro_id", libroId);
    if (error) {
      setError(error.message);
      return;
    }
    setEstado(null);
    setFavorito(false);
  }

  if (!cargado) return null;

  if (!usuarioId) {
    return (
      <p className="text-sm text-texto-suave">
        <Link href="/acceso" className="font-semibold text-mar underline">
          Inicia sesión
        </Link>{" "}
        para guardar este libro en tu biblioteca.
      </p>
    );
  }

  const base = "rounded-full border px-4 py-1.5 text-sm transition-colors";
  const activo = "border-mar bg-mar text-papel";
  const inactivo =
    "border-arena-clara bg-papel text-texto-suave hover:border-mar";

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {opciones.map((o) => (
          <button
            key={o.valor}
            onClick={() => guardar(o.valor, favorito)}
            className={`${base} ${estado === o.valor ? activo : inactivo}`}
          >
            {o.texto}
          </button>
        ))}
        <button
          onClick={() => guardar(estado ?? "pendiente", !favorito)}
          className={`${base} ${favorito ? "border-coral bg-coral text-mar-oscuro" : inactivo}`}
        >
          {favorito ? "★ Favorito" : "☆ Favorito"}
        </button>
        {estado && (
          <button onClick={quitar} className={`${base} ${inactivo}`}>
            Quitar
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}