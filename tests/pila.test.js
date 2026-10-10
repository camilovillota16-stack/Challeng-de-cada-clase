import test from 'node:test';
import assert from 'node:assert/strict';
import { Pila } from '../src/estructuras/Pila.js';
import { camposVacios, crearPilaEjemplo, validarLibro } from '../src/libros.js';

test('Una pila vacía no retira valores y conserva tamaño cero', () => {
  const stack = new Pila();
  assert.equal(stack.isEmpty(), true);
  assert.equal(stack.size(), 0);
  assert.equal(stack.peek(), null);
  assert.equal(stack.pop(), null);
  assert.deepEqual(stack.print(), []);
});

test('LIFO: A, B y C salen como C, B y A', () => {
  const stack = new Pila();
  assert.equal(stack.push('A'), 1);
  stack.push('B');
  stack.push('C');
  assert.deepEqual(stack.print(), ['C', 'B', 'A']);
  assert.equal(stack.pop(), 'C');
  assert.equal(stack.pop(), 'B');
  assert.equal(stack.pop(), 'A');
  assert.equal(stack.size(), 0);
  assert.equal(stack.isEmpty(), true);
});

test('peek y print consultan sin cambiar el orden ni el tamaño', () => {
  const stack = new Pila();
  stack.push({ name: 'Primero' });
  const last = { name: 'Último' };
  stack.push(last);
  assert.equal(stack.peek(), last);
  const snapshot = stack.print();
  snapshot.pop();
  snapshot.reverse();
  assert.equal(stack.size(), 2);
  assert.equal(stack.pop(), last);
});

test('Puede agregarse otro libro después de vaciar la pila', () => {
  const stack = new Pila();
  stack.push('Anterior');
  stack.pop();
  stack.push('Nuevo');
  assert.equal(stack.peek(), 'Nuevo');
  assert.equal(stack.size(), 1);
});

test('Los tres libros de ejemplo salen en orden inverso de llegada', () => {
  const stack = crearPilaEjemplo();
  assert.equal(stack.size(), 3);
  assert.equal(stack.pop().id, 'ejemplo-3');
  assert.equal(stack.pop().id, 'ejemplo-2');
  assert.equal(stack.pop().id, 'ejemplo-1');
});

const valid = { name: ' Libro ', isbn: '978-0-000000-04-0', author: ' Autor ', editorial: ' Editorial ' };

test('Valida los cuatro campos y normaliza los espacios y guiones del ISBN', () => {
  assert.deepEqual(validarLibro(valid), { name: 'Libro', isbn: '9780000000040', author: 'Autor', editorial: 'Editorial' });
  assert.equal(valid.name, ' Libro ');
});

test('Admite un ISBN de diez caracteres terminado en X', () => {
  assert.equal(validarLibro({ ...valid, isbn: '0-12345678-x' }).isbn, '012345678X');
});

test('Rechaza campos faltantes y espacios sin contenido', () => {
  assert.throws(() => validarLibro(camposVacios), /nombre/);
  for (const key of Object.keys(camposVacios)) {
    assert.throws(() => validarLibro({ ...valid, [key]: '  ' }), /Completa/);
  }
});

test('Rechaza un ISBN con longitud inválida o letras intermedias', () => {
  for (const isbn of ['123', 'abcdefghij', '123456789012X', '12345678X9']) {
    assert.throws(() => validarLibro({ ...valid, isbn }), /ISBN de 10 o 13/);
  }
});

test('Rechaza campos de más de 150 caracteres', () => {
  for (const key of Object.keys(camposVacios)) {
    assert.throws(() => validarLibro({ ...valid, [key]: 'a'.repeat(151) }), /150 caracteres/);
  }
});
