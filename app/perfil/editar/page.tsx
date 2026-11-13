import FormularioPerfil from "@/components/FormularioPerfil";

export default function EditarPerfilPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-titulo text-5xl font-semibold text-mar-oscuro">
        Mi perfil
      </h1>
      <p className="mb-8 mt-3 text-lg text-texto-suave">
        Cuéntale a otros lectores quién eres.
      </p>
      <FormularioPerfil />
    </main>
  );
}