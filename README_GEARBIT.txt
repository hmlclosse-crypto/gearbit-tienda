GEARBIT - Tienda online universitaria

Cambios incluidos:
1. Carrusel automático de anuncios en la página principal.
2. Catálogo con buscador y filtro por categoría.
3. Detalle completo del producto: nombre, precio, marca, descripción, características, especificaciones y botón de WhatsApp.
4. Formulario de reseñas: puntuación, descripción, nombre, correo y enviar.
5. Carrito lateral y checkout con pago académico simulado.
6. Base de datos SQLite incluida en database/gearbit.db.
7. Archivo schema.sql para revisar o recrear la base de datos en DB Browser for SQLite.

Cómo ejecutarlo:
1. Descomprime la carpeta.
2. Abre una terminal dentro de la carpeta proyecto.
3. Ejecuta: npm install
4. Ejecuta: npm start
5. Abre en el navegador: http://localhost:3000

Base de datos:
- Puedes abrir database/gearbit.db con DB Browser for SQLite.
- Tablas principales: productos, resenas y pedidos.
- Los pedidos del checkout y las reseñas se guardan en SQLite cuando el servidor está funcionando.

Nota:
El pago online es una simulación académica gratuita. No cobra dinero real; solo registra el pedido en la base de datos.

Actualización añadida:
- En el método de pago Yappy se agregó carga de comprobante de pago.
- Se aceptan imágenes JPG, JPEG, PNG y WEBP de hasta 5 MB.
- Al confirmar pedido, el sistema guarda el comprobante, registra el pedido y genera una factura digital con diseño GEARBIT.
- La factura queda asociada al correo registrado por el cliente y se puede abrir desde el enlace que muestra el sistema.
- Para una demostración local, el envío de correo queda representado como factura digital emitida al correo registrado. Para envío real por correo se debe configurar un servicio SMTP o plataforma de correo.
