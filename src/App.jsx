import { useRef, useState } from 'react';
import { camposVacios, crearPilaEjemplo, validarLibro } from './libros.js';

function Libro({ book, position, isTop }) {
  return (
    <li className={`book ${isTop ? 'top-book' : ''}`}>
      <div className="book-spine" aria-hidden="true">{String(position).padStart(2, '0')}</div>
      <div className="book-content">
        <div className="book-heading">
          <h3>{book.name}</h3>
          {isTop && <span className="top-label">Tope</span>}
        </div>
        <p>{book.author}</p>
        <div className="book-details"><span>{book.editorial}</span><span>ISBN {book.isbn}</span></div>
      </div>
    </li>
  );
}

export default function App() {
  // La clase administra la pila. React conserva una copia para dibujarla.
  const stackRef = useRef(null);
  if (stackRef.current === null) stackRef.current = crearPilaEjemplo();
  const [books, setBooks] = useState(() => stackRef.current.print());
  const [values, setValues] = useState({ ...camposVacios });
  const [message, setMessage] = useState('La pila empieza con tres libros de ejemplo.');
  const [error, setError] = useState('');
  const [removed, setRemoved] = useState(null);
  const top = stackRef.current.peek();

  function changeField(event) {
    setValues(previous => ({ ...previous, [event.target.name]: event.target.value }));
    setError('');
  }

  function addBook(event) {
    event.preventDefault();
    try {
      const book = { ...validarLibro(values), id: crypto.randomUUID() };
      stackRef.current.push(book);
      setBooks(stackRef.current.print());
      setValues({ ...camposVacios });
      setError('');
      setMessage(`Agregaste «${book.name}». Ahora es el libro del tope.`);
    } catch (validationError) {
      setError(validationError.message);
    }
  }

  function removeBook() {
    const book = stackRef.current.pop();
    if (book === null) return;
    setBooks(stackRef.current.print());
    setRemoved(book);
    setMessage(`Retiraste «${book.name}», el último libro agregado.`);
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand"><span className="brand-mark" aria-hidden="true">P</span><div>Entre páginas<small>Challenge 04</small></div></div>
        <span className="course-label">Estructuras de Datos II</span>
      </header>

      <main>
        <header className="page-heading">
          <p className="eyebrow">Pilas / Libros de ejemplo</p>
          <h1>El último que llega,<br />el primero que sale.</h1>
          <p>Agrega libros al tope y retíralos en orden inverso. Una forma de ver LIFO en acción.</p>
        </header>

        <div className="workspace">
          <section className="form-section" aria-labelledby="new-book-title">
            <p className="section-number">01 / PUSH</p>
            <h2 id="new-book-title">Un nuevo libro</h2>
            <p className="intro">Todos los campos son obligatorios.</p>
            <form onSubmit={addBook}>
              <label htmlFor="name">Nombre del libro</label>
              <input id="name" name="name" value={values.name} onChange={changeField} placeholder="Ej. Aventuras entre nodos" maxLength={150} required />

              <label htmlFor="isbn">ISBN</label>
              <input id="isbn" name="isbn" value={values.isbn} onChange={changeField} placeholder="Ej. 978-0-000000-04-0" maxLength={150} aria-describedby="isbn-help" required />
              <p className="field-help" id="isbn-help">10 o 13 caracteres; puedes incluir guiones o espacios.</p>

              <div className="form-row">
                <div><label htmlFor="author">Autor</label><input id="author" name="author" value={values.author} onChange={changeField} placeholder="Ej. Camila Luna" maxLength={150} required /></div>
                <div><label htmlFor="editorial">Editorial</label><input id="editorial" name="editorial" value={values.editorial} onChange={changeField} placeholder="Ej. Tinta y Código" maxLength={150} required /></div>
              </div>

              {error && <p className="error-message" role="alert">{error}</p>}
              <button type="submit" className="primary">Agregar al tope <span aria-hidden="true">+</span></button>
            </form>
            <aside className="explanation"><h3>¿Qué hace este botón?</h3><code>pila.push(libro)</code><p>Inserta el nuevo libro en el tope. Los que llegaron antes quedan debajo.</p></aside>
          </section>

          <section className="stack-section" aria-labelledby="stack-title">
            <div className="stack-heading"><div><p className="section-number">02 / PEEK Y POP</p><h2 id="stack-title">Tu pila de libros</h2></div><span className="count">{stackRef.current.size()} {books.length === 1 ? 'libro' : 'libros'}</span></div>
            <div className="top-summary"><span>Próximo en salir</span><strong>{top ? top.name : 'La pila está vacía'}</strong></div>

            {books.length > 0 ? (
              <ol className="books" aria-label="Pila ordenada desde el tope hacia la base">
                {books.map((book, index) => <Libro key={book.id} book={book} position={index + 1} isTop={index === 0} />)}
              </ol>
            ) : (
              <div className="empty-state"><span aria-hidden="true">∅</span><h3>Ya no quedan libros</h3><p>Agrega uno con el formulario para volver a empezar.</p></div>
            )}
            <div className="stack-base">Base de la pila</div>
            <button type="button" className="remove-button" disabled={stackRef.current.isEmpty()} onClick={removeBook}>Retirar libro del tope <span aria-hidden="true">−</span></button>
            <p className="small-note"><code>peek()</code> consulta el tope. <code>pop()</code> lo retira. El botón se desactiva cuando <code>isEmpty()</code> devuelve <code>true</code>.</p>
          </section>
        </div>

        <section className="activity" aria-labelledby="activity-title">
          <div><p className="section-number">03 / RESULTADO</p><h2 id="activity-title">El movimiento más reciente</h2><p className="status" role="status">{message}</p></div>
          <div className="last-removed"><span>Último libro retirado</span><strong>{removed ? removed.name : 'Todavía no has retirado ninguno'}</strong>{removed && <small>{removed.author} · ISBN {removed.isbn}</small>}</div>
        </section>
      </main>

      <footer className="site-footer"><span>JavaScript + React / LIFO</span><span>Libros ficticios. Los cambios se restablecen al recargar.</span></footer>
    </div>
  );
}
