import { Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const modulos = [
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

const estilosLomo = [
  { color: "bg-mar text-papel", alto: "h-[420px]" },
  { color: "bg-coral text-mar-oscuro", alto: "h-[400px]" },
  { color: "bg-mar-oscuro text-papel", alto: "h-[300px]" },
  { color: "border-2 border-mar bg-papel text-mar", alto: "h-[340px]" },
  { color: "bg-[#2f7a74] text-papel", alto: "h-[320px]" },
];

async function Estanteria() {
  const { data: libros, error } = await supabase
    .from("libros")
    .select("id, titulo")
    .order("anio_publicacion")
    .limit(5);

  if (error) {
    return <p className="text-red-700">Error: {error.message}</p>;
  }

  return (
    <ul className="flex items-end gap-3 overflow-x-auto pb-2">
      {libros?.map((libro, i) => {
        const estilo = estilosLomo[i % estilosLomo.length];
        return (
          <li key={libro.id} className="shrink-0">
            <Link
              href={`/libros/${libro.id}`}
              className={`flex w-[84px] items-start justify-start rounded-t-lg rounded-b-sm p-4 font-titulo text-xl font-semibold [writing-mode:vertical-rl] ${estilo.color} ${estilo.alto}`}
            >
              {libro.titulo}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function Home() {
  return (
    <main>
      <section className="mx-auto flex max-w-6xl flex-wrap items-center gap-12 px-6 pb-20 pt-14">
        <div className="min-w-0 flex-[1_1_420px]">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-mar">
            Cartografía de la lectura
          </p>
          <h1 className="mt-5 font-titulo text-5xl font-normal leading-[1.02] tracking-tight text-mar-oscuro sm:text-7xl">
            Cada libro guarda un{" "}
            <em className="font-semibold text-mar">mapa</em>.
          </h1>
          <p className="mt-7 max-w-xl text-xl leading-relaxed text-texto-suave">
            Recorre novelas a través de sus lugares, sus personajes y sus
            emociones. Guarda lo que lees y descubre qué leer después.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/explorar"
              className="inline-flex min-h-[52px] items-center rounded-full bg-coral px-8 text-base font-bold text-mar-oscuro transition-opacity hover:opacity-90"
            >
              Explorar el atlas
            </Link>
            <Link
              href="/biblioteca"
              className="inline-flex min-h-[52px] items-center rounded-full border-2 border-mar px-8 text-base font-bold text-mar transition-colors hover:bg-arena-clara"
            >
              Ver mi biblioteca
            </Link>
          </div>
        </div>

        <div className="min-w-0 flex-[1_1_420px]">
          <div className="rounded-3xl border border-[#d6c9a6] bg-arena-clara p-5">
            <svg
              viewBox="0 0 520 440"
              role="img"
              aria-label="Ilustración de un mapa con la ruta de La vuelta al mundo en 80 días: Londres, Bombay, Hong Kong y Nueva York"
              className="block w-full"
            >
              <g fill="none" stroke="#cdbe98" strokeWidth="1.5">
                <path d="M-10 90 C80 40 160 130 260 80 S430 30 540 90" />
                <path d="M-10 140 C90 90 170 180 270 130 S440 80 540 140" />
                <path d="M-10 190 C100 140 180 230 280 180 S450 130 540 190" />
                <path d="M-10 240 C110 200 190 280 290 230 S460 190 540 240" />
                <path d="M-10 290 C120 250 200 330 300 280 S470 240 540 290" />
                <path d="M-10 340 C120 310 210 380 310 330 S480 300 540 340" />
              </g>
              <path
                d="M92 270 C150 190 210 150 262 190 S372 280 428 150"
                fill="none"
                stroke="#1f5f5b"
                strokeWidth="3"
                strokeDasharray="3 9"
                strokeLinecap="round"
              />
              <g fill="#e8735a" stroke="#12312f" strokeWidth="3">
                <circle cx="92" cy="270" r="9" />
                <circle cx="262" cy="190" r="9" />
                <circle cx="372" cy="262" r="9" />
                <circle cx="428" cy="150" r="9" />
              </g>
              <g
                fontFamily="DM Sans, Arial, sans-serif"
                fontSize="15"
                fontWeight="700"
                fill="#12312f"
              >
                <text x="72" y="304">Londres</text>
                <text x="242" y="172">Bombay</text>
                <text x="338" y="296">Hong Kong</text>
                <text x="352" y="128">Nueva York</text>
              </g>
            </svg>
            <p className="mx-1 mb-1 mt-3 text-sm text-texto-suave">
              Ruta ilustrativa · La vuelta al mundo en 80 días
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-arena-clara">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-14 px-6 py-20">
          <div className="min-w-0 flex-[1_1_280px]">
            <h2 className="font-titulo text-4xl font-semibold leading-tight text-mar-oscuro sm:text-5xl">
              Cuatro maneras de leer un libro
            </h2>
            <p className="mt-5 max-w-sm text-lg leading-relaxed text-texto-suave">
              Cada herramienta mira la misma historia desde un ángulo distinto.
            </p>
          </div>
          <ul className="min-w-0 flex-[2_1_520px] border-t-2 border-mar">
            {modulos.map((m, i) => (
              <li key={m.href} className="border-b border-[#d6c9a6]">
                <Link
                  href={m.href}
                  className="group flex items-baseline gap-6 py-6"
                >
                  <span className="min-w-8 font-titulo text-xl font-semibold text-coral">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span className="block font-titulo text-3xl font-semibold text-mar transition-colors group-hover:text-coral">
                      {m.titulo}
                    </span>
                    <span className="mt-1 block text-texto-suave">
                      {m.texto}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-2xl text-mar">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-arena-clara">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end gap-14 px-6 py-20">
          <div className="min-w-0 flex-[1_1_280px]">
            <h2 className="font-titulo text-4xl font-semibold leading-tight text-mar-oscuro sm:text-5xl">
              Para empezar
            </h2>
            <p className="mb-7 mt-5 max-w-sm text-lg leading-relaxed text-texto-suave">
              Nuestra primera estantería. El catálogo crecerá con cada libro
              que se incorpore.
            </p>
            <Link
              href="/libros"
              className="inline-flex min-h-12 items-center rounded-full bg-mar px-7 text-base font-bold text-papel transition-opacity hover:opacity-90"
            >
              Ver el catálogo
            </Link>
          </div>
          <div className="min-w-0 flex-[2_1_520px]">
            <Suspense
              fallback={<p className="text-texto-suave">Cargando libros...</p>}
            >
              <Estanteria />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}