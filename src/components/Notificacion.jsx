import React from 'react';
import { usarCarrito } from '../context/CarritoContext';
import './EstilosComponentes.css';

const Notificacion = () => {
  const { notificacion } = usarCarrito();

  if (!notificacion.visible) return null;

  return (
    <div className={`pop-up-notificacion ${notificacion.tipo}`}>
      {notificacion.tipo === 'exito' ? '🛒 ' : '🗑️ '}
      {notificacion.mensaje}
    </div>
  );
};

export default Notificacion;