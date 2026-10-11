import test from 'node:test';
import assert from 'node:assert/strict';
import { ArbolNario, NodoMenu } from '../src/estructuras/ArbolNario.js';
import { crearMenu } from '../src/menu.js';

const Page = () => null;
const value = (title, link) => ({ title, link, component: Page });
const pages = Object.fromEntries(['Inicio','Academico','Materias','Estructuras','DesarrolloWeb','Agenda','Calificaciones','Recursos','Biblioteca','Guias','Ejercicios','MiEspacio','Perfil','Preferencias'].map(name => [name, () => null]));

test('Raíz sin hijos tiene un nivel y es hoja', () => {
  const tree = new ArbolNario(value('Raíz', '/'));
  assert.equal(tree.root.parent, null);
  assert.equal(tree.root.isLeaf(), true);
  assert.equal(tree.size(), 1);
  assert.equal(tree.height(), 1);
});

test('Árbol n-ario permite cuatro hijos directos en la raíz', () => {
  const tree = crearMenu(pages);
  assert.equal(tree.root.children.length, 4);
  assert.equal(tree.size(), 15);
  assert.equal(tree.height(), 4);
});

test('Cada opción conserva título enlace único y componente', () => {
  const tree = crearMenu(pages);
  const links = new Set();
  for (const node of tree.dfs()) {
    assert.ok(node.value.title);
    assert.equal(typeof node.value.component, 'function');
    assert.equal(links.has(node.value.link), false);
    links.add(node.value.link);
  }
  assert.equal(tree.find('/recursos/biblioteca').value.component, pages.Biblioteca);
});

test('DFS explora la rama académica antes de la siguiente sección', () => {
  const links = crearMenu(pages).dfs().map(node => node.value.link);
  assert.deepEqual(links.slice(0, 6), ['/', '/inicio', '/academico', '/academico/materias', '/academico/materias/estructuras', '/academico/materias/web']);
  assert.ok(links.indexOf('/academico/calificaciones') < links.indexOf('/recursos'));
});

test('BFS comienza con raíz y las cuatro secciones; luego visita niveles siguientes', () => {
  const nodes = crearMenu(pages).bfs();
  assert.deepEqual(nodes.slice(0, 5).map(node => node.value.link), ['/', '/inicio', '/academico', '/recursos', '/mi-espacio']);
  assert.ok(nodes.findIndex(node => node.value.link === '/recursos/biblioteca') < nodes.findIndex(node => node.value.link === '/academico/materias/estructuras'));
  assert.equal(nodes.length, 15);
});

test('Breadcrumbs se recuperan de la cadena de padres', () => {
  const tree = crearMenu(pages);
  assert.deepEqual(tree.pathTo('/academico/materias/estructuras').map(node => node.value.title), ['Campus', 'Académico', 'Mis materias', 'Estructuras de Datos II']);
});

test('Ruta desconocida devuelve null y camino vacío', () => {
  const tree = crearMenu(pages);
  assert.equal(tree.find('/no-existe'), null);
  assert.deepEqual(tree.pathTo('/no-existe'), []);
});

test('No se agregan enlaces duplicados ni nodos con padre desconocido', () => {
  const tree = crearMenu(pages);
  assert.throws(() => tree.addChild('/', value('Repetido', '/inicio')), /ya existe/);
  assert.throws(() => tree.addChild('/no-existe', value('Nuevo', '/nuevo')), /padre/);
  assert.equal(tree.size(), 15);
});

test('Rechaza título vacío enlace externo o componente faltante', () => {
  assert.throws(() => new NodoMenu(value(' ', '/')), /título/);
  assert.throws(() => new NodoMenu(value('Página', 'https://example.com')), /ruta interna/);
  assert.throws(() => new NodoMenu({ title:'Página', link:'/pagina' }), /componente/);
});

test('No permite que un mismo nodo tenga dos padres', () => {
  const tree = crearMenu(pages);
  assert.throws(() => tree.find('/recursos').addChild(tree.find('/academico/agenda')), /ya tiene un padre/);
});

test('No permite ciclos ni conectar la raíz bajo un descendiente', () => {
  const tree = crearMenu(pages);
  assert.throws(() => tree.find('/academico/materias').addChild(tree.root), /ciclos/);
  assert.throws(() => tree.root.addChild(tree.root), /ciclos/);
});

test('Al agregar un submenú actualiza búsqueda y vínculo al padre', () => {
  const tree = crearMenu(pages);
  const child = tree.addChild('/recursos', value('Notas', '/recursos/notas'));
  assert.equal(tree.find('/recursos/notas'), child);
  assert.equal(child.parent, tree.find('/recursos'));
  assert.equal(tree.size(), 16);
});
