import { Link } from 'react-router-dom'; // Herramienta para navegar sin recargar la página
import { ShoppingCart, Store } from 'lucide-react'; // Íconos de tienda y carrito
import './EstilosComponentes.css'; // Crearemos este archivo de CSS en un momento
import { usarCarrito } from '../context/CarritoContext'; // Importamos el acceso al cerebro

export function HeaderPrincipal() {
  const cantidadDeProductosEnCarrito = 0; // Por ahora es cero, luego lo conectaremos al sistema real
  const { totalDeArticulosAgregados } = usarCarrito();

  return (
    <header className="barra-superior-header">
      <div className="contenedor-header">
        {/* Link envuelve el logo para que al darle clic te lleve al inicio ("/") */}
        <Link to="/" className="enlace-logotipo">
          <Store size={32} color="#007bff" />
          <h1 className="nombre-de-la-tienda">Mi Tienda Online</h1>
        </Link>

        <Link to="/carrito" className="enlace-carrito">
          <button className="boton-carrito-compras">
            <ShoppingCart size={24} color="#333333" />
            <span className="indicador-cantidad-carrito">
              {totalDeArticulosAgregados}
            </span>
          </button>
        </Link>

        <span className="indicador-cantidad-carrito">
          {totalDeArticulosAgregados}
        </span>
      </div>
    </header>
  );
}