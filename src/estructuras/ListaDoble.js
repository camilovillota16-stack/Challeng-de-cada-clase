export class NodoDoble {
  constructor(value) {
    this.value = value;
    this.previous = null;
    this.next = null;
  }
}

export class ListaDoble {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value) {
    const node = new NodoDoble(value);
    node.previous = this.tail;
    if (this.tail) this.tail.next = node;
    else this.head = node;
    this.tail = node;
    this.length += 1;
    return node;
  }

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
    if (node.previous) node.previous.next = node.next;
    else this.head = node.next;
    if (node.next) node.next.previous = node.previous;
    else this.tail = node.previous;
    this.length -= 1;
    node.previous = null;
    node.next = null;
    return node.value;
  }

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
