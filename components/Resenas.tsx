"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { crearClienteNavegador } from "@/lib/supabase-browser";

type Resena = {
  id: number;
  usuario_id: string;
  valoracion: number;
  texto: string | null;
  perfiles: { nombre_usuario: string } | { nombre_usuario: string }[] | null;
};

const estrellas = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

export default function Resenas({ libroId }: { libroId: number }) {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [valoracion, setValoracion] = useState(5);
  const [texto, setTexto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargado, setCargado] = useState(false);

  const cargar = useCallback(async () => {
    const supabase = crearClienteNavegador();
    const { data: auth, error: errorAuth } = await supabase.auth.getUser();
    const uid = errorAuth || !auth.user ? null : auth.user.id;
    setUsuarioId(uid);

    const { data, error } = await supabase
      .from("resenas")
      .select("id, usuario_id, valoracion, texto, perfiles(nombre_usuario)")
      .eq("libro_id", libroId)
      .order("creado_en", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      const lista = (data ?? []) as Resena[];
      setResenas(lista);
      const mia = lista.find((r) => r.usuario_id === uid);
      if (mia) {
        setValoracion(mia.valoracion);
        setTexto(mia.texto ?? "");
      }
    }
    setCargado(true);
  }, [libroId]);

  useEffect(() => {
    let activo = true;
    Promise.resolve().then(() => {
      if (activo) cargar();
    });
    return () => {
      activo = false;
    };
  }, [cargar]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!usuarioId) return;
    setError(null);
    const supabase = crearClienteNavegador();
    const { error } = await supabase.from("resenas").upsert(
      {
        usuario_id: usuarioId,
        libro_id: libroId,
        valoracion,
        texto: texto.trim() || null,
      },
      { onConflict: "usuario_id,libro_id" },
    );
    if (error) {
      setError(error.message);
      return;
    }
    await cargar();
  }

  async function borrar() {
    if (!usuarioId) return;
    const supabase = crearClienteNavegador();
    const { error } = await supabase
      .from("resenas")
      .delete()
      .eq("libro_id", libroId)
      .eq("usuario_id", usuarioId);
    if (error) {
      setError(error.message);
      return;
    }
    setTexto("");
    setValoracion(5);
    await cargar();
  }

  const nombre = (r: Resena) =>
    (Array.isArray(r.perfiles) ? r.perfiles[0] : r.perfiles)?.nombre_usuario ??
    "Lector";

  const promedio =
    resenas.length > 0
      ? resenas.reduce((s, r) => s + r.valoracion, 0) / resenas.length
      : null;

  const tieneMia = resenas.some((r) => r.usuario_id === usuarioId);

  if (!cargado) return null;

  return (
    <section className="mt-12 border-t border-arena-clara pt-8">
      <h2 className="font-titulo text-2xl font-bold text-mar">Reseñas</h2>
      {promedio !== null && (
        <p className="mt-1 text-coral">
          {estrellas(Math.round(promedio))}{" "}
          <span className="text-sm text-texto-suave">
            {promedio.toFixed(1)} · {resenas.length}{" "}
            {resenas.length === 1 ? "reseña" : "reseñas"}
          </span>
        </p>
      )}

      {usuarioId ? (
        <form onSubmit={enviar} className="mt-6 space-y-3">
          <label className="block text-sm font-semibold text-mar">
            Tu valoración
            <select
              value={valoracion}
              onChange={(e) => setValoracion(Number(e.target.value))}
              className="ml-2 rounded border border-arena-clara bg-papel p-1"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} {estrellas(n)}
                </option>
              ))}
            </select>
          </label>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="¿Qué te pareció?"
            className="w-full rounded-lg border border-arena-clara bg-papel p-3 text-mar-oscuro focus:border-mar focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-full bg-mar px-5 py-2 text-sm font-semibold text-papel hover:opacity-90"
            >
              {tieneMia ? "Actualizar reseña" : "Publicar reseña"}
            </button>
            {tieneMia && (
              <button
                type="button"
                onClick={borrar}
                className="rounded-full border border-arena-clara px-5 py-2 text-sm text-texto-suave hover:border-mar"
              >
                Borrar
              </button>
            )}
          </div>
        </form>
      ) : (
        <p className="mt-4 text-sm text-texto-suave">
          <Link href="/acceso" className="font-semibold text-mar underline">
            Inicia sesión
          </Link>{" "}
          para escribir una reseña.
        </p>
      )}

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

      <ul className="mt-8 space-y-5">
        {resenas.length === 0 && (
          <li className="text-sm text-texto-suave">Aún no hay reseñas.</li>
        )}
        {resenas.map((r) => (
          <li
            key={r.id}
            className="rounded-lg border border-arena-clara bg-papel p-4"
          >
            <p className="text-sm">
              <strong className="text-mar">{nombre(r)}</strong>{" "}
              <span className="text-coral">{estrellas(r.valoracion)}</span>
            </p>
            {r.texto && (
              <p className="mt-2 text-sm text-texto-suave">{r.texto}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}