export class Nodo {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

/** Lista simple. El orden vive en los enlaces entre nodos. */
export class ListaEnlazada {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // La referencia tail permite insertar al final en O(1).
  append(value) {
    const node = new Nodo(value);
    if (this.tail) this.tail.next = node;
    else this.head = node;
    this.tail = node;
    this.length += 1;
    return node;
  }

  // Índices desde cero, como en un arreglo; la búsqueda recorre nodos.
  peek(index = 0) {
    if (!Number.isInteger(index) || index < 0 || index >= this.length) return null;
    let current = this.head;
    for (let i = 0; i < index; i += 1) current = current.next;
    return current;
  }

  size() { return this.length; }

  remove(index) {
    const node = this.peek(index);
    if (!node) return null;
    if (index === 0) this.head = node.next;
    else {
      const previous = this.peek(index - 1);
      previous.next = node.next;
      if (node === this.tail) this.tail = previous;
    }
    this.length -= 1;
    if (this.length === 0) this.tail = null;
    node.next = null;
    return node.value;
  }

  // Solo convertimos a arreglo para dibujar la lista en React.
  print() {
    const values = [];
    let current = this.head;
    while (current) {
      values.push(current.value);
      current = current.next;
    }
    return values;
  }
}
