require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, "database", "gearbit.db");
const SCHEMA_PATH = path.join(__dirname, "database", "schema.sql");
const UPLOADS_DIR = path.join(__dirname, "uploads");
const COMPROBANTES_DIR = path.join(UPLOADS_DIR, "comprobantes");
const FACTURAS_DIR = path.join(UPLOADS_DIR, "facturas");

app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ extended: true, limit: "12mb" }));
app.use(express.static(path.join(__dirname, "Public")));
app.use("/uploads", express.static(UPLOADS_DIR));

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
fs.mkdirSync(COMPROBANTES_DIR, { recursive: true });
fs.mkdirSync(FACTURAS_DIR, { recursive: true });
const db = new sqlite3.Database(DB_PATH);

const productosIniciales = [
  {
    nombre: "Pantalla OLED iPhone 13",
    marca: "Apple Compatible",
    categoria: "Pantallas",
    precio: 65.00,
    precio_anterior: null,
    imagen: "imagenes/pantalla_oled13iphone.jpg",
    descripcion: "Pantalla OLED compatible con iPhone 13, ideal para reemplazos con excelente brillo y respuesta táctil.",
    caracteristicas: "OLED de alta definición|Compatible con iPhone 13|Incluye protección de empaque|Guía de instalación disponible",
    especificaciones: "Modelo: iPhone 13|Tipo: OLED|Color: Negro|Garantía académica: 15 días|Stock: limitado",
    stock: 8,
    video: 1,
    oferta: 0
  },
    {
    nombre: "Pantalla iPhone 11",
    marca: "Apple Compatible",
    categoria: "Pantallas",
    precio: 48.00,
    precio_anterior: null,
    imagen: "imagenes/ipho-11.jpg",
    descripcion: "Pantalla compatible con iPhone 11, ideal para reemplazo por rotura, manchas, líneas o fallas táctiles.",
    caracteristicas: "Compatible con iPhone 11|Buena respuesta táctil|Imagen clara|Instalación técnica recomendada",
    especificaciones: "Modelo: iPhone 11|Marca compatible: Apple|Tipo: LCD compatible|Color: Negro|Garantía académica: 15 días",
    stock: 12,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Pantalla iPhone 12",
    marca: "Apple Compatible",
    categoria: "Pantallas",
    precio: 58.00,
    precio_anterior: null,
    imagen: "imagenes/ipho-12.jpg",
    descripcion: "Pantalla compatible con iPhone 12 para equipos con pantalla dañada, sin imagen o con fallas táctiles.",
    caracteristicas: "Compatible con iPhone 12|Buen brillo|Respuesta táctil estable|Repuesto para reparación",
    especificaciones: "Modelo: iPhone 12|Marca compatible: Apple|Tipo: OLED compatible|Color: Negro|Stock: disponible",
    stock: 9,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Pantalla iPhone 12 Pro",
    marca: "Apple Compatible",
    categoria: "Pantallas",
    precio: 62.00,
    precio_anterior: null,
    imagen: "imagenes/ipho-12pro.jpg",
    descripcion: "Pantalla compatible con iPhone 12 Pro, pensada para reemplazo completo en reparación técnica.",
    caracteristicas: "Compatible con iPhone 12 Pro|Buena calidad visual|Táctil sensible|Instalación profesional sugerida",
    especificaciones: "Modelo: iPhone 12 Pro|Marca compatible: Apple|Tipo: OLED compatible|Color: Negro|Garantía académica: 15 días",
    stock: 8,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Pantalla iPhone 14",
    marca: "Apple Compatible",
    categoria: "Pantallas",
    precio: 98.00,
    precio_anterior: null,
    imagen: "imagenes/ipho-14.jpg",
    descripcion: "Pantalla compatible con iPhone 14, recomendada para reparar equipos con vidrio roto o fallas de imagen.",
    caracteristicas: "Compatible con iPhone 14|Alta claridad|Buen funcionamiento táctil|Repuesto premium compatible",
    especificaciones: "Modelo: iPhone 14|Marca compatible: Apple|Tipo: pantalla compatible|Color: Negro|Stock: limitado",
    stock: 5,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Pantalla iPhone 14 Pro Max",
    marca: "Apple Compatible",
    categoria: "Pantallas",
    precio: 185.00,
    precio_anterior: null,
    imagen: "imagenes/ipho-14promax.jpg",
    descripcion: "Pantalla compatible con iPhone 14 Pro Max para reparaciones de gama alta.",
    caracteristicas: "Compatible con iPhone 14 Pro Max|Excelente respuesta táctil|Buena calidad de imagen|Instalación técnica recomendada",
    especificaciones: "Modelo: iPhone 14 Pro Max|Marca compatible: Apple|Tipo: pantalla premium compatible|Color: Negro|Garantía académica: 15 días",
    stock: 4,
    video: 0,
    oferta: 0
  },

  {
    nombre: "Pantalla Samsung Galaxy A14 5G",
    marca: "Samsung Compatible",
    categoria: "Pantallas",
    precio: 38.00,
    precio_anterior: null,
    imagen: "imagenes/a14.jpg",
    descripcion: "Pantalla compatible con Samsung Galaxy A14 5G para reemplazo por golpes, manchas o fallas táctiles.",
    caracteristicas: "Compatible con Galaxy A14 5G|Buena respuesta táctil|Imagen clara|Instalación técnica recomendada",
    especificaciones: "Modelo: Galaxy A14 5G|Marca compatible: Samsung|Tipo: módulo de pantalla|Color: Negro|Garantía académica: 15 días",
    stock: 10,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Pantalla Samsung Galaxy A24",
    marca: "Samsung Compatible",
    categoria: "Pantallas",
    precio: 55.00,
    precio_anterior: null,
    imagen: "imagenes/a24.jpg",
    descripcion: "Pantalla compatible con Samsung Galaxy A24 para reparación de equipos con pantalla rota o sin imagen.",
    caracteristicas: "Compatible con Galaxy A24|Imagen clara|Respuesta táctil estable|Repuesto para reparación",
    especificaciones: "Modelo: Galaxy A24|Marca compatible: Samsung|Tipo: pantalla completa|Color: Negro|Garantía académica: 15 días",
    stock: 8,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Pantalla Samsung Galaxy A34",
    marca: "Samsung Compatible",
    categoria: "Pantallas",
    precio: 68.00,
    precio_anterior: null,
    imagen: "imagenes/a34.jpg",
    descripcion: "Pantalla compatible con Samsung Galaxy A34, recomendada para reemplazos técnicos.",
    caracteristicas: "Compatible con Galaxy A34|Buen brillo|Táctil funcional|Instalación profesional sugerida",
    especificaciones: "Modelo: Galaxy A34|Marca compatible: Samsung|Tipo: módulo pantalla|Color: Negro|Stock: limitado",
    stock: 6,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Pantalla Samsung Galaxy A53",
    marca: "Samsung Compatible",
    categoria: "Pantallas",
    precio: 72.00,
    precio_anterior: null,
    imagen: "imagenes/a53.jpg",
    descripcion: "Pantalla compatible para Samsung Galaxy A53, ideal para cambio por golpes, líneas o fallas visuales.",
    caracteristicas: "Compatible con Galaxy A53|Alta sensibilidad táctil|Buen nivel de brillo|Repuesto probado visualmente",
    especificaciones: "Modelo: Galaxy A53|Marca compatible: Samsung|Tipo: pantalla de reemplazo|Color: Negro|Garantía académica: 15 días",
    stock: 7,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Pantalla Samsung Galaxy S21",
    marca: "Samsung Compatible",
    categoria: "Pantallas",
    precio: 145.00,
    precio_anterior: null,
    imagen: "imagenes/s21.jpg",
    descripcion: "Pantalla compatible con Samsung Galaxy S21 para reparación de gama alta.",
    caracteristicas: "Compatible con Galaxy S21|Repuesto premium|Buena calidad de imagen|Uso técnico especializado",
    especificaciones: "Modelo: Galaxy S21|Marca compatible: Samsung|Tipo: pantalla premium|Color: Negro|Garantía académica: 15 días",
    stock: 4,
    video: 0,
    oferta: 0
  },

  {
    nombre: "Pantalla Redmi Note 10",
    marca: "Xiaomi Redmi Compatible",
    categoria: "Pantallas",
    precio: 42.00,
    precio_anterior: null,
    imagen: "imagenes/note10.jpg",
    descripcion: "Pantalla compatible con Redmi Note 10 para reparación por daño físico o fallas visuales.",
    caracteristicas: "Compatible con Redmi Note 10|Buen brillo|Táctil funcional|Instalación técnica recomendada",
    especificaciones: "Modelo: Redmi Note 10|Marca compatible: Xiaomi Redmi|Tipo: pantalla de reemplazo|Color: Negro|Garantía académica: 15 días",
    stock: 10,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Pantalla Redmi Note 11",
    marca: "Xiaomi Redmi Compatible",
    categoria: "Pantallas",
    precio: 45.00,
    precio_anterior: null,
    imagen: "imagenes/note11.jpg",
    descripcion: "Pantalla compatible con Redmi Note 11, útil para cambios por golpes, rayas o pantalla sin imagen.",
    caracteristicas: "Compatible con Redmi Note 11|Respuesta táctil estable|Buena calidad de imagen|Producto de reemplazo",
    especificaciones: "Modelo: Redmi Note 11|Marca compatible: Xiaomi Redmi|Tipo: módulo pantalla|Color: Negro|Stock: disponible",
    stock: 11,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Pantalla Redmi Note 12",
    marca: "Xiaomi Redmi Compatible",
    categoria: "Pantallas",
    precio: 50.00,
    precio_anterior: null,
    imagen: "imagenes/note12.jpg",
    descripcion: "Pantalla compatible con Redmi Note 12 para reemplazo técnico de pantalla dañada.",
    caracteristicas: "Compatible con Redmi Note 12|Buen nivel de brillo|Táctil sensible|Repuesto para reparación",
    especificaciones: "Modelo: Redmi Note 12|Marca compatible: Xiaomi Redmi|Tipo: pantalla completa|Color: Negro|Garantía académica: 15 días",
    stock: 9,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Pantalla Redmi 10C",
    marca: "Xiaomi Redmi Compatible",
    categoria: "Pantallas",
    precio: 35.00,
    precio_anterior: null,
    imagen: "imagenes/10c.jpg",
    descripcion: "Pantalla compatible con Redmi 10C, opción económica para reparación de pantalla rota.",
    caracteristicas: "Compatible con Redmi 10C|Precio accesible|Táctil funcional|Instalación técnica sugerida",
    especificaciones: "Modelo: Redmi 10C|Marca compatible: Xiaomi Redmi|Tipo: pantalla LCD compatible|Color: Negro|Stock: disponible",
    stock: 14,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Pantalla Redmi 12C",
    marca: "Xiaomi Redmi Compatible",
    categoria: "Pantallas",
    precio: 37.00,
    precio_anterior: null,
    imagen: "imagenes/12c.jpg",
    descripcion: "Pantalla compatible con Redmi 12C para reemplazo por fractura, manchas o fallas táctiles.",
    caracteristicas: "Compatible con Redmi 12C|Buena respuesta táctil|Repuesto económico|Instalación técnica recomendada",
    especificaciones: "Modelo: Redmi 12C|Marca compatible: Xiaomi Redmi|Tipo: pantalla de reemplazo|Color: Negro|Garantía académica: 15 días",
    stock: 13,
    video: 0,
    oferta: 0
  },

  {
    nombre: "Pantalla Honor X6",
    marca: "Honor Compatible",
    categoria: "Pantallas",
    precio: 36.00,
    precio_anterior: null,
    imagen: "imagenes/x6.jpg",
    descripcion: "Pantalla compatible con Honor X6 para reparación de celulares con pantalla dañada.",
    caracteristicas: "Compatible con Honor X6|Táctil estable|Buen brillo|Repuesto para cambio técnico",
    especificaciones: "Modelo: Honor X6|Marca compatible: Honor|Tipo: pantalla completa|Color: Negro|Garantía académica: 15 días",
    stock: 10,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Pantalla Honor X7",
    marca: "Honor Compatible",
    categoria: "Pantallas",
    precio: 40.00,
    precio_anterior: null,
    imagen: "imagenes/x7.jpg",
    descripcion: "Pantalla compatible con Honor X7, ideal para reemplazo por golpes o fallas en imagen.",
    caracteristicas: "Compatible con Honor X7|Imagen clara|Respuesta táctil funcional|Instalación técnica recomendada",
    especificaciones: "Modelo: Honor X7|Marca compatible: Honor|Tipo: módulo pantalla|Color: Negro|Stock: disponible",
    stock: 9,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Pantalla Honor X8",
    marca: "Honor Compatible",
    categoria: "Pantallas",
    precio: 44.00,
    precio_anterior: null,
    imagen: "imagenes/x8.jpg",
    descripcion: "Pantalla compatible con Honor X8 para reparación por vidrio roto, manchas o líneas.",
    caracteristicas: "Compatible con Honor X8|Buen funcionamiento táctil|Diseño de reemplazo|Producto en oferta",
    especificaciones: "Modelo: Honor X8|Marca compatible: Honor|Tipo: pantalla compatible|Color: Negro|Garantía académica: 15 días",
    stock: 8,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Pantalla Honor 90 Lite",
    marca: "Honor Compatible",
    categoria: "Pantallas",
    precio: 58.00,
    precio_anterior: null,
    imagen: "imagenes/90lite.jpg",
    descripcion: "Pantalla compatible con Honor 90 Lite, recomendada para reparación técnica completa.",
    caracteristicas: "Compatible con Honor 90 Lite|Buena calidad visual|Respuesta táctil estable|Instalación profesional sugerida",
    especificaciones: "Modelo: Honor 90 Lite|Marca compatible: Honor|Tipo: pantalla de reemplazo|Color: Negro|Stock: limitado",
    stock: 6,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Pantalla Honor Magic 5 Lite",
    marca: "Honor Compatible",
    categoria: "Pantallas",
    precio: 72.00,
    precio_anterior: null,
    imagen: "imagenes/5lite.jpg",
    descripcion: "Pantalla compatible con Honor Magic 5 Lite para reemplazo de pantalla dañada.",
    caracteristicas: "Compatible con Honor Magic 5 Lite|Repuesto premium|Buen brillo|Táctil sensible",
    especificaciones: "Modelo: Honor Magic 5 Lite|Marca compatible: Honor|Tipo: pantalla premium compatible|Color: Negro|Garantía académica: 15 días",
    stock: 5,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cargador Rápido Samsung 45W USB-C",
    marca: "Samsung",
    categoria: "Cargadores",
    precio: 13.99,
    precio_anterior: 17.99,
    imagen: "imagenes/cargador_45wsam.jpg",
    descripcion: "Adaptador de carga rápida para equipos Samsung y otros dispositivos compatibles con USB-C.",
    caracteristicas: "Carga rápida 45W|Puerto USB-C|Diseño compacto|Protección contra sobrecarga",
    especificaciones: "Potencia: 45W|Entrada: 100-240V|Salida: USB-C|Compatibilidad: Android USB-C|Color: Blanco",
    stock: 15,
    video: 0,
    oferta: 1
  },
    {
    nombre: "Cargador Completo Tipo C 25W",
    marca: "GearBit Charge",
    categoria: "Cargadores",
    precio: 14.99,
    precio_anterior: null,
    imagen: "imagenes/25w.jpg",
    descripcion: "Cargador completo con cable tipo C, ideal para celulares Android compatibles con carga rápida.",
    caracteristicas: "Incluye cabeza y cable tipo C|Carga rápida 25W|Diseño compacto|Compatible con equipos Android",
    especificaciones: "Tipo: cargador completo|Entrada: 100-240V|Salida: USB-C|Potencia: 25W|Color: Blanco",
    stock: 18,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cargador Completo Tipo C 45W",
    marca: "GearBit Charge",
    categoria: "Cargadores",
    precio: 18.99,
    precio_anterior: null,
    imagen: "imagenes/tipoc.jpg",
    descripcion: "Cargador completo tipo C de alta potencia para celulares compatibles con carga súper rápida.",
    caracteristicas: "Carga rápida 45W|Incluye cable tipo C|Protección contra sobrecarga|Ideal para Samsung, Redmi y Honor",
    especificaciones: "Tipo: cargador completo|Potencia: 45W|Salida: USB-C|Entrada: 100-240V|Color: Blanco",
    stock: 14,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cargador Completo V8 Micro USB",
    marca: "GearBit Charge",
    categoria: "Cargadores",
    precio: 9.99,
    precio_anterior: null,
    imagen: "imagenes/v8.jpg",
    descripcion: "Cargador completo con cable V8 Micro USB para celulares y dispositivos compatibles.",
    caracteristicas: "Incluye cabeza y cable V8|Carga estable|Compatible con equipos Micro USB|Uso diario",
    especificaciones: "Tipo: cargador completo|Conector: V8 Micro USB|Potencia: 10W|Color: Blanco|Uso: celular y accesorios",
    stock: 20,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cargador Completo iPhone Lightning",
    marca: "Apple Compatible",
    categoria: "Cargadores",
    precio: 17.99,
    precio_anterior: null,
    imagen: "imagenes/ipho.jpg",
    descripcion: "Cargador completo compatible con iPhone, incluye adaptador y cable Lightning.",
    caracteristicas: "Compatible con iPhone|Incluye cable Lightning|Carga estable|Diseño compacto",
    especificaciones: "Tipo: cargador completo|Conector: Lightning|Entrada: USB|Color: Blanco|Compatibilidad: iPhone",
    stock: 16,
    video: 0,
    oferta: 0
  },

  {
    nombre: "Cabeza de Cargador USB 20W",
    marca: "GearBit Charge",
    categoria: "Cargadores",
    precio: 8.50,
    precio_anterior: null,
    imagen: "imagenes/cabe.jpg",
    descripcion: "Adaptador de pared con entrada USB para conectar cables de carga tradicionales.",
    caracteristicas: "Entrada USB|Carga rápida 20W|Diseño liviano|Compatible con distintos cables",
    especificaciones: "Tipo: cabeza de cargador|Puerto: USB-A|Potencia: 20W|Entrada: 100-240V|Color: Blanco",
    stock: 22,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cabeza de Cargador Tipo C 25W",
    marca: "GearBit Charge",
    categoria: "Cargadores",
    precio: 7.50,
    precio_anterior: null,
    imagen: "imagenes/zac.jpg",
    descripcion: "Cabeza de cargador con entrada tipo C para carga rápida en celulares compatibles.",
    caracteristicas: "Puerto tipo C|Carga rápida 25W|Compacto y resistente|Compatible con cable tipo C",
    especificaciones: "Tipo: adaptador de pared|Puerto: USB-C|Potencia: 25W|Entrada: 100-240V|Color: Blanco",
    stock: 19,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cabeza de Cargador Doble USB y Tipo C",
    marca: "GearBit Charge",
    categoria: "Cargadores",
    precio: 10.99,
    precio_anterior: null,
    imagen: "imagenes/tiv8.jpg",
    descripcion: "Adaptador con doble salida USB y tipo C para cargar dos dispositivos desde una sola cabeza.",
    caracteristicas: "Puerto USB-A y USB-C|Carga simultánea|Diseño compacto|Ideal para uso diario",
    especificaciones: "Tipo: adaptador doble|Puertos: USB-A y USB-C|Potencia: 30W|Entrada: 100-240V|Color: Blanco",
    stock: 15,
    video: 0,
    oferta: 0
  },

  {
    nombre: "Cargador para Carro USB Completo",
    marca: "GearBit Car",
    categoria: "Cargadores",
    precio: 8.99,
    precio_anterior: null,
    imagen: "imagenes/cabv8.jpg",
    descripcion: "Cargador para carro con entrada USB, incluye cable para cargar dispositivos durante viajes.",
    caracteristicas: "Uso en vehículo|Entrada USB|Incluye cable|Carga estable en carretera",
    especificaciones: "Tipo: cargador de carro|Puerto: USB-A|Voltaje: 12V-24V|Incluye cable|Color: Negro",
    stock: 17,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cargador para Carro Tipo C Completo",
    marca: "GearBit Car",
    categoria: "Cargadores",
    precio: 7.99,
    precio_anterior: null,
    imagen: "imagenes/tipc.jpg",
    descripcion: "Cargador para carro con salida tipo C, ideal para carga rápida en vehículos.",
    caracteristicas: "Puerto tipo C|Carga rápida|Incluye cable tipo C|Compatible con vehículos 12V-24V",
    especificaciones: "Tipo: cargador de carro|Puerto: USB-C|Voltaje: 12V-24V|Incluye cable tipo C|Color: Negro",
    stock: 13,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cargador para Carro Doble Puerto",
    marca: "GearBit Car",
    categoria: "Cargadores",
    precio: 9.99,
    precio_anterior: null,
    imagen: "imagenes/amb.jpg",
    descripcion: "Cargador vehicular con doble puerto USB y tipo C para cargar dos equipos al mismo tiempo.",
    caracteristicas: "Puerto USB y tipo C|Carga simultánea|Diseño compacto|Ideal para viajes",
    especificaciones: "Tipo: cargador vehicular|Puertos: USB-A y USB-C|Voltaje: 12V-24V|Color: Negro|Uso: automóvil",
    stock: 12,
    video: 0,
    oferta: 0
  },

  {
    nombre: "Cable Tipo C Reforzado 1 Metro",
    marca: "GearBit Cable",
    categoria: "Cargadores",
    precio: 4.99,
    precio_anterior: null,
    imagen: "imagenes/cab.jpg",
    descripcion: "Cable tipo C reforzado para carga y transferencia de datos en dispositivos compatibles.",
    caracteristicas: "Conector tipo C|Longitud 1 metro|Material reforzado|Carga y datos",
    especificaciones: "Tipo: cable de carga|Conector: USB-A a Tipo C|Longitud: 1m|Color: Blanco|Uso: carga y datos",
    stock: 30,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cable iPhone Lightning 1 Metro",
    marca: "Apple Compatible",
    categoria: "Cargadores",
    precio: 5.99,
    precio_anterior: null,
    imagen: "imagenes/ip.jpg",
    descripcion: "Cable compatible con iPhone para carga diaria y transferencia de datos.",
    caracteristicas: "Conector Lightning|Longitud 1 metro|Carga estable|Compatible con iPhone",
    especificaciones: "Tipo: cable de carga|Conector: USB-A a Lightning|Longitud: 1m|Color: Blanco|Uso: carga y datos",
    stock: 28,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Kit de Herramientas Pro para Celulares",
    marca: "GearBit Tools",
    categoria: "Herramientas",
    precio: 12.50,
    precio_anterior: null,
    imagen: "imagenes/kit.jpg",
    descripcion: "Kit básico para mantenimiento, apertura y reparación de celulares de forma organizada.",
    caracteristicas: "Destornilladores de precisión|Palancas plásticas|Pinza técnica|Ideal para estudiantes y técnicos",
    especificaciones: "Piezas: 12|Uso: reparación móvil|Material: acero y plástico|Nivel: básico/intermedio",
    stock: 12,
    video: 1,
    oferta: 0
  },
  {
    nombre: "Pantalla Original iPhone 15 Pro Max",
    marca: "Apple Compatible",
    categoria: "Pantallas",
    precio: 275.00,
    precio_anterior: 320.00,
    imagen: "imagenes/pan_15promax.jpg",
    descripcion: "Pantalla de reemplazo premium para iPhone 15 Pro Max, pensada para reparación profesional.",
    caracteristicas: "Alta resolución|Excelente brillo|Respuesta táctil estable|Producto en oferta",
    especificaciones: "Modelo: iPhone 15 Pro Max|Tipo: pantalla premium|Color: Negro|Garantía académica: 15 días",
    stock: 4,
    video: 0,
    oferta: 1
  },
  {
    nombre: "Pantalla Samsung Galaxy A54",
    marca: "Samsung Compatible",
    categoria: "Pantallas",
    precio: 78.00,
    precio_anterior: 95.00,
    imagen: "imagenes/a54.jpg",
    descripcion: "Pantalla compatible con Samsung Galaxy A54 para reparación o reemplazo por daño físico.",
    caracteristicas: "Compatible con Galaxy A54|Buen brillo|Instalación técnica recomendada|Precio especial",
    especificaciones: "Modelo: A54|Marca compatible: Samsung|Tipo: módulo pantalla|Color: Negro",
    stock: 7,
    video: 0,
    oferta: 1
  },
  {
    nombre: "Blower Profesional Técnico",
    marca: "GearBit Tools",
    categoria: "Herramientas",
    precio: 65.00,
    precio_anterior: 85.00,
    imagen: "imagenes/calor.jpg",
    descripcion: "Herramienta de aire caliente para trabajos técnicos en celulares y componentes electrónicos.",
    caracteristicas: "Control de temperatura|Uso técnico|Diseño resistente|Ideal para reparación electrónica",
    especificaciones: "Tipo: blower|Uso: técnico|Voltaje: 110V|Garantía académica: 15 días",
    stock: 3,
    video: 0,
    oferta: 1
  },
  {
    nombre: "Cover Premium Antigolpes",
    marca: "GearBit Case",
    categoria: "Covers",
    precio: 15.00,
    precio_anterior: 18.00,
    imagen: "imagenes/covera22.jpg",
    descripcion: "Cover resistente para proteger el celular contra golpes, rayones y caídas leves.",
    caracteristicas: "Bordes reforzados|Material flexible|Diseño moderno|Protección diaria",
    especificaciones: "Material: TPU|Tipo: antigolpes|Color: variable|Compatibilidad: consultar modelo",
    stock: 20,
    video: 0,
    oferta: 1
  },
    {
    nombre: "Cover Transparente iPhone 13",
    marca: "GearBit Case",
    categoria: "Covers",
    precio: 3.99,
    precio_anterior: null,
    imagen: "imagenes/co-13.jpg",
    descripcion: "Cover transparente compatible con iPhone 13, ideal para proteger el equipo sin ocultar su diseño original.",
    caracteristicas: "Diseño transparente|Material flexible|Bordes elevados|Protección contra rayones",
    especificaciones: "Modelo: iPhone 13|Material: TPU|Color: Transparente|Tipo: protector flexible|Compatibilidad: iPhone",
    stock: 20,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cover Antigolpes iPhone 14 Pro Max",
    marca: "GearBit Case",
    categoria: "Covers",
    precio: 9.99,
    precio_anterior: null,
    imagen: "imagenes/co-14promax.jpg",
    descripcion: "Cover antigolpes compatible con iPhone 14 Pro Max, diseñado para mayor protección en el uso diario.",
    caracteristicas: "Bordes reforzados|Protección contra caídas leves|Diseño resistente|Ajuste preciso",
    especificaciones: "Modelo: iPhone 14 Pro Max|Material: TPU reforzado|Color: Negro|Tipo: antigolpes|Uso: diario",
    stock: 15,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cover MagSafe Compatible iPhone 15",
    marca: "GearBit Case",
    categoria: "Covers",
    precio: 13.99,
    precio_anterior: null,
    imagen: "imagenes/co-ip15.jpg",
    descripcion: "Cover compatible con iPhone 15 y sistema MagSafe, ideal para carga inalámbrica y accesorios magnéticos.",
    caracteristicas: "Compatible con MagSafe|Diseño elegante|Protección lateral|Ajuste preciso",
    especificaciones: "Modelo: iPhone 15|Material: TPU y aro magnético|Color: Transparente|Tipo: MagSafe compatible|Uso: carga inalámbrica",
    stock: 10,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cover Silicón Samsung Galaxy A54",
    marca: "GearBit Case",
    categoria: "Covers",
    precio: 9.99,
    precio_anterior: null,
    imagen: "imagenes/co-a54.jpg",
    descripcion: "Cover de silicón compatible con Samsung Galaxy A54, cómodo al tacto y resistente para uso diario.",
    caracteristicas: "Material suave|Buen agarre|Protección trasera|Diseño liviano",
    especificaciones: "Modelo: Galaxy A54|Material: silicón|Color: Variable|Tipo: cover flexible|Marca compatible: Samsung",
    stock: 18,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cover Antigolpes Samsung Galaxy A14",
    marca: "GearBit Case",
    categoria: "Covers",
    precio: 11.99,
    precio_anterior: null,
    imagen: "imagenes/co-a14.jpg",
    descripcion: "Cover resistente compatible con Samsung Galaxy A14, pensado para proteger bordes, esquinas y parte trasera.",
    caracteristicas: "Bordes reforzados|Material resistente|Diseño moderno|Protección diaria",
    especificaciones: "Modelo: Galaxy A14|Material: TPU reforzado|Color: Negro|Tipo: antigolpes|Compatibilidad: Samsung",
    stock: 16,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cover con Soporte Samsung Galaxy S21",
    marca: "GearBit Case",
    categoria: "Covers",
    precio: 13.99,
    precio_anterior: null,
    imagen: "imagenes/co-s21.jpg",
    descripcion: "Cover compatible con Samsung Galaxy S21 con soporte trasero para ver videos o realizar videollamadas.",
    caracteristicas: "Soporte integrado|Protección reforzada|Diseño funcional|Buen agarre",
    especificaciones: "Modelo: Galaxy S21|Material: TPU y policarbonato|Color: Negro|Tipo: cover con soporte|Uso: multimedia",
    stock: 12,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cover Transparente Redmi Note 12",
    marca: "GearBit Case",
    categoria: "Covers",
    precio: 7.99,
    precio_anterior: null,
    imagen: "imagenes/co-no12.jpg",
    descripcion: "Cover transparente compatible con Redmi Note 12, ideal para protección ligera y diseño sencillo.",
    caracteristicas: "Transparente|Flexible|Ligero|Protección contra rayones",
    especificaciones: "Modelo: Redmi Note 12|Material: TPU|Color: Transparente|Tipo: cover básico|Compatibilidad: Xiaomi Redmi",
    stock: 22,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cover Antigolpes Redmi Note 11",
    marca: "GearBit Case",
    categoria: "Covers",
    precio: 10.99,
    precio_anterior: null,
    imagen: "imagenes/co-no11.jpg",
    descripcion: "Cover antigolpes compatible con Redmi Note 11, diseñado para proteger el celular de golpes leves.",
    caracteristicas: "Protección reforzada|Bordes elevados|Ajuste cómodo|Diseño resistente",
    especificaciones: "Modelo: Redmi Note 11|Material: TPU reforzado|Color: Negro|Tipo: antigolpes|Compatibilidad: Redmi",
    stock: 17,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cover Honor X8 Diseño Elegante",
    marca: "GearBit Case",
    categoria: "Covers",
    precio: 9.50,
    precio_anterior: null,
    imagen: "imagenes/co-x8.jpg",
    descripcion: "Cover compatible con Honor X8 con diseño elegante para proteger el celular manteniendo una apariencia moderna.",
    caracteristicas: "Diseño elegante|Buen agarre|Protección trasera|Material flexible",
    especificaciones: "Modelo: Honor X8|Material: TPU|Color: Variable|Tipo: cover elegante|Compatibilidad: Honor",
    stock: 14,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cover Antigolpes Honor 90 Lite",
    marca: "GearBit Case",
    categoria: "Covers",
    precio: 11.50,
    precio_anterior: null,
    imagen: "imagenes/co-90lite.jpg",
    descripcion: "Cover antigolpes compatible con Honor 90 Lite, ideal para proteger el equipo en el uso diario.",
    caracteristicas: "Bordes reforzados|Protección contra golpes leves|Diseño resistente|Ajuste seguro",
    especificaciones: "Modelo: Honor 90 Lite|Material: TPU reforzado|Color: Negro|Tipo: antigolpes|Compatibilidad: Honor",
    stock: 13,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cover de SM A25 con Porta Tarjeta",
    marca: "GearBit Case",
    categoria: "Covers",
    precio: 6.75,
    precio_anterior: null,
    imagen: "imagenes/co-a25.jpg",
    descripcion: "Cover tipo universal con espacio para tarjeta, práctico para usuarios que buscan comodidad diaria.",
    caracteristicas: "Porta tarjeta integrado|Diseño práctico|Protección trasera|Uso diario",
    especificaciones: "Tipo: cover universal|Material: TPU y cuero sintético|Color: Negro|Función: porta tarjeta|Compatibilidad: consultar modelo",
    stock: 11,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Cover Acrílico Premium Transparente de Iphone 17 pro",
    marca: "GearBit Case",
    categoria: "Covers",
    precio: 8.50,
    precio_anterior: null,
    imagen: "imagenes/co-ip17pro.jpg",
    descripcion: "Cover acrílico transparente de estilo premium de Iphone 17 pro, ideal para protección y apariencia limpia.",
    caracteristicas: "Parte trasera rígida|Bordes flexibles|Diseño transparente|Protección elegante",
    especificaciones: "Tipo: cover premium|Material: acrílico y TPU|Color: Transparente|Compatibilidad: varios modelos|Uso: diario",
    stock: 15,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Protector de Pantalla Templado",
    marca: "GearBit Glass",
    categoria: "Protectores",
    precio: 9.50,
    precio_anterior: 12.00,
    imagen: "imagenes/paquetevidrio.jpg",
    descripcion: "Vidrio templado para proteger la pantalla del celular contra rayones y golpes leves.",
    caracteristicas: "Vidrio templado|Fácil instalación|Alta transparencia|Protección contra rayones",
    especificaciones: "Material: vidrio|Dureza: 9H|Compatibilidad: varios modelos|Incluye limpieza previa",
    stock: 25,
    video: 0,
    oferta: 1
  },
    {
    nombre: "Protector Vidrio Templado Unidad",
    marca: "GearBit Glass",
    categoria: "Protectores",
    precio: 3.99,
    precio_anterior: null,
    imagen: "imagenes/pro-te.jpg",
    descripcion: "Protector de vidrio templado vendido por unidad, ideal para proteger la pantalla contra rayones y golpes leves.",
    caracteristicas: "Venta por unidad|Vidrio templado|Alta transparencia|Fácil instalación",
    especificaciones: "Tipo: vidrio templado|Presentación: 1 unidad|Dureza: 9H|Compatibilidad: consultar modelo|Incluye limpieza previa",
    stock: 40,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Caja de Vidrios Templados 10 Unidades",
    marca: "GearBit Glass",
    categoria: "Protectores",
    precio: 24.99,
    precio_anterior: null,
    imagen: "imagenes/pro-10.jpg",
    descripcion: "Caja con 10 protectores de vidrio templado, ideal para técnicos, revendedores o uso frecuente.",
    caracteristicas: "Caja de 10 unidades|Ideal para técnicos|Alta transparencia|Protección contra rayones",
    especificaciones: "Tipo: vidrio templado|Presentación: caja de 10|Dureza: 9H|Compatibilidad: varios modelos|Uso: venta o reparación",
    stock: 12,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Protector Antiespía Unidad",
    marca: "GearBit Privacy",
    categoria: "Protectores",
    precio: 6.99,
    precio_anterior: null,
    imagen: "imagenes/pro-so.jpg",
    descripcion: "Protector antiespía vendido por unidad, diseñado para reducir la visibilidad lateral de la pantalla.",
    caracteristicas: "Privacidad lateral|Venta por unidad|Vidrio oscuro|Protección contra rayones",
    especificaciones: "Tipo: antiespía|Presentación: 1 unidad|Dureza: 9H|Color: oscuro|Compatibilidad: consultar modelo",
    stock: 25,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Caja Protectores Antiespía 10 Unidades",
    marca: "GearBit Privacy",
    categoria: "Protectores",
    precio: 39.99,
    precio_anterior: null,
    imagen: "imagenes/pro-un.jpg",
    descripcion: "Caja de 10 protectores antiespía, ideal para tiendas, técnicos o ventas por volumen.",
    caracteristicas: "Caja de 10 unidades|Protección de privacidad|Vidrio oscuro|Ideal para reventa",
    especificaciones: "Tipo: antiespía|Presentación: caja de 10|Dureza: 9H|Color: oscuro|Uso: técnico/comercial",
    stock: 8,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Protector Cerámico Flexible",
    marca: "GearBit Glass",
    categoria: "Protectores",
    precio: 5.99,
    precio_anterior: null,
    imagen: "imagenes/pro-fl.jpg",
    descripcion: "Protector cerámico flexible, recomendado para equipos con bordes curvos o usuarios que prefieren protección ligera.",
    caracteristicas: "Material flexible|Buena sensibilidad táctil|Fácil instalación|Protección contra rayones",
    especificaciones: "Tipo: cerámico flexible|Presentación: 1 unidad|Color: transparente|Compatibilidad: varios modelos|Uso: pantalla curva",
    stock: 30,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Protector Hidrogel Transparente",
    marca: "GearBit Hydrogel",
    categoria: "Protectores",
    precio: 7.99,
    precio_anterior: null,
    imagen: "imagenes/pro-hy.jpg",
    descripcion: "Protector de hidrogel transparente, ideal para pantallas curvas y protección contra rayones diarios.",
    caracteristicas: "Material hidrogel|Alta sensibilidad táctil|Se adapta a pantallas curvas|Acabado transparente",
    especificaciones: "Tipo: hidrogel|Presentación: 1 unidad|Color: transparente|Compatibilidad: varios modelos|Uso: protección ligera",
    stock: 22,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Protector Hidrogel Mate Anti Huellas",
    marca: "GearBit Hydrogel",
    categoria: "Protectores",
    precio: 8.99,
    precio_anterior: null,
    imagen: "imagenes/pro.mate.jpg",
    descripcion: "Protector hidrogel con acabado mate, diseñado para reducir reflejos y marcas de huellas.",
    caracteristicas: "Acabado mate|Reduce huellas|Buena sensibilidad táctil|Ideal para uso diario",
    especificaciones: "Tipo: hidrogel mate|Presentación: 1 unidad|Color: mate translúcido|Compatibilidad: varios modelos|Uso: anti reflejo",
    stock: 20,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Protector 9D Bordes Completos",
    marca: "GearBit Glass",
    categoria: "Protectores",
    precio: 5.50,
    precio_anterior: null,
    imagen: "imagenes/pro-9d.jpg",
    descripcion: "Protector 9D con cobertura de bordes completos, pensado para una protección más amplia de la pantalla.",
    caracteristicas: "Cobertura completa|Bordes redondeados|Vidrio templado|Alta transparencia",
    especificaciones: "Tipo: 9D|Presentación: 1 unidad|Dureza: 9H|Color: transparente con borde|Compatibilidad: consultar modelo",
    stock: 28,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Protector de Cámara iPhone",
    marca: "GearBit Lens",
    categoria: "Protectores",
    precio: 4.99,
    precio_anterior: null,
    imagen: "imagenes/pro-ip.jpg",
    descripcion: "Protector para cámara compatible con iPhone, diseñado para evitar rayones en los lentes.",
    caracteristicas: "Protección de cámara|Vidrio resistente|Fácil instalación|Diseño discreto",
    especificaciones: "Tipo: protector de cámara|Compatibilidad: iPhone|Presentación: 1 unidad|Material: vidrio|Color: transparente",
    stock: 35,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Protector de Cámara Samsung A15",
    marca: "GearBit Lens",
    categoria: "Protectores",
    precio: 4.99,
    precio_anterior: null,
    imagen: "imagenes/pro-a15.jpg",
    descripcion: "Protector de cámara compatible con equipos Samsung, útil para evitar rayones y marcas en los lentes.",
    caracteristicas: "Protección para lentes|Vidrio transparente|Instalación rápida|Diseño ligero",
    especificaciones: "Tipo: protector de cámara|Compatibilidad: Samsung|Presentación: 1 unidad|Material: vidrio|Color: transparente",
    stock: 32,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Kit Protector Pantalla y Cámara de A21s",
    marca: "GearBit Glass",
    categoria: "Protectores",
    precio: 9.99,
    precio_anterior: null,
    imagen: "imagenes/pro-a21s.jpg",
    descripcion: "Kit que incluye protector de pantalla y protector de cámara para una protección más completa del equipo.",
    caracteristicas: "Incluye protector de pantalla|Incluye protector de cámara|Fácil instalación|Protección completa",
    especificaciones: "Tipo: kit protector|Presentación: pantalla + cámara|Material: vidrio|Compatibilidad: consultar modelo|Uso: protección completa",
    stock: 18,
    video: 0,
    oferta: 0
  },
  {
    nombre: "Paquete Protector Económico 3 Unidades",
    marca: "GearBit Glass",
    categoria: "Protectores",
    precio: 10.99,
    precio_anterior: null,
    imagen: "imagenes/pro-3.jpg",
    descripcion: "Paquete económico de 3 protectores de pantalla, ideal para tener repuestos disponibles.",
    caracteristicas: "Incluye 3 unidades|Precio económico|Vidrio templado|Protección contra rayones",
    especificaciones: "Tipo: vidrio templado|Presentación: paquete de 3|Dureza: 9H|Compatibilidad: consultar modelo|Uso: repuesto personal",
    stock: 20,
    video: 0,
    oferta: 0
  },
];

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}


function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function limpiarNombreArchivo(value) {
  return String(value || "archivo")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

async function asegurarColumnasPedidos() {
  const columnas = await all("PRAGMA table_info(pedidos)");
  const nombres = columnas.map(col => col.name);
  const agregar = async (nombre, definicion) => {
    if (!nombres.includes(nombre)) {
      await run(`ALTER TABLE pedidos ADD COLUMN ${nombre} ${definicion}`);
    }
  };
  await agregar("comprobante_pago", "TEXT");
  await agregar("factura_archivo", "TEXT");
  await agregar("factura_estado", "TEXT NOT NULL DEFAULT 'Pendiente de emisión'");
}

function guardarComprobanteDesdeBase64(comprobante) {
  if (!comprobante || !comprobante.contenido) return "";

  const tiposPermitidos = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
  };

  const mime = String(comprobante.tipo || "").toLowerCase();
  const extension = tiposPermitidos[mime];
  if (!extension) {
    const error = new Error("Solo se permiten comprobantes en formato JPG, JPEG, PNG o WEBP.");
    error.statusCode = 400;
    throw error;
  }

  const base64 = String(comprobante.contenido).replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  const maxBytes = 5 * 1024 * 1024;
  if (!buffer.length || buffer.length > maxBytes) {
    const error = new Error("El comprobante debe pesar menos de 5 MB.");
    error.statusCode = 400;
    throw error;
  }

  const nombreBase = limpiarNombreArchivo(comprobante.nombre || `comprobante${extension}`);
  const nombreArchivo = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${nombreBase.replace(/\.[^.]+$/, "")}${extension}`;
  fs.writeFileSync(path.join(COMPROBANTES_DIR, nombreArchivo), buffer);
  return `/uploads/comprobantes/${nombreArchivo}`;
}

function crearFacturaHtml(pedido) {
  const fecha = new Date().toLocaleString("es-PA", {
    timeZone: "America/Panama",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
  const detalle = Array.isArray(pedido.detalle) ? pedido.detalle : [];
  const filas = detalle.map(item => {
    const precio = Number(item.precio || 0);
    const cantidad = Number(item.cantidad || 0);
    const subtotal = precio * cantidad;
    return `
      <tr>
        <td>${escapeHtml(item.nombre)}</td>
        <td class="center">${cantidad}</td>
        <td class="right">$${precio.toFixed(2)}</td>
        <td class="right">$${subtotal.toFixed(2)}</td>
      </tr>`;
  }).join("");
  const estadoPago = pedido.metodo_pago === "Pago al recibir" ? "Pendiente al recibir" : "Registrado para verificación";
  const comprobante = pedido.comprobante_pago
    ? `<a class="comprobante" href="${escapeHtml(pedido.comprobante_pago)}" target="_blank">Ver comprobante de pago</a>`
    : `<span class="muted">No aplica para este método de pago</span>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Factura GEARBIT #${pedido.id}</title>
  <style>
    :root { --dark:#101820; --blue:#0099ff; --orange:#ff7a00; --soft:#f5f7fb; --line:#e5eaf1; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: var(--dark); background: linear-gradient(135deg, #eef7ff 0%, #ffffff 45%, #fff6ed 100%); padding: 30px 14px; }
    .factura { max-width: 860px; margin: auto; background: #fff; border-radius: 26px; overflow: hidden; box-shadow: 0 22px 60px rgba(16,24,32,.14); border: 1px solid rgba(16,24,32,.06); }
    .top { background: linear-gradient(135deg, #101820, #183653); color: white; padding: 34px; display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
    .logo { font-size: 34px; font-weight: 900; letter-spacing: .5px; }
    .logo span { color: var(--orange); }
    .top p { margin: 6px 0 0; opacity: .88; }
    .badge { background: rgba(255,122,0,.16); color: #ffd6ae; padding: 10px 14px; border: 1px solid rgba(255,122,0,.35); border-radius: 999px; font-weight: 800; display: inline-block; }
    .content { padding: 34px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .card { background: var(--soft); border: 1px solid var(--line); border-radius: 18px; padding: 18px; }
    .card h3 { margin: 0 0 12px; color: var(--blue); font-size: 16px; text-transform: uppercase; letter-spacing: .06em; }
    .card p { margin: 6px 0; line-height: 1.45; }
    table { width: 100%; border-collapse: collapse; overflow: hidden; border-radius: 18px; margin-top: 10px; }
    th { background: #101820; color: white; text-align: left; padding: 14px; font-size: 14px; }
    td { border-bottom: 1px solid var(--line); padding: 14px; }
    .center { text-align: center; }
    .right { text-align: right; }
    .total { display: flex; justify-content: flex-end; margin-top: 24px; }
    .total-box { min-width: 260px; background: linear-gradient(135deg, #fff3e8, #ffffff); border: 1px solid #ffd7b3; border-radius: 20px; padding: 20px; }
    .total-box span { color: #667085; font-weight: 700; }
    .total-box strong { display: block; color: var(--orange); font-size: 34px; margin-top: 6px; }
    .comprobante { color: var(--blue); font-weight: 800; text-decoration: none; }
    .muted { color: #667085; }
    .note { margin-top: 28px; padding: 18px; border-radius: 18px; background: #eef7ff; border: 1px solid #caeaff; color: #225; line-height: 1.5; }
    .footer { text-align: center; padding: 24px 34px 34px; color: #667085; }
    @media (max-width: 700px) { .grid { grid-template-columns: 1fr; } .top, .content { padding: 24px; } table { font-size: 13px; } }
  </style>
</head>
<body>
  <main class="factura">
    <section class="top">
      <div>
        <div class="logo">GEAR<span>BIT</span></div>
        <p>Repuestos, accesorios y soporte técnico para celulares</p>
      </div>
      <div>
        <span class="badge">Factura digital #${pedido.id}</span>
        <p>${escapeHtml(fecha)}</p>
      </div>
    </section>
    <section class="content">
      <div class="grid">
        <div class="card">
          <h3>Cliente</h3>
          <p><strong>Nombre:</strong> ${escapeHtml(pedido.cliente_nombre)}</p>
          <p><strong>Correo:</strong> ${escapeHtml(pedido.cliente_correo)}</p>
          <p><strong>Teléfono:</strong> ${escapeHtml(pedido.cliente_telefono)}</p>
        </div>
        <div class="card">
          <h3>Pago</h3>
          <p><strong>Método:</strong> ${escapeHtml(pedido.metodo_pago)}</p>
          <p><strong>Referencia:</strong> ${escapeHtml(pedido.referencia_pago || "N/A")}</p>
          <p><strong>Estado:</strong> ${escapeHtml(estadoPago)}</p>
          <p><strong>Comprobante:</strong> ${comprobante}</p>
        </div>
      </div>
      <h2>Detalle del pedido</h2>
      <table>
        <thead><tr><th>Producto</th><th class="center">Cantidad</th><th class="right">Precio</th><th class="right">Subtotal</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
      <div class="total"><div class="total-box"><span>Total pagado / a pagar</span><strong>$${Number(pedido.total || 0).toFixed(2)}</strong></div></div>
      <div class="note"><strong>Gracias por comprar en GEARBIT.</strong> Esta factura digital fue generada automáticamente con los datos registrados en la tienda. Los pagos por Yappy quedan sujetos a verificación del comprobante.</div>
    </section>
    <section class="footer">GEARBIT · gearbit@gmail.com · +507 6599-3385 · Panamá</section>
  </main>
</body>
</html>`;
}

function generarFactura(pedido) {
  const html = crearFacturaHtml(pedido);
  const nombreArchivo = `factura-gearbit-${pedido.id}.html`;
  fs.writeFileSync(path.join(FACTURAS_DIR, nombreArchivo), html, "utf8");
  return {
    url: `/uploads/facturas/${nombreArchivo}`,
    archivo: nombreArchivo,
    html
  };
}

function obtenerConfigCorreo() {
  const usuario = process.env.EMAIL_USER || process.env.GMAIL_USER || "";
  const clave = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || "";
  const nombre = process.env.EMAIL_FROM_NAME || "GEARBIT";

  if (!usuario || !clave) {
    return null;
  }

  return { usuario, clave, nombre };
}

async function enviarFacturaPorCorreo(pedido, factura) {
  const config = obtenerConfigCorreo();
  if (!config) {
    return {
      enviado: false,
      estado: "Factura generada, pero el correo no está configurado en .env"
    };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.usuario,
      pass: config.clave
    }
  });

  const baseUrl = process.env.WEBSITE_URL || `http://localhost:${PORT}`;
  const facturaCompletaUrl = `${baseUrl}${factura.url}`;
  const asunto = `Factura digital GEARBIT #${pedido.id}`;

  await transporter.sendMail({
    from: `"${config.nombre}" <${config.usuario}>`,
    to: pedido.cliente_correo,
    subject: asunto,
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; color:#101820; line-height:1.5;">
        <h2 style="margin-bottom:8px;">Gracias por tu compra en GEARBIT</h2>
        <p>Hola ${escapeHtml(pedido.cliente_nombre)}, tu pedido #${pedido.id} fue registrado correctamente.</p>
        <p><strong>Total:</strong> $${Number(pedido.total || 0).toFixed(2)}</p>
        <p><strong>Método de pago:</strong> ${escapeHtml(pedido.metodo_pago)}</p>
        <p>Puedes ver tu factura digital aquí:</p>
        <p><a href="${facturaCompletaUrl}" style="display:inline-block;background:#ff7a00;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:12px;font-weight:bold;">Ver factura digital</a></p>
        <p style="color:#667085;font-size:13px;">También se adjunta una copia de la factura en formato HTML.</p>
      </div>
    `,
    attachments: [
      {
        filename: factura.archivo,
        content: factura.html,
        contentType: "text/html"
      }
    ]
  });

  return {
    enviado: true,
    estado: `Factura digital enviada al correo registrado: ${pedido.cliente_correo}`
  };
}

async function inicializarBaseDatos() {
  const schema = fs.readFileSync(SCHEMA_PATH, "utf8");
  await new Promise((resolve, reject) => db.exec(schema, err => err ? reject(err) : resolve()));
  await asegurarColumnasPedidos();
  const count = await get("SELECT COUNT(*) AS total FROM productos");
  if (count.total === 0) {
    for (const p of productosIniciales) {
      await run(
        `INSERT INTO productos (nombre, marca, categoria, precio, precio_anterior, imagen, descripcion, caracteristicas, especificaciones, stock, video, oferta)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.nombre, p.marca, p.categoria, p.precio, p.precio_anterior, p.imagen, p.descripcion, p.caracteristicas, p.especificaciones, p.stock, p.video, p.oferta]
      );
    }
    await run(`INSERT INTO resenas (producto_id, puntuacion, nombre, correo, comentario) VALUES (1, 5, 'Cliente Demo', 'cliente@demo.com', 'La pantalla se ve muy bien y el detalle del producto está completo.')`);
    await run(`INSERT INTO resenas (producto_id, puntuacion, nombre, correo, comentario) VALUES (2, 4, 'Usuario Demo', 'usuario@demo.com', 'Carga rápido y el precio está bastante accesible.')`);
  }
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "index.html"));
});

app.get("/api/productos", async (req, res) => {
  try {
    const { q = "", categoria = "" } = req.query;
    const params = [];
    let sql = "SELECT * FROM productos WHERE 1=1";
    if (q) {
      sql += " AND (LOWER(nombre) LIKE ? OR LOWER(marca) LIKE ? OR LOWER(categoria) LIKE ?)";
      const like = `%${q.toLowerCase()}%`;
      params.push(like, like, like);
    }
    if (categoria) {
      sql += " AND categoria = ?";
      params.push(categoria);
    }
    sql += " ORDER BY oferta DESC, id DESC";
    res.json(await all(sql, params));
  } catch (error) {
    res.status(500).json({ error: "No se pudieron cargar los productos." });
  }
});

app.get("/api/productos/:id", async (req, res) => {
  try {
    const producto = await get("SELECT * FROM productos WHERE id = ?", [req.params.id]);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado." });
    producto.resenas = await all("SELECT * FROM resenas WHERE producto_id = ? ORDER BY fecha DESC", [req.params.id]);
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: "No se pudo cargar el producto." });
  }
});

app.post("/api/resenas", async (req, res) => {
  try {
    const { producto_id, puntuacion, nombre, correo, comentario } = req.body;
    if (!producto_id || !puntuacion || !nombre || !correo || !comentario) {
      return res.status(400).json({ error: "Completa todos los campos de la reseña." });
    }
    await run(
      "INSERT INTO resenas (producto_id, puntuacion, nombre, correo, comentario) VALUES (?, ?, ?, ?, ?)",
      [producto_id, Number(puntuacion), nombre.trim(), correo.trim(), comentario.trim()]
    );
    res.json({ ok: true, mensaje: "Reseña enviada correctamente." });
  } catch (error) {
    res.status(500).json({ error: "No se pudo guardar la reseña." });
  }
});

app.post("/api/pedidos", async (req, res) => {
  try {
    const {
      cliente_nombre,
      cliente_correo,
      cliente_telefono,
      metodo_pago,
      referencia_pago,
      datos_pago,
      total,
      detalle,
      comprobante_pago
    } = req.body;

    if (!cliente_nombre || !cliente_correo || !cliente_telefono || !metodo_pago || !detalle) {
      return res.status(400).json({ error: "Completa los datos del pedido." });
    }

    let detallePedido = detalle;
    if (typeof detallePedido === "string") {
      try { detallePedido = JSON.parse(detallePedido); } catch (_) { detallePedido = []; }
    }

    if (!Array.isArray(detallePedido) || detallePedido.length === 0) {
      return res.status(400).json({ error: "El pedido debe tener al menos un producto." });
    }

    let comprobanteRuta = "";
    if (metodo_pago === "Yappy QR") {
      if (!referencia_pago) {
        return res.status(400).json({ error: "Escribe la referencia o nombre usado en Yappy." });
      }
      if (!comprobante_pago) {
        return res.status(400).json({ error: "Sube el comprobante de pago de Yappy." });
      }
      comprobanteRuta = guardarComprobanteDesdeBase64(comprobante_pago);
    }

    const datosPagoFinales = {
      ...(datos_pago || {}),
      comprobante_yappy: comprobanteRuta || "No aplica"
    };

    const result = await run(
      `INSERT INTO pedidos (cliente_nombre, cliente_correo, cliente_telefono, metodo_pago, referencia_pago, datos_pago, total, detalle, comprobante_pago, factura_estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cliente_nombre.trim(),
        cliente_correo.trim(),
        cliente_telefono.trim(),
        metodo_pago,
        referencia_pago || "",
        JSON.stringify(datosPagoFinales),
        Number(total),
        JSON.stringify(detallePedido),
        comprobanteRuta,
        "Factura digital pendiente de envío"
      ]
    );

    const pedidoParaFactura = {
      id: result.lastID,
      cliente_nombre: cliente_nombre.trim(),
      cliente_correo: cliente_correo.trim(),
      cliente_telefono: cliente_telefono.trim(),
      metodo_pago,
      referencia_pago: referencia_pago || "",
      comprobante_pago: comprobanteRuta,
      total: Number(total),
      detalle: detallePedido
    };

    const factura = generarFactura(pedidoParaFactura);
    let resultadoCorreo;
    try {
      resultadoCorreo = await enviarFacturaPorCorreo(pedidoParaFactura, factura);
    } catch (correoError) {
      console.error("No se pudo enviar la factura por correo:", correoError.message);
      resultadoCorreo = {
        enviado: false,
        estado: `Factura generada, pero no se pudo enviar al correo: ${correoError.message}`
      };
    }

    await run(
      "UPDATE pedidos SET factura_archivo = ?, factura_estado = ? WHERE id = ?",
      [factura.url, resultadoCorreo.estado, result.lastID]
    );

    res.json({
      ok: true,
      pedido_id: result.lastID,
      factura_url: factura.url,
      comprobante_url: comprobanteRuta,
      correo_enviado: resultadoCorreo.enviado,
      mensaje: resultadoCorreo.enviado
        ? `Pedido confirmado. La factura digital fue enviada al correo registrado: ${cliente_correo.trim()}.`
        : `Pedido confirmado. La factura digital fue generada, pero falta configurar el envío real de correo en el archivo .env.`
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message || "No se pudo registrar el pedido." });
  }
});

inicializarBaseDatos()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor funcionando en http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("Error al inicializar la base de datos:", err.message);
    process.exit(1);
  });
