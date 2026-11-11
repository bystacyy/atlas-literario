-- Atlas Literario: etiquetas de los libros (usadas por el recomendador)
-- Este archivo documenta lo que ya se ejecutó en el SQL Editor de Supabase.
-- NO volver a ejecutarlo: la columna ya existe.
-- Orden si se reconstruye desde cero: schema.sql, seed.sql y luego este archivo.

alter table libros add column etiquetas text[] not null default '{}';

update libros set etiquetas = array['aventura','viajes','humor','amistad','mundo','apuesta','carrera','optimismo','ligera']
  where titulo = 'La vuelta al mundo en 80 días';

update libros set etiquetas = array['humor','locura','idealismo','amistad','sátira','españa','caballeros','filosofía','tragicomedia','melancolía']
  where titulo = 'Don Quijote de la Mancha';

update libros set etiquetas = array['terror','miedo','vampiros','suspenso','gótico','misterio','oscuro','amor','tensión','noche']
  where titulo = 'Drácula';

update libros set etiquetas = array['terror','gótico','ciencia','soledad','tristeza','ética','creación','venganza','melancolía','oscuro','filosofía']
  where titulo = 'Frankenstein';

update libros set etiquetas = array['aventura','mar','obsesión','venganza','tragedia','filosofía','naturaleza','tensión','soledad','epopeya']
  where titulo = 'Moby Dick';