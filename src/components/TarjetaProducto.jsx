import { Link } from 'react-router-dom';
import { useState } from 'react';
import { usarCarrito } from '../context/CarritoContext';
import { ShoppingCart } from 'lucide-react';

export function TarjetaProducto({ datosDelProducto }) {
  const { agregarProductoAlCarrito } = usarCarrito();
  const [estaAnimando, establecerEstaAnimando] = useState(false);

  const manejarClicAgregar = () => {
    agregarProductoAlCarrito(datosDelProducto);
    
    // Activamos la animación por 500 milisegundos
    establecerEstaAnimando(true);
    setTimeout(() => establecerEstaAnimando(false), 500);
  };

  return (
    <div className="tarjeta-contenedor">
      <img 
        src={datosDelProducto.imagenesDelProducto[0]} 
        alt={datosDelProducto.nombreDelProducto} 
        className="imagen-producto-tarjeta"
      />
      {/* Al hacer clic en la imagen, vamos a /producto/id-del-producto */}
      <Link to={`/producto/${datosDelProducto.identificadorUnico}`}>
        <img 
          src={datosDelProducto.imagenesDelProducto[0]} 
          alt={datosDelProducto.nombreDelProducto} 
          className="imagen-producto-tarjeta"
        />
      </Link>
      <div className="info-tarjeta">
        <Link to={`/producto/${datosDelProducto.identificadorUnico}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h4 className="nombre-producto">{datosDelProducto.nombreDelProducto}</h4>
        </Link>
        <p className="categoria-texto">{datosDelProducto.categoriaDelProducto}</p>
        <div className="fila-precio-boton">
          <span className="precio-texto">${datosDelProducto.precioEnPesosMexicanos}</span>
          <button 
            onClick={manejarClicAgregar}
            className={`boton-agregar-miniatura ${estaAnimando ? 'animacion-rebote' : ''}`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}