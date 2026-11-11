import Link from "next/link";
import BotonSesion from "./BotonSesion";

const enlaces = [
  { href: "/libros", texto: "Libros" },
  { href: "/mapa", texto: "Mapa" },
  { href: "/personajes", texto: "Personajes" },
  { href: "/recomendador", texto: "Recomendador" },
  { href: "/emociones", texto: "Emociones" },
  { href: "/biblioteca", texto: "Mi biblioteca" },
    { href: "/geografia", texto: "Mi geografía" },
];

export default function Navbar() {
  return (
    <header className="border-b border-dorado/40 bg-bosque text-crema">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link href="/" className="font-titulo text-2xl font-bold text-dorado">
          Atlas Literario
        </Link>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {enlaces.map((enlace) => (
            <li key={enlace.href}>
              <Link
                href={enlace.href}
                className="transition-colors hover:text-dorado"
              >
                {enlace.texto}
              </Link>
            </li>
          ))}
          <li>
            <BotonSesion />
          </li>
        </ul>
      </nav>
    </header>
  );
}