-- Atlas Literario: capítulos (etapas narrativas) y datos emocionales
-- Documenta lo que ya se ejecutó en el SQL Editor de Supabase.
-- NO volver a ejecutarlo: duplicaría o daría error por la regla unique.
-- Orden si se reconstruye desde cero: schema.sql, seed.sql, etiquetas.sql y este archivo.
-- Las intensidades (1 a 10) son una valoración editorial manual.

with datos(libro, numero, titulo, intensidad, explicacion) as (values
  ('La vuelta al mundo en 80 días', 1, 'La apuesta', 2, 'Fogg acepta la apuesta en el Reform Club con total calma.'),
  ('La vuelta al mundo en 80 días', 2, 'Partida y sospechas', 4, 'Comienza el viaje y el detective Fix empieza a seguirlo.'),
  ('La vuelta al mundo en 80 días', 3, 'El rescate de Aouda', 7, 'Fogg arriesga tiempo y seguridad para salvar a Aouda en la India.'),
  ('La vuelta al mundo en 80 días', 4, 'Engaños en Asia', 5, 'Fix engaña a Passepartout y el grupo pierde un barco.'),
  ('La vuelta al mundo en 80 días', 5, 'Cruce de América', 8, 'Peligros en tren y un ataque ponen el plazo en riesgo.'),
  ('La vuelta al mundo en 80 días', 6, 'Carrera por el Atlántico', 7, 'Fogg compra un barco para ganar tiempo; Fix lo detiene al llegar.'),
  ('La vuelta al mundo en 80 días', 7, 'El giro final', 9, 'Creen haber perdido, pero la diferencia de día les da la victoria.'),

  ('Don Quijote de la Mancha', 1, 'La primera salida', 4, 'Don Quijote es armado caballero en una venta y sale a buscar aventuras.'),
  ('Don Quijote de la Mancha', 2, 'Los molinos de viento', 5, 'Ataca gigantes que son molinos: comienza la locura cómica.'),
  ('Don Quijote de la Mancha', 3, 'Sierra Morena', 6, 'Penitencia y encuentros que mezclan humor y melancolía.'),
  ('Don Quijote de la Mancha', 4, 'La fama', 4, 'En la segunda parte descubre que ya es famoso por su historia.'),
  ('Don Quijote de la Mancha', 5, 'En casa de los duques', 5, 'Los duques se burlan de él con engaños elaborados.'),
  ('Don Quijote de la Mancha', 6, 'La derrota en Barcelona', 8, 'El Caballero de la Blanca Luna lo vence y debe renunciar.'),
  ('Don Quijote de la Mancha', 7, 'El regreso y la cordura', 9, 'Recobra la razón y muere como Alonso Quijano: final emotivo.'),

  ('Drácula', 1, 'Viaje a Transilvania', 5, 'Harker viaja al castillo y se acumulan señales inquietantes.'),
  ('Drácula', 2, 'Prisionero en el castillo', 8, 'Descubre que el conde es un monstruo y que no puede escapar.'),
  ('Drácula', 3, 'Llegada a Whitby', 7, 'El barco llega sin tripulación y el conde entra en Inglaterra.'),
  ('Drácula', 4, 'La enfermedad de Lucy', 9, 'Lucy empeora y muere a pesar de los esfuerzos de sus amigos.'),
  ('Drácula', 5, 'La alianza', 6, 'Van Helsing reúne al grupo y explica la amenaza.'),
  ('Drácula', 6, 'Mina en peligro', 9, 'El conde ataca a Mina y el grupo corre contra el tiempo.'),
  ('Drácula', 7, 'La persecución final', 10, 'Persiguen al conde hasta Transilvania para destruirlo.'),

  ('Frankenstein', 1, 'Las cartas de Walton', 3, 'Walton, en el Ártico, recoge el relato de Víctor.'),
  ('Frankenstein', 2, 'Infancia y estudios', 4, 'Víctor crece feliz y se obsesiona con la ciencia.'),
  ('Frankenstein', 3, 'La creación', 8, 'Da vida a la criatura y huye horrorizado de su obra.'),
  ('Frankenstein', 4, 'Las muertes de William y Justine', 8, 'Víctor calla la verdad y una inocente es condenada.'),
  ('Frankenstein', 5, 'El encuentro en los Alpes', 7, 'La criatura cuenta su soledad y pide una compañera.'),
  ('Frankenstein', 6, 'La venganza', 10, 'La criatura mata a Clerval y a Elizabeth; la tragedia culmina.'),
  ('Frankenstein', 7, 'La persecución al Ártico', 9, 'Víctor persigue a la criatura entre los hielos hasta el final.'),

  ('Moby Dick', 1, 'Llamadme Ismael', 2, 'Ismael decide embarcarse y el tono es reflexivo.'),
  ('Moby Dick', 2, 'Amistad con Queequeg', 3, 'Ismael conoce al arponero y nace una amistad inesperada.'),
  ('Moby Dick', 3, 'El Pequod zarpa', 4, 'Parte el barco y el capitán aún no se deja ver.'),
  ('Moby Dick', 4, 'La obsesión de Ahab', 7, 'Ahab revela que su meta es cazar a la ballena blanca.'),
  ('Moby Dick', 5, 'Cacerías y calma', 5, 'Se alternan cacerías peligrosas con largas reflexiones.'),
  ('Moby Dick', 6, 'Encuentros en el mar', 6, 'Otros barcos advierten del peligro y Ahab no cede.'),
  ('Moby Dick', 7, 'Los tres días de persecución', 10, 'El enfrentamiento final con Moby Dick lo destruye todo.')
),
nuevos as (
  insert into capitulos (libro_id, numero, titulo, resumen)
  select l.id, d.numero, d.titulo, d.explicacion
  from datos d
  join libros l on l.titulo = d.libro
  returning id, libro_id, numero
)
insert into datos_emocionales (capitulo_id, intensidad, explicacion)
select n.id, d.intensidad, d.explicacion
from nuevos n
join libros l on l.id = n.libro_id
join datos d on d.libro = l.titulo and d.numero = n.numero;