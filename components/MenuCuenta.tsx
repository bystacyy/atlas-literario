"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { crearClienteNavegador } from "@/lib/supabase-browser";

export default function MenuCuenta() {
  const router = useRouter();
  const [hayUsuario, setHayUsuario] = useState<boolean | null>(null);
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!abierto) return;
    function clicFuera(e: MouseEvent) {
      if (
        contenedor.current &&
        !contenedor.current.contains(e.target as Node)
      ) {
        setAbierto(false);
      }
    }
    function tecla(e: KeyboardEvent) {
      if (e.key === "Escape") setAbierto(false);
    }
    document.addEventListener("mousedown", clicFuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("mousedown", clicFuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [abierto]);

  if (hayUsuario === null) {
    return <div className="h-11 w-11" aria-hidden="true" />;
  }

  if (!hayUsuario) {
    return (
      <Link
        href="/acceso"
        className="ml-1 rounded-full border-2 border-mar px-4 py-2 text-sm font-bold text-mar transition-colors hover:bg-arena-clara"
      >
        Entrar
      </Link>
    );
  }

  const claseItem =
    "block w-full rounded px-3 py-2 text-left text-sm text-mar-oscuro hover:bg-arena-clara";

  return (
    <div ref={contenedor} className="relative">
      <button
        onClick={() => setAbierto(!abierto)}
        aria-label="Mi cuenta"
        aria-haspopup="menu"
        aria-expanded={abierto}
        className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-mar bg-arena-clara text-mar"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
        </svg>
      </button>

      {abierto && (
        <div
          role="menu"
          className="absolute right-0 z-[1100] mt-2 w-52 rounded-lg border border-arena-clara bg-papel p-1 shadow-lg"
        >
                    <Link
            href="/perfil/editar"
            role="menuitem"
            onClick={() => setAbierto(false)}
            className={claseItem}
          >
            Mi perfil
          </Link>
          <Link
            href="/biblioteca"
            role="menuitem"
            onClick={() => setAbierto(false)}
            className={claseItem}
          >
            Mi biblioteca
          </Link>
          <Link
            href="/geografia"
            role="menuitem"
            onClick={() => setAbierto(false)}
            className={claseItem}
          >
            Mi geografía
          </Link>
          <button
            role="menuitem"
            onClick={async () => {
              await crearClienteNavegador().auth.signOut();
              setAbierto(false);
              router.push("/");
              router.refresh();
            }}
            className={claseItem}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}