/** Pila genérica LIFO: el último valor agregado sale primero. */
export class Pila {
  #items = [];

  // Inserta en el tope. El tope está al final del arreglo interno.
  push(value) {
    return this.#items.push(value);
  }

  // Retira y devuelve el tope; una pila vacía devuelve null.
  pop() {
    return this.isEmpty() ? null : this.#items.pop();
  }

  // Consulta el tope sin retirarlo.
  peek() {
    return this.isEmpty() ? null : this.#items[this.#items.length - 1];
  }

  isEmpty() {
    return this.#items.length === 0;
  }

  size() {
    return this.#items.length;
  }

  // Copia desde el tope hacia la base. No modifica el orden interno.
  print() {
    return [...this.#items].reverse();
  }
}
