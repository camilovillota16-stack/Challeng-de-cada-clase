import { useEffect, useState } from 'react';
import { crearCanciones, crearHistorial } from './data.js';

const formatTime = (seconds) => `0:${String(seconds).padStart(2, '0')}`;
const currentPage = () => window.location.hash === '#/historial' ? 'historial' : 'canciones';

function NodeChain({ values, currentId, double = false }) {
  return <div className="node-chain" aria-label="Recorrido de nodos">
    <span className="endpoint">head</span>
    {values.map((value, index) => <div className="node-pair" key={value.id}>
      <span className={`chain-node ${value.id === currentId ? 'selected' : ''}`}>{index + 1}. {value.title}</span>
      <span className="link-arrow" aria-hidden="true">{double && index < values.length - 1 ? '⇄' : '→'}</span>
    </div>)}
    <span className="endpoint">null</span>
  </div>;
}

function Canciones() {
  const [list] = useState(crearCanciones);
  const [current, setCurrent] = useState(list.head);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const values = list.print();
  const song = current.value;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setElapsed(value => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    if (elapsed < song.duration) return;
    if (current.next) {
      setCurrent(current.next);
      setElapsed(0);
    } else {
      setPlaying(false);
      setElapsed(song.duration);
      setFinished(true);
    }
  }, [elapsed, song.duration, current]);

  function next() {
    if (!current.next) return;
    setCurrent(current.next);
    setElapsed(0);
    setFinished(false);
  }

  function restart() {
    setCurrent(list.head);
    setElapsed(0);
    setPlaying(false);
    setFinished(false);
  }

  return <>
    <header className="page-heading"><p className="eyebrow">01 / Lista enlazada simple</p><h1>Una canción.<br />Después, la siguiente.</h1><p>Cuatro canciones de ejemplo, conectadas en el orden de reproducción.</p></header>
    <div className="workspace">
      <section className="player" aria-label="Reproductor de canciones">
        <div className="record-art" style={{ '--album-color': song.color }} aria-hidden="true"><div className="record"><span /></div><span className="album-number">LISTA / 0{values.findIndex(value => value.id === song.id) + 1}</span></div>
        <div className="player-content"><p className="eyebrow">{finished ? 'Lista terminada' : playing ? 'Reproduciendo' : 'En pausa'}</p><h2 aria-live="polite">{song.title}</h2><p className="artist">{song.artist}</p>
          <progress aria-label="Progreso de reproducción" max={song.duration} value={Math.min(elapsed, song.duration)} />
          <div className="time-row"><span>{formatTime(Math.min(elapsed, song.duration))}</span><span>{formatTime(song.duration)}</span></div>
          <div className="controls"><button className="primary" disabled={finished} onClick={() => setPlaying(value => !value)}>{playing ? 'Pausar' : 'Reproducir'}</button><button onClick={next} disabled={!current.next}>Siguiente →</button><button className="text-button" onClick={restart}>Volver al inicio</button></div>
          <p className="small-note">Reproducción simulada, sin audio. Al terminar una canción, pasa automáticamente al siguiente nodo.</p>
        </div>
      </section>
      <section className="playlist" aria-label="Lista de canciones"><div className="section-title"><h2>En esta lista</h2><span>{list.size()} canciones</span></div>
        <ol>{values.map((value, index) => <li key={value.id} className={value.id === song.id ? 'active-song' : ''}><span className="song-index">0{index + 1}</span><div><strong>{value.title}</strong><span>{value.artist}</span></div><span>{formatTime(value.duration)}</span>{value.id === song.id && <span className="current-label">Actual</span>}</li>)}</ol>
        <div className="structure-note"><h3>¿Qué cambia al pulsar Siguiente?</h3><code>actual = actual.next</code><p>La lista guarda la primera canción en <code>head</code>. Cada nodo conoce el que viene después. La última apunta a <code>null</code>.</p></div>
      </section>
    </div>
    <section className="diagram-section"><h2>El recorrido de la lista</h2><NodeChain values={values} currentId={song.id} /></section>
  </>;
}

function Historial() {
  const [list] = useState(crearHistorial);
  const [current, setCurrent] = useState(list.tail);
  const page = current.value;
  const values = list.print();

  return <>
    <header className="page-heading"><p className="eyebrow">02 / Lista doblemente enlazada</p><h1>Tu recorrido,<br />en ambas direcciones.</h1><p>Regresa a una página visitada o avanza a la siguiente usando sus enlaces.</p></header>
    <section className="browser-demo" aria-label="Simulación del historial del navegador">
      <div className="browser-toolbar"><div className="browser-buttons"><button aria-label="Atrás" disabled={!current.previous} onClick={() => setCurrent(current.previous)}>←</button><button aria-label="Adelante" disabled={!current.next} onClick={() => setCurrent(current.next)}>→</button></div><div className="address-bar" aria-label="Dirección de la página simulada">{page.url}</div><span className="demo-badge">Simulación</span></div>
      <div className="browser-page"><p className="eyebrow">CAMPUS / {page.title}</p><h2 aria-live="polite">{page.category}</h2><p>{page.description}</p><ul>{page.items.map(item => <li key={item}>{item}</li>)}</ul></div>
      <div className="history-footer"><span>Página {values.findIndex(value => value.id === page.id) + 1} de {list.size()}</span><button className="text-button" onClick={() => setCurrent(list.tail)}>Volver a la última visita</button></div>
    </section>
    <section className="diagram-section"><div className="section-title"><h2>Las páginas que visitaste</h2><span>Orden de llegada</span></div><NodeChain values={values} currentId={page.id} double />
      <div className="direction-notes"><p><strong>Atrás</strong><code>actual = actual.previous</code></p><p><strong>Adelante</strong><code>actual = actual.next</code></p></div>
      <p className="small-note">El primer nodo no tiene anterior y el último no tiene siguiente. Por eso se desactiva el botón correspondiente. Las direcciones son ficticias y no abren sitios externos.</p>
    </section>
  </>;
}

export default function App() {
  const [page, setPage] = useState(currentPage);
  useEffect(() => {
    const update = () => setPage(currentPage());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return <div className="app-shell"><header className="site-header"><a className="brand" href="#/canciones"><span className="brand-mark" aria-hidden="true">L</span><span>Entre nodos<small>Challenge 03</small></span></a><nav aria-label="Pantallas del challenge"><a href="#/canciones" aria-current={page === 'canciones' ? 'page' : undefined}>01 Canciones</a><a href="#/historial" aria-current={page === 'historial' ? 'page' : undefined}>02 Historial</a></nav><span className="course-label">Estructuras de Datos II</span></header><main>{page === 'canciones' ? <Canciones /> : <Historial />}</main><footer className="site-footer"><span>JavaScript + React</span><span>Datos ficticios para practicar listas enlazadas</span></footer></div>;
}
