// En lugar de require, usamos import (estilo ESM)
import Stripe from 'stripe';

// Inicializamos Stripe de forma moderna
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function manejadorDePago(req, res) {
  if (req.method === 'POST') {
    try {
      const { listaDeProductosParaPagar } = req.body;
      const origenBase = req.headers.origin || 'http://localhost:3000';

      // REVISIÓN CLAVE: Aquí es donde definimos 'item' (puedes llamarlo producto)
      const productosFormateadosParaStripe = listaDeProductosParaPagar.map((item) => {
        
        // 1. Verificamos si tiene imágenes para evitar el error "undefined"
        let imagenesArray = [];
        if (item.imagenesDelProducto && item.imagenesDelProducto.length > 0) {
          const primeraImagen = item.imagenesDelProducto[0];
          // Stripe solo acepta URLs que empiecen con http o https
          if (primeraImagen.startsWith('http')) {
            imagenesArray = [primeraImagen];
          }
        }

        // 2. Retornamos el objeto con el nombre correcto de la variable (item)
        return {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: item.nombreDelProducto, // Usamos 'item'
              images: imagenesArray,
            },
            unit_amount: Math.round(item.precioEnPesosMexicanos * 100),
          },
          quantity: item.cantidadEnCarrito,
        };
      });

      const sesionDePagoSegura = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: productosFormateadosParaStripe,
        mode: 'payment',
        success_url: `${origenBase}/exito`,
        cancel_url: `${origenBase}/carrito`,
      });

      return res.status(200).json({ urlDePago: sesionDePagoSegura.url });

    } catch (error) {
      // Si algo sale mal, esto aparecerá en tu terminal de VS Code
      console.error("DETALLE DEL ERROR EN EL SERVIDOR:", error.message);
      return res.status(500).json({ mensajeDeError: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Método no permitido');
  }
}