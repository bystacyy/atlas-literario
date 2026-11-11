import MapaCargador from "@/components/MapaCargador";

export default function MapaPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-titulo text-4xl font-bold text-bosque">
        Mapa literario
      </h1>
      <p className="mt-2 mb-8 text-cafe">
        Recorre el mundo siguiendo los lugares de cada novela.
      </p>
      <MapaCargador />
    </main>
  );
}