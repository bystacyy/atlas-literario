"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearClienteNavegador } from "@/lib/supabase-browser";

export default function FormularioAcceso() {
  const router = useRouter();
  const [modo, setModo] = useState<"entrar" | "registrar">("entrar");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMensaje(null);
    setCargando(true);

    const supabase = crearClienteNavegador();

    if (modo === "registrar") {
      const { data, error } = await supabase.auth.signUp({
        email: correo,
        password: clave,
        options: { data: { nombre_usuario: nombre } },
      });
      setCargando(false);
      if (error) {
        setError(error.message);
        return;
      }
      if (data.session) {
        router.push("/");
        router.refresh();
      } else {
        setMensaje("Cuenta creada. Revisa tu correo para confirmarla.");
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: clave,
    });
    setCargando(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  const campo =
    "mt-1 w-full rounded-lg border border-arena bg-crema p-3 text-tinta focus:border-dorado focus:outline-none";

  return (
    <form onSubmit={enviar} className="space-y-4">
      <div className="flex gap-2">
        {(["entrar", "registrar"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setModo(m)}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              modo === m
                ? "border-bosque bg-bosque text-crema"
                : "border-arena bg-pergamino text-cafe hover:border-dorado"
            }`}
          >
            {m === "entrar" ? "Iniciar sesión" : "Crear cuenta"}
          </button>
        ))}
      </div>

      {modo === "registrar" && (
        <label className="block text-sm font-semibold text-bosque">
          Nombre de usuario
          <input
            type="text"
            required
            minLength={3}
            maxLength={30}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={campo}
          />
        </label>
      )}

      <label className="block text-sm font-semibold text-bosque">
        Correo
        <input
          type="email"
          required
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className={campo}
        />
      </label>

      <label className="block text-sm font-semibold text-bosque">
        Contraseña
        <input
          type="password"
          required
          minLength={8}
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          className={campo}
        />
      </label>

      {error && <p className="text-sm text-red-700">{error}</p>}
      {mensaje && <p className="text-sm text-bosque">{mensaje}</p>}

      <button
        type="submit"
        disabled={cargando}
        className="rounded-full bg-bosque px-6 py-2 font-semibold text-crema hover:opacity-90 disabled:opacity-50"
      >
        {cargando
          ? "Procesando..."
          : modo === "entrar"
            ? "Entrar"
            : "Crear cuenta"}
      </button>
    </form>
  );
}