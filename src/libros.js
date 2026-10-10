import { Pila } from './estructuras/Pila.js';

export const camposVacios = { name: '', isbn: '', author: '', editorial: '' };

// Verifica formato de 10 o 13 caracteres; no comprueba el dígito de control.
export function validarLibro(values) {
  const book = {};
  const labels = { name: 'nombre', isbn: 'ISBN', author: 'autor', editorial: 'editorial' };
  for (const key of Object.keys(labels)) {
    book[key] = String(values[key] ?? '').trim();
    if (!book[key]) throw new Error(`Completa el campo ${labels[key]}.`);
    if (book[key].length > 150) throw new Error(`El campo ${labels[key]} admite hasta 150 caracteres.`);
  }
  const normalizedISBN = book.isbn.replace(/[\s-]/g, '').toUpperCase();
  if (!/^(?:\d{13}|\d{9}[\dX])$/.test(normalizedISBN)) {
    throw new Error('Escribe un ISBN de 10 o 13 caracteres. Puedes usar espacios o guiones.');
  }
  book.isbn = normalizedISBN;
  return book;
}

export function crearPilaEjemplo() {
  const stack = new Pila();
  // Libros ficticios. La última llamada a push deja ese libro en el tope.
  stack.push({ id: 'ejemplo-1', name: 'Un mapa de algoritmos', isbn: '9780000000019', author: 'Laura Ríos', editorial: 'Ediciones Horizonte' });
  stack.push({ id: 'ejemplo-2', name: 'El lenguaje de los nodos', isbn: '9780000000026', author: 'Mateo Solano', editorial: 'Tinta y Código' });
  stack.push({ id: 'ejemplo-3', name: 'Pequeñas ideas en JavaScript', isbn: '9780000000033', author: 'Valentina Torres', editorial: 'Ediciones Horizonte' });
  return stack;
}
