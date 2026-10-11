function nombreValido(nombre) {
  if (typeof nombre !== 'string' || !nombre.trim() || nombre.trim().length > 60) {
    throw new Error('Escribe un nombre entre 1 y 60 caracteres.');
  }
  return nombre.trim();
}

// Grafo no dirigido: cada nodo tiene un conjunto de vecinos.
export class Grafo {
  #nodos = new Map();
  #adyacencia = new Map();
  #secuencia = 0;

  #insertar(datos) {
    const id = `${datos.tipo}-${++this.#secuencia}`;
    this.#nodos.set(id, Object.freeze({ id, ...datos }));
    this.#adyacencia.set(id, new Set());
    return id;
  }

  #exigir(id, tipo) {
    const nodo = this.#nodos.get(id);
    if (!nodo || nodo.tipo !== tipo) throw new Error(`Selecciona una ${tipo} válida.`);
    return nodo;
  }

  #conectar(a, b) {
    this.#adyacencia.get(a).add(b);
    this.#adyacencia.get(b).add(a);
  }

  agregarCiudad(nombre) {
    const limpio = nombreValido(nombre);
    const clave = limpio.toLocaleLowerCase('es');
    if (this.ciudades().some(c => c.nombre.toLocaleLowerCase('es') === clave)) {
      throw new Error('Esa ciudad ya está registrada.');
    }
    return this.#insertar({ tipo: 'ciudad', nombre: limpio });
  }

  agregarPersona(nombre, edad, ciudadId) {
    const limpio = nombreValido(nombre);
    if (!Number.isInteger(edad) || edad < 0 || edad > 120) {
      throw new Error('La edad debe ser un número entero entre 0 y 120.');
    }
    this.#exigir(ciudadId, 'ciudad');
    const id = this.#insertar({ tipo: 'persona', nombre: limpio, edad, ciudadId });
    this.#conectar(id, ciudadId);
    return id;
  }

  agregarAmistad(a, b) {
    this.#exigir(a, 'persona');
    this.#exigir(b, 'persona');
    if (a === b) throw new Error('Escoge dos personas diferentes.');
    if (this.#adyacencia.get(a).has(b)) throw new Error('Esa amistad ya existe.');
    this.#conectar(a, b);
  }

  cambiarCiudad(personaId, ciudadId) {
    const persona = this.#exigir(personaId, 'persona');
    this.#exigir(ciudadId, 'ciudad');
    this.#adyacencia.get(personaId).delete(persona.ciudadId);
    this.#adyacencia.get(persona.ciudadId).delete(personaId);
    this.#nodos.set(personaId, Object.freeze({ ...persona, ciudadId }));
    this.#conectar(personaId, ciudadId);
  }

  nodo(id) { return this.#nodos.get(id) ?? null; }
  nodos() { return [...this.#nodos.values()]; }
  ciudades() { return this.nodos().filter(n => n.tipo === 'ciudad'); }
  personas() { return this.nodos().filter(n => n.tipo === 'persona'); }
  vecinos(id) {
    if (!this.#nodos.has(id)) throw new Error('El nodo no existe.');
    return [...this.#adyacencia.get(id)].map(vecino => this.#nodos.get(vecino));
  }
  habitantes(ciudadId) {
    this.#exigir(ciudadId, 'ciudad');
    return this.vecinos(ciudadId).filter(n => n.tipo === 'persona');
  }
  amigos(personaId) {
    this.#exigir(personaId, 'persona');
    return this.vecinos(personaId).filter(n => n.tipo === 'persona');
  }
  aristas() {
    const resultado = [];
    for (const [origen, vecinos] of this.#adyacencia) {
      for (const destino of vecinos) {
        // Orden de IDs para emitir una sola vez cada arista simétrica.
        if (origen < destino) resultado.push({
          source: origen, target: destino,
          tipo: this.nodo(origen).tipo === this.nodo(destino).tipo ? 'amistad' : 'residencia',
        });
      }
    }
    return resultado;
  }
}
