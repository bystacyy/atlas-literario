import FormularioAcceso from "@/components/FormularioAcceso";

export default function AccesoPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="font-titulo text-4xl font-bold text-bosque">Tu cuenta</h1>
      <p className="mt-2 mb-8 text-cafe">
        Guarda tus lecturas, escribe reseñas y explora tu geografía literaria.
      </p>
      <FormularioAcceso />
    </main>
  );
}