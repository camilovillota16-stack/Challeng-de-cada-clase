# Verificación del Challenge 04

Fecha: 10 de octubre de 2026.

## Automatizadas

`npm.cmd test`: **10 aprobadas y 0 fallidas**.

- Pila vacía: tamaño cero, peek y pop sin elementos.
- Orden LIFO: A, B y C salen como C, B y A.
- Consultar peek y cambiar el arreglo que devuelve print no altera el orden interno.
- Insertar después de vaciar la pila.
- Orden inverso de los libros de ejemplo.
- Normalización de campos y ISBN con guiones.
- ISBN de diez caracteres terminado en X.
- Campos faltantes y espacios sin contenido.
- ISBN con longitud o caracteres inválidos.
- Campos que superan 150 caracteres.

## Compilación

`npm.cmd run build`: completado con Vite 7.3.7 y Node.js 24.

## Revisión en navegador

| Caso | Resultado observado |
| --- | --- |
| Inicio | Tres libros; Pequeñas ideas en JavaScript en el tope |
| Agregar con ISBN 123 | Mensaje de formato inválido; conserva tres libros |
| Corregir ISBN y agregar | Cuatro libros; el nuevo queda primero; se limpia el formulario |
| Retirar el nuevo | Sale el último agregado; vuelve a tres libros |
| Retirar los ejemplos | Salen Pequeñas ideas, El lenguaje de los nodos y Un mapa de algoritmos |
| Pila vacía | Contador cero y botón de retirar desactivado |
| Insertar después de vaciar | Vuelve a mostrar un libro y habilita retirar |
| Recargar | Recupera los tres libros ficticios iniciales |
| Computador de 1280 px | Formulario y pila en dos columnas, sin desbordamiento horizontal |
| Teléfono de 390 px | Formulario y pila en una columna, sin desbordamiento horizontal |
| Consola del navegador | No se registraron errores durante esta revisión |

Los libros de prueba se retiraron y la página quedó con los datos de ejemplo. Este ejercicio usa memoria del navegador; no guarda cambios después de recargar.
