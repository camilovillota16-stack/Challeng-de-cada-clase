export class Nodo {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
  isLeaf() { return this.left === null && this.right === null; }
}

function validarNumero(value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER) {
    throw new Error('Usa un número finito dentro del rango seguro de JavaScript.');
  }
}

export class ArbolBinario {
  constructor() { this.root = null; this.length = 0; }

  insert(value) {
    validarNumero(value);
    if (!this.root) {
      this.root = new Nodo(value);
      this.length += 1;
      return true;
    }
    let node = this.root;
    while (node) {
      if (node.value === value) return false;
      const side = value < node.value ? 'left' : 'right';
      if (node[side]) node = node[side];
      else {
        node[side] = new Nodo(value);
        this.length += 1;
        return true;
      }
    }
  }

  search(value) {
    validarNumero(value);
    const path = [];
    let node = this.root;
    while (node) {
      path.push(node.value);
      if (node.value === value) return { found: true, path };
      node = value < node.value ? node.left : node.right;
    }
    return { found: false, path };
  }

  contains(value) { return this.search(value).found; }
  size() { return this.length; }

  // Preorden: nodo, izquierda, derecha.
  preorder() {
    const values = [];
    function visit(node) {
      if (!node) return;
      values.push(node.value); visit(node.left); visit(node.right);
    }
    visit(this.root);
    return values;
  }

  // Inorden: izquierda, nodo, derecha.
  inorder() {
    const values = [];
    function visit(node) {
      if (!node) return;
      visit(node.left); values.push(node.value); visit(node.right);
    }
    visit(this.root);
    return values;
  }

  // Postorden: izquierda, derecha, nodo.
  postorder() {
    const values = [];
    function visit(node) {
      if (!node) return;
      visit(node.left); visit(node.right); values.push(node.value);
    }
    visit(this.root);
    return values;
  }

  // Se cuenta por niveles: árbol vacío 0; raíz sola 1.
  height() {
    function depth(node) { return node ? 1 + Math.max(depth(node.left), depth(node.right)) : 0; }
    return depth(this.root);
  }
}
