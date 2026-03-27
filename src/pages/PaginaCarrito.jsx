import { useState } from 'react';
import { usarCarrito } from '../context/CarritoContext';
import { Trash2, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

// Sustituye esta clave por tu "Clave publicable" que obtuviste en el Dashboard de Stripe
const stripePromesa = loadStripe('pk_test_51TEyjxAmH9GoXamvzRH64B3bSMlqPap6WXrxy6KjZC5KGzjvCBR3JIEhyrmp2PsOSHnLEDFvkOqD7H8QJebMsSvB00SALbkruN');

export function PaginaCarrito() {
  const { listaDeProductosEnElCarrito } = usarCarrito();
  
  // Estados para el sistema de cupones
  const [codigoDeCuponIngresado, establecerCodigoDeCupon] = useState("");
  const [porcentajeDeDescuento, establecerPorcentajeDeDescuento] = useState(0);
  const [mensajeDeErrorCupon, establecerMensajeDeErrorCupon] = useState("");

  // Cálculos de dinero
  const subtotalDeLaCompra = listaDeProductosEnElCarrito.reduce(
    (acumulador, prod) => acumulador + (prod.precioEnPesosMexicanos * prod.cantidadEnCarrito), 
    0
  );

  const valorDelDescuento = (subtotalDeLaCompra * porcentajeDeDescuento) / 100;
  const totalFinalConDescuento = subtotalDeLaCompra - valorDelDescuento;

  // Función para aplicar cupones (Simulada)
  const manejarAplicarCupon = () => {
    const cuponesValidos = {
      "BIENVENIDA10": 10,
      "PROMO2026": 20,
      "STRIPE": 50
    };

    if (cuponesValidos[codigoDeCuponIngresado.toUpperCase()]) {
      establecerPorcentajeDeDescuento(cuponesValidos[codigoDeCuponIngresado.toUpperCase()]);
      establecerMensajeDeErrorCupon("");
    } else {
      establecerMensajeDeErrorCupon("Este cupón no es válido o ha expirado.");
      establecerPorcentajeDeDescuento(0);
    }
  };

  if (listaDeProductosEnElCarrito.length === 0) {
    return (
      <div className="carrito-vacio">
        <h2>Tu carrito está vacío 🛒</h2>
        <p>¿Aún no sabes qué comprar? Revisa nuestros productos.</p>
        <Link to="/" className="boton-volver">Ver Catálogo</Link>
      </div>
    );
  }

  const manejarPagoConStripe = async () => {
    try {
      // Ya no necesitamos 'stripeInstancia' para la redirección directa
      const respuestaDeMiServidor = await fetch('/api/crear-sesion-de-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listaDeProductosParaPagar: listaDeProductosEnElCarrito }),
      });

      if (!respuestaDeMiServidor.ok) {
        const errorTexto = await respuestaDeMiServidor.text();
        throw new Error(`Error en el servidor: ${errorTexto}`);
      }

      const datosDeLaSesion = await respuestaDeMiServidor.json();

      // NUEVO MÉTODO 2026: Redirección directa del navegador
      // Esto es mucho más rápido y evita errores de carga de librerías externas
      if (datosDeLaSesion.urlDePago) {
        window.location.assign(datosDeLaSesion.urlDePago);
      } else {
        throw new Error("No se recibió la URL de pago de Stripe.");
      }

    } catch (error) {
      console.error("Detalle del error:", error);
      alert("Hubo un problema al conectar con Stripe. Revisa la consola.");
    }
  };

  return (
    <div className="contenedor-carrito-pagina">
      <h1 className="titulo-seccion">Tu Carrito de Compras</h1>

      <div className="grid-carrito">
        {/* LISTA DE PRODUCTOS (Izquierda) */}
        <div className="columna-productos-carrito">
          {listaDeProductosEnElCarrito.map((producto) => (
            <div key={producto.identificadorUnico} className="item-carrito">
              <img src={producto.imagenesDelProducto[0]} alt={producto.nombreDelProducto} />
              <div className="info-item">
                <h3>{producto.nombreDelProducto}</h3>
                <p>Cantidad: {producto.cantidadEnCarrito}</p>
                <p className="precio-item">${producto.precioEnPesosMexicanos} MXN c/u</p>
              </div>
              <button className="boton-eliminar-item">
                <Trash2 size={20} color="#ff4757" />
              </button>
            </div>
          ))}
        </div>

        {/* RESUMEN DE COMPRA (Derecha) */}
        <aside className="resumen-compra-panel">
          <h3>Resumen de orden</h3>
          <div className="linea-resumen">
            <span>Subtotal</span>
            <span>${subtotalDeLaCompra.toLocaleString()} MXN</span>
          </div>

          {/* Sección de Cupones */}
          <div className="seccion-cupon-input">
            <div className="input-con-boton">
              <input 
                type="text" 
                placeholder="Código de cupón" 
                value={codigoDeCuponIngresado}
                onChange={(e) => establecerCodigoDeCupon(e.target.value)}
              />
              <button onClick={manejarAplicarCupon}>Aplicar</button>
            </div>
            {porcentajeDeDescuento > 0 && (
              <p className="mensaje-exito-cupon">¡Cupón aplicado! -{porcentajeDeDescuento}%</p>
            )}
            {mensajeDeErrorCupon && (
              <p className="mensaje-error-cupon">{mensajeDeErrorCupon}</p>
            )}
          </div>

          {porcentajeDeDescuento > 0 && (
            <div className="linea-resumen descuento">
              <span>Descuento</span>
              <span>-${valorDelDescuento.toLocaleString()} MXN</span>
            </div>
          )}

          <div className="linea-resumen total-negrita">
            <span>Total estimado</span>
            <span>${totalFinalConDescuento.toLocaleString()} MXN</span>
          </div>

          <button className="boton-pagar-ahora" onClick={manejarPagoConStripe}>
            Ir a Pagar con Stripe <ArrowRight size={20} />
          </button>
        </aside>
      </div>
    </div>
  );
}