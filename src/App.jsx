import { useMemo, useState } from 'react';
import { crearEjemplo } from './buscador.js';

function VistaHeap({ productos }) {
  const visibles = productos.slice(0, 15);
  const niveles = Math.floor(Math.log2(Math.max(visibles.length, 1))) + 1;
  const posicion = indice => {
    const nivel = Math.floor(Math.log2(indice + 1));
    const lugar = indice - (2 ** nivel - 1);
    return { x: (lugar + 0.5) * 720 / 2 ** nivel, y: 40 + nivel * 85 };
  };
  if (!visibles.length) return <p className="empty">No hay coincidencias para construir el Heap.</p>;
  return <div className="heap-scroll" tabIndex="0" role="region" aria-label="Dibujo del Max Heap">
    <svg viewBox={`0 0 720 ${niveles * 85 + 12}`} role="img" aria-label={`Max Heap inicial con ${productos.length} productos. Raíz: ${productos[0].name}, popularidad ${productos[0].popularity}`}>
      {visibles.slice(1).map((producto, i) => {
        const indice = i + 1, hijo = posicion(indice), padre = posicion(Math.floor((indice - 1) / 2));
        return <line key={producto.name} x1={padre.x} y1={padre.y} x2={hijo.x} y2={hijo.y} stroke="#c6d4c1" strokeWidth="2"/>;
      })}
      {visibles.map((producto, indice) => {
        const { x, y } = posicion(indice);
        return <g key={producto.name} role="img" aria-label={`Índice ${indice}: ${producto.name}, ${producto.popularity}`}>
          <circle cx={x} cy={y} r="22" fill={indice === 0 ? '#24695d' : '#e9f0e2'} stroke="#abc3ae"/>
          <text x={x} y={y + 5} textAnchor="middle" fill={indice === 0 ? 'white' : '#214e46'} fontSize="14" fontWeight="700">{producto.popularity}</text>
          <text x={x} y={y + 40} textAnchor="middle" fill="#315f57" fontSize="11">{producto.name.length > 18 ? `${producto.name.slice(0, 17)}…` : producto.name}</text>
        </g>;
      })}
    </svg>
    {productos.length > 15 && <p className="hint">Se dibujan los primeros 15 nodos; la búsqueda utiliza las {productos.length} coincidencias.</p>}
  </div>;
}

