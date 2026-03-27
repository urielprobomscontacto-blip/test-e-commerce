import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usarCarrito } from '../context/CarritoContext';
import listaDeProductosDesdeArchivo from '../data/productosPlantilla.json';
import { TarjetaProducto } from '../components/TarjetaProducto';
import { ShieldCheck, Truck, CreditCard } from 'lucide-react';

export function PaginaDelProducto() {
  // 1. Obtenemos el ID de la URL (ej: prod_001)
  const { identificadorDelProducto } = useParams();
  const { agregarProductoAlCarrito } = usarCarrito();

  // 2. Buscamos el producto en nuestro JSON
  const productoEncontrado = listaDeProductosDesdeArchivo.find(
    (p) => p.identificadorUnico === identificadorDelProducto
  );

  // 3. Estado para controlar qué imagen se muestra en grande
  const [imagenPrincipal, establecerImagenPrincipal] = useState("");

  // Efecto para poner la primera imagen por defecto al cargar
  useEffect(() => {
    if (productoEncontrado) {
      establecerImagenPrincipal(productoEncontrado.imagenesDelProducto[0]);
      window.scrollTo(0, 0); // Subir al inicio de la página al cambiar de producto
    }
  }, [identificadorDelProducto, productoEncontrado]);

  if (!productoEncontrado) {
    return <div className="mensaje-error">Producto no encontrado. <Link to="/">Volver al inicio</Link></div>;
  }

  // 4. Lógica para obtener productos relacionados
  const productosRelacionados = listaDeProductosDesdeArchivo.filter(
    (p) => productoEncontrado.productosRelacionadosPorId.includes(p.identificadorUnico)
  );

  return (
    <div className="contenedor-detalle-producto">
      {/* SECCIÓN SUPERIOR: Fotos e Información de Compra */}
      <div className="grid-detalle-principal">
        
        {/* Galería de Imágenes */}
        <div className="seccion-galeria">
          <div className="contenedor-imagen-grande">
            <img src={imagenPrincipal} alt={productoEncontrado.nombreDelProducto} />
          </div>
          <div className="carrete-miniaturas">
            {productoEncontrado.imagenesDelProducto.map((url, indice) => (
              <img 
                key={indice} 
                src={url} 
                className={imagenPrincipal === url ? "miniatura-activa" : "miniatura"}
                onClick={() => establecerImagenPrincipal(url)}
                alt="Miniatura"
              />
            ))}
          </div>
        </div>

        {/* Información y Compra */}
        <div className="seccion-informacion-compra">
          <span className="categoria-badge">{productoEncontrado.categoriaDelProducto}</span>
          <h1 className="titulo-producto-detalle">{productoEncontrado.nombreDelProducto}</h1>
          <p className="precio-detalle">${productoEncontrado.precioEnPesosMexicanos} MXN</p>
          
          <div className="divisor" />
          
          <p className="descripcion-texto">{productoEncontrado.descripcionDetallada}</p>

          <button 
            className="boton-agregar-grande"
            onClick={() => agregarProductoAlCarrito(productoEncontrado)}
          >
            Agregar al Carrito
          </button>

          {/* Iconos de confianza solicitados */}
          <div className="beneficios-compra">
            <div className="beneficio">
              <ShieldCheck size={20} color="#28a745" />
              <span>Garantía de satisfacción</span>
            </div>
            <div className="beneficio">
              <Truck size={20} color="#007bff" />
              <span>Envío seguro a todo México</span>
            </div>
            <div className="beneficio">
              <CreditCard size={20} color="#333" />
              <span>Pago procesado por Stripe</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Productos Relacionados */}
      <div className="seccion-relacionados">
        <h2 className="titulo-seccion">También te podría gustar</h2>
        <div className="cuadricula-de-productos">
          {productosRelacionados.map((relacionado) => (
            <TarjetaProducto key={relacionado.identificadorUnico} datosDelProducto={relacionado} />
          ))}
        </div>
      </div>
    </div>
  );
}