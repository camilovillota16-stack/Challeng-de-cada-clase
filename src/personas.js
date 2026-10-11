import { Cola } from './estructuras/Cola.js';

export const camposVacios = { name: '', amount: '' };
const HOUR = 60 * 60 * 1000;

export function validarPersona(values) {
  const name = String(values.name ?? '').trim();
  if (!name) throw new Error('Escribe el nombre de la persona.');
  if (name.length > 100) throw new Error('El nombre admite hasta 100 caracteres.');
  const amount = String(values.amount ?? '').trim();
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(amount)) {
    throw new Error('Escribe un monto positivo, sin separadores de miles y con máximo dos decimales.');
  }
  const [whole, decimal = ''] = amount.replace(',', '.').split('.');
  const cents = BigInt(whole) * 100n + BigInt(decimal.padEnd(2, '0'));
  if (cents <= 0n) throw new Error('El monto de retiro debe ser mayor que cero.');
  if (cents > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('El monto es demasiado grande.');
  return { name, withdrawalCents: Number(cents) };
}

// Una llegada ficticia dentro de la última hora. Nunca genera una fecha futura.
export function fechaAleatoria(now = Date.now(), random = Math.random) {
  const value = random();
  if (!Number.isFinite(now) || !Number.isFinite(value) || value < 0 || value >= 1) {
    throw new Error('No se pudo generar la fecha de llegada.');
  }
  return now - HOUR + Math.floor(value * HOUR);
}

export function crearPersona(values, order, options = {}) {
  return {
    ...validarPersona(values),
    id: options.id ?? crypto.randomUUID(),
    order,
    arrivedAt: fechaAleatoria(options.now ?? Date.now(), options.random ?? Math.random),
  };
}

// Primero se ordenan las llegadas simuladas; después se encolan en ese orden.
// La clase Cola conserva FIFO y no realiza inserciones en el medio.
export function organizarPorLlegada(people) {
  const sorted = [...people].sort((a, b) => a.arrivedAt - b.arrivedAt || a.order - b.order);
  const queue = new Cola();
  for (const person of sorted) queue.enqueue(person);
  return queue;
}

export function crearColaEjemplo(now = Date.now(), random = Math.random) {
  const people = [
    { name: 'Ana Ríos', amount: '75000' },
    { name: 'Bruno Solano', amount: '120000' },
    { name: 'Camila Torres', amount: '50000' },
  ].map((values, index) => crearPersona(values, index + 1, { now, random, id: `ejemplo-${index + 1}` }));
  return organizarPorLlegada(people);
}
