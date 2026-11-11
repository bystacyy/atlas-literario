"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuCuenta from "./MenuCuenta";

const propsIcono = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const items = [
  {
    href: "/",
    texto: "Inicio",
    exacto: true,
    rutas: [] as string[],
    dibujo: <path d="M4 11l8-7 8 7v9H4z" />,
  },
  {
    href: "/explorar",
    texto: "Explorar",
    exacto: false,
    rutas: [
      "/explorar",
      "/libros",
      "/mapa",
      "/personajes",
      "/recomendador",
      "/emociones",
    ],
    dibujo: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M15.5 8.5l-2 5-5 2 2-5z" />
      </>
    ),
  },
  {
    href: "/biblioteca",
    texto: "Mi biblioteca",
    exacto: false,
    rutas: ["/biblioteca", "/geografia"],
    dibujo: <path d="M5 4h4v16H5zM11 4h4v16h-4zM17 6l3 .8-3.6 13.6-3-.8z" />,
  },
  {
    href: "/comunidad",
    texto: "Comunidad",
    exacto: false,
    rutas: ["/comunidad"],
    dibujo: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15.5 14.2c3 0 5.5 2 5.5 5.3" />
      </>
    ),
  },
];

export default function Navbar() {
  const pathname = usePathname();

  const activo = (item: (typeof items)[number]) =>
    item.exacto
      ? pathname === item.href
      : item.rutas.some((ruta) => pathname.startsWith(ruta));

  return (
    <>
      <header className="border-b border-arena-clara bg-papel">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link
            href="/"
            aria-label="Atlas Literario, inicio"
            className="flex items-center gap-3"
          >
            <Image
              src="/logo/atlas-isotipo.svg"
              alt=""
              width={40}
              height={40}
              priority
            />
            <span className="font-titulo text-2xl font-semibold text-mar">
              Atlas Literario
            </span>
          </Link>

          <nav
            aria-label="Principal"
            className="hidden gap-9 text-base font-medium md:flex"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={activo(item) ? "page" : undefined}
                className={
                  activo(item)
                    ? "border-b-2 border-coral pb-1 text-mar"
                    : "pb-1 text-mar-oscuro transition-colors hover:text-mar"
                }
              >
                {item.texto}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/libros"
              aria-label="Buscar libros"
              className="flex h-11 w-11 items-center justify-center rounded-full text-mar transition-colors hover:bg-arena-clara"
            >
              <svg {...propsIcono} width={22} height={22}>
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
            </Link>
            <MenuCuenta />
          </div>
        </div>
      </header>

      <nav
        aria-label="Principal móvil"
        className="fixed inset-x-0 bottom-0 z-[1100] flex justify-around border-t border-arena-clara bg-papel px-2 py-1.5 md:hidden"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={activo(item) ? "page" : undefined}
            className={`flex min-h-12 min-w-16 flex-col items-center justify-center gap-0.5 text-[11px] ${
              activo(item)
                ? "font-bold text-mar"
                : "font-medium text-texto-suave"
            }`}
          >
            <svg {...propsIcono}>{item.dibujo}</svg>
            {item.texto === "Mi biblioteca" ? "Biblioteca" : item.texto}
          </Link>
        ))}
      </nav>
    </>
  );
}