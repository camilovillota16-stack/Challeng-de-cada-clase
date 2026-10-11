import { Trie, normalizar } from './estructuras/Trie.js';
import { MaxHeap } from './estructuras/MaxHeap.js';

export function compararProductos(a, b) {
  if (a.popularity !== b.popularity) return a.popularity - b.popularity;
  const nombreA = normalizar(a.name), nombreB = normalizar(b.name);
  // Empates: primero el nombre menor, comparado por caracteres normalizados.
  return nombreA < nombreB ? 1 : nombreA > nombreB ? -1 : 0;
}

export class Buscador {
  #trie = new Trie();
  agregar(producto) { this.#trie.insertar(producto); }
  get size() { return this.#trie.size; }
  productos() { return this.#trie.buscarPrefijo(''); }

  buscar(prefijo, k) {
    if (!Number.isSafeInteger(k) || k < 1 || k > 100) throw new Error('K debe ser un entero entre 1 y 100.');
    const coincidencias = this.#trie.buscarPrefijo(prefijo);
    const heap = new MaxHeap(compararProductos, coincidencias);
    const heapInicial = heap.valores();
    const resultados = [];
    while (resultados.length < k && heap.size) resultados.push(heap.extraerMaximo());
    return { coincidencias, heapInicial, resultados, pasos: this.#trie.recorrerPrefijo(prefijo) };
  }

  searchTopK(prefijo, k) { return this.buscar(prefijo, k).resultados; }
}

export function crearEjemplo() {
  const buscador = new Buscador();
  // Los cuatro productos y puntajes de la consigna del profesor.
  for (const producto of [
    { name: 'air max', popularity: 90 },
    { name: 'air force', popularity: 95 },
    { name: 'air jordan', popularity: 85 },
    { name: 'adidas boost', popularity: 80 },
  ]) buscador.agregar(producto);
  return buscador;
}