export default function App() {
  const [buscador, setBuscador] = useState(crearEjemplo);
  const [version, setVersion] = useState(0);
  const [prefijo, setPrefijo] = useState('air');
  const [kTexto, setKTexto] = useState('2');
  const [mensaje, setMensaje] = useState('Ejemplo de la clase cargado. Busca por el comienzo del nombre.');
  const [errorRegistro, setErrorRegistro] = useState(false);
  const consulta = useMemo(() => {
    try {
      if (!/^\d+$/.test(kTexto)) throw new Error('K debe ser un entero entre 1 y 100.');
      return { ...buscador.buscar(prefijo, Number(kTexto)), error: null };
    } catch (e) { return { resultados: [], coincidencias: [], heapInicial: [], pasos: [], error: e.message }; }
  }, [buscador, version, prefijo, kTexto]);
  const productos = buscador.productos();
  function agregar(event) {
    event.preventDefault();
    const formulario = event.currentTarget, campos = new FormData(formulario);
    try {
      const texto = campos.get('popularidad').trim();
      if (!/^\d+$/.test(texto)) throw new Error('Escribe una popularidad entera no negativa.');
      buscador.agregar({ name: campos.get('nombre'), popularity: Number(texto) });
      setVersion(v => v + 1); setErrorRegistro(false);
      setMensaje(`Producto añadido: ${campos.get('nombre').trim()}.`); formulario.reset();
    } catch (e) { setMensaje(e.message); setErrorRegistro(true); }
  }
  function restaurar() {
    setBuscador(crearEjemplo()); setVersion(v => v + 1); setPrefijo('air'); setKTexto('2');
    setMensaje('Ejemplo restaurado: air force (95) y air max (90) encabezan la búsqueda.'); setErrorRegistro(false);
  }

  return <div className="shell">
    <header className="hero"><div><span className="eyebrow">ESTRUCTURAS DE DATOS · CHALLENGE 11</span><h1>Encuentra primero lo mejor.</h1><p>Un prefijo abre el camino. La popularidad define el orden.</p></div><button className="secondary" onClick={restaurar}>Restaurar ejemplo</button></header>
    <main>
      <section className="search-card" aria-labelledby="search-title">
        <div className="search-intro"><span className="eyebrow">BUSCADOR DE PRODUCTOS</span><h2 id="search-title">¿Qué estás buscando?</h2><span className="catalog-count">{buscador.size} productos en el catálogo</span></div>
        <div className="search-controls"><div><label htmlFor="prefijo">Prefijo del producto</label><input id="prefijo" value={prefijo} onChange={e => setPrefijo(e.target.value)} maxLength="60" placeholder="Ej. air" autoComplete="off"/></div><div><label htmlFor="top-k">Top K</label><input id="top-k" type="number" min="1" max="100" step="1" value={kTexto} onChange={e => setKTexto(e.target.value)}/></div></div>
        <p className="hint">La búsqueda se actualiza al escribir. Un prefijo vacío busca en todo el catálogo.</p>
      </section>
      {consulta.error ? <p role="alert" className="status error">{consulta.error}</p> : <section className="results" aria-labelledby="results-title">
        <div className="section-heading"><h2 id="results-title">Los más populares</h2><p role="status">{consulta.coincidencias.length} {consulta.coincidencias.length === 1 ? 'coincidencia' : 'coincidencias'} · {consulta.resultados.length} {consulta.resultados.length === 1 ? 'resultado' : 'resultados'}</p></div>
        <ol className="ranking">{consulta.resultados.map((producto, indice) => <li className="result-card" key={producto.name}><span className="rank">{String(indice + 1).padStart(2, '0')}</span><div><h3>{producto.name}</h3><span>Coincide con tu prefijo</span></div><div className="score"><strong>{producto.popularity}</strong><span>popularidad</span></div></li>)}</ol>
        {!consulta.resultados.length && <p className="empty">No hay productos que comiencen con «{prefijo.trim()}». Prueba con “air” o “ad”.</p>}
      </section>}
      <section className="structures" aria-label="Cómo trabajan las estructuras">
        <article className="card trie-card"><span className="eyebrow">01 · FILTRAR POR PREFIJO</span><h2>El Trie encuentra el camino</h2><p className="description">Cada enlace representa una letra. Al terminar el prefijo, exploramos los productos del subárbol.</p>
          <div className="trie-path" aria-label="Recorrido del prefijo"><span className="root">raíz</span>{consulta.pasos.map((paso, i) => <span className="path-step" key={i}><span aria-hidden="true">→</span><strong className={paso.existe ? 'letter' : 'letter missing'}>{paso.letra === ' ' ? '␠' : paso.letra}<small>{paso.existe ? '✓' : '×'}</small></strong></span>)}</div>
          <p className="hint">{consulta.error ? 'Corrige K para ver la consulta.' : !prefijo.trim() ? 'Sin prefijo: el recorrido empieza en la raíz y abarca todos los productos.' : consulta.pasos.some(p => !p.existe) ? 'El camino se detiene: esa letra no existe en esta rama.' : 'Camino encontrado. Ahora recogemos los productos que comienzan así.'}</p>
          <h3>Coincidencias antes de ordenar</h3><ul className="matches">{consulta.coincidencias.map(p => <li key={p.name}><span>{p.name}</span><strong>{p.popularity}</strong></li>)}</ul>
          <code>trie.buscarPrefijo("{prefijo.trim()}")</code>
        </article>
        <article className="card heap-card"><span className="eyebrow">02 · ELEGIR POR POPULARIDAD</span><h2>El Max Heap pone el mayor arriba</h2><p className="description">Cada padre tiene al menos la prioridad de sus hijos. Extraemos la raíz K veces para obtener el ranking.</p><VistaHeap productos={consulta.heapInicial}/>
          <p className="hint">Heap inicial, antes de extraer los resultados. En empates va primero el nombre menor según sus caracteres normalizados.</p>
          <code>searchTopK("{prefijo.trim()}", {kTexto || '?'})</code>
        </article>
      </section>
      <section className="catalog-grid" aria-label="Administrar productos">
        <form className="card" onSubmit={agregar}><span className="eyebrow">PRUEBA CON TUS DATOS</span><h2>Añadir producto</h2><label htmlFor="nuevo-nombre">Nombre del producto</label><input id="nuevo-nombre" name="nombre" required maxLength="60" placeholder="Ej. air zoom"/><label htmlFor="popularidad">Popularidad</label><input id="popularidad" name="popularidad" required type="number" min="0" max={Number.MAX_SAFE_INTEGER} step="1" placeholder="Ej. 98"/><button type="submit">Añadir al catálogo +</button><p role="status" className={`status ${errorRegistro ? 'error' : ''}`}>{mensaje}</p></form>
        <section className="card" aria-labelledby="catalog-title"><div className="section-heading"><div><span className="eyebrow">DATOS DISPONIBLES</span><h2 id="catalog-title">Catálogo completo</h2></div><span className="badge">{buscador.size} productos</span></div><div className="table-scroll"><table><thead><tr><th>Producto</th><th>Popularidad</th></tr></thead><tbody>{productos.map(p => <tr key={p.name}><td>{p.name}</td><td>{p.popularity}</td></tr>)}</tbody></table></div><p className="hint">El catálogo muestra el recorrido del Trie; el orden del ranking lo decide el Heap.</p></section>
      </section>
    </main>
    <footer><span>Harold Camilo Villota Ortiz · 2240680</span><span>Datos en memoria · Se reinician al recargar</span></footer>
  </div>;
}
