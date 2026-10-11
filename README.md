# Challenge 11 · Buscador con Trie y Max Heap

**Harold Camilo Villota Ortiz · Código 2240680**

Solución del Challenge11 de la diapositiva 21 de **Clase 11 - Tries_n_Heaps.pptx**. Los productos se almacenan en un **Trie**, se buscan por prefijo y un **Max Heap** selecciona los Top K más populares. Las dos estructuras están implementadas en JavaScript. React permite probarlas y ver su funcionamiento.

Rama independiente: `codex/challenge-11-trie-heap`.

## Ejecutar en Windows

Necesitas Git y Node.js 22.12 o superior. Dentro del repositorio:

```powershell
git switch codex/challenge-11-trie-heap
npm.cmd ci
npm.cmd run dev
```

Abre [http://127.0.0.1:5173/](http://127.0.0.1:5173/). Detén el servidor con `Ctrl + C` en su terminal. Para encenderlo otro día, vuelve a esta carpeta y ejecuta `npm.cmd run dev`. Antes de cambiar de rama, detén el servidor; después reinstala las dependencias con `npm.cmd ci`.

```powershell
npm.cmd test
npm.cmd run build
```

Las 16 pruebas comprueban las estructuras y su integración. La compilación genera los archivos de producción en `dist`. El proyecto usa React 19 y Vite 7, con las versiones concretas registradas en `package-lock.json`.

## Ejemplo exacto de la clase

```js
{ name: 'air max', popularity: 90 }
{ name: 'air force', popularity: 95 }
{ name: 'air jordan', popularity: 85 }
{ name: 'adidas boost', popularity: 80 }
```

```js
buscador.searchTopK('air', 2);
// [
//   { name: 'air force', popularity: 95 },
//   { name: 'air max', popularity: 90 }
// ]
```

K significa cuántos resultados queremos como máximo. Aquí hay tres productos con el prefijo `air`, pero K = 2 entrega únicamente los dos de mayor popularidad.

## Demostración en clase

1. La aplicación abre buscando `air` con K = 2. Muestra `air force` (95) y `air max` (90).
2. Escribe `ad`: aparece `adidas boost`. Escribe `max`: no hay resultados, porque buscamos el comienzo del nombre, no fragmentos internos.
3. Borra el prefijo y cambia K a 10. Aparecen los cuatro productos, por popularidad descendente.
4. Vuelve a `air`, K = 2. Añade `air zoom` con popularidad 98. Aparece primero, seguido de `air force`.
5. Prueba a añadir ` AIR ZOOM `: se rechaza el duplicado. Mayúsculas y espacios externos no crean un producto distinto.
6. Mira el recorrido del Trie y el árbol del Heap. El Heap dibujado es una copia **anterior a la extracción**; cada búsqueda construye uno nuevo, por lo que no consume los productos del catálogo.
7. Un K vacío, 0, negativo, decimal o mayor de 100 muestra un mensaje. Si K supera las coincidencias, se entregan todas las disponibles.
8. **Restaurar ejemplo** vuelve a los cuatro productos iniciales. Recargar hace lo mismo: este ejercicio usa memoria, sin base de datos.

## El Trie: filtrar por letras

Un Trie comparte el recorrido de las palabras que comienzan igual. Sus nodos tienen un mapa de hijos por carácter y, cuando termina un nombre, una referencia al producto.

```text
raíz
└─ a
   ├─ i → r → espacio
   │                  ├─ m → a → x             [air max, 90]
   │                  ├─ f → o → r → c → e     [air force, 95]
   │                  └─ j → o → r → d → a → n [air jordan, 85]
   └─ d → i → d → a → s → espacio → b → o → o → s → t
                                                   [adidas boost, 80]
```

Para buscar `air`, recorremos `a`, `i` y `r`. Después exploramos el subárbol que empieza allí para recoger los productos coincidentes. Si no existe una letra, la búsqueda termina sin coincidencias. El producto se marca al final de su nombre: almacenar `air` y `air max` simultáneamente también funciona.

`buscarPrefijo('')` empieza en la raíz y devuelve todo el catálogo. `recorrerPrefijo()` proporciona las letras visitadas para la explicación visual; no representa el árbol completo.

Los nombres se recortan, se normalizan a Unicode NFC y se comparan en minúsculas. Los acentos se conservan: `ár` y `ar` son prefijos distintos. Los espacios dentro del nombre también forman parte del recorrido.

## El Max Heap: escoger por prioridad

El Heap es un árbol binario completo almacenado en un arreglo. Para un índice `i`:

```js
padre = Math.floor((i - 1) / 2);
izquierda = 2 * i + 1;
derecha = 2 * i + 2;
```

Cada padre tiene una prioridad igual o mayor que sus hijos. La raíz contiene el producto con mayor popularidad. **El arreglo completo no está necesariamente ordenado**, y un hermano no necesita superar al otro.

El constructor copia las coincidencias y reorganiza los padres desde abajo hacia arriba. `extraerMaximo()` retira la raíz, lleva el último elemento a su lugar y lo baja intercambiándolo con el hijo de mayor prioridad. Al repetir la extracción obtenemos el ranking.

Si hay empate de popularidad, se compara el nombre normalizado por sus caracteres y sale primero el menor. Es una regla determinista de esta implementación, no un orden alfabético lingüístico.

Ejemplo de Heap inicial para `air`:

```text
          air force (95)
          /            \
 air jordan (85)    air max (90)
```

La primera extracción devuelve 95. La segunda devuelve 90. El dibujo usa los índices reales de `heapInicial`; si hay más de 15 coincidencias, dibuja solo los primeros 15 nodos y lo indica. El algoritmo utiliza todas las coincidencias.

## Integración de las estructuras

`src/buscador.js` contiene la clase `Buscador`:

1. `agregar(producto)` inserta un producto validado en el Trie.
2. `buscar(prefijo, k)` obtiene coincidencias del Trie.
3. Construye un Max Heap con esas coincidencias y guarda una copia para visualizarlo.
4. Extrae como máximo K productos.
5. Devuelve candidatos, recorrido, Heap inicial y resultados a React.

`searchTopK(prefijo, k)` devuelve únicamente el arreglo de resultados, como pide el ejercicio. No se usa `Array.sort()` para resolver el ranking.

### Validaciones y protección de datos

- Nombre entre 1 y 60 caracteres, sin estar vacío después de recortar.
- Popularidad entera, no negativa y dentro del rango seguro de números de JavaScript. Es un puntaje de ejemplo: no se limita a 100 ni significa necesariamente un porcentaje.
- Nombres duplicados rechazados después de normalizar.
- K entero entre 1 y 100; límite de esta demostración.
- Los productos se guardan como objetos inmutables. Las listas devueltas son nuevas y construir o consumir el Heap no modifica el catálogo.

## Costos

Sea `L` la longitud del nombre insertado, `P` la del prefijo, `S` los nodos recorridos dentro del subárbol coincidente, `M` los productos encontrados y `R = min(K, M)`. Considerando Map de acceso esperado constante y nombres de longitud acotada:

| Operación | Costo |
| --- | --- |
| Insertar un nombre en Trie | O(L) |
| Encontrar y recoger coincidencias | O(P + S) |
| Construir Heap desde las M coincidencias | O(M) |
| Insertar o extraer un elemento del Heap | O(log M) |
| Obtener los R resultados | O(R log M) |
| Búsqueda completa | O(P + S + M + R log M) |
| Espacio adicional para candidatos, Heap y resultados | O(S + M + R) |

El Trie ocupa espacio proporcional a los caracteres de los nombres, compartiendo prefijos. Esta implementación construye un Max Heap con todos los candidatos: no es el algoritmo alternativo de mantener un Min Heap de tamaño K.

## Archivos

| Archivo | Función |
| --- | --- |
| `src/estructuras/Trie.js` | Inserción y búsquedas por prefijo |
| `src/estructuras/MaxHeap.js` | Construcción, inserción y extracción de máximos |
| `src/buscador.js` | Comparador, integración y datos de la clase |
| `src/App.jsx` | Buscador, ranking, visualizaciones, formulario y catálogo |
| `tests/buscador.test.js` | 16 pruebas automáticas |
| `PRUEBAS.md` | Comprobaciones realizadas |

## Referencias

- Material de clase: **Clase 11 - Tries_n_Heaps.pptx**, diapositiva 21, Challenge11.
- [Rama del Challenge 11 en GitHub](https://github.com/camilovillota16-stack/Challeng-de-cada-clase/tree/codex/challenge-11-trie-heap).
- [Índice de todos los ejercicios](https://github.com/camilovillota16-stack/Challeng-de-cada-clase).
