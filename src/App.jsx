import { useRef, useState } from 'react';
import { camposVacios, crearColaEjemplo, crearPersona, organizarPorLlegada } from './personas.js';

const currency = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 2 });
const arrival = new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
const money = cents => currency.format(cents / 100);
const initials = name => name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();

export default function App() {
  const queueRef = useRef(null);
  if (queueRef.current === null) queueRef.current = crearColaEjemplo();
  const orderRef = useRef(4);
  const [people, setPeople] = useState(() => queueRef.current.print());
  const [values, setValues] = useState({ ...camposVacios });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('Tres personas de ejemplo, ordenadas por su llegada.');
  const [served, setServed] = useState(null);
  const [servedCount, setServedCount] = useState(0);
  const first = queueRef.current.peek();

  function changeField(event) {
    setValues(previous => ({ ...previous, [event.target.name]: event.target.value }));
    setError('');
  }

  function addPerson(event) {
    event.preventDefault();
    try {
      const person = crearPersona(values, orderRef.current);
      queueRef.current = organizarPorLlegada([...queueRef.current.print(), person]);
      orderRef.current += 1;
      setPeople(queueRef.current.print());
      setValues({ ...camposVacios });
      setError('');
      setMessage(`Agregaste a ${person.name}. Llegada asignada: ${arrival.format(person.arrivedAt)}. Su posición depende de esa fecha.`);
    } catch (validationError) {
      setError(validationError.message);
    }
  }

  function serveNext() {
    const person = queueRef.current.dequeue();
    if (person === null) return;
    setPeople(queueRef.current.print());
    setServed(person);
    setServedCount(count => count + 1);
    setMessage(`Atendiste a ${person.name}, la primera persona de la cola. Retiro simulado: ${money(person.withdrawalCents)}.`);
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand"><span className="brand-mark" aria-hidden="true">C</span><div>En su turno<small>Challenge 05</small></div></div>
        <span className="course-label">Estructuras de Datos II</span>
      </header>
      <main>
        <header className="page-heading">
          <p className="eyebrow">Colas / Simulación de cajero</p>
          <h1>Quien llegó primero,<br />pasa primero.</h1>
          <p>Una cola de personas, un orden de llegada y un siguiente turno. Así funciona FIFO.</p>
        </header>
        <div className="workspace">
          <section className="form-section" aria-labelledby="new-person-title">
            <p className="section-number">01 / REGISTRO</p>
            <h2 id="new-person-title">Una persona más</h2>
            <p className="intro">Registra su nombre y el monto que quiere retirar.</p>
            <form onSubmit={addPerson}>
              <label htmlFor="name">Nombre de la persona</label>
              <input id="name" name="name" value={values.name} onChange={changeField} placeholder="Ej. Camilo Villota" maxLength={100} required />
              <label htmlFor="amount">Monto de retiro en COP</label>
              <div className="amount-input"><span aria-hidden="true">$</span><input id="amount" name="amount" value={values.amount} onChange={changeField} placeholder="75000" inputMode="decimal" maxLength={20} aria-describedby="amount-help" required /></div>
              <p className="field-help" id="amount-help">Sin separadores de miles. Ejemplo: 75000 o 75000,50.</p>
              <div className="arrival-note"><span aria-hidden="true">◷</span><div><strong>La llegada la asigna el sistema</strong><p>Fecha aleatoria dentro de la última hora. Las personas se ordenan por esa fecha antes de formar la cola.</p></div></div>
              {error && <p role="alert" className="error-message">{error}</p>}
              <button type="submit" className="primary">Agregar a la cola <span aria-hidden="true">+</span></button>
            </form>
            <aside className="explanation"><h3>Una cola conserva el orden</h3><code>cola.enqueue(persona)</code><p>Tras ordenar las llegadas simuladas, cada persona se agrega al final. Si dos fechas coinciden, pasa primero quien se registró antes.</p></aside>
          </section>
          <section className="queue-section" aria-labelledby="queue-title">
            <div className="queue-heading"><div><p className="section-number">02 / ESPERA</p><h2 id="queue-title">La fila del cajero</h2></div><span className="count">{queueRef.current.size()} en espera</span></div>
            <div className="next-summary"><span>Próximo en pasar</span><strong>{first ? first.name : 'No hay personas en espera'}</strong>{first && <small>Retiro de {money(first.withdrawalCents)}</small>}</div>
            {people.length > 0 ? (
              <ol className="people" aria-label="Personas ordenadas por fecha de llegada">
                {people.map((person, index) => (
                  <li key={person.id} className={index === 0 ? 'first-person' : ''}>
                    <span className="position">{String(index + 1).padStart(2, '0')}</span>
                    <span className="avatar" aria-hidden="true">{initials(person.name)}</span>
                    <div className="person-content"><div className="person-heading"><h3>{person.name}</h3>{index === 0 && <span className="first-label">Siguiente</span>}</div><p><time dateTime={new Date(person.arrivedAt).toISOString()}>{arrival.format(person.arrivedAt)}</time></p></div>
                    <strong className="amount">{money(person.withdrawalCents)}</strong>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="empty-state"><span aria-hidden="true">✓</span><h3>Todos fueron atendidos</h3><p>Agrega otra persona para iniciar una nueva fila.</p></div>
            )}
            <button type="button" className="serve-button" disabled={queueRef.current.isEmpty()} onClick={serveNext}>Atender siguiente <span aria-hidden="true">→</span></button>
            <p className="small-note"><code>peek()</code> consulta a la primera persona. <code>dequeue()</code> la retira cuando es atendida.</p>
          </section>
        </div>
        <section className="activity" aria-labelledby="activity-title">
          <div><p className="section-number">03 / ATENCIÓN</p><h2 id="activity-title">El movimiento más reciente</h2><p role="status" className="status">{message}</p></div>
          <div className="last-served"><span>Última persona atendida</span><strong>{served ? served.name : 'Todavía no has atendido a nadie'}</strong>{served && <small>{money(served.withdrawalCents)} · Llegó a las {arrival.format(served.arrivedAt)}</small>}<p>{servedCount} {servedCount === 1 ? 'persona atendida' : 'personas atendidas'}</p></div>
        </section>
      </main>
      <footer className="site-footer"><span>JavaScript + React / FIFO</span><span>Simulación con datos ficticios. Las horas se muestran en Bogotá.</span></footer>
    </div>
  );
}
