import test from 'node:test';
import assert from 'node:assert/strict';
import { ArbolBinario } from '../src/estructuras/ArbolBinario.js';
import { aDatosD3, crearEjemplo, leerNumeros, imprimirRecorridos } from '../src/arbol.js';

test('Árbol vacío: búsqueda y recorridos vacíos', () => {
  const tree = new ArbolBinario();
  assert.equal(tree.root, null);
  assert.equal(tree.size(), 0);
  assert.equal(tree.height(), 0);
  assert.deepEqual(tree.search(10), { found: false, path: [] });
  for (const method of ['inorder', 'preorder', 'postorder']) assert.deepEqual(tree[method](), []);
  assert.equal(aDatosD3(tree.root), null);
});

test('Inserción respeta izquierda y derecha; hojas y raíz', () => {
  const tree = crearEjemplo();
  assert.equal(tree.root.value, 50);
  assert.equal(tree.root.left.value, 30);
  assert.equal(tree.root.right.value, 70);
  assert.equal(tree.root.left.right.value, 40);
  assert.equal(tree.root.isLeaf(), false);
  assert.equal(tree.root.left.left.isLeaf(), true);
  assert.equal(tree.size(), 7);
  assert.equal(tree.height(), 3);
});

test('Inorden, postorden y preorden del ejemplo', () => {
  const tree = crearEjemplo();
  assert.deepEqual(tree.inorder(), [20, 30, 40, 50, 60, 70, 80]);
  assert.deepEqual(tree.postorder(), [20, 40, 30, 60, 80, 70, 50]);
  assert.deepEqual(tree.preorder(), [50, 30, 20, 40, 70, 60, 80]);
});

test('Búsqueda encuentra y devuelve el camino correcto', () => {
  const tree = crearEjemplo();
  assert.deepEqual(tree.search(60), { found: true, path: [50, 70, 60] });
  assert.deepEqual(tree.search(65), { found: false, path: [50, 70, 60] });
  assert.equal(tree.contains(50), true);
  assert.equal(tree.contains(99), false);
});

test('Valores repetidos no crean nodos ni alteran la estructura', () => {
  const tree = crearEjemplo();
  assert.equal(tree.insert(50), false);
  assert.equal(tree.insert(20), false);
  assert.equal(tree.size(), 7);
});

test('Admite cero, negativos y decimales', () => {
  const tree = new ArbolBinario();
  for (const value of [0, -5, 2.5, -2.5]) tree.insert(value);
  assert.deepEqual(tree.inorder(), [-5, -2.5, 0, 2.5]);
  assert.equal(tree.contains(-2.5), true);
});

test('Inserción ordenada puede producir un árbol sin balanceo', () => {
  const tree = new ArbolBinario();
  for (const value of [1, 2, 3, 4]) tree.insert(value);
  assert.equal(tree.height(), 4);
  assert.equal(tree.root.left, null);
  assert.deepEqual(tree.search(4).path, [1, 2, 3, 4]);
});

test('Rechaza NaN, infinito, texto y números fuera del rango seguro', () => {
  const tree = new ArbolBinario();
  for (const value of [NaN, Infinity, '50', Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => tree.insert(value));
    assert.throws(() => tree.search(value));
  }
});

test('Adaptador D3 conserva valores y lados cuando solo hay hijo derecho', () => {
  const tree = new ArbolBinario();
  tree.insert(10); tree.insert(20);
  const data = aDatosD3(tree.root);
  assert.equal(data.name, '10');
  assert.equal(data.attributes.side, 'Raíz');
  assert.equal(data.children[0].attributes.empty, true);
  assert.equal(data.children[1].name, '20');
  assert.equal(data.children[1].attributes.side, 'Derecha');
  assert.equal(data.children[1].children, undefined);
});

test('Adaptador D3 conserva un hijo izquierdo y no cuenta placeholders como nodos', () => {
  const tree = new ArbolBinario(); tree.insert(10); tree.insert(5);
  const data = aDatosD3(tree.root);
  assert.equal(data.children[0].name, '5');
  assert.equal(data.children[1].attributes.empty, true);
  assert.equal(tree.size(), 2);
  assert.deepEqual(tree.inorder(), [5, 10]);
});

test('Lee series separadas por comas, espacios o punto y coma', () => {
  assert.deepEqual(leerNumeros('50, 30; 70 -2.5'), [50, 30, 70, -2.5]);
  for (const text of ['', '20 abc', 'Infinity', '1e309', '9007199254740992']) assert.throws(() => leerNumeros(text));
});

test('Imprime los tres recorridos con sus etiquetas en consola', () => {
  const tree = crearEjemplo();
  const calls = [];
  const original = console.log;
  try {
    console.log = (...args) => calls.push(args);
    imprimirRecorridos(tree);
  } finally { console.log = original; }
  assert.deepEqual(calls, [['Inorden:', tree.inorder()], ['Postorden:', tree.postorder()], ['Preorden:', tree.preorder()]]);
});
