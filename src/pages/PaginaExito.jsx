import React from 'react';
import { Link } from 'react-router-dom';
import './EstilosPaginas.css'; // Usamos tus estilos existentes

const PaginaExito = () => {
  return (
    <div className="contenedor-exito" style={estilosExtra}>
      <div className="tarjeta-exito">
        <div className="icono-check">✅</div>
        <h1>¡Pago Completado!</h1>
        <p>Gracias por tu compra. Hemos recibido tu pedido correctamente.</p>
        <p className="texto-secundario">
          Recibirás un correo de confirmación con los detalles de tu envío en unos minutos.
        </p>
        
        <Link to="/" className="boton-volver-inicio">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
};

// Estilos rápidos para que se vea bien desde el inicio
const estilosExtra = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '70vh',
  textAlign: 'center',
  padding: '20px'
};

export default PaginaExito;