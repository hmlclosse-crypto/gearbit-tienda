CREATE TABLE IF NOT EXISTS productos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  marca TEXT NOT NULL,
  categoria TEXT NOT NULL,
  precio REAL NOT NULL,
  precio_anterior REAL,
  imagen TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  caracteristicas TEXT NOT NULL,
  especificaciones TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  video INTEGER NOT NULL DEFAULT 0,
  oferta INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS resenas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  producto_id INTEGER NOT NULL,
  puntuacion INTEGER NOT NULL CHECK(puntuacion BETWEEN 1 AND 5),
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL,
  comentario TEXT NOT NULL,
  fecha TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(producto_id) REFERENCES productos(id)
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_nombre TEXT NOT NULL,
  cliente_correo TEXT NOT NULL,
  cliente_telefono TEXT NOT NULL,
  metodo_pago TEXT NOT NULL,
  referencia_pago TEXT,
  datos_pago TEXT,
  total REAL NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Pendiente',
  detalle TEXT NOT NULL,
  comprobante_pago TEXT,
  factura_archivo TEXT,
  factura_estado TEXT NOT NULL DEFAULT 'Pendiente de emisión',
  fecha TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
