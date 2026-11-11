-- Atlas Literario: datos iniciales (seed)
-- Este archivo documenta lo que ya se ejecutó en el SQL Editor de Supabase.
-- NO volver a ejecutarlo sobre una base que ya tiene datos: duplicaría las filas.
-- Orden de ejecución si se reconstruye desde cero: schema.sql y luego este archivo.

-- 1. Autores
insert into autores (nombre, pais, anio_nacimiento) values
  ('Julio Verne', 'Francia', 1828),
  ('Miguel de Cervantes', 'España', 1547),
  ('Bram Stoker', 'Irlanda', 1847),
  ('Mary Shelley', 'Reino Unido', 1797),
  ('Herman Melville', 'Estados Unidos', 1819);

-- 2. Libros
insert into libros (titulo, autor_id, anio_publicacion, sinopsis) values
  ('La vuelta al mundo en 80 días',
   (select id from autores where nombre = 'Julio Verne'),
   1872,
   'Phileas Fogg apuesta que puede rodear el planeta en ochenta días.'),
  ('Don Quijote de la Mancha',
   (select id from autores where nombre = 'Miguel de Cervantes'),
   1605,
   'Un hidalgo enloquecido por los libros de caballerías sale a recorrer España como caballero andante.'),
  ('Drácula',
   (select id from autores where nombre = 'Bram Stoker'),
   1897,
   'Un grupo de amigos se enfrenta a un conde vampiro que llega de Transilvania a Inglaterra.'),
  ('Frankenstein',
   (select id from autores where nombre = 'Mary Shelley'),
   1818,
   'Un joven científico crea vida artificial y sufre las consecuencias de abandonar a su criatura.'),
  ('Moby Dick',
   (select id from autores where nombre = 'Herman Melville'),
   1851,
   'El capitán Ahab persigue obsesivamente a la ballena blanca que le arrancó una pierna.');

-- 3. Lugares (coordenadas aproximadas)
insert into lugares (libro_id, nombre, pais, latitud, longitud, descripcion, orden) values
-- La vuelta al mundo en 80 días
((select id from libros where titulo = 'La vuelta al mundo en 80 días'), 'Londres', 'Reino Unido', 51.5074, -0.1278, 'Phileas Fogg acepta la apuesta en el Reform Club.', 1),
((select id from libros where titulo = 'La vuelta al mundo en 80 días'), 'Suez', 'Egipto', 29.9668, 32.5498, 'Paso obligado hacia el océano Índico.', 2),
((select id from libros where titulo = 'La vuelta al mundo en 80 días'), 'Bombay', 'India', 19.0760, 72.8777, 'Comienza la travesía por el subcontinente.', 3),
((select id from libros where titulo = 'La vuelta al mundo en 80 días'), 'Hong Kong', 'China', 22.3193, 114.1694, 'Escala en Asia oriental.', 4),
((select id from libros where titulo = 'La vuelta al mundo en 80 días'), 'San Francisco', 'Estados Unidos', 37.7749, -122.4194, 'Llegada a América.', 5),
((select id from libros where titulo = 'La vuelta al mundo en 80 días'), 'Nueva York', 'Estados Unidos', 40.7128, -74.0060, 'Último tramo hacia Europa.', 6),
-- Don Quijote de la Mancha
((select id from libros where titulo = 'Don Quijote de la Mancha'), 'Campo de Montiel', 'España', 38.7000, -2.9000, 'Región por donde cabalga don Quijote en su primera salida.', 1),
((select id from libros where titulo = 'Don Quijote de la Mancha'), 'Puerto Lápice', 'España', 39.3200, -3.4800, 'Lugar de la venta donde es armado caballero.', 2),
((select id from libros where titulo = 'Don Quijote de la Mancha'), 'Sierra Morena', 'España', 38.2000, -3.9000, 'Escenario de penitencias y encuentros.', 3),
((select id from libros where titulo = 'Don Quijote de la Mancha'), 'Zaragoza', 'España', 41.6488, -0.8891, 'Destino cambiado por don Quijote.', 4),
((select id from libros where titulo = 'Don Quijote de la Mancha'), 'Barcelona', 'España', 41.3874, 2.1686, 'Allí vive su derrota ante el Caballero de la Blanca Luna.', 5),
-- Drácula
((select id from libros where titulo = 'Drácula'), 'Bistrița', 'Rumanía', 47.1333, 24.5000, 'Jonathan Harker inicia su viaje hacia el castillo.', 1),
((select id from libros where titulo = 'Drácula'), 'Castillo de Drácula (Paso Borgo)', 'Rumanía', 47.2300, 25.1900, 'Residencia del conde en los Cárpatos.', 2),
((select id from libros where titulo = 'Drácula'), 'Varna', 'Bulgaria', 43.2141, 27.9147, 'Puerto donde el conde llega por mar rumbo a Inglaterra.', 3),
((select id from libros where titulo = 'Drácula'), 'Whitby', 'Reino Unido', 54.4858, -0.6206, 'Desembarco del conde en Inglaterra.', 4),
((select id from libros where titulo = 'Drácula'), 'Londres', 'Reino Unido', 51.5074, -0.1278, 'Escenario de la caza del vampiro.', 5),
-- Frankenstein
((select id from libros where titulo = 'Frankenstein'), 'Ginebra', 'Suiza', 46.2044, 6.1432, 'Hogar de la familia Frankenstein.', 1),
((select id from libros where titulo = 'Frankenstein'), 'Ingolstadt', 'Alemania', 48.7665, 11.4258, 'Donde Víctor estudia y crea a la criatura.', 2),
((select id from libros where titulo = 'Frankenstein'), 'Chamonix', 'Francia', 45.9237, 6.8694, 'Encuentro entre Víctor y su criatura en los Alpes.', 3),
((select id from libros where titulo = 'Frankenstein'), 'Islas Orcadas', 'Reino Unido', 59.0000, -3.0000, 'Víctor trabaja en una segunda criatura.', 4),
((select id from libros where titulo = 'Frankenstein'), 'Ártico', 'Océano Ártico', 80.0000, 0.0000, 'Persecución final entre hielos.', 5),
-- Moby Dick
((select id from libros where titulo = 'Moby Dick'), 'Nantucket', 'Estados Unidos', 41.2835, -70.0995, 'Isla ballenera de donde parte Ismael.', 1),
((select id from libros where titulo = 'Moby Dick'), 'New Bedford', 'Estados Unidos', 41.6362, -70.9342, 'Puerto donde Ismael conoce a Queequeg.', 2),
((select id from libros where titulo = 'Moby Dick'), 'Océano Atlántico', 'Océano Atlántico', 20.0000, -35.0000, 'Primer tramo de la travesía del Pequod.', 3),
((select id from libros where titulo = 'Moby Dick'), 'Cabo de Buena Esperanza', 'Sudáfrica', -34.3568, 18.4740, 'Cruce hacia el océano Índico.', 4),
((select id from libros where titulo = 'Moby Dick'), 'Océano Pacífico', 'Océano Pacífico', 0.0000, -160.0000, 'Escenario del encuentro final con Moby Dick.', 5);