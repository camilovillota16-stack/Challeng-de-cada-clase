# Challenge 05 — Cola de personas en un cajero

Aplicación React con JavaScript que muestra una cola FIFO de personas, con nombre, monto de retiro y fecha de llegada asignada aleatoriamente por el sistema.

Rama: `codex/challenge-05-colas`.

## Enunciado

Challenge 05 de **Clase 06 - Pilas y Colas**, diapositiva 13: crear y manejar una cola de personas en un cajero, cargar datos de ejemplo, permitir agregar personas mediante un formulario React y mostrar la cola según su fecha de llegada. Cada persona tiene nombre, monto de retiro y fecha de llegada aleatoria.

## Encender en Windows

Requiere Node.js 22.12 o superior. Se comprobó con Node.js 24.

```powershell
git clone https://github.com/camilovillota16-stack/Challeng-de-cada-clase.git
cd Challeng-de-cada-clase
git switch codex/challenge-05-colas
npm.cmd install
npm.cmd run dev
```

Si ya tienes la carpeta, omite clone y entra a ella. Antes de cambiar de rama detén el servidor anterior con `Ctrl+C`.

Abre **http://127.0.0.1:5173/**. Mantén abierta la terminal. Para apagar el servidor pulsa `Ctrl+C`; otro día lo enciendes con `npm.cmd run dev` en esta carpeta. Si el puerto está ocupado, detén el servidor anterior o usa `npm.cmd run dev -- --port 5174`.

## Probar en pantalla

1. La cola comienza con Ana, Bruno y Camila. Su orden puede cambiar entre recargas porque las fechas se generan aleatoriamente.
2. Observa que las fechas avanzan de la más antigua a la más reciente. La primera persona aparece como **Próximo en pasar**.
3. Agrega una persona con monto `75000` o `75000,50`. El sistema asigna su llegada dentro de la última hora y la ubica según esa fecha.
4. Pulsa **Atender siguiente**. Sale la primera persona; se muestran sus datos y aumenta el contador de atendidas.
5. Sigue atendiendo hasta vaciar la cola. Se desactiva el botón.
6. Agrega otra persona para comprobar que una cola vacía puede usarse de nuevo.
7. Recargar recupera tres personas de ejemplo con fechas nuevas. Los cambios no se conservan; el ejercicio trabaja en memoria y no usa base de datos.

## FIFO y las fechas aleatorias

**FIFO** significa *First In, First Out*: primero en entrar, primero en salir.

```text
enqueue(A), enqueue(B), enqueue(C)
Primero → A → B → C → null
dequeue() devuelve A; después B y después C.
```

La clase Cola conserva ese orden. Usa nodos con `value` y `next`, referencias privadas al primero y al último, y un contador. `enqueue` enlaza al final; `dequeue` retira al principio. No usa `shift()` para mover un arreglo completo.

El enunciado exige llegadas aleatorias. Estas representan una simulación, por lo que pueden generarse fuera de orden: alguien registrado después podría tener una hora de llegada anterior. La función `organizarPorLlegada` ordena los datos por fecha y luego los incorpora a una nueva Cola mediante `enqueue`. En fechas iguales, desempata por el orden de registro.

Al agregar una persona se reconstruye la cola pendiente con ese criterio. Las personas ya atendidas no se reincorporan. En una cola real que recibe llegadas en tiempo real y en orden, bastaría encolar directamente al final.

Esta preparación se mantiene fuera de la clase Cola. La atención usa exclusivamente `dequeue`, que devuelve a quien está primero, sin buscar ni seleccionar una persona intermedia.

## Métodos y costo

| Método | Función | Costo |
| --- | --- | --- |
| `enqueue(persona)` | Enlaza un nodo al final | O(1) |
| `dequeue()` | Retira el primero; null si está vacía | O(1) |
| `peek()` | Consulta el primero sin retirarlo | O(1) |
| `size()` | Devuelve el contador | O(1) |
| `isEmpty()` | Comprueba si el contador es cero | O(1) |
| `print()` | Recorre los nodos y devuelve una copia para la pantalla | O(n) |

Ordenar las llegadas simuladas cuesta O(n log n), y construir la cola ordenada cuesta O(n). Atender requiere O(1) para retirar el nodo y O(n) para producir la copia que muestra React, además del renderizado. La estructura almacena O(n) nodos.

## Conexión con React

`queueRef` conserva la instancia de Cola. Después de agregar o atender, se actualiza el estado `people` con `print()` para que React dibuje las filas.

```js
const person = queueRef.current.dequeue();
setPeople(queueRef.current.print());
```

El arreglo devuelto por `print` sirve para presentar la cola; sus nodos mantienen el orden real. Los cambios a la estructura ocurren en los eventos del formulario y del botón.

## Datos y validaciones

El nombre es obligatorio y admite hasta 100 caracteres. El monto debe ser positivo, sin separadores de miles y con máximo dos decimales; admite coma o punto decimal. Se convierte a centavos enteros para evitar errores de redondeo al validar. Se rechazan montos que exceden el rango entero seguro de JavaScript.

Cada persona recibe un identificador interno único, un número de registro y una fecha entre una hora antes del registro y el instante anterior a ese registro. El usuario no escribe la fecha. Las horas se muestran en la zona America/Bogota. Nombres iguales corresponden a registros diferentes.

## Archivos y comprobación

| Archivo | Responsabilidad |
| --- | --- |
| `src/estructuras/Cola.js` | Nodos y operaciones FIFO |
| `src/personas.js` | Validación, fechas aleatorias y orden previo a la cola |
| `src/App.jsx` | Formulario y atención del siguiente |
| `src/styles.css` | Diseño adaptable |
| `tests/cola.test.js` | Orden, fechas, montos y casos límite |
| `PRUEBAS.md` | Evidencia de las comprobaciones |

```powershell
npm.cmd test
npm.cmd run build
```

`npm.cmd run preview` sirve la compilación en http://127.0.0.1:4173/.

## Referencias

- Clase 06 - Pilas y Colas, Challenge 05, diapositiva 13.
- React: https://react.dev/reference/react/useRef
- Repositorio: https://github.com/camilovillota16-stack/Challeng-de-cada-clase/tree/codex/challenge-05-colas

Esta rama contiene únicamente el Challenge 05. Los ejercicios anteriores se conservan en sus ramas y el índice está en `main`.
