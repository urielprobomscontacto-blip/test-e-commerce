import { createContext, useState, useContext, useEffect } from 'react';

// 1. Creamos la "nube" de datos (Contexto)
const CarritoContextoPrivado = createContext();

// 2. Este es el "Proveedor" que envolverá a toda la página
export function ProveedorDelCarrito({ children }) {
  // CARGA INICIAL: Intentamos leer del almacenamiento del navegador al iniciar
  const [listaDeProductosEnElCarrito, establecerListaDeProductos] = useState(() => {
    const datosGuardados = localStorage.getItem('mi_carrito_real');
    return datosGuardados ? JSON.parse(datosGuardados) : [];
  });

  const [notificacion, establecerNotificacion] = useState({ mensaje: '', visible: false, tipo: '' });

  // PERSISTENCIA: Cada vez que el carrito cambie, lo guardamos en el navegador
  useEffect(() => {
    localStorage.setItem('mi_carrito_real', JSON.stringify(listaDeProductosEnElCarrito));
  }, [listaDeProductosEnElCarrito]);

  // --- FUNCIÓN PARA MOSTRAR EL POP-UP ---
  const mostrarPopUp = (mensaje, tipo) => {
    establecerNotificacion({ mensaje, visible: true, tipo });
    
    // Desaparecer después de 3 segundos
    setTimeout(() => {
      establecerNotificacion({ mensaje: '', visible: false, tipo: '' });
    }, 3000);
  };

  // --- FUNCIÓN: AGREGAR PRODUCTO ---
  const agregarProductoAlCarrito = (productoParaAgregar) => {
    establecerListaDeProductos((listaActual) => {
      const productoYaExiste = listaActual.find(
        (item) => item.identificadorUnico === productoParaAgregar.identificadorUnico
      );

      if (productoYaExiste) {
        return listaActual.map((item) =>
          item.identificadorUnico === productoParaAgregar.identificadorUnico
            ? { ...item, cantidadEnCarrito: item.cantidadEnCarrito + 1 }
            : item
        );
      }
      return [...listaActual, { ...productoParaAgregar, cantidadEnCarrito: 1 }];
    });
  };

  // --- FUNCIÓN NUEVA: REMOVER PRODUCTO ---
  const removerProductoDelCarrito = (idParaRemover) => {
    establecerListaDeProductos((listaActual) => {
      // Filtramos la lista: dejamos todos excepto el que coincida con el ID
      return listaActual.filter(item => item.identificadorUnico !== idParaRemover);
    });
  };

  // --- FUNCIÓN NUEVA: LIMPIAR TODO (Para la página de éxito) ---
  const vaciarCarritoCompletamente = () => {
    establecerListaDeProductos([]);
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
      removerProductoDelCarrito, // <--- Exportamos la nueva función
      vaciarCarritoCompletamente,  // <--- Exportamos la nueva función
      totalDeArticulosAgregados,
      notificacion
    }}>
      {children}
    </CarritoContextoPrivado.Provider>
  );
}

// 3. Este es el "Gancho" (Hook) para que otros componentes usen el carrito
export function usarCarrito() {
  const contexto = useContext(CarritoContextoPrivado);
  if (!contexto) {
    throw new Error("usarCarrito debe usarse dentro de un ProveedorDelCarrito");
  }
  return contexto;
}