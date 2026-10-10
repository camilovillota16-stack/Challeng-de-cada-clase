import { ListaEnlazada } from './estructuras/ListaEnlazada.js';
import { ListaDoble } from './estructuras/ListaDoble.js';

export function crearCanciones() {
  const list = new ListaEnlazada();
  list.append({ id: 'amanecer', title: 'Amanecer en Cali', artist: 'Horizonte', duration: 12, color: '#e6ab77' });
  list.append({ id: 'rio', title: 'A la orilla del río', artist: 'Brisa del Sur', duration: 10, color: '#90b0ab' });
  list.append({ id: 'ciudad', title: 'Luces de la ciudad', artist: 'Estación Central', duration: 14, color: '#b5a2c1' });
  list.append({ id: 'regreso', title: 'Camino de regreso', artist: 'Horizonte', duration: 8, color: '#d0b77d' });
  return list;
}

export function crearHistorial() {
  const list = new ListaDoble();
  list.append({ id: 'inicio', title: 'Inicio', url: 'https://campus.example/inicio', category: 'Bienvenido al campus', description: 'Un lugar para explorar recursos, aprender a tu ritmo y seguir tus clases.', items: ['Consulta tus asignaturas', 'Revisa las próximas actividades', 'Encuentra material de estudio'] });
  list.append({ id: 'biblioteca', title: 'Biblioteca', url: 'https://campus.example/biblioteca', category: 'Ideas para aprender', description: 'Una selección de recursos de ejemplo para acompañar el estudio de estructuras de datos.', items: ['Guía de listas enlazadas', 'Ejercicios de nodos y referencias', 'Lecturas de algoritmos'] });
  list.append({ id: 'cursos', title: 'Mis cursos', url: 'https://campus.example/cursos', category: 'Tu recorrido académico', description: 'Estas páginas son ficticias. Los botones recorren el historial mediante referencias entre nodos.', items: ['Estructuras de Datos II', 'Ingeniería de Software', 'Desarrollo Web'] });
  list.append({ id: 'perfil', title: 'Mi perfil', url: 'https://campus.example/perfil', category: 'Tu espacio personal', description: 'Llegaste a la última página visitada. Puedes retroceder para recuperar las anteriores.', items: ['Estudiante de demostración', 'Preferencias de aprendizaje', 'Actividades recientes'] });
  return list;
}
