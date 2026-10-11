import { Grafo } from './estructuras/Grafo.js';

export function crearEjemplo() {
  const grafo = new Grafo();
  const pasto = grafo.agregarCiudad('Pasto');
  const cali = grafo.agregarCiudad('Cali');
  const bogota = grafo.agregarCiudad('Bogotá');
  const ana = grafo.agregarPersona('Ana', 22, pasto);
  const bruno = grafo.agregarPersona('Bruno', 25, pasto);
  const camila = grafo.agregarPersona('Camila', 21, cali);
  const diego = grafo.agregarPersona('Diego', 28, cali);
  const elena = grafo.agregarPersona('Elena', 24, bogota);
  const felipe = grafo.agregarPersona('Felipe', 23, bogota);
  grafo.agregarAmistad(ana, bruno);
  grafo.agregarAmistad(ana, camila);
  grafo.agregarAmistad(diego, elena);
  grafo.agregarAmistad(elena, felipe);
  return grafo;
}

// Adaptador: la biblioteca recibe copias, sin acceso a la estructura privada.
export function datosVisuales(grafo, ancho, seleccionId) {
  const ciudades = grafo.ciudades();
  const paso = ancho / Math.max(ciudades.length, 1);
  const nodes = [];
  let filas = 0;
  ciudades.forEach((ciudad, indice) => {
    const x = paso * (indice + 0.5);
    nodes.push({ id: ciudad.id, nombre: ciudad.nombre, x, y: 65, color: '#c48a47',
      symbolType: 'diamond', size: 850, strokeWidth: ciudad.id === seleccionId ? 4 : 1 });
    const residentes = grafo.habitantes(ciudad.id);
    filas = Math.max(filas, residentes.length);
    residentes.forEach((persona, fila) => nodes.push({
      id: persona.id, nombre: persona.nombre, x: x + (fila % 2 ? 22 : -22),
      y: 175 + fila * 88, color: '#267668', symbolType: 'circle', size: 480,
      strokeWidth: persona.id === seleccionId ? 4 : 1,
    }));
  });
  return { data: { nodes, links: grafo.aristas().map(arista => ({
    ...arista, color: arista.tipo === 'amistad' ? '#7892c7' : '#d8b58a',
    strokeWidth: arista.tipo === 'amistad' ? 2.5 : 1.5,
  })) }, altura: Math.max(380, 205 + filas * 88) };
}
