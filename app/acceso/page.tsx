import FormularioAcceso from "@/components/FormularioAcceso";

export default function AccesoPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="font-titulo text-5xl font-semibold text-mar-oscuro">
        Tu cuenta
      </h1>
      <p className="mb-8 mt-3 text-lg text-texto-suave">
        Guarda tus lecturas, escribe reseñas y explora tu geografía literaria.
      </p>
      <FormularioAcceso />
    </main>
  );
}