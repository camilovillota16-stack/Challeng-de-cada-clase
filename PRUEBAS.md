# Verificación del Challenge 09

Fecha: 10 de octubre de 2026.

## Automatizadas

`npm.cmd test`: **12 aprobadas y 0 fallidas**.

- Raíz sin hijos, tamaño y altura.
- Cuatro hijos de Campus, 15 nodos totales y cuatro niveles.
- Títulos, enlaces únicos y componentes función de todos los nodos.
- Orden DFS por ramas y BFS por niveles.
- Camino a un nodo profundo mediante referencias de padres.
- Ruta desconocida, duplicada y padre inexistente.
- Campos inválidos, enlace externo y componente ausente.
- Rechazo de dos padres para un mismo nodo y de ciclos.
- Inserción de un submenú con búsqueda y vínculo al padre.

## Compilación

`npm.cmd run build`: completado con Vite 7.3.7 y Node.js 24.

## Revisión en navegador

| Caso | Resultado observado |
| --- | --- |
| Ruta a Estructuras de Datos II | Breadcrumbs Campus / Académico / Mis materias / Estructuras de Datos II |
| Contraer Académico | Oculta sus submenús y conserva la pantalla seleccionada |
| Expandir Académico | Recupera sus submenús y el nivel de Mis materias |
| Cambiar a BFS | Comienza con Campus, Inicio, Académico, Recursos y Mi espacio |
| Catorce enlaces del menú | Cada enlace abrió un título principal distinto y coincidió con el título y ruta del nodo seleccionado |
| Atrás y Adelante | Recuperan Perfil y Preferencias mediante sus rutas |
| Ruta no existente | Muestra Página no encontrada y un enlace para volver al inicio |
| Recargar una ruta profunda | Conserva la pantalla Estructuras de Datos II |
| Computador de 1280 px | Menú lateral y contenido en dos columnas, sin desbordamiento horizontal |
| Teléfono de 390 px | Menú y contenido en una columna, sin desbordamiento horizontal |
| Consola | No se registraron errores durante la revisión |

La pantalla quedó en Estructuras de Datos II, con el recorrido DFS y las ramas abiertas. Las páginas contienen datos de demostración.
