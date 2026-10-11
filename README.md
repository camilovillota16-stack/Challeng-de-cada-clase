# Challenge 10 · Grafo de personas y ciudades

**Harold Camilo Villota Ortiz · Código 2240680**
Estructuras de Datos II · JavaScript y React

Solución del Challenge10 de la diapositiva 8 de **Clase 10 - Grafos.pptx**. Cada persona y cada ciudad es un nodo. Las personas tienen nombre, edad y referencia a una ciudad. La aplicación muestra el grafo con **react-d3-graph** y lista las personas que viven en la ciudad seleccionada. También permite registrar personas, ciudades y amistades.

Esta entrega está en `codex/challenge-10-grafos`. Las ramas de los demás ejercicios son independientes.

## Ejecutar en Windows

Necesitas Node.js 22.12 o superior y Git. Abre la terminal dentro del repositorio:

```powershell
git switch codex/challenge-10-grafos
npm.cmd ci
npm.cmd run dev
```

Abre [http://127.0.0.1:5173/](http://127.0.0.1:5173/). Para detener el servidor, pulsa `Ctrl + C` en su terminal. Para encenderlo otro día, vuelve a esa carpeta y ejecuta `npm.cmd run dev`. Al cambiar de rama, detén primero el servidor y reinstala con `npm.cmd ci`: cada ejercicio puede tener dependencias distintas.

```powershell
npm.cmd test
npm.cmd run build
```

`test` ejecuta las pruebas de la estructura y del adaptador visual. `build` genera la aplicación de producción en `dist`.

### Versiones compatibles

Esta rama usa React y ReactDOM **16.14.0**, D3 **5.16.0** y react-d3-graph **2.6.0**, respetando las dependencias compatibles declaradas por la biblioteca que exige el ejercicio. El montaje utiliza `ReactDOM.render`, correspondiente a esta versión. No se necesita `--force` ni `--legacy-peer-deps`. Vite y su complemento de React se encargan del servidor y la compilación.

## Demostración en clase

1. El ejemplo inicial tiene **6 personas, 3 ciudades, 4 amistades y 10 aristas**. Pasto tiene a Ana y Bruno; Cali, a Camila y Diego; Bogotá, a Elena y Felipe.
2. Cambia **Buscar habitantes por ciudad**. La lista se obtiene consultando los vecinos de ese nodo ciudad.
3. Pulsa un nodo del mapa o el botón de una persona en la lista. Aparecen su nombre, edad, ciudad y amigos, o el número de habitantes si es una ciudad.
4. Añade Medellín: aparece un nodo ciudad y su consulta devuelve una lista vacía.
5. Añade a Lucía, de 26 años, en Medellín: se crea un nodo persona y una arista de residencia. La lista de Medellín muestra a Lucía.
6. Crea una amistad entre Lucía y Ana: se añade una arista azul aunque vivan en ciudades diferentes. Una amistad duplicada o consigo misma muestra un mensaje y no cambia el grafo.
7. **Restaurar ejemplo** regresa a los datos iniciales. Al recargar también se reinician: este ejercicio guarda los datos en memoria y no utiliza base de datos.

Los nombres y las edades iniciales son ficticios. Las ciudades se dibujan arriba y sus habitantes debajo; las posiciones solo organizan el dibujo, no representan distancias geográficas. En un teléfono el mapa tiene desplazamiento horizontal dentro de su panel.

## Qué es el grafo y cómo funciona

Un **nodo** representa una entidad: Ana, Bruno o Pasto. Una **arista** representa una relación entre dos nodos:

| Relación | Ejemplo | Color |
| --- | --- | --- |
| Residencia | Ana ↔ Pasto | Dorado |
| Amistad | Ana ↔ Camila | Azul |

Es un grafo **no dirigido y sin pesos**. La conexión se guarda en ambos sentidos: si Ana es amiga de Camila, Camila también es amiga de Ana. Cada persona tiene exactamente una ciudad, pero puede tener varios amigos. Como hay aristas entre personas, no es bipartito. Tampoco es un árbol: puede formar ciclos.

### Lista de adyacencia

`src/estructuras/Grafo.js` contiene la estructura propia. Utiliza dos mapas privados:

```js
// Conceptualmente:
nodos: Map<id, { id, tipo, nombre, edad?, ciudadId? }>
adyacencia: Map<id, Set<idDeVecino>>
```

El primer mapa conserva la información de los nodos y el segundo sus vecinos. Los conjuntos evitan repetir vecinos. Los IDs son únicos e independientes del nombre: dos personas pueden llamarse Ana sin mezclarse.

Ejemplo de uso real:

```js
const grafo = new Grafo();
const pasto = grafo.agregarCiudad('Pasto');
const cali = grafo.agregarCiudad('Cali');
const ana = grafo.agregarPersona('Ana', 22, pasto);
const camila = grafo.agregarPersona('Camila', 21, cali);
grafo.agregarAmistad(ana, camila);

grafo.habitantes(pasto).map(persona => persona.nombre); // ['Ana']
grafo.amigos(ana).map(persona => persona.nombre);       // ['Camila']
```

`habitantes(ciudadId)` comprueba que sea una ciudad, recorre sus vecinos y devuelve los de tipo persona. No necesita recorrer todas las personas para averiguar dónde viven. `amigos(personaId)` recorre los vecinos de una persona y excluye su ciudad.

`aristas()` emite cada relación una sola vez aunque se guarde en los dos conjuntos. Así no se dibujan dos líneas para una amistad. `cambiarCiudad(personaId, ciudadId)` está disponible en la estructura y probado: sustituye la residencia anterior y conserva las amistades. La interfaz permite crear registros y conexiones; no ofrece formulario de mudanza.

### Validaciones

- Nombres entre 1 y 60 caracteres, recortando espacios externos.
- Edad entera entre 0 y 120; es una regla de esta demostración.
- Cada persona referencia una ciudad existente.
- Ciudades sin duplicados al comparar nombres sin espacios externos ni diferencias de mayúsculas. No se unifican acentos.
- Amistades entre dos personas distintas; se rechazan duplicados incluso invirtiendo el orden.
- Los nodos son inmutables y las consultas devuelven nuevas listas. El adaptador entrega copias a la biblioteca para proteger la estructura.

### Costos de las operaciones

Sea `V` el número de nodos, `E` el de aristas y `grado(n)` la cantidad de vecinos de un nodo. Considerando los costos usuales de Map y Set:

| Operación | Costo esperado |
| --- | --- |
| Buscar nodo por ID | O(1) |
| Añadir persona o amistad | O(1), además de validar el nombre |
| Añadir ciudad | O(V), porque se verifica que el nombre no exista |
| Consultar habitantes o amigos | O(grado(n)) |
| Listar nodos, personas o ciudades | O(V) |
| Exportar todas las aristas | O(V + E) |
| Cambiar residencia | O(1) |
| Almacenamiento de la estructura | O(V + E) |

El adaptador visual recorre ciudades, habitantes y aristas: O(V + E). Los costos de dibujar en React/D3 son adicionales.

## Relación entre estructura e interfaz

1. `crearEjemplo()` construye el grafo usando los mismos métodos que los formularios.
2. React conserva la instancia del grafo. Un contador de versión indica cuándo recalcular la visualización después de una modificación.
3. `datosVisuales()` transforma nodos y aristas a `{ nodes, links }`, el formato de `react-d3-graph`.
4. `<Graph>` dibuja el mapa. `onClickNode` selecciona un nodo para mostrar su información.
5. El selector de ciudad llama a `grafo.habitantes(ciudadId)` y React imprime la lista.

La biblioteca realiza la visualización. La creación, las reglas de las relaciones y las consultas pertenecen a nuestra clase `Grafo`.

## Archivos principales

| Archivo | Responsabilidad |
| --- | --- |
| `src/estructuras/Grafo.js` | Nodos, adyacencia, consultas y validaciones |
| `src/datos.js` | Datos ficticios y adaptador para react-d3-graph |
| `src/App.jsx` | Mapa, consulta, detalles y formularios |
| `src/styles.css` | Diseño y adaptación a pantallas pequeñas |
| `tests/grafo.test.js` | 12 pruebas automáticas de comportamiento |
| `PRUEBAS.md` | Resultados y verificaciones manuales |

## Referencias

- Material de clase: **Clase 10 - Grafos.pptx**, diapositiva 8, Challenge10.
- [Repositorio y guía de react-d3-graph](https://github.com/danielcaldas/react-d3-graph).
- [Documentación de react-d3-graph 2.6.0](https://danielcaldas.github.io/react-d3-graph/docs/index.html).
- [Entrega del challenge en GitHub](https://github.com/camilovillota16-stack/Challeng-de-cada-clase/tree/codex/challenge-10-grafos).
