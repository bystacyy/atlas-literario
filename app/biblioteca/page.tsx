import BibliotecaPersonal from "@/components/BibliotecaPersonal";

export default function BibliotecaPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-titulo text-4xl font-bold text-bosque">
        Mi biblioteca
      </h1>
      <p className="mt-2 mb-8 text-cafe">
        Tus libros leídos, pendientes y favoritos.
      </p>
      <BibliotecaPersonal />
    </main>
  );
}