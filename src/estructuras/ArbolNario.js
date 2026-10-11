export class NodoMenu {
  constructor(value) {
    if (!value || typeof value.title !== 'string' || !value.title.trim()) throw new Error('Cada menú necesita un título.');
    if (typeof value.link !== 'string' || !/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(value.link)) throw new Error('El enlace debe ser una ruta interna válida.');
    if (typeof value.component !== 'function') throw new Error('Cada menú necesita un componente.');
    this.value = { ...value, title: value.title.trim() };
    this.children = [];
    this.parent = null;
  }

  addChild(child) {
    if (!(child instanceof NodoMenu)) throw new Error('El hijo debe ser un NodoMenu.');
    let ancestor = this;
    while (ancestor) {
      if (ancestor === child) throw new Error('No se permiten ciclos en el árbol.');
      ancestor = ancestor.parent;
    }
    if (child.parent) throw new Error('El nodo ya tiene un padre.');
    child.parent = this;
    this.children.push(child);
    return child;
  }

  isLeaf() { return this.children.length === 0; }
}

export class ArbolNario {
  constructor(value) { this.root = new NodoMenu(value); }

  // DFS visita un nodo y luego explora cada subárbol en orden.
  dfs() {
    const nodes = [];
    function visit(node) {
      nodes.push(node);
      for (const child of node.children) visit(child);
    }
    visit(this.root);
    return nodes;
  }

  // BFS visita por niveles. El índice evita desplazar un arreglo con shift().
  bfs() {
    const pending = [this.root];
    const nodes = [];
    for (let index = 0; index < pending.length; index += 1) {
      const node = pending[index];
      nodes.push(node);
      pending.push(...node.children);
    }
    return nodes;
  }

  find(link) { return this.dfs().find(node => node.value.link === link) ?? null; }

  addChild(parentLink, value) {
    const parent = this.find(parentLink);
    if (!parent) throw new Error('No existe el menú padre.');
    const child = new NodoMenu(value);
    if (this.find(child.value.link)) throw new Error('El enlace ya existe en el árbol.');
    return parent.addChild(child);
  }

  pathTo(link) {
    const path = [];
    let node = this.find(link);
    while (node) { path.push(node); node = node.parent; }
    return path.reverse();
  }

  size() { return this.dfs().length; }

  // Raíz sola = un nivel.
  height() {
    function levels(node) {
      return 1 + (node.isLeaf() ? 0 : Math.max(...node.children.map(levels)));
    }
    return levels(this.root);
  }
}
