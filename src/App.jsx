import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Graph } from 'react-d3-graph';
import { crearEjemplo, datosVisuales } from './datos.js';

export default function App() {
  const [grafo, setGrafo] = useState(crearEjemplo);
  const [version, setVersion] = useState(0);
  const [ciudadId, setCiudadId] = useState(() => grafo.ciudades()[0].id);
  const [seleccionId, setSeleccionId] = useState(null);
  const [mensaje, setMensaje] = useState('Ejemplo cargado: 6 personas, 3 ciudades y 4 amistades.');
  const [error, setError] = useState(false);
  const [ancho, setAncho] = useState(720);
  const contenedor = useRef(null);
  useEffect(() => {
    const observer = new ResizeObserver(entries => setAncho(Math.max(600, Math.floor(entries[0].contentRect.width))));
    observer.observe(contenedor.current);
    return () => observer.disconnect();
  }, []);
  const ciudades = grafo.ciudades();
  const personas = grafo.personas();
  const aristas = grafo.aristas();
  const habitantes = grafo.habitantes(ciudadId);
  const seleccionado = grafo.nodo(seleccionId);
  const visual = useMemo(() => datosVisuales(grafo, ancho, seleccionId), [grafo, version, ancho, seleccionId]);
  const config = useMemo(() => ({
    width: ancho, height: visual.altura, directed: false, staticGraph: true,
    node: { labelProperty: 'nombre', fontSize: 14, fontColor: '#163f48',
      labelPosition: 'bottom', strokeColor: '#163f48', mouseCursor: 'pointer' },
    link: { color: '#d8b58a' },
  }), [ancho, visual.altura]);

  function ejecutar(event, operacion) {
    event.preventDefault();
    const formulario = event.currentTarget;
    const campos = new FormData(formulario);
    try {
      const texto = operacion(campos);
      setVersion(v => v + 1);
      setMensaje(texto);
      setError(false);
      formulario.reset();
    } catch (e) {
      setMensaje(e.message);
      setError(true);
    }
  }
  function reiniciar() {
    const nuevo = crearEjemplo();
    setGrafo(nuevo); setCiudadId(nuevo.ciudades()[0].id); setSeleccionId(null);
    setVersion(v => v + 1); setMensaje('Ejemplo restaurado.'); setError(false);
  }
  function opcionesPersonas() {
    return personas.map(p => <option key={p.id} value={p.id}>{p.nombre} · {grafo.nodo(p.ciudadId).nombre}</option>);
  }

  return <div className="shell">
    <header className="hero">
      <div><span className="eyebrow">ESTRUCTURAS DE DATOS · CHALLENGE 10</span>
        <h1>Una red, muchas conexiones.</h1>
        <p>Personas, ciudades y amistades en un mismo grafo.</p></div>
      <button className="secondary" onClick={reiniciar}>Restaurar ejemplo</button>
    </header>
    <div className="stats" aria-label="Resumen del grafo">
      <div><strong>{personas.length}</strong><span>Personas</span></div>
      <div><strong>{ciudades.length}</strong><span>Ciudades</span></div>
      <div><strong>{aristas.filter(a => a.tipo === 'amistad').length}</strong><span>Amistades</span></div>
      <div><strong>{aristas.length}</strong><span>Conexiones</span></div>
    </div>
    <p role="status" className={`status ${error ? 'error' : ''}`}>{mensaje}</p>
    <main className="workspace">
      <section className="card graph-card" aria-labelledby="graph-title">
        <div className="section-heading"><div><span className="eyebrow">EL MAPA DE LA RED</span><h2 id="graph-title">Personas y ciudades</h2></div><span className="badge">Grafo no dirigido</span></div>
        <div className="legend"><span><i className="city-dot"/>Ciudad</span><span><i className="person-dot"/>Persona</span><span><i className="residence-line"/>Residencia</span><span><i className="friend-line"/>Amistad</span></div>
        <p className="hint">Pulsa un nodo para ver sus datos. En pantallas pequeñas puedes desplazar el mapa horizontalmente.</p>
        <div ref={contenedor} className="graph-viewport" role="region" aria-label="Mapa del grafo" tabIndex="0">
          <Graph key={`${version}-${ancho}`} id="red-personas" data={visual.data} config={config} onClickNode={id => setSeleccionId(id)} />
        </div>
        <div className="node-detail" aria-live="polite">
          {seleccionado ? <><h3>{seleccionado.nombre}</h3>
            {seleccionado.tipo === 'persona' ? <><p>Persona · {seleccionado.edad} años · Vive en {grafo.nodo(seleccionado.ciudadId).nombre}</p><p>Amigos: {grafo.amigos(seleccionId).map(p => p.nombre).join(', ') || 'Sin amistades registradas'}</p></> : <p>Ciudad · {grafo.habitantes(seleccionId).length} habitantes registrados</p>}
          </> : <p>Selecciona una persona o una ciudad del mapa.</p>}
        </div>
      </section>
      <section className="card residents" aria-labelledby="residents-title">
        <span className="eyebrow">CONSULTAR EL GRAFO</span><h2 id="residents-title">¿Quién vive aquí?</h2>
        <label htmlFor="buscar-ciudad">Buscar habitantes por ciudad</label>
        <select id="buscar-ciudad" value={ciudadId} onChange={e => setCiudadId(e.target.value)}>{ciudades.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select>
        <p className="result-count">{habitantes.length} {habitantes.length === 1 ? 'persona' : 'personas'} en {grafo.nodo(ciudadId).nombre}</p>
        <ul className="people-list">{habitantes.map(p => <li key={p.id}><button onClick={() => setSeleccionId(p.id)}><span className="avatar">{p.nombre[0].toUpperCase()}</span><span><strong>{p.nombre}</strong><small>{p.edad} años · {grafo.amigos(p.id).length} {grafo.amigos(p.id).length === 1 ? 'amistad' : 'amistades'}</small></span><span aria-hidden="true">↗</span></button></li>)}</ul>
        {!habitantes.length && <p className="empty">Esta ciudad todavía no tiene personas registradas.</p>}
        <div className="lesson"><h3>Así funciona</h3><p>La ciudad es un nodo. Sus vecinos son las personas que viven allí. La consulta recorre esas conexiones y devuelve los habitantes.</p><code>grafo.habitantes(ciudadId)</code></div>
      </section>
    </main>
    <section className="forms" aria-label="Editar la red">
      <form className="card" onSubmit={e => ejecutar(e, campos => {
        const edadTexto = campos.get('edad').trim();
        if (!/^\d+$/.test(edadTexto)) throw new Error('Escribe una edad entera entre 0 y 120.');
        grafo.agregarPersona(campos.get('nombre'), Number(edadTexto), campos.get('ciudad'));
        return `Persona añadida: ${campos.get('nombre').trim()}.`;
      })}>
        <span className="eyebrow">01 · UN NUEVO NODO</span><h2>Añadir persona</h2>
        <label htmlFor="persona-nombre">Nombre de la persona</label><input id="persona-nombre" name="nombre" maxLength="60" required placeholder="Ej. Lucía"/>
        <div className="field-row"><div><label htmlFor="persona-edad">Edad</label><input id="persona-edad" name="edad" type="number" min="0" max="120" step="1" required placeholder="26"/></div><div><label htmlFor="persona-ciudad">Ciudad de residencia</label><select id="persona-ciudad" name="ciudad">{ciudades.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select></div></div>
        <button type="submit">Añadir persona +</button>
      </form>
      <form className="card" onSubmit={e => ejecutar(e, campos => { grafo.agregarAmistad(campos.get('primera'), campos.get('segunda')); return 'Amistad registrada en ambas direcciones.'; })}>
        <span className="eyebrow">02 · UNA NUEVA ARISTA</span><h2>Conectar amigos</h2>
        <label htmlFor="amigo-uno">Primera persona</label><select id="amigo-uno" name="primera">{opcionesPersonas()}</select>
        <label htmlFor="amigo-dos">Segunda persona</label><select id="amigo-dos" name="segunda" defaultValue={personas[1].id}>{opcionesPersonas()}</select>
        <button type="submit">Crear amistad ↗</button>
      </form>
      <form className="card" onSubmit={e => ejecutar(e, campos => { grafo.agregarCiudad(campos.get('nombre')); return `Ciudad añadida: ${campos.get('nombre').trim()}.`; })}>
        <span className="eyebrow">03 · AMPLIAR EL MAPA</span><h2>Añadir ciudad</h2>
        <label htmlFor="ciudad-nombre">Nombre de la ciudad</label><input id="ciudad-nombre" name="nombre" maxLength="60" required placeholder="Ej. Medellín"/>
        <p className="hint">La ciudad aparece como un nodo, incluso cuando todavía no tiene habitantes.</p>
        <button type="submit">Añadir ciudad +</button>
      </form>
    </section>
    <footer><span>Harold Camilo Villota Ortiz · 2240680</span><span>Datos de ejemplo en memoria · Se reinician al recargar</span></footer>
  </div>;
}
