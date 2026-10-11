import { useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import { ArbolBinario } from './estructuras/ArbolBinario.js';
import { aDatosD3, crearEjemplo, ejemplo, hojasVisuales, imprimirRecorridos, leerNumeros } from './arbol.js';

function Grafico({ data, levels, search }) {
  const container = useRef(null);
  const [width, setWidth] = useState(700);
  const [view, setView] = useState(0);
  useEffect(() => {
    const observer = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const zoom = Math.max(.25, Math.min(1, (width - 50) / Math.max(120, hojasVisuales(data) * 120), 340 / Math.max(95, levels * 95)));

  function renderNode({ nodeDatum }) {
    const { empty, value, side } = nodeDatum.attributes;
    if (empty) return <g role="img" aria-label={`Sin hijo a la ${side.toLowerCase()}`}><circle r={8} fill="#f8faf5" stroke="#c6d0bc" strokeDasharray="2 2" /><text textAnchor="middle" y={4} className="empty-label">∅</text></g>;
    const found = search?.found && search.value === value;
    const visited = search?.path.includes(value);
    return (
      <g role="img" aria-label={`Nodo ${value}, ${side}${found ? ', encontrado' : visited ? ', visitado' : ''}`}>
        <circle r={23} fill={found ? '#ad703e' : visited ? '#e6d4a4' : '#3a5945'} stroke={found ? '#805331' : visited ? '#ad8c44' : '#3a5945'} strokeWidth={2} />
        <text textAnchor="middle" y={5} className={`node-value ${visited && !found ? 'visited-value' : ''}`}>{nodeDatum.name}</text>
        <text textAnchor="middle" y={42} className="node-side">{side}</text>
      </g>
    );
  }

  return <section className="graph-section" aria-labelledby="graph-title">
    <div className="graph-heading"><div><p className="section-number">02 / ESTRUCTURA</p><h2 id="graph-title">Así crece el árbol</h2></div><button type="button" className="small-button" onClick={() => setView(value => value + 1)}>Centrar vista</button></div>
    <div className="tree-canvas" ref={container} aria-label="Visualización del árbol binario">
      {data ? <Tree key={view} data={data} orientation="vertical" translate={{ x: width / 2, y: 50 }} zoom={zoom} nodeSize={{ x: 95, y: 95 }} separation={{ siblings: 1.2, nonSiblings: 1.4 }} pathFunc="straight" collapsible={false} renderCustomNodeElement={renderNode} transitionDuration={0} scaleExtent={{ min: .2, max: 2 }} /> : <div className="empty-tree"><span>∅</span><h3>El árbol está vacío</h3><p>Inserta una serie para crear tu primera raíz.</p></div>}
    </div>
    <div className="graph-footer"><span>Menores a la izquierda / Mayores a la derecha</span><span>Arrastra para mover · Rueda para acercar</span></div>
    <p className="small-note">Los símbolos ∅ representan hijos ausentes, no valores del árbol.</p>
  </section>;
}

export default function App() {
  const treeRef = useRef(null);
  if (treeRef.current === null) treeRef.current = crearEjemplo();
  const [data, setData] = useState(() => aDatosD3(treeRef.current.root));
  const [series, setSeries] = useState('');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(`Ejemplo cargado en este orden: ${ejemplo.join(', ')}.`);
  useEffect(() => imprimirRecorridos(treeRef.current), [data]);

  function insertNumbers(event) {
    event.preventDefault();
    try {
      const numbers = leerNumeros(series); // Se valida toda la serie antes de insertar.
      const inserted = [];
      const repeated = [];
      for (const value of numbers) (treeRef.current.insert(value) ? inserted : repeated).push(value);
      setData(aDatosD3(treeRef.current.root));
      setSearch(null);
      setError('');
      setSeries('');
      setMessage(`${inserted.length ? `Insertados: ${inserted.join(', ')}.` : 'No se agregaron valores.'}${repeated.length ? ` Repetidos omitidos: ${repeated.join(', ')}.` : ''}`);
    } catch (validationError) { setError(validationError.message); }
  }

  function searchNumber(event) {
    event.preventDefault();
    try {
      const numbers = leerNumeros(query);
      if (numbers.length !== 1) throw new Error('Busca un solo número a la vez.');
      const result = { ...treeRef.current.search(numbers[0]), value: numbers[0] };
      setSearch(result);
      setError('');
      setMessage(`${result.found ? 'Encontrado' : 'No encontrado'}: ${result.value}. ${result.path.length ? `Camino visitado: ${result.path.join(' → ')}.` : 'El árbol está vacío.'}`);
    } catch (validationError) { setError(validationError.message); }
  }

  function reset(useExample) {
    treeRef.current = useExample ? crearEjemplo() : new ArbolBinario();
    setData(aDatosD3(treeRef.current.root));
    setSearch(null); setQuery(''); setSeries(''); setError('');
    setMessage(useExample ? 'Restableciste los siete valores del ejemplo.' : 'Árbol vacío. El primer número que insertes será la raíz.');
  }

  return <div className="app-shell">
    <header className="site-header"><div className="brand"><span className="brand-mark" aria-hidden="true">A</span><div>Entre ramas<small>Challenge 08</small></div></div><span className="course-label">Estructuras de Datos II</span></header>
    <main>
      <header className="page-heading"><p className="eyebrow">Árbol binario de búsqueda</p><h1>Cada número<br />encuentra su lugar.</h1><p>Inserta, busca y recorre los nodos. La posición depende de las comparaciones y del orden de inserción.</p></header>
      <div className="workspace">
        <section className="tools" aria-labelledby="tools-title"><p className="section-number">01 / OPERACIONES</p><h2 id="tools-title">Construye y explora</h2>
          <form onSubmit={insertNumbers}><label htmlFor="series">Números para insertar</label><input id="series" value={series} onChange={event => setSeries(event.target.value)} placeholder="Ej. 25, 35, 65" maxLength={1000} aria-describedby="series-help" required /><p id="series-help" className="field-help">Separa con comas o espacios. No se repiten valores.</p><button type="submit" className="primary">Insertar números <span aria-hidden="true">+</span></button></form>
          <form className="search-form" onSubmit={searchNumber}><label htmlFor="query">Buscar número</label><div className="search-row"><input id="query" value={query} onChange={event => setQuery(event.target.value)} placeholder="Ej. 60" maxLength={30} required /><button type="submit">Buscar</button></div></form>
          {error && <p role="alert" className="error-message">{error}</p>}
          <p className="status" role="status">{message}</p>
          <div className="legend"><span><i className="visited-dot" />Nodo visitado</span><span><i className="found-dot" />Número encontrado</span></div>
          <div className="reset-actions"><button type="button" onClick={() => reset(true)}>Restablecer ejemplo</button><button type="button" onClick={() => reset(false)}>Vaciar árbol</button></div>
          <div className="tree-stats"><div><strong>{treeRef.current.size()}</strong><span>Nodos</span></div><div><strong>{treeRef.current.height()}</strong><span>Niveles</span></div><div><strong>{treeRef.current.root?.value ?? '∅'}</strong><span>Raíz</span></div></div>
        </section>
        <Grafico data={data} levels={treeRef.current.height()} search={search} />
      </div>
      <section className="traversals" aria-labelledby="traversals-title"><div className="traversals-heading"><div><p className="section-number">03 / RECORRIDOS</p><h2 id="traversals-title">Tres maneras de visitar el mismo árbol</h2></div><button type="button" className="small-button" onClick={() => { imprimirRecorridos(treeRef.current); setMessage('Imprimiste Inorden, Postorden y Preorden en la consola del navegador.'); }}>Imprimir recorridos en consola</button></div>
        <div className="traversal-list">{[['Inorden', 'Izquierda · Nodo · Derecha', treeRef.current.inorder()], ['Postorden', 'Izquierda · Derecha · Nodo', treeRef.current.postorder()], ['Preorden', 'Nodo · Izquierda · Derecha', treeRef.current.preorder()]].map(([name, rule, values]) => <div className="traversal" key={name}><div><h3>{name}</h3><span>{rule}</span></div><p aria-label={`Recorrido ${name}`}>{values.length ? values.join(' → ') : 'Árbol vacío'}</p></div>)}</div>
      </section>
    </main><footer className="site-footer"><span>JavaScript + React / react-d3-tree</span><span>Árbol sin balanceo automático. Los cambios se restablecen al recargar.</span></footer>
  </div>;
}
