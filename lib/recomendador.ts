export type LibroConEtiquetas = {
  id: number;
  titulo: string;
  anio_publicacion: number | null;
  sinopsis: string | null;
  portada_url: string | null;
  etiquetas: string[];
  autor: string;
};

export type Recomendacion = {
  libro: LibroConEtiquetas;
  puntos: number;
  coincidencias: string[];
};

// Palabras (o inicios de palabra) que el usuario puede escribir
// y que apuntan a una etiqueta. Las claves van sin tildes.
const sinonimos: Record<string, string[]> = {
  aventura: ["aventur", "explor", "emocion", "accion"],
  viajes: ["viaj", "recorrer", "paises", "turismo"],
  humor: ["humor", "gracios", "reir", "risa", "divertid", "comic"],
  amistad: ["amistad", "amigo", "compan", "lealtad"],
  terror: ["terror", "susto", "asust", "pesadilla", "escalofri"],
  miedo: ["miedo", "temor", "panico"],
  misterio: ["misterio", "enigma", "intriga"],
  amor: ["amor", "romanc", "enamor", "pasion"],
  tristeza: ["trist", "llorar", "deprim", "desanim"],
  melancolia: ["melanc", "nostalg"],
  soledad: ["solo", "soledad", "aislad"],
  venganza: ["venganz", "rencor", "odio"],
  mar: ["mar", "barco", "marino", "oceano", "ballena", "naufrag"],
  filosofia: ["filosof", "reflex", "pensar", "profund"],
  ciencia: ["cienc", "experiment", "cientific", "tecnolog"],
  locura: ["locur", "loco", "demencia"],
  optimismo: ["optimis", "alegr", "feliz", "positiv", "animo"],
  ligera: ["ligero", "facil", "relajad", "descans"],
  oscuro: ["oscur", "sombri", "tenebr"],
  gotico: ["gotic"],
  suspenso: ["suspens", "tension", "tens"],
  tension: ["suspens", "tension", "tens"],
  obsesion: ["obsesi", "fijacion"],
  tragedia: ["traged", "dramatic"],
  naturaleza: ["naturaleza", "salvaje", "bosque"],
  satira: ["satir", "critica", "ironi"],
  vampiros: ["vampir", "dracula"],
  noche: ["noche", "nocturn"],
};

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function coincide(palabras: string[], disparador: string): boolean {
  // Los disparadores cortos deben coincidir exactos para evitar falsos positivos.
  return palabras.some((p) =>
    disparador.length <= 3 ? p === disparador : p.startsWith(disparador),
  );
}

export function recomendar(
  texto: string,
  libros: LibroConEtiquetas[],
): Recomendacion[] {
  const palabras = normalizar(texto)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  const resultados = libros.map((libro) => {
    const coincidencias = libro.etiquetas.filter((etiqueta) => {
      const clave = normalizar(etiqueta);
      const disparadores = [clave, ...(sinonimos[clave] ?? [])];
      return disparadores.some((d) => coincide(palabras, d));
    });
    return { libro, puntos: coincidencias.length, coincidencias };
  });

  return resultados
    .filter((r) => r.puntos > 0)
    .sort((a, b) => b.puntos - a.puntos)
    .slice(0, 3);
}