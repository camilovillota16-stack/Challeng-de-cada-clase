# Challenge 08 — Árbol binario de búsqueda

Proyecto React con JavaScript y **react-d3-tree** para insertar números, buscar un valor y mostrar un árbol binario de búsqueda con recorridos inorden, postorden y preorden.

Rama: `codex/challenge-08-arbol-binario`.

## Enunciado

Challenge 08 de **Clase 09 - Árboles**, diapositiva 18: insertar una serie de números en un árbol nuevo, imprimir los tres recorridos en consola, escribir una función para comprobar si un valor está en el árbol e instalar react-d3-tree para visualizarlo.

## Ejecutar en Windows

Requiere Node.js 22.12 o superior. Verificado con Node.js 24.

```powershell
git clone https://github.com/camilovillota16-stack/Challeng-de-cada-clase.git
cd Challeng-de-cada-clase
git switch codex/challenge-08-arbol-binario
npm.cmd install
npm.cmd run dev
```

Si ya tienes esta carpeta, omite clone. Detén el servidor anterior con `Ctrl+C` antes de cambiar de rama. Abre **http://127.0.0.1:5173/** y mantén abierta la terminal. Otro día se enciende con `npm.cmd run dev` desde esta carpeta. Si el puerto está ocupado, detén el servidor anterior o ejecuta `npm.cmd run dev -- --port 5174`.

## Demostración

1. El ejemplo inserta en orden `50, 30, 70, 20, 40, 60, 80`. La raíz es 50, con 30 a la izquierda y 70 a la derecha.
2. Busca `60`: el resultado es encontrado y el camino visitado es `50 → 70 → 60`. El dibujo distingue los nodos visitados y el encontrado.
3. Busca `65`: el resultado es no encontrado. Visita 50, 70 y 60 antes de alcanzar un hijo ausente.
4. Inserta `25, 65, 50`. Agrega 25 y 65; omite el 50 repetido. El gráfico y los recorridos se actualizan.
5. Pulsa **Imprimir recorridos en consola**. Abre las herramientas del navegador con `F12` y selecciona Consola. Verás las etiquetas Inorden, Postorden y Preorden con sus arreglos. También se imprimen al iniciar y al cambiar la estructura.
6. Pulsa **Vaciar árbol** e inserta `10, 20`. Se crea una raíz 10 y un hijo derecho 20. El símbolo ∅ muestra que no hay hijo izquierdo.
7. **Restablecer ejemplo** recupera los siete nodos iniciales. **Centrar vista** recupera el encuadre del dibujo. Puedes arrastrar el gráfico y usar la rueda para ajustar el zoom.

Los cambios se mantienen en memoria y se restablecen al recargar. React Strict Mode puede imprimir dos veces los recorridos iniciales durante el desarrollo; no inserta valores repetidos en el árbol.

## Regla de inserción y búsqueda

Cada `Nodo` contiene `value`, `left` y `right`. El árbol mantiene una referencia `root` y un contador de nodos.

- Un valor menor que el nodo actual continúa por `left`.
- Un valor mayor continúa por `right`.
- Si es igual, no se inserta otro nodo.
- Cuando el enlace correspondiente es null, se conecta allí el nuevo nodo.

La búsqueda usa las mismas comparaciones, sin recorrer ramas que no pueden contener el número. `contains(value)` devuelve un booleano; `search(value)` devuelve además los valores del camino para mostrarlos en la interfaz.

```js
tree.search(60);
// { found: true, path: [50, 70, 60] }
```

El árbol no se balancea automáticamente. Insertar 1, 2, 3 y 4 crea una cadena hacia la derecha. En el ejemplo inicial está equilibrado por el orden de inserción, sin implementar un árbol AVL.

## Tres recorridos

| Recorrido | Orden de visita | Resultado del ejemplo |
| --- | --- | --- |
| Inorden | Izquierda, nodo, derecha | 20, 30, 40, 50, 60, 70, 80 |
| Postorden | Izquierda, derecha, nodo | 20, 40, 30, 60, 80, 70, 50 |
| Preorden | Nodo, izquierda, derecha | 50, 30, 20, 40, 70, 60, 80 |

Los métodos son recursivos. Cada uno llega hasta un nodo null, retorna y continúa por la otra rama. Inorden produce valores ordenados porque la estructura cumple la propiedad de búsqueda.

## Costos

Con n nodos y altura h:

| Operación | Tiempo |
| --- | --- |
| Insertar o buscar | O(h); O(log n) si está equilibrado y O(n) en el peor caso |
| Cada recorrido | O(n) |
| Contar nodos con el contador | O(1) |
| Calcular altura | O(n) |
| Convertir al formato visual | O(n) |

Los nodos ocupan O(n) espacio. Los recorridos producen un arreglo O(n) y usan una pila de llamadas de profundidad O(h). La altura se muestra por niveles: vacío 0, raíz sola 1.

## Integración con react-d3-tree

Se instaló **react-d3-tree 3.6.7**. La biblioteca dibuja el gráfico, mientras `ArbolBinario` implementa la inserción, búsqueda y recorridos.

La función `aDatosD3` convierte cada nodo al formato de la biblioteca:

```js
{
  name: '50',
  attributes: { value: 50, side: 'Raíz' },
  children: [/* datos del hijo izquierdo y del derecho */]
}
```

El arreglo children conserva izquierda primero y derecha después. Cuando falta un hijo pero existe el otro, se agrega un marcador ∅ para conservar su posición en el dibujo. Ese marcador no pertenece al árbol, no se cuenta y no aparece en los recorridos.

React conserva el árbol en `treeRef`. Después de insertar, actualiza el estado `data` con el adaptador. La búsqueda conserva un resultado separado para resaltar nodos sin cambiar sus enlaces. El dibujo permite mover y acercar la vista para explorar estructuras grandes.

## Validación y archivos

Se aceptan números finitos, positivos, negativos y decimales con punto, dentro del rango seguro de JavaScript. Se separan con comas, espacios o punto y coma. Se valida toda la serie antes de modificar el árbol: una entrada inválida no inserta parcialmente los números anteriores. La búsqueda recibe un solo número. Los repetidos se informan y se omiten.

| Archivo | Responsabilidad |
| --- | --- |
| `src/estructuras/ArbolBinario.js` | Nodos, inserción, búsqueda, altura y recorridos |
| `src/arbol.js` | Datos iniciales, lector de números, adaptador D3 y consola |
| `src/App.jsx` | Formularios y gráfico con react-d3-tree |
| `tests/arbol.test.js` | Reglas del árbol, recorridos y formato visual |
| `PRUEBAS.md` | Resultados de las comprobaciones |

```powershell
npm.cmd test
npm.cmd run build
```

`npm.cmd run preview` sirve la compilación en http://127.0.0.1:4173/.

## Referencias

- Clase 09 - Árboles, Challenge 08, diapositiva 18.
- react-d3-tree: https://github.com/bkrem/react-d3-tree
- Props de la biblioteca: https://bkrem.github.io/react-d3-tree/docs/interfaces/TreeProps.html
- Repositorio: https://github.com/camilovillota16-stack/Challeng-de-cada-clase/tree/codex/challenge-08-arbol-binario

El índice está en `main`. Esta rama contiene únicamente el Challenge 08; los anteriores se conservan en sus ramas.
