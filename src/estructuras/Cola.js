class Nodo {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

/** Cola FIFO con nodos: enqueue al final y dequeue al principio. */
export class Cola {
  #first = null;
  #last = null;
  #length = 0;

  enqueue(value) {
    const node = new Nodo(value);
    if (this.#last) this.#last.next = node;
    else this.#first = node;
    this.#last = node;
    this.#length += 1;
    return this.#length;
  }

  dequeue() {
    if (this.isEmpty()) return null;
    const node = this.#first;
    this.#first = node.next;
    this.#length -= 1;
    if (this.isEmpty()) this.#last = null;
    node.next = null;
    return node.value;
  }

  peek() { return this.#first ? this.#first.value : null; }
  isEmpty() { return this.#length === 0; }
  size() { return this.#length; }

  print() {
    const values = [];
    let node = this.#first;
    while (node) {
      values.push(node.value);
      node = node.next;
    }
    return values;
  }
}
