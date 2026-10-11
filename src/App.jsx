import { useEffect, useState } from 'react';
import { crearMenu, seccionesAbiertas } from './menu.js';
import * as pages from './pages.jsx';

const getRoute = () => window.location.hash.slice(1) || '/inicio';

function RamaMenu({ node, route, path, expanded, toggle, depth = 0 }) {
  const hasChildren = !node.isLeaf();
  const isOpen = expanded.has(node.value.link);
  const isActive = node.value.link === route;
  const isAncestor = path.some(ancestor => ancestor === node) && !isActive;
  return <li>
    <div className={`menu-row ${isActive ? 'active' : ''} ${isAncestor ? 'ancestor' : ''}`} style={{ '--depth': depth }}>
      <a href={`#${node.value.link}`} aria-current={isActive ? 'page' : undefined}><span className="menu-dot" aria-hidden="true" />{node.value.title}</a>
      {hasChildren && <button type="button" aria-label={`${isOpen ? 'Contraer' : 'Expandir'} ${node.value.title}`} aria-expanded={isOpen} onClick={() => toggle(node.value.link)}>{isOpen ? '−' : '+'}</button>}
    </div>
    {hasChildren && isOpen && <ul>{node.children.map(child => <RamaMenu key={child.value.link} node={child} route={route} path={path} expanded={expanded} toggle={toggle} depth={depth + 1} />)}</ul>}
  </li>;
}

export default function App() {
  const [tree] = useState(() => crearMenu(pages));
  const [route, setRoute] = useState(getRoute);
  const [expanded, setExpanded] = useState(() => new Set(seccionesAbiertas));
  const [traversal, setTraversal] = useState('dfs');
  const selected = tree.find(route);
  const path = tree.pathTo(route);
  const Component = selected?.value.component;
  const visitOrder = tree[traversal]();

  useEffect(() => {
    const update = () => setRoute(getRoute());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  function toggle(link) {
    setExpanded(previous => {
      const next = new Set(previous);
      if (next.has(link)) next.delete(link); else next.add(link);
      return next;
    });
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#/inicio"><span className="brand-mark" aria-hidden="true">C</span><span>Campus entre ramas<small>Challenge 09</small></span></a>
      <p className="nav-label">Explora tu campus</p>
      <nav aria-label="Menú generado desde el árbol"><ul className="menu-root">{tree.root.children.map(node => <RamaMenu key={node.value.link} node={node} route={route} path={path} expanded={expanded} toggle={toggle} />)}</ul></nav>
      <div className="sidebar-note"><span>{tree.size() - 1} opciones · {tree.height()} niveles</span><p>Una raíz conecta todas las secciones. Cada submenú pertenece a su nodo padre.</p></div>
    </aside>
    <main>
      <header className="top-bar"><nav aria-label="Ruta dentro del árbol"><ol className="breadcrumbs">{path.length ? path.map((node, index) => <li key={node.value.link}>{index > 0 && <span aria-hidden="true">/</span>}<a href={`#${node.value.link}`} aria-current={index === path.length - 1 ? 'page' : undefined}>{node.value.title}</a></li>) : <li>Página no encontrada</li>}</ol></nav><span className="course-label">Estructuras de Datos II</span></header>
      <div className="main-content">
        {Component ? <Component /> : <section className="page-content"><p className="eyebrow">Ruta desconocida</p><h1>Página no encontrada.</h1><p className="lead">No hay un nodo del menú para este enlace.</p><a className="return-link" href="#/inicio">Volver al inicio</a></section>}
        {selected && <section className="node-detail" aria-labelledby="node-title"><div className="detail-heading"><p className="eyebrow">El nodo detrás de esta pantalla</p><h2 id="node-title">Título, enlace y componente</h2></div><dl><div><dt>Título</dt><dd>{selected.value.title}</dd></div><div><dt>Enlace</dt><dd><code>{selected.value.link}</code></dd></div><div><dt>Componente</dt><dd><code>{selected.value.component.name}</code></dd></div><div><dt>Hijos directos</dt><dd>{selected.children.length}</dd></div></dl><p>El menú recorre <code>children</code> para dibujar sus ramas. El enlace selecciona este nodo y su componente genera el contenido.</p></section>}
        <section className="traversal-section" aria-labelledby="traversal-title"><div className="traversal-heading"><div><p className="eyebrow">Recorrido del árbol completo</p><h2 id="traversal-title">El mismo árbol, otro orden</h2></div><div className="traversal-buttons" aria-label="Tipo de recorrido"><button type="button" aria-pressed={traversal === 'dfs'} onClick={() => setTraversal('dfs')}>DFS</button><button type="button" aria-pressed={traversal === 'bfs'} onClick={() => setTraversal('bfs')}>BFS</button></div></div><p className="traversal-description">{traversal === 'dfs' ? 'DFS explora cada rama en profundidad antes de pasar a la siguiente.' : 'BFS visita primero la raíz, después sus hijos y luego los niveles siguientes.'}</p><ol className="visit-order" aria-label={`Orden ${traversal.toUpperCase()}`}>{visitOrder.map((node, index) => <li key={node.value.link}><span>{String(index + 1).padStart(2, '0')}</span>{node.value.title}</li>)}</ol></section>
      </div>
      <footer className="site-footer"><span>JavaScript + React / Árbol n-ario</span><span>Datos de ejemplo para practicar navegación.</span></footer>
    </main>
  </div>;
}
