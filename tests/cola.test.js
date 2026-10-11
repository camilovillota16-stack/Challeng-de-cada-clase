import test from 'node:test';
import assert from 'node:assert/strict';
import { Cola } from '../src/estructuras/Cola.js';
import { validarPersona, fechaAleatoria, crearPersona, organizarPorLlegada, crearColaEjemplo } from '../src/personas.js';

test('Cola vacía: peek y dequeue devuelven null y size es cero', () => {
  const queue = new Cola();
  assert.equal(queue.peek(), null);
  assert.equal(queue.dequeue(), null);
  assert.equal(queue.size(), 0);
  assert.equal(queue.isEmpty(), true);
  assert.deepEqual(queue.print(), []);
});

test('FIFO: A, B y C se atienden como A, B y C', () => {
  const queue = new Cola();
  assert.equal(queue.enqueue('A'), 1);
  queue.enqueue('B');
  queue.enqueue('C');
  assert.deepEqual(queue.print(), ['A', 'B', 'C']);
  assert.equal(queue.dequeue(), 'A');
  assert.equal(queue.dequeue(), 'B');
  assert.equal(queue.dequeue(), 'C');
  assert.equal(queue.isEmpty(), true);
});

test('peek y modificar la copia de print no cambian la cola', () => {
  const queue = new Cola();
  queue.enqueue('A');
  queue.enqueue('B');
  assert.equal(queue.peek(), 'A');
  const copy = queue.print();
  copy.reverse();
  copy.pop();
  assert.equal(queue.size(), 2);
  assert.equal(queue.dequeue(), 'A');
});

test('Se puede insertar después de vaciar y mezclar inserción con atención', () => {
  const queue = new Cola();
  queue.enqueue('A');
  queue.dequeue();
  queue.enqueue('B');
  queue.enqueue('C');
  assert.equal(queue.dequeue(), 'B');
  queue.enqueue('D');
  assert.deepEqual(queue.print(), ['C', 'D']);
  assert.equal(queue.size(), 2);
});

test('Ordena por llegada y mantiene el registro anterior ante fechas iguales', () => {
  const people = [{ id: 'B', arrivedAt: 30, order: 2 }, { id: 'C', arrivedAt: 10, order: 3 }, { id: 'A', arrivedAt: 10, order: 1 }];
  const queue = organizarPorLlegada(people);
  assert.deepEqual(queue.print().map(value => value.id), ['A', 'C', 'B']);
  assert.deepEqual(people.map(value => value.id), ['B', 'C', 'A']);
  assert.equal(queue.dequeue().id, 'A');
});

test('Una persona con llegada anterior queda delante sin alterar la cola original', () => {
  const original = organizarPorLlegada([{ id: 'B', arrivedAt: 20, order: 1 }]);
  const newQueue = organizarPorLlegada([...original.print(), { id: 'A', arrivedAt: 10, order: 2 }]);
  assert.equal(newQueue.peek().id, 'A');
  assert.equal(original.peek().id, 'B');
});

test('Fecha aleatoria está dentro de la última hora y nunca en el futuro', () => {
  const now = Date.parse('2026-10-10T22:00:00Z');
  assert.equal(fechaAleatoria(now, () => 0), now - 3600000);
  assert.equal(fechaAleatoria(now, () => .5), now - 1800000);
  assert.equal(fechaAleatoria(now, () => .9999999), now - 1);
  assert.throws(() => fechaAleatoria(now, () => 1), /fecha de llegada/);
});

test('Monto con punto o coma se convierte exactamente a centavos', () => {
  assert.deepEqual(validarPersona({ name: ' Ana ', amount: '75000,50' }), { name: 'Ana', withdrawalCents: 7500050 });
  assert.equal(validarPersona({ name: 'Ana', amount: '0.01' }).withdrawalCents, 1);
  assert.equal(validarPersona({ name: 'Ana', amount: '125000' }).withdrawalCents, 12500000);
});

test('Rechaza nombres vacíos o demasiado largos', () => {
  for (const name of ['', '   ', 'a'.repeat(101)]) assert.throws(() => validarPersona({ name, amount: '10' }));
});

test('Rechaza monto cero negativo inválido con tres decimales o demasiado grande', () => {
  for (const amount of ['', '0', '-1', 'NaN', '1e5', '10.999', '99999999999999999']) {
    assert.throws(() => validarPersona({ name: 'Ana', amount }));
  }
});

test('El sistema genera id, orden, monto y fecha; el usuario no proporciona la llegada', () => {
  const person = crearPersona({ name: 'Ana', amount: '25' }, 4, { id: 'prueba', now: 10000000, random: () => .5 });
  assert.deepEqual(person, { id: 'prueba', name: 'Ana', withdrawalCents: 2500, order: 4, arrivedAt: 8200000 });
});

test('Los datos de ejemplo también se encolan por sus fechas aleatorias', () => {
  const samples = [.9, .1, .5];
  const queue = crearColaEjemplo(10000000, () => samples.shift());
  assert.deepEqual(queue.print().map(value => value.name), ['Bruno Solano', 'Camila Torres', 'Ana Ríos']);
  assert.equal(queue.size(), 3);
});
