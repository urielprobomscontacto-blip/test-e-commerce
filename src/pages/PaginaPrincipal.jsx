import { useState } from 'react';
import listaDeProductosDesdeArchivo from '../data/productosPlantilla.json';
import { TarjetaProducto } from '../components/TarjetaProducto';
import './EstilosPaginas.css'; // Crearemos este archivo para el diseño del layout

export function PaginaPrincipal() {
  // 1. ESTADOS: La memoria de nuestros filtros
  const [categoriaSeleccionada, establecerCategoriaSeleccionada] = useState("Todas");
  const [precioMaximoSeleccionado, establecerPrecioMaximoSeleccionado] = useState(2000); // Rango inicial alto

  // 2. LÓGICA DE FILTRADO: El "Embudo"
  // Filtramos la lista original basándonos en AMBOS criterios al mismo tiempo
  const productosFiltrados = listaDeProductosDesdeArchivo.filter((producto) => {
    const coincideCategoria = 
      categoriaSeleccionada === "Todas" || 
      producto.categoriaDelProducto === categoriaSeleccionada;

    const coincidePrecio = 
      producto.precioEnPesosMexicanos <= precioMaximoSeleccionado;

    // Solo si cumple AMBAS condiciones, el producto pasa el filtro
    return coincideCategoria && coincidePrecio;
  });

  // Obtenemos las categorías únicas del JSON para no escribirlas a mano
  const categoriasDisponibles = [
    "Todas", 
    ...new Set(listaDeProductosDesdeArchivo.map(p => p.categoriaDelProducto))
  ];

  return (
    <div className="layout-con-sidebar">
      {/* BARRA LATERAL DE FILTROS */}
      <aside className="panel-de-filtros">
        <h3>Filtros</h3>
        
        <div className="grupo-filtro">
          <label>Categoría</label>
          <select 
            value={categoriaSeleccionada} 
            onChange={(e) => establecerCategoriaSeleccionada(e.target.value)}
          >
            {categoriasDisponibles.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="grupo-filtro">
          <label>Precio máximo: <strong>${precioMaximoSeleccionado}</strong></label>
          <input 
            type="range" 
            min="0" 
            max="2000" 
            step="50"
            value={precioMaximoSeleccionado}
            onChange={(e) => establecerPrecioMaximoSeleccionado(Number(e.target.value))}
          />
        </div>
      </aside>

      {/* CONTENIDO DE PRODUCTOS */}
      <section className="seccion-de-listado">
        <div className="encabezado-de-listado">
          <p className="conteo-resultados">
            Mostrando <strong>{productosFiltrados.length}</strong> resultados
          </p>
        </div>

        <div className="cuadricula-de-productos">
          {productosFiltrados.map((productoIndividual) => (
            <TarjetaProducto 
              key={productoIndividual.identificadorUnico} 
              datosDelProducto={productoIndividual} 
            />
          ))}
        </div>

        {/* Mensaje por si no hay productos que coincidan */}
        {productosFiltrados.length === 0 && (
          <p className="mensaje-sin-resultados">No se encontraron productos con esos filtros.</p>
        )}
      </section>
    </div>
  );
}