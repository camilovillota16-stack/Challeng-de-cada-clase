export function normalizar(texto) {
  if (typeof texto !== 'string') throw new Error('El texto debe ser una cadena.');
  return texto.trim().normalize('NFC').toLocaleLowerCase('es');
}

class NodoTrie {
  hijos = new Map();
  producto = null;
}

export class Trie {
  #raiz = new NodoTrie();
  #cantidad = 0;
  get size() { return this.#cantidad; }

  insertar(producto) {
    if (!producto || typeof producto.name !== 'string') throw new Error('Escribe el nombre del producto.');
    const name = producto.name.trim().normalize('NFC');
    if (!name || [...name].length > 60) throw new Error('El nombre debe tener entre 1 y 60 caracteres.');
    if (!Number.isSafeInteger(producto.popularity) || producto.popularity < 0) {
      throw new Error('La popularidad debe ser un entero no negativo y seguro.');
    }
    const clave = normalizar(name);
    // Comprobar duplicados antes de crear nodos.
    const existente = this.#buscarNodo(clave);
    if (existente?.producto) throw new Error('Ese producto ya está registrado.');
    let nodo = this.#raiz;
    for (const letra of clave) {
      if (!nodo.hijos.has(letra)) nodo.hijos.set(letra, new NodoTrie());
      nodo = nodo.hijos.get(letra);
    }
    nodo.producto = Object.freeze({ name, popularity: producto.popularity });
    this.#cantidad++;
  }

  #buscarNodo(clave) {
    let nodo = this.#raiz;
    for (const letra of clave) {
      nodo = nodo.hijos.get(letra);
      if (!nodo) return null;
    }
    return nodo;
  }

  buscarPrefijo(prefijo) {
    const inicial = this.#buscarNodo(normalizar(prefijo));
    if (!inicial) return [];
    const encontrados = [];
    const pendientes = [inicial];
    while (pendientes.length) {
      const nodo = pendientes.pop();
      if (nodo.producto) encontrados.push(nodo.producto);
      for (const hijo of nodo.hijos.values()) pendientes.push(hijo);
    }
    return encontrados;
  }

  recorrerPrefijo(prefijo) {
    const letras = [...normalizar(prefijo)];
    const pasos = [];
    let nodo = this.#raiz;
    for (const letra of letras) {
      nodo = nodo.hijos.get(letra);
      pasos.push({ letra, existe: Boolean(nodo) });
      if (!nodo) break;
    }
    return pasos;
  }
}
