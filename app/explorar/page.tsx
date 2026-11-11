import Link from "next/link";

const herramientas = [
  {
    href: "/libros",
    titulo: "Catálogo de libros",
    texto: "Todos los libros, con su autor y su sinopsis.",
  },
  {
    href: "/mapa",
    titulo: "Mapa literario",
    texto: "Sigue las rutas de cada novela por el mundo.",
  },
  {
    href: "/personajes",
    titulo: "Grafo de personajes",
    texto: "Descubre quién es amigo, rival, familia o amor de quién.",
  },
  {
    href: "/recomendador",
    titulo: "Recomendador",
    texto: "Cuéntanos cómo te sientes y te sugerimos qué leer.",
  },
  {
    href: "/emociones",
    titulo: "Mapa emocional",
    texto: "Mira cómo sube y baja la tensión capítulo a capítulo.",
  },
];

export default function ExplorarPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-titulo text-5xl font-semibold text-mar-oscuro">
        Explorar
      </h1>
      <p className="mt-3 max-w-xl text-lg text-texto-suave">
        Elige desde qué ángulo quieres mirar los libros.
      </p>

      <ul className="mt-10 border-t-2 border-mar">
        {herramientas.map((h, i) => (
          <li key={h.href} className="border-b border-arena-clara">
            <Link
              href={h.href}
              className="group flex items-baseline gap-6 py-6"
            >
              <span className="font-titulo text-xl font-semibold text-coral">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">
                <span className="block font-titulo text-3xl font-semibold text-mar transition-colors group-hover:text-coral">
                  {h.titulo}
                </span>
                <span className="mt-1 block text-texto-suave">{h.texto}</span>
              </span>
              <span aria-hidden="true" className="text-2xl text-mar">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}