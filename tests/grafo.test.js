import test from 'node:test';
import assert from 'node:assert/strict';
import { Grafo } from '../src/estructuras/Grafo.js';
import { crearEjemplo, datosVisuales } from '../src/datos.js';

function base() {
  const grafo = new Grafo();
  const pasto = grafo.agregarCiudad('Pasto');
  const cali = grafo.agregarCiudad('Cali');
  const ana = grafo.agregarPersona('Ana', 22, pasto);
  const bruno = grafo.agregarPersona('Bruno', 25, cali);
  return { grafo, pasto, cali, ana, bruno };
}
test('grafo vacío y ciudad sin habitantes', () => {
  const g = new Grafo(); assert.deepEqual(g.aristas(), []);
  const id = g.agregarCiudad('Pasto'); assert.deepEqual(g.habitantes(id), []);
});
test('personas tienen nombre, edad y referencia a la ciudad', () => {
  const { grafo:g, ana, pasto } = base();
  assert.deepEqual(g.nodo(ana), { id:ana,tipo:'persona',nombre:'Ana',edad:22,ciudadId:pasto });
});
test('residencia conecta en ambas direcciones', () => {
  const { grafo:g, ana, pasto } = base();
  assert.deepEqual(g.vecinos(ana).map(n=>n.id), [pasto]);
  assert.deepEqual(g.vecinos(pasto).map(n=>n.id), [ana]);
});
test('consulta solo habitantes de la ciudad elegida', () => {
  const { grafo:g, pasto, cali, ana, bruno } = base();
  g.agregarAmistad(ana,bruno);
  assert.deepEqual(g.habitantes(pasto).map(n=>n.nombre), ['Ana']);
  assert.deepEqual(g.habitantes(cali).map(n=>n.nombre), ['Bruno']);
});
test('amistad simétrica y no confunde residencia con amistad', () => {
  const { grafo:g, ana, bruno } = base(); g.agregarAmistad(ana,bruno);
  assert.deepEqual(g.amigos(ana).map(n=>n.id), [bruno]);
  assert.deepEqual(g.amigos(bruno).map(n=>n.id), [ana]);
  assert.equal(g.aristas().length,3);
});
test('rechaza amistad duplicada en cualquier dirección y consigo mismo', () => {
  const { grafo:g, ana, bruno } = base(); g.agregarAmistad(ana,bruno);
  assert.throws(()=>g.agregarAmistad(bruno,ana),/ya existe/);
  assert.throws(()=>g.agregarAmistad(ana,ana),/diferentes/);
  assert.equal(g.aristas().length,3);
});
test('valida tipos de extremos y nodos inexistentes sin mutar', () => {
  const { grafo:g, ana, pasto } = base();
  assert.throws(()=>g.agregarAmistad(ana,pasto));
  assert.throws(()=>g.agregarPersona('Ana',22,ana));
  assert.throws(()=>g.habitantes('no-existe'));
  assert.throws(()=>g.vecinos('no-existe')); assert.equal(g.nodos().length,4);
});
test('valida nombres y edades antes de insertar', () => {
  const { grafo:g, pasto } = base();
  for (const edad of [-1,121,22.5,NaN,'22']) assert.throws(()=>g.agregarPersona('Ana',edad,pasto));
  assert.throws(()=>g.agregarCiudad('  ')); assert.throws(()=>g.agregarPersona(' ',22,pasto));
  assert.equal(g.nodos().length,4);
  assert.equal(g.nodo(g.agregarPersona(' Bebé ',0,pasto)).edad,0);
});
test('ciudades duplicadas ignoran espacios y mayúsculas; homónimos tienen IDs distintos', () => {
  const { grafo:g, pasto, ana } = base();
  assert.throws(()=>g.agregarCiudad(' PASTO '),/ya está/);
  const otra = g.agregarPersona('Ana',30,pasto); assert.notEqual(otra,ana);
});
test('mudanza cambia una sola residencia y conserva amistades', () => {
  const { grafo:g, ana, bruno, pasto, cali } = base(); g.agregarAmistad(ana,bruno);
  g.cambiarCiudad(ana,cali);
  assert.equal(g.habitantes(pasto).length,0); assert.equal(g.habitantes(cali).length,2);
  assert.equal(g.nodo(ana).ciudadId,cali); assert.deepEqual(g.amigos(ana).map(n=>n.id),[bruno]);
  assert.equal(g.vecinos(ana).filter(n=>n.tipo==='ciudad').length,1);
  assert.throws(()=>g.cambiarCiudad(ana,'no-existe')); assert.equal(g.nodo(ana).ciudadId,cali);
});
test('copias de listas y nodos inmutables protegen el grafo', () => {
  const { grafo:g, ana } = base(); g.nodos().pop(); g.vecinos(ana).pop(); g.aristas().pop();
  assert.equal(g.nodos().length,4); assert.equal(g.vecinos(ana).length,1);
  assert.throws(()=>{g.nodo(ana).nombre='Cambio';},TypeError);
});
test('ejemplo y adaptador exportan nodos y aristas sin duplicar ni perder ciudades vacías', () => {
  const g = crearEjemplo(); const vacia = g.agregarCiudad('Medellín');
  const { data, altura } = datosVisuales(g,800,null);
  assert.equal(data.nodes.length,10); assert.equal(data.links.length,10);
  assert.ok(data.nodes.some(n=>n.id===vacia)); assert.ok(altura>=380);
  const ids = new Set(data.nodes.map(n=>n.id));
  assert.ok(data.links.every(e=>ids.has(e.source)&&ids.has(e.target)));
  data.nodes[0].nombre='Cambio'; assert.equal(g.nodo(data.nodes[0].id).nombre,'Pasto');
});
