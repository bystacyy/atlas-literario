-- Atlas Literario: esquema de la base de datos (PostgreSQL en Supabase)
-- Este archivo documenta lo que ya se ejecutó en el SQL Editor.
-- Las tablas perfiles, lecturas y resenas se agregarán en la Etapa 9.

create table autores (
  id bigint generated always as identity primary key,
  nombre text not null,
  pais text,
  anio_nacimiento integer,
  biografia text
);

create table libros (
  id bigint generated always as identity primary key,
  titulo text not null,
  autor_id bigint not null references autores(id),
  anio_publicacion integer,
  sinopsis text,
  portada_url text
);

create table lugares (
  id bigint generated always as identity primary key,
  libro_id bigint not null references libros(id) on delete cascade,
  nombre text not null,
  pais text,
  latitud double precision not null,
  longitud double precision not null,
  descripcion text,
  orden integer not null
);

create table personajes (
  id bigint generated always as identity primary key,
  libro_id bigint not null references libros(id) on delete cascade,
  nombre text not null,
  descripcion text
);

create table relaciones_personajes (
  id bigint generated always as identity primary key,
  personaje_a_id bigint not null references personajes(id) on delete cascade,
  personaje_b_id bigint not null references personajes(id) on delete cascade,
  tipo text not null check (tipo in ('amistad', 'familia', 'rivalidad', 'romance')),
  descripcion text
);

create table capitulos (
  id bigint generated always as identity primary key,
  libro_id bigint not null references libros(id) on delete cascade,
  numero integer not null,
  titulo text,
  resumen text,
  unique (libro_id, numero)
);

create table datos_emocionales (
  id bigint generated always as identity primary key,
  capitulo_id bigint not null unique references capitulos(id) on delete cascade,
  intensidad integer not null check (intensidad between 1 and 10),
  explicacion text
);

-- Seguridad por filas (RLS): lectura pública, escritura bloqueada
alter table autores enable row level security;
alter table libros enable row level security;
alter table lugares enable row level security;
alter table personajes enable row level security;
alter table relaciones_personajes enable row level security;
alter table capitulos enable row level security;
alter table datos_emocionales enable row level security;

create policy "Lectura pública de autores" on autores for select using (true);
create policy "Lectura pública de libros" on libros for select using (true);
create policy "Lectura pública de lugares" on lugares for select using (true);
create policy "Lectura pública de personajes" on personajes for select using (true);
create policy "Lectura pública de relaciones" on relaciones_personajes for select using (true);
create policy "Lectura pública de capítulos" on capitulos for select using (true);
create policy "Lectura pública de datos emocionales" on datos_emocionales for select using (true);