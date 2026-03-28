// Importamos las herramientas de enrutamiento de React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importamos los proveedores que apareceran
import { ProveedorDelCarrito } from './context/CarritoContext';

// Importamos nuestros componentes visuales
import { HeaderPrincipal } from './components/Header';
import { FooterPrincipal } from './components/Footer';

// Importamos nuestras vistas (Páginas)
import { PaginaPrincipal } from './pages/PaginaPrincipal';
import { PaginaDelProducto } from './pages/PaginaDelProducto';

// PAGINA DEL CARRITO
import { PaginaCarrito } from './pages/PaginaCarrito';

import PaginaExito from './pages/PaginaExito';

import Notificacion from './components/Notificacion';

export default function App() {
  return (
    <ProveedorDelCarrito> {/* <-- ENVOLVEMOS AQUÍ */}
      <BrowserRouter>
        <div className="contenedor-principal-de-la-pagina">
          <HeaderPrincipal />
          <main className="contenido-dinamico-central">
            <Notificacion />
            <Routes>
              <Route path="/" element={<PaginaPrincipal />} />
              <Route path="/producto/:identificadorDelProducto" element={<PaginaDelProducto />} />
              <Route path="/carrito" element={<PaginaCarrito />} /> {/* <-- NUEVA RUTA */}
              <Route path="/exito" element={<PaginaExito />} />
            </Routes>
          </main>
          <FooterPrincipal />
        </div>
      </BrowserRouter>
    </ProveedorDelCarrito>
  );
}