"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { crearClienteNavegador } from "@/lib/supabase-browser";

const generos = [
  "Aventura",
  "Clásicos",
  "Ciencia ficción",
  "Drama",
  "Fantasía",
  "Filosofía",
  "Histórica",
  "Humor",
  "Misterio",
  "Poesía",
  "Romance",
  "Terror",
];

export default function FormularioPerfil() {
  const [estado, setEstado] = useState<"cargando" | "sin-sesion" | "listo">(
    "cargando",
  );
  const [uid, setUid] = useState<string | null>(null);
  const [usuario, setUsuario] = useState("");
  const [nombreVisible, setNombreVisible] = useState("");
  const [biografia, setBiografia] = useState("");
  const [pais, setPais] = useState("");
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [autor, setAutor] = useState("");
  const [libro, setLibro] = useState("");
  const [perfilPublico, setPerfilPublico] = useState(true);
  const [mostrarLecturas, setMostrarLecturas] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const supabase = crearClienteNavegador();
    async function cargar() {
      const { data: auth, error: errorAuth } = await supabase.auth.getUser();
      if (errorAuth || !auth.user) {
        setEstado("sin-sesion");
        return;
      }
      setUid(auth.user.id);

      const { data, error } = await supabase
        .from("perfiles")
        .select(
          "nombre_usuario, nombre_visible, biografia, pais, generos_favoritos, autor_favorito, libro_favorito, perfil_publico, mostrar_lecturas",
        )
        .eq("id", auth.user.id)
        .maybeSingle();

      if (error) {
        setError(error.message);
      } else if (data) {
        setUsuario(data.nombre_usuario);
        setNombreVisible(data.nombre_visible ?? "");
        setBiografia(data.biografia ?? "");
        setPais(data.pais ?? "");
        setFavoritos(data.generos_favoritos ?? []);
        setAutor(data.autor_favorito ?? "");
        setLibro(data.libro_favorito ?? "");
        setPerfilPublico(data.perfil_publico);
        setMostrarLecturas(data.mostrar_lecturas);
      }
      setEstado("listo");
    }
    cargar();
  }, []);

  function alternarGenero(g: string) {
    setFavoritos((actual) =>
      actual.includes(g) ? actual.filter((x) => x !== g) : [...actual, g],
    );
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!uid) return;
    setError(null);
    setMensaje(null);
    setGuardando(true);

    const supabase = crearClienteNavegador();
    const { data, error } = await supabase
      .from("perfiles")
      .update({
        nombre_visible: nombreVisible.trim() || null,
        biografia: biografia.trim() || null,
        pais: pais.trim() || null,
        generos_favoritos: favoritos,
        autor_favorito: autor.trim() || null,
        libro_favorito: libro.trim() || null,
        perfil_publico: perfilPublico,
        mostrar_lecturas: mostrarLecturas,
      })
      .eq("id", uid)
      .select("id");

    setGuardando(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (!data || data.length === 0) {
      setError("No se pudo guardar tu perfil. Vuelve a iniciar sesión.");
      return;
    }
    setMensaje("Perfil guardado.");
  }

  if (estado === "cargando") {
    return <p className="text-texto-suave">Cargando...</p>;
  }

  if (estado === "sin-sesion") {
    return (
      <p className="text-texto-suave">
        <Link href="/acceso" className="font-semibold text-mar underline">
          Inicia sesión
        </Link>{" "}
        para editar tu perfil.
      </p>
    );
  }

  const campo =
    "mt-1 w-full rounded-xl border border-arena-clara bg-papel p-3 text-mar-oscuro focus:border-mar focus:outline-none";
  const etiqueta = "block text-sm font-semibold text-mar";

  return (
    <form onSubmit={guardar} className="space-y-6">
      <div>
        <p className={etiqueta}>Nombre de usuario</p>
        <p className="mt-1 text-mar-oscuro">@{usuario}</p>
      </div>

      <label className={etiqueta}>
        Nombre visible
        <input
          type="text"
          maxLength={50}
          value={nombreVisible}
          onChange={(e) => setNombreVisible(e.target.value)}
          className={campo}
        />
      </label>

      <label className={etiqueta}>
        Biografía
        <textarea
          rows={4}
          maxLength={300}
          value={biografia}
          onChange={(e) => setBiografia(e.target.value)}
          className={campo}
        />
        <span className="mt-1 block text-xs font-normal text-texto-suave">
          {biografia.length}/300
        </span>
      </label>

      <label className={etiqueta}>
        País o ubicación (opcional)
        <input
          type="text"
          maxLength={60}
          value={pais}
          onChange={(e) => setPais(e.target.value)}
          className={campo}
        />
      </label>

      <fieldset>
        <legend className={etiqueta}>Géneros favoritos</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {generos.map((g) => {
            const activo = favoritos.includes(g);
            return (
              <button
                key={g}
                type="button"
                aria-pressed={activo}
                onClick={() => alternarGenero(g)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  activo
                    ? "border-mar bg-mar text-papel"
                    : "border-arena-clara bg-papel text-texto-suave hover:border-mar"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className={etiqueta}>
        Autor favorito
        <input
          type="text"
          maxLength={80}
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          className={campo}
        />
      </label>

      <label className={etiqueta}>
        Libro favorito
        <input
          type="text"
          maxLength={120}
          value={libro}
          onChange={(e) => setLibro(e.target.value)}
          className={campo}
        />
      </label>

      <fieldset className="space-y-3 rounded-2xl border border-arena-clara p-5">
        <legend className="px-2 text-sm font-semibold text-mar">
          Privacidad
        </legend>
        <label className="flex items-start gap-3 text-mar-oscuro">
          <input
            type="checkbox"
            checked={perfilPublico}
            onChange={(e) => setPerfilPublico(e.target.checked)}
            className="mt-1 h-5 w-5 accent-[#1f5f5b]"
          />
          <span>
            Perfil público
            <span className="block text-sm text-texto-suave">
              Si lo desactivas, nadie más puede ver tu perfil y tus reseñas
              aparecerán como &quot;Lector&quot;.
            </span>
          </span>
        </label>
        <label className="flex items-start gap-3 text-mar-oscuro">
          <input
            type="checkbox"
            checked={mostrarLecturas}
            onChange={(e) => setMostrarLecturas(e.target.checked)}
            className="mt-1 h-5 w-5 accent-[#1f5f5b]"
          />
          <span>
            Mostrar mis lecturas
            <span className="block text-sm text-texto-suave">
              Permite que otros vean tus libros leídos y tu geografía literaria.
              Esta opción se aplicará cuando existan los perfiles públicos.
            </span>
          </span>
        </label>
      </fieldset>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      {mensaje && (
        <p role="status" className="text-sm font-semibold text-mar">
          {mensaje}
        </p>
      )}

      <button
        type="submit"
        disabled={guardando}
        className="inline-flex min-h-12 items-center rounded-full bg-coral px-8 font-bold text-mar-oscuro transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {guardando ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}