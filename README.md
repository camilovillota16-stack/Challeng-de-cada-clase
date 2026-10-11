# Challenge 09 — Árbol n-ario de menús

Aplicación React con JavaScript que genera un menú lateral desde un árbol n-ario. Cada nodo guarda título, enlace y una función componente de React. El menú permite navegar, expandir y contraer submenús.

Rama: `codex/challenge-09-arbol-nario`.

## Enunciado

Challenge 09 de **Clase 09 - Árboles**, diapositiva 24: crear un proyecto React, llenar un árbol n-ario con menús y submenús, guardar título, enlace y componente en cada opción y generar un menú lateral en pantalla desde ese árbol.

## Ejecutar en Windows

Requiere Node.js 22.12 o superior. Verificado con Node.js 24.

```powershell
git clone https://github.com/camilovillota16-stack/Challeng-de-cada-clase.git
cd Challeng-de-cada-clase
git switch codex/challenge-09-arbol-nario
npm.cmd install
npm.cmd run dev
```

Si ya tienes la carpeta, omite clone. Antes de cambiar de rama detén el servidor anterior con `Ctrl+C`. Abre **http://127.0.0.1:5173/** y mantén abierta la terminal. Otro día se enciende con `npm.cmd run dev`. Si el puerto está ocupado, detén el servidor anterior o usa `npm.cmd run dev -- --port 5174`.

## Prueba guiada

1. Selecciona **Académico**, luego **Mis materias** y después **Estructuras de Datos II**.
2. Observa la ruta superior: Campus / Académico / Mis materias / Estructuras de Datos II. Se genera siguiendo las referencias parent del nodo seleccionado.
3. Revisa la sección **Título, enlace y componente**. Muestra el título, `/academico/materias/estructuras`, el componente `Estructuras` y cero hijos directos.
4. Pulsa el botón de contraer Académico. Sus submenús se ocultan, pero la pantalla seleccionada se conserva. Vuelve a expandirlo con el botón +.
5. Selecciona **Biblioteca** en Recursos. Se carga otro componente y cambia la ruta superior.
6. Cambia entre **DFS** y **BFS**. DFS explora una rama completa; BFS visita los nodos por niveles.
7. Usa Atrás y Adelante del navegador. La ruta y el componente se recuperan mediante el fragmento de la URL.
8. Recarga una página profunda. Se conserva la selección porque el enlace sigue en la URL; las ramas se abren en su estado inicial.

Las páginas contienen ejemplos ficticios. El ejercicio no usa base de datos ni modifica configuraciones del computador.

## Estructura del árbol

Hay 15 nodos contando la raíz Campus. La raíz no se dibuja como opción lateral, por eso el menú muestra **14 opciones**. La rama más profunda tiene cuatro niveles, contando la raíz.

```text
Campus
├── Inicio
├── Académico
│   ├── Mis materias
│   │   ├── Estructuras de Datos II
│   │   └── Desarrollo Web
│   ├── Agenda
│   └── Calificaciones
├── Recursos
│   ├── Biblioteca
│   ├── Guías de estudio
│   └── Ejercicios
└── Mi espacio
    ├── Mi perfil
    └── Preferencias
```

Un nodo n-ario guarda un arreglo `children`, así que puede tener más de dos hijos. En este ejemplo, Campus tiene cuatro. Cada nodo también guarda `parent`, que permite reconstruir el camino hasta la raíz.

```js
{
  title: 'Biblioteca',
  link: '/recursos/biblioteca',
  component: pages.Biblioteca
}
```

`component` contiene la función de React, no solo su nombre. Al seleccionar el nodo, App obtiene esa función y renderiza `<Component />`.

## Cómo se genera el menú

`crearMenu` construye el árbol mediante llamadas a `addChild`. App empieza en los hijos de la raíz. El componente recursivo `RamaMenu` dibuja un enlace y, si tiene hijos y está expandido, vuelve a invocarse para cada hijo. No mantiene una lista lateral diferente al árbol.

El estado `expanded` contiene los enlaces de las ramas abiertas. Contraer una rama cambia su presentación, sin eliminar sus nodos. Los recorridos DFS y BFS siguen mostrando el árbol completo aunque algunos submenús estén ocultos.

Los enlaces usan rutas como `#/recursos/biblioteca`. El evento `hashchange` actualiza la selección y `tree.find` encuentra el nodo que corresponde a esa ruta. Una ruta desconocida muestra Página no encontrada y permite volver al inicio.

## Métodos y costos

| Método | Función | Tiempo |
| --- | --- | --- |
| `dfs()` | Visita nodo y luego cada subárbol | O(n) |
| `bfs()` | Visita nivel por nivel con una cola representada por arreglo e índice | O(n) |
| `find(link)` | Busca un nodo entre los resultados de DFS | O(n) |
| `addChild(parentLink, value)` | Encuentra el padre, valida enlace único y conecta el hijo | O(n) |
| `pathTo(link)` | Busca el nodo, sigue parent y devuelve el camino desde la raíz | O(n + h) |
| `size()` | Cuenta los resultados del recorrido | O(n) |
| `height()` | Calcula el máximo número de niveles | O(n) |

n es el número de nodos y h la altura. DFS usa una pila de llamadas de profundidad O(h), más el arreglo de resultados O(n). BFS utiliza O(n) espacio para pendientes y resultados. El menú recursivo dibuja únicamente los nodos visibles. La altura usa niveles: raíz sola equivale a uno.

## Validaciones

Cada nodo necesita título no vacío, ruta interna y componente función. `ArbolNario.addChild` impide enlaces duplicados y padres inexistentes. `NodoMenu.addChild` impide ciclos y reutilizar un nodo que ya tiene padre. Los nodos se construyen a través de estos métodos para conservar las reglas del árbol.

## Archivos

| Archivo | Responsabilidad |
| --- | --- |
| `src/estructuras/ArbolNario.js` | Nodos, padres, hijos, búsqueda y recorridos |
| `src/menu.js` | Construcción del árbol y relación de rutas con componentes |
| `src/pages.jsx` | Componentes de las catorce páginas de ejemplo |
| `src/App.jsx` | Menú recursivo, rutas, breadcrumbs y selección de componentes |
| `src/styles.css` | Diseño para computador y teléfono |
| `tests/menu.test.js` | Reglas del árbol, recorridos y metadatos del menú |
| `PRUEBAS.md` | Resultados de la comprobación |

```powershell
npm.cmd test
npm.cmd run build
```

`npm.cmd run preview` sirve la compilación en http://127.0.0.1:4173/.

## Referencias

- Clase 09 - Árboles, Challenge 09, diapositiva 24.
- React y listas de componentes: https://react.dev/learn/rendering-lists
- Repositorio: https://github.com/camilovillota16-stack/Challeng-de-cada-clase/tree/codex/challenge-09-arbol-nario

Esta rama contiene únicamente el Challenge 09. Los anteriores se conservan en sus ramas; el índice está en `main`.
