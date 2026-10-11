# Verificación del Challenge 08

Fecha: 10 de octubre de 2026.

## Automatizadas

`npm.cmd test`: **12 aprobadas y 0 fallidas**.

- Árbol vacío, recorridos y búsqueda sin nodos.
- Raíz, hijos izquierdos y derechos, hojas, tamaño y altura del ejemplo.
- Resultados exactos de inorden, postorden y preorden.
- Búsqueda existente y ausente con su camino de comparaciones.
- Rechazo de nodos repetidos.
- Cero, negativos y decimales.
- Árbol sin balanceo al insertar una secuencia creciente.
- Rechazo de valores no finitos, texto y valores fuera del rango seguro.
- Adaptador visual con un hijo derecho y marcador izquierdo ausente.
- Adaptador con un hijo izquierdo y marcador derecho ausente; el marcador no cuenta como nodo.
- Series con diferentes separadores y rechazo de texto inválido.
- Impresión de los tres arreglos y etiquetas en consola.

## Compilación

`npm.cmd run build`: completado con Vite 7.3.7 y Node.js 24.

Biblioteca visual instalada: react-d3-tree 3.6.7. La instalación informó 0 vulnerabilidades en su auditoría de npm en esta fecha.

## Revisión en navegador

| Caso | Resultado observado |
| --- | --- |
| Buscar 60 | Encontrado; camino 50, 70, 60 y nodo 60 resaltado |
| Buscar 65 en el ejemplo | No encontrado; mismo camino hasta 60 |
| Insertar 25, 65, 50 | Agrega 25 y 65; omite 50 y actualiza inorden con nueve nodos |
| Imprimir recorridos | Consola registra Inorden, Postorden y Preorden con arreglos de nueve valores |
| Insertar 22, abc | Error; conserva exactamente el recorrido previo, sin insertar 22 |
| Vaciar | Cero nodos y niveles; gráfico y recorridos vacíos |
| Insertar 10, 20 desde vacío | Raíz 10 e hijo 20 a la derecha; ausencia del hijo izquierdo marcada con ∅ |
| Posición del hijo único | Coordenada horizontal del nodo 20 mayor que la de la raíz 10 |
| Restablecer | Recupera los siete valores y los tres recorridos originales |
| Computador de 1280 px | Operaciones y dibujo en dos columnas; árbol visible |
| Teléfono de 390 px | Una columna y siete nodos visibles después de centrar, sin desbordamiento horizontal |
| Consola | No se registraron errores durante la revisión |

La pantalla quedó con el ejemplo de siete nodos y la búsqueda de 60 para mostrar su recorrido. Los cambios se restablecen al recargar y no se usa base de datos.
