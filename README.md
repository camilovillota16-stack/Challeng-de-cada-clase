# Challenge 03 — Listas enlazadas

Proyecto de Estructuras de Datos II. Implementa dos pantallas en React con JavaScript: una lista simple de canciones y una lista doble de páginas visitadas.

Rama de entrega: `codex/challenge-03-listas`.

## Enunciado de clase

La diapositiva 18 de **Clase 03 - Listas** pide:

1. Implementar una lista enlazada para reproducir canciones en orden, con datos de ejemplo.
2. Implementar una lista doblemente enlazada para navegar atrás y adelante entre páginas visitadas, con datos ficticios.
3. Crear un proyecto React con dos páginas y botones para recorrer las listas.

Las canciones, artistas y páginas de esta aplicación son ficticios. El reproductor simula la duración y avanza automáticamente por la lista; no reproduce archivos de audio.

## Ejecutar en Windows

Requiere Node.js 22.12 o superior. Se verificó con Node.js 24.

Si todavía no tienes el repositorio:

```bash
git clone https://github.com/camilovillota16-stack/Challeng-de-cada-clase.git
cd Challeng-de-cada-clase
git switch codex/challenge-03-listas
npm install
npm run dev
```

Si ya tienes esta carpeta, abre una terminal allí y ejecuta:

```bash
git switch codex/challenge-03-listas
npm install
npm run dev
```

Abre **http://127.0.0.1:5173/**. Mantén abierta la terminal mientras usas la aplicación. Para apagar el servidor pulsa `Ctrl+C`. Para encenderlo otro día, vuelve a ejecutar `npm run dev` en esta carpeta. `npm install` se repite si faltan las dependencias o cambia el archivo de dependencias.

Si el puerto 5173 ya está ocupado, detén el servidor anterior o ejecuta `npm run dev -- --port 5174` y abre la dirección que indique la terminal.

```bash
npm test
npm run build
```

`npm test` verifica los enlaces y casos límite de las listas. `npm run build` genera la versión de producción en `dist/`. Para verla usa `npm run preview` y abre http://127.0.0.1:4173/.

## Cómo demostrar el funcionamiento

### Pantalla Canciones

1. Abre **01 Canciones**. La canción actual es Amanecer en Cali, el primer nodo.
2. Pulsa **Reproducir**. El progreso avanza durante 12 segundos y luego pasa automáticamente a A la orilla del río.
3. Pulsa **Pausar** y comprueba que el tiempo se detiene.
4. Pulsa **Siguiente** para recorrer las canciones en orden. El diagrama resalta el nodo actual.
5. En la última canción, **Siguiente** se desactiva porque `next` vale `null`.
6. Pulsa **Volver al inicio**. La referencia actual vuelve a `head` y el reproductor queda en pausa.
7. Si reproduces hasta el final de toda la lista, aparece **Lista terminada**. Vuelve al inicio para reproducir otra vez.

### Pantalla Historial

1. Abre **02 Historial**. La página actual es Mi perfil, la última visita, almacenada en `tail`.
2. Pulsa **Atrás**. Aparece Mis cursos; otro clic muestra Biblioteca y otro Inicio.
3. En Inicio, **Atrás** se desactiva porque `previous` vale `null`.
4. Pulsa **Adelante** para recorrer las mismas páginas en el orden opuesto.
5. En Mi perfil, **Adelante** se desactiva porque `next` vale `null`.
6. **Volver a la última visita** recupera el nodo `tail`.

El navegador simulado muestra las direcciones como texto. No abre sitios externos. Las dos pantallas tienen rutas distintas: `#/canciones` y `#/historial`. Al cambiar de pantalla o recargar se restablecen los datos y la posición de demostración; no se usa base de datos.

## Explicación para estudiar

### Qué es un nodo

Un nodo guarda un valor y referencias a otros nodos. En una lista simple hay dos propiedades:

```js
class Nodo {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
```

`value` contiene la canción. `next` contiene una referencia al siguiente objeto nodo. No contiene el índice de un arreglo. `null` indica que ya no hay otro nodo.

```text
head → Amanecer → Río → Ciudad → Regreso → null
```

La lista conserva `head`, `tail` y `length`. Al agregar una canción, enlaza el último nodo con el nuevo y actualiza `tail`.

### Por qué la lista doble puede retroceder

Cada nodo doble también tiene `previous`, una referencia al nodo anterior:

```text
null ← Inicio ⇄ Biblioteca ⇄ Cursos ⇄ Perfil → null
```

La pantalla usa una referencia `current` que señala la visita actual. Atrás obtiene `current.previous`; Adelante obtiene `current.next`. Cuando una referencia es `null`, el botón se desactiva.

### Cómo se conecta con React

Las clases construyen las listas. Los datos se cargan mediante `append` en `src/data.js`. El componente conserva el nodo actual en estado de React. Al navegar obtiene otro nodo y llama `setCurrent`; React actualiza la pantalla.

En la playlist:

```js
setCurrent(current.next);
```

Las listas no se modifican durante la navegación. `print()` recorre sus nodos y devuelve un arreglo para dibujar las filas. El arreglo sirve para presentar información; el orden y la navegación siguen dependiendo de los enlaces de la lista.

### Métodos y costo

| Método | Función | Costo |
| --- | --- | --- |
| `append(value)` | Agrega un nodo al final usando `tail` | O(1) |
| `peek(index)` | Busca el nodo de una posición desde cero | O(n) en el peor caso |
| `size()` | Devuelve el contador de nodos | O(1) |
| `remove(index)` | Encuentra, retira y reconecta el nodo | O(n) por la búsqueda |
| `print()` | Recorre todos los nodos para mostrarlos | O(n) |
| Seguir `next` o `previous` | Cambia al nodo vecino conocido | O(1) |

La lista simple solo conoce el siguiente nodo. La lista doble usa referencias anteriores y siguientes, lo que permite recorrerla en ambas direcciones a cambio de guardar una referencia adicional por nodo.

## Archivos importantes

| Archivo | Responsabilidad |
| --- | --- |
| `src/estructuras/ListaEnlazada.js` | Nodo simple y lista de canciones |
| `src/estructuras/ListaDoble.js` | Nodo doble y lista de visitas |
| `src/data.js` | Datos ficticios agregados a las listas |
| `src/App.jsx` | Pantallas, navegación y reproducción simulada |
| `src/styles.css` | Diseño adaptable a computador y teléfono |
| `tests/listas.test.js` | Casos vacíos, enlaces, eliminaciones y recorridos |

## Referencias

- Material del curso: Clase 03 - Listas, Challenge 03, diapositiva 18.
- React: https://react.dev/reference/react/useState
- React y actualización de objetos: https://react.dev/learn/updating-objects-in-state
- Vite: https://vite.dev/guide/
- Repositorio: https://github.com/camilovillota16-stack/Challeng-de-cada-clase

El índice de los demás challenges está en la rama `main`. Esta rama corresponde exclusivamente al Challenge 03.
