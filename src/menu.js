import { ArbolNario } from './estructuras/ArbolNario.js';

export function crearMenu(pages) {
  const tree = new ArbolNario({ title: 'Campus', link: '/', component: pages.Inicio });
  const add = (parent, title, link, componentName) => tree.addChild(parent, { title, link, component: pages[componentName] });

  add('/', 'Inicio', '/inicio', 'Inicio');
  add('/', 'Académico', '/academico', 'Academico');
  add('/academico', 'Mis materias', '/academico/materias', 'Materias');
  add('/academico/materias', 'Estructuras de Datos II', '/academico/materias/estructuras', 'Estructuras');
  add('/academico/materias', 'Desarrollo Web', '/academico/materias/web', 'DesarrolloWeb');
  add('/academico', 'Agenda', '/academico/agenda', 'Agenda');
  add('/academico', 'Calificaciones', '/academico/calificaciones', 'Calificaciones');
  add('/', 'Recursos', '/recursos', 'Recursos');
  add('/recursos', 'Biblioteca', '/recursos/biblioteca', 'Biblioteca');
  add('/recursos', 'Guías de estudio', '/recursos/guias', 'Guias');
  add('/recursos', 'Ejercicios', '/recursos/ejercicios', 'Ejercicios');
  add('/', 'Mi espacio', '/mi-espacio', 'MiEspacio');
  add('/mi-espacio', 'Mi perfil', '/mi-espacio/perfil', 'Perfil');
  add('/mi-espacio', 'Preferencias', '/mi-espacio/preferencias', 'Preferencias');
  return tree;
}

export const seccionesAbiertas = ['/academico', '/academico/materias', '/recursos', '/mi-espacio'];
