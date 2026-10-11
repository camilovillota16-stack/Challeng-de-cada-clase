# Verificación del Challenge 11

Fecha: **10 de octubre de 2026**.

## Automáticas

`npm.cmd test`: **16 pruebas aprobadas**, 0 fallidas.

Se verificaron el ejemplo de la clase, prefijos compartidos, palabras que terminan antes de sus hijos, ausencia de coincidencias, normalización Unicode y mayúsculas, prefijo vacío, límites de K, validación de productos antes de modificar, duplicados, recorrido del Trie, Heap vacío, construcción e inserción, extracciones en orden, prioridad de todos los padres en un Heap de 200 elementos, empates, búsquedas repetidas, inserciones posteriores y protección del catálogo.

`npm.cmd run build`: compilación correcta con Vite 7.3.7, después del ajuste final de los textos singulares.

## Navegador

- `air`, K = 2: `air force` (95), `air max` (90), en ese orden.
- El recorrido visible del Trie es raíz → a → i → r. El Heap inicial tiene raíz `air force` (95) e hijos `air jordan` (85) y `air max` (90).
- `ad`: un resultado, `adidas boost` (80).
- `max`: sin resultados, porque no es prefijo de ningún nombre.
- Prefijo vacío y K = 10: cuatro productos, con puntajes 95, 90, 85, 80.
- K = 0 y K vacío: mensaje «K debe ser un entero entre 1 y 100».
- ` AIR ` conserva los mismos resultados que `air`.
- Añadir `air zoom`, popularidad 98: catálogo de cinco productos; pasa al primer puesto, seguido por `air force`.
- Registrar ` AIR ZOOM ` de nuevo: mensaje de duplicado, sin añadir un sexto producto.
- Buscar `air z`: una coincidencia y un resultado, `air zoom` (98).
- Restaurar y recargar devuelve el ejemplo inicial de cuatro productos y el Top 2 original.
- Revisión visual a 1280 × 900 y 390 × 844. La página móvil no tiene desbordamiento horizontal: ancho de documento 375 px para ventana de 390 px. El dibujo del Heap permite desplazamiento horizontal dentro de su panel.
- Sin errores ni advertencias registrados en la consola durante la revisión.

Los escenarios anteriores no son una prueba de rendimiento a gran escala. El ejercicio utiliza datos en memoria.
