import './EstilosComponentes.css';

export function FooterPrincipal() {
  return (
    <footer className="pie-de-pagina-footer">
      <div className="contenedor-columnas-footer">
        
        <div className="columna-informacion">
          <h3>Contáctanos</h3>
          <p>Email: soporte@mitienda.com.mx</p>
          <p>Teléfono: +52 55 1234 5678</p>
        </div>

        <div className="columna-informacion">
          <h3>Enlaces Rápidos</h3>
          <ul className="lista-enlaces-footer">
            <li><a href="/politicas">Políticas de Privacidad</a></li>
            <li><a href="/devoluciones">Cambios y Devoluciones</a></li>
            <li><a href="/faq">Preguntas Frecuentes</a></li>
          </ul>
        </div>

        <div className="columna-informacion">
          <h3>Nuestra Empresa</h3>
          <p>Enviamos los mejores productos a todo México con pagos seguros a través de Stripe.</p>
        </div>

      </div>
      <div className="derechos-de-autor">
        <p>© 2026 Mi Tienda Online. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}