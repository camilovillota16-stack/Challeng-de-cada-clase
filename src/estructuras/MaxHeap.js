// El comparador devuelve un positivo si a tiene más prioridad que b.
export class MaxHeap {
  #datos;
  #comparar;
  constructor(comparar, elementos = []) {
    if (typeof comparar !== 'function') throw new Error('El Heap necesita un comparador.');
    this.#comparar = comparar;
    this.#datos = [...elementos];
    // Construcción de abajo hacia arriba: O(n).
    for (let i = Math.floor(this.size / 2) - 1; i >= 0; i--) this.#bajar(i);
  }
  get size() { return this.#datos.length; }
  peek() { return this.#datos[0] ?? null; }
  valores() { return [...this.#datos]; }
  #intercambiar(a, b) {
    [this.#datos[a], this.#datos[b]] = [this.#datos[b], this.#datos[a]];
  }
  insertar(elemento) {
    this.#datos.push(elemento);
    let i = this.size - 1;
    while (i > 0) {
      const padre = Math.floor((i - 1) / 2);
      if (this.#comparar(this.#datos[i], this.#datos[padre]) <= 0) break;
      this.#intercambiar(i, padre); i = padre;
    }
  }
  #bajar(inicio) {
    let i = inicio;
    while (true) {
      const izquierda = 2 * i + 1;
      const derecha = izquierda + 1;
      let mayor = i;
      if (izquierda < this.size && this.#comparar(this.#datos[izquierda], this.#datos[mayor]) > 0) mayor = izquierda;
      if (derecha < this.size && this.#comparar(this.#datos[derecha], this.#datos[mayor]) > 0) mayor = derecha;
      if (mayor === i) break;
      this.#intercambiar(i, mayor); i = mayor;
    }
  }
  extraerMaximo() {
    if (!this.size) return null;
    const maximo = this.#datos[0];
    const ultimo = this.#datos.pop();
    if (this.size) { this.#datos[0] = ultimo; this.#bajar(0); }
    return maximo;
  }
}
