# Challenge 04 — Pila de libros

Proyecto React con JavaScript para agregar y retirar libros usando una pila LIFO. Rama de entrega: `codex/challenge-04-pilas`.

## Enunciado

El Challenge 04, diapositiva 7 de **Clase 06 - Pilas y Colas**, pide una pila de libros con nombre, ISBN, autor y editorial, datos de ejemplo, un formulario React para agregar libros y la pila visible en pantalla.

La aplicación comienza con tres libros ficticios. El formulario agrega otro al tope. También permite retirar el tope para demostrar LIFO, consultar el próximo libro en salir y ver el último retirado.

## Encender en Windows

Requiere Node.js 22.12 o superior. Se verificó con Node.js 24.

En una copia nueva del repositorio:

```powershell
git clone https://github.com/camilovillota16-stack/Challeng-de-cada-clase.git
cd Challeng-de-cada-clase
git switch codex/challenge-04-pilas
npm.cmd install
npm.cmd run dev
```

Si ya tienes la copia local, detén el servidor anterior con `Ctrl+C` antes de cambiar de rama:

```powershell
git switch codex/challenge-04-pilas
npm.cmd install
npm.cmd run dev
```

Abre **http://127.0.0.1:5173/** y mantén abierta la terminal. Para encenderlo otro día, ejecuta `npm.cmd run dev` desde esta carpeta. Para apagarlo pulsa `Ctrl+C`. Si el puerto 5173 está ocupado, detén el servidor anterior o usa `npm.cmd run dev -- --port 5174`.

## Demostrar LIFO

1. Observa que el último libro de ejemplo agregado, **Pequeñas ideas en JavaScript**, está en el tope.
2. Completa el formulario con un libro de prueba. Puedes usar ISBN `978-0-000000-04-0`, autor `Autor de prueba` y editorial `Editorial de prueba`.
3. Pulsa **Agregar al tope**. El libro aparece primero y el contador sube de 3 a 4.
4. Pulsa **Retirar libro del tope**. Sale el que acabas de agregar y el contador vuelve a 3.
5. Retira los demás. Salen Pequeñas ideas en JavaScript, El lenguaje de los nodos y Un mapa de algoritmos, en ese orden.
6. Al quedar vacía se muestra un aviso y se desactiva el botón de retirar.
7. Agrega otro libro para comprobar que la pila se puede usar otra vez.

Recargar la página recupera los tres libros iniciales. Este ejercicio trabaja en memoria y no usa base de datos.

## Explicación de la estructura

**LIFO** significa *Last In, First Out*: el último en entrar es el primero en salir.

```text
push(A), push(B), push(C)

Tope: C
      B
Base: A

pop() devuelve C, después B y después A.
```

La clase `Pila` guarda sus elementos en un arreglo privado `#items`. El último elemento del arreglo representa el tope. Usa los métodos nativos `push` y `pop`, como permite el material de clase, y agrega los demás métodos de consulta.

| Método | Efecto | Costo de la estructura |
| --- | --- | --- |
| `push(libro)` | Agrega un libro al final interno, que es el tope | O(1) amortizado |
| `pop()` | Retira y devuelve el último; devuelve null si está vacía | O(1) |
| `peek()` | Devuelve el último sin retirarlo | O(1) |
| `isEmpty()` | Indica si no quedan elementos | O(1) |
| `size()` | Devuelve la cantidad de elementos | O(1) |
| `print()` | Devuelve una copia desde el tope hacia la base | O(n) |

`print()` usa una copia antes de invertir el orden. Así se muestra el tope arriba sin alterar el arreglo original ni cambiar qué libro retirará `pop()`.

## Conexión con React

`stackRef` conserva la instancia de `Pila`. Los botones llaman a los métodos de esa instancia y después actualizan el estado `books` con el resultado de `print()`. React vuelve a dibujar la pila con esa copia. Las actualizaciones de la estructura se realizan en los eventos del formulario y del botón.

```js
stackRef.current.push(book);
setBooks(stackRef.current.print());
```

La estructura decide el orden. React presenta el resultado. Aunque `push` cuesta O(1) amortizado, producir la copia para la pantalla cuesta O(n), además del trabajo de renderizado.

## Validaciones

Los cuatro campos son obligatorios. Se eliminan espacios al principio y al final, y cada campo admite hasta 150 caracteres. El ISBN acepta 13 dígitos o 10 caracteres con posible X al final. Se pueden escribir separadores, que se eliminan al guardar. Se valida el formato, sin verificar su dígito de control ni consultar un catálogo real.

Se permiten varios ejemplares con el mismo ISBN. Cada libro agregado recibe un identificador interno diferente para dibujar cada ejemplar en React.

## Archivos

| Archivo | Contenido |
| --- | --- |
| `src/estructuras/Pila.js` | Clase y métodos de la pila |
| `src/libros.js` | Libros ficticios y validación del formulario |
| `src/App.jsx` | Formulario, pila visible y eventos |
| `src/styles.css` | Diseño para computador y teléfono |
| `tests/pila.test.js` | Orden LIFO, consultas y validaciones |
| `PRUEBAS.md` | Resultados de la comprobación |

## Comprobar el proyecto

```powershell
npm.cmd test
npm.cmd run build
```

La compilación crea `dist/`. `npm.cmd run preview` permite revisarla en http://127.0.0.1:4173/.

## Referencias

- Clase 06 - Pilas y Colas, Challenge 04, diapositiva 7.
- React useRef: https://react.dev/reference/react/useRef
- React useState: https://react.dev/reference/react/useState
- Repositorio: https://github.com/camilovillota16-stack/Challeng-de-cada-clase/tree/codex/challenge-04-pilas

El índice de todos los challenges está en `main`. Esta rama contiene únicamente el ejercicio de pilas; el Challenge 03 sigue en `codex/challenge-03-listas`.
