import BibliotecaPersonal from "@/components/BibliotecaPersonal";

export default function BibliotecaPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-titulo text-5xl font-semibold text-mar-oscuro">
        Mi biblioteca
      </h1>
      <p className="mb-8 mt-3 max-w-xl text-lg text-texto-suave">
        Tus libros leídos, pendientes y favoritos.
      </p>
      <BibliotecaPersonal />
    </main>
  );
}