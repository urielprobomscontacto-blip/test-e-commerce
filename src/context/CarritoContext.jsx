import { createContext, useState, useContext } from 'react';

// 1. Creamos la "nube" de datos
const CarritoContextoPrivado = createContext();

// 2. Este es el "Proveedor" que envolverá a toda la página
export function ProveedorDelCarrito({ children }) {
  const [listaDeProductosEnElCarrito, establecerListaDeProductos] = useState([]);

  // Función para agregar un producto
  const agregarProductoAlCarrito = (productoParaAgregar) => {
    establecerListaDeProductos((listaActual) => {
      // Revisamos si el producto ya estaba en el carrito
      const productoYaExiste = listaActual.find(
        (item) => item.identificadorUnico === productoParaAgregar.identificadorUnico
      );

      if (productoYaExiste) {
        // Si ya existe, solo le sumamos 1 a la cantidad
        return listaActual.map((item) =>
          item.identificadorUnico === productoParaAgregar.identificadorUnico
            ? { ...item, cantidadEnCarrito: item.cantidadEnCarrito + 1 }
            : item
        );
      }
      // Si es nuevo, lo agregamos con cantidad 1
      return [...listaActual, { ...productoParaAgregar, cantidadEnCarrito: 1 }];
    });
  };

  // Calculamos el total de productos para el circulito del Header
  const totalDeArticulosAgregados = listaDeProductosEnElCarrito.reduce(
    (acumulador, producto) => acumulador + producto.cantidadEnCarrito, 
    0
  );

  return (
    <CarritoContextoPrivado.Provider value={{ 
      listaDeProductosEnElCarrito, 
      agregarProductoAlCarrito,
      totalDeArticulosAgregados 
    }}>
      {children}
    </CarritoContextoPrivado.Provider>
  );
}

// 3. Este es el "Gancho" (Hook) para que otros componentes usen el carrito
export function usarCarrito() {
  return useContext(CarritoContextoPrivado);
}