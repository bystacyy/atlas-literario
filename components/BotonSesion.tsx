"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { crearClienteNavegador } from "@/lib/supabase-browser";

export default function BotonSesion() {
  const router = useRouter();
  const [hayUsuario, setHayUsuario] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = crearClienteNavegador();
    supabase.auth.getSession().then(({ data }) => {
      setHayUsuario(!!data.session);
    });
    const { data } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      setHayUsuario(!!sesion);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (hayUsuario === null) return null;

  if (!hayUsuario) {
    return (
      <Link href="/acceso" className="transition-colors hover:text-dorado">
        Entrar
      </Link>
    );
  }

  return (
    <button
      onClick={async () => {
        await crearClienteNavegador().auth.signOut();
        router.push("/");
        router.refresh();
      }}
      className="transition-colors hover:text-dorado"
    >
      Cerrar sesión
    </button>
  );
}