import GeografiaPersonal from "@/components/GeografiaPersonal";

export default function GeografiaPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-titulo text-4xl font-bold text-bosque">
        Mi geografía literaria
      </h1>
      <p className="mt-2 mb-8 text-cafe">
        Los lugares del mundo que has recorrido a través de tus lecturas.
      </p>
      <GeografiaPersonal />
    </main>
  );
}