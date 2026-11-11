import GeografiaPersonal from "@/components/GeografiaPersonal";

export default function GeografiaPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-titulo text-5xl font-semibold text-mar-oscuro">
        Mi geografía literaria
      </h1>
      <p className="mb-8 mt-3 max-w-xl text-lg text-texto-suave">
        Los lugares del mundo que has recorrido a través de tus lecturas.
      </p>
      <GeografiaPersonal />
    </main>
  );
}