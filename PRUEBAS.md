# Verificación del Challenge 10

Fecha: **10 de octubre de 2026**.

## Pruebas automáticas

`npm.cmd test`: **12 pruebas aprobadas**, 0 fallidas.

Se verificaron: grafo vacío, datos de las personas, residencia simétrica, habitantes por ciudad, amistades en ambas direcciones, rechazo de duplicados y autoamistades, tipos de nodos, validaciones antes de modificar, IDs para homónimos, cambio de residencia conservando amigos, protección de datos y exportación visual sin aristas duplicadas ni pérdida de ciudades vacías.

`npm.cmd run build`: **compilación correcta** con Vite 7.3.7. El archivo generado utiliza la biblioteca react-d3-graph 2.6.0 con React 16.14.0 y D3 5.16.0.

`npm.cmd ls --depth=0`: dependencias instaladas correctamente, sin conflictos de versiones declarados.

## Comprobaciones en navegador

- El ejemplo muestra 6 personas, 3 ciudades, 4 amistades y 10 conexiones. El SVG contiene los 9 nodos con sus nombres.
- Pasto lista a Ana y Bruno; Cali a Camila y Diego; Bogotá a Elena y Felipe.
- Seleccionar Camila en el mapa muestra edad 21, residencia Cali y amistad con Ana.
- Seleccionar Pasto muestra 2 habitantes; seleccionar Ana desde la lista muestra sus amistades con Bruno y Camila.
- Añadir Medellín crea un nodo visible y un resultado de 0 personas.
- Registrar Lucía, 26 años, en Medellín actualiza el mapa y la consulta: 1 persona.
- Conectar Lucía con Ana crea una amistad entre ciudades diferentes: 7 personas, 4 ciudades, 5 amistades y 12 conexiones.
- Repetir la amistad muestra «Esa amistad ya existe» y conserva los contadores.
- Intentar conectar Lucía consigo misma muestra «Escoge dos personas diferentes».
- Añadir « PASTO » rechaza la ciudad duplicada.
- Seleccionar Lucía desde la lista muestra edad, ciudad y a Ana como amiga.
- Restaurar el ejemplo devuelve los registros iniciales; recargar también los reinicia.
- Se revisó visualmente a 1280 × 900 y 390 × 844. En móvil la página no tiene desbordamiento horizontal; el mapa permite desplazamiento dentro de su propio panel (contenido de 600 px en un panel de 303 px).
- Sin errores ni advertencias registrados en la consola durante estas comprobaciones.

Estos resultados corresponden al ejemplo y a los escenarios anteriores, no a una prueba de rendimiento con grandes volúmenes de nodos. Los datos se guardan en memoria.
