import test from 'node:test';
import assert from 'node:assert/strict';
import { ListaEnlazada } from '../src/estructuras/ListaEnlazada.js';
import { ListaDoble } from '../src/estructuras/ListaDoble.js';
import { crearCanciones, crearHistorial } from '../src/data.js';

for (const [name, Class] of [['simple', ListaEnlazada], ['doble', ListaDoble]]) {
  test(`Lista ${name}: vacía y posiciones inválidas`, () => {
    const list = new Class();
    assert.equal(list.head, null);
    assert.equal(list.tail, null);
    assert.equal(list.size(), 0);
    assert.deepEqual(list.print(), []);
    for (const index of [-1, 0, 2.5, NaN]) {
      assert.equal(list.peek(index), null);
      assert.equal(list.remove(index), null);
    }
  });
  test(`Lista ${name}: enlaces, orden e inserción al final`, () => {
    const list = new Class();
    const a = list.append('A');
    const b = list.append('B');
    const c = list.append('C');
    assert.equal(list.head, a);
    assert.equal(list.tail, c);
    assert.equal(a.next, b);
    assert.equal(b.next, c);
    assert.equal(c.next, null);
    assert.equal(list.peek(1), b);
    assert.equal(list.size(), 3);
    assert.deepEqual(list.print(), ['A', 'B', 'C']);
    if (name === 'doble') {
      assert.equal(a.previous, null);
      assert.equal(b.previous, a);
      assert.equal(c.previous, b);
    }
  });
  test(`Lista ${name}: eliminar centro, último y único; volver a insertar`, () => {
    const list = new Class();
    const a = list.append('A');
    const b = list.append('B');
    const c = list.append('C');
    assert.equal(list.remove(1), 'B');
    assert.equal(a.next, c);
    assert.equal(b.next, null);
    if (name === 'doble') {
      assert.equal(c.previous, a);
      assert.equal(b.previous, null);
    }
    assert.equal(list.remove(1), 'C');
    assert.equal(list.tail, a);
    assert.equal(list.remove(0), 'A');
    assert.equal(list.head, null);
    assert.equal(list.tail, null);
    assert.equal(list.size(), 0);
    const nuevo = list.append('Nuevo');
    assert.equal(list.head, nuevo);
    assert.equal(list.tail, nuevo);
  });
  test(`Lista ${name}: eliminar cabeza conserva el resto`, () => {
    const list = new Class();
    list.append('A');
    const b = list.append('B');
    list.append('C');
    assert.equal(list.remove(0), 'A');
    assert.equal(list.head, b);
    assert.deepEqual(list.print(), ['B', 'C']);
    assert.equal(list.size(), 2);
    if (name === 'doble') assert.equal(b.previous, null);
  });
}

test('La playlist avanza por next hasta terminar sin regresar al comienzo', () => {
  const list = crearCanciones();
  const ids = [];
  let node = list.head;
  while (node) {
    ids.push(node.value.id);
    node = node.next;
  }
  assert.deepEqual(ids, ['amanecer', 'rio', 'ciudad', 'regreso']);
  assert.equal(list.tail.next, null);
});

test('El historial recorre atrás y adelante los mismos nodos', () => {
  const list = crearHistorial();
  const backwards = [];
  let node = list.tail;
  while (node) { backwards.push(node.value.id); node = node.previous; }
  assert.deepEqual(backwards, ['perfil', 'cursos', 'biblioteca', 'inicio']);
  const forwards = [];
  node = list.head;
  while (node) { forwards.push(node.value.id); node = node.next; }
  assert.deepEqual(forwards, backwards.toReversed());
});
