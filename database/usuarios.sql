-- Atlas Literario: usuarios, biblioteca personal y reseñas
-- Documenta lo que ya se ejecutó en el SQL Editor de Supabase.
-- NO volver a ejecutarlo: las tablas y el trigger ya existen.
-- Orden si se reconstruye desde cero: schema.sql, seed.sql, etiquetas.sql,
-- emociones.sql y este archivo.

create table perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre_usuario text not null,
  creado_en timestamptz not null default now()
);

create table lecturas (
  id bigint generated always as identity primary key,
  usuario_id uuid not null references perfiles(id) on delete cascade,
  libro_id bigint not null references libros(id) on delete cascade,
  estado text not null check (estado in ('leido', 'pendiente', 'leyendo')),
  es_favorito boolean not null default false,
  creado_en timestamptz not null default now(),
  unique (usuario_id, libro_id)
);

create table resenas (
  id bigint generated always as identity primary key,
  usuario_id uuid not null references perfiles(id) on delete cascade,
  libro_id bigint not null references libros(id) on delete cascade,
  valoracion integer not null check (valoracion between 1 and 5),
  texto text check (char_length(texto) <= 2000),
  creado_en timestamptz not null default now(),
  unique (usuario_id, libro_id)
);

-- Seguridad por filas (RLS)
alter table perfiles enable row level security;
alter table lecturas enable row level security;
alter table resenas enable row level security;

create policy "Perfiles públicos para leer"
  on perfiles for select using (true);
create policy "Editar solo mi perfil"
  on perfiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Ver solo mis lecturas"
  on lecturas for select using (auth.uid() = usuario_id);
create policy "Crear mis lecturas"
  on lecturas for insert with check (auth.uid() = usuario_id);
create policy "Editar mis lecturas"
  on lecturas for update using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);
create policy "Borrar mis lecturas"
  on lecturas for delete using (auth.uid() = usuario_id);

create policy "Reseñas públicas para leer"
  on resenas for select using (true);
create policy "Crear mis reseñas"
  on resenas for insert with check (auth.uid() = usuario_id);
create policy "Editar mis reseñas"
  on resenas for update using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);
create policy "Borrar mis reseñas"
  on resenas for delete using (auth.uid() = usuario_id);

-- Trigger: crea el perfil automáticamente al registrarse un usuario
create function public.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfiles (id, nombre_usuario)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre_usuario', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger al_registrarse
  after insert on auth.users
  for each row execute function public.crear_perfil();