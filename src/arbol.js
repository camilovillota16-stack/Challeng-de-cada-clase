import { ArbolBinario } from './estructuras/ArbolBinario.js';

export const ejemplo = [50, 30, 70, 20, 40, 60, 80];

export function crearEjemplo() {
  const tree = new ArbolBinario();
  for (const value of ejemplo) tree.insert(value);
  return tree;
}

export function leerNumeros(text) {
  const trimmed = String(text).trim();
  if (!trimmed) throw new Error('Escribe al menos un número.');
  return trimmed.split(/[,;\s]+/).map(token => {
    if (!/^[+-]?\d+(?:\.\d+)?$/.test(token)) throw new Error(`«${token}» no es un número válido. Usa punto para los decimales.`);
    const value = Number(token);
    if (!Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER) throw new Error('Un número está fuera del rango seguro de JavaScript.');
    return value;
  });
}

// Adaptador al formato name/attributes/children requerido por react-d3-tree.
export function aDatosD3(node, side = 'Raíz') {
  if (!node) return null;
  const data = { name: String(node.value), attributes: { value: node.value, side } };
  if (node.left || node.right) {
    // Conserva la posición de un hijo único mostrando el lado ausente como ∅.
    const empty = childSide => ({ name: '∅', attributes: { empty: true, side: childSide } });
    data.children = [aDatosD3(node.left, 'Izquierda') ?? empty('Izquierda'), aDatosD3(node.right, 'Derecha') ?? empty('Derecha')];
  }
  return data;
}

export function hojasVisuales(data) {
  if (!data) return 0;
  return data.children ? data.children.reduce((sum, child) => sum + hojasVisuales(child), 0) : 1;
}

export function imprimirRecorridos(tree) {
  console.log('Inorden:', tree.inorder());
  console.log('Postorden:', tree.postorder());
  console.log('Preorden:', tree.preorder());
}
