function Contenido({ label, title, intro, items }) {
  return <section className="page-content">
    <p className="eyebrow">{label}</p><h1>{title}</h1><p className="lead">{intro}</p>
    <div className="content-list">{items.map(([name, detail], index) => <article key={name}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{name}</h2><p>{detail}</p></div></article>)}</div>
    <p className="demo-note">Contenido ficticio para demostrar la navegación del árbol de menús.</p>
  </section>;
}

export function Inicio() { return <Contenido label="Bienvenido a tu campus" title="Un lugar para cada recurso." intro="Explora las secciones del menú lateral. Cada opción representa un nodo y abre su propio componente de React." items={[
  ['Tu vida académica', 'Materias, agenda y calificaciones organizadas en una misma rama.'],
  ['Recursos para aprender', 'Biblioteca, guías de estudio y ejercicios en la sección Recursos.'],
  ['Tu espacio personal', 'Perfil y preferencias bajo el mismo menú padre.'],
]} />; }
export function Academico() { return <Contenido label="Sección académica" title="Tu recorrido de aprendizaje." intro="Este nodo agrupa tres submenús. Mis materias contiene un nivel adicional con dos asignaturas." items={[
  ['Mis materias', 'Explora Estructuras de Datos II y Desarrollo Web.'], ['Agenda', 'Consulta las actividades de ejemplo.'], ['Calificaciones', 'Revisa los resultados ficticios del curso.'],
]} />; }
export function Materias() { return <Contenido label="Académico / Mis materias" title="Dos materias, una misma rama." intro="Las dos asignaturas son hijas del nodo Mis materias. Sus componentes se seleccionan desde el árbol." items={[
  ['Estructuras de Datos II', 'Listas, pilas, colas, árboles y grafos.'], ['Desarrollo Web', 'Componentes, estado y navegación en React.'],
]} />; }
export function Estructuras() { return <Contenido label="Mis materias / Estructuras de Datos II" title="Las estructuras toman forma." intro="Este es un nodo hoja: no tiene hijos. Está conectado a Mis materias, que a su vez pertenece a Académico." items={[
  ['Árbol n-ario', 'Cada nodo conserva un arreglo children con sus hijos.'], ['Recorrido DFS', 'Explora una rama antes de continuar con las demás.'], ['Recorrido BFS', 'Visita los nodos nivel por nivel.'],
]} />; }
export function DesarrolloWeb() { return <Contenido label="Mis materias / Desarrollo Web" title="Una pantalla para cada enlace." intro="La ruta del nodo decide qué componente aparece en el área de contenido." items={[
  ['Componentes', 'Cada página es una función de React guardada en su nodo.'], ['Rutas internas', 'Los enlaces usan el fragmento de la URL para cambiar de pantalla.'], ['Estado', 'El menú conserva por separado qué ramas están abiertas.'],
]} />; }
export function Agenda() { return <Contenido label="Académico / Agenda" title="Espacio para organizarte." intro="Una agenda de ejemplo que pertenece directamente a la sección Académico." items={[
  ['Repasar árboles', 'Reconocer raíz, hijos, niveles y hojas.'], ['Practicar recorridos', 'Comparar el orden de DFS con el de BFS.'], ['Revisar el challenge', 'Comprobar enlaces y componentes del menú.'],
]} />; }
export function Calificaciones() { return <Contenido label="Académico / Calificaciones" title="Resultados de demostración." intro="Esta pantalla presenta ejemplos ficticios; no consulta un sistema académico real." items={[
  ['Actividad de listas', 'Ejemplo de actividad revisada.'], ['Actividad de pilas y colas', 'Ejemplo de actividad revisada.'], ['Actividad de árboles', 'Ejemplo de actividad en desarrollo.'],
]} />; }
export function Recursos() { return <Contenido label="Sección de recursos" title="Encuentra tu siguiente lectura." intro="Biblioteca, Guías de estudio y Ejercicios son tres hijos de este mismo nodo." items={[
  ['Biblioteca', 'Lecturas para acompañar las clases.'], ['Guías de estudio', 'Conceptos para repasar estructuras de datos.'], ['Ejercicios', 'Ideas de práctica con nodos y recorridos.'],
]} />; }
export function Biblioteca() { return <Contenido label="Recursos / Biblioteca" title="Lecturas que conectan ideas." intro="Seleccionaste el nodo Biblioteca, hijo de Recursos. Su enlace carga el componente Biblioteca." items={[
  ['Introducción a los árboles', 'Raíz, ramas y hojas con ejemplos sencillos.'], ['Estructuras jerárquicas', 'Cómo representar categorías y menús.'], ['Recursividad', 'Casos base y llamadas sobre los subárboles.'],
]} />; }
export function Guias() { return <Contenido label="Recursos / Guías de estudio" title="Un repaso por las ramas." intro="Las guías se reúnen en una hoja del árbol del menú." items={[
  ['Raíz', 'El nodo inicial que conecta las secciones principales.'], ['Nodo interno', 'Un nodo con uno o más hijos.'], ['Hoja', 'Un nodo sin hijos, como esta página de guías.'],
]} />; }
export function Ejercicios() { return <Contenido label="Recursos / Ejercicios" title="Práctica para explorar el árbol." intro="Estas actividades ayudan a relacionar la estructura con el menú que estás viendo." items={[
  ['Sigue una ruta', 'Abre Académico, Mis materias y Estructuras de Datos II.'], ['Contrae una sección', 'Oculta sus hijos y comprueba que la pantalla actual se conserva.'], ['Compara los recorridos', 'Observa los nombres visitados en DFS y en BFS.'],
]} />; }
export function MiEspacio() { return <Contenido label="Sección personal" title="Tu espacio en el campus." intro="Este menú padre conecta Mi perfil y Preferencias. También tiene su propio componente." items={[
  ['Mi perfil', 'Datos de un estudiante ficticio.'], ['Preferencias', 'Opciones ilustrativas del espacio personal.'],
]} />; }
export function Perfil() { return <Contenido label="Mi espacio / Mi perfil" title="Un perfil de ejemplo." intro="El contenido de esta página es ficticio y sirve para comprobar la selección del componente Perfil." items={[
  ['Nombre', 'Estudiante de demostración.'], ['Programa', 'Desarrollo de software.'], ['Asignatura', 'Estructuras de Datos II.'],
]} />; }
export function Preferencias() { return <Contenido label="Mi espacio / Preferencias" title="Una sección para tus opciones." intro="Esta pantalla ilustra una hoja de la sección Mi espacio. No cambia configuraciones del navegador ni del equipo." items={[
  ['Navegación', 'Utiliza los enlaces del menú para explorar.'], ['Organización', 'Contrae y expande las ramas con sus botones.'], ['Acceso', 'La ruta de cada página se conserva en la URL.'],
]} />; }
