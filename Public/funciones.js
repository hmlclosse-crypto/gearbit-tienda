const WHATSAPP = "50765993385";
let productos = [];
let productoActivo = null;
let carrito = JSON.parse(localStorage.getItem("gearbit_carrito")) || [];

let marcaSeleccionada = "";

const grid = document.getElementById("gridProductos");
const buscarProducto = document.getElementById("buscarProducto");
const filtroCategoria = document.getElementById("filtroCategoria");
const contadorCarrito = document.getElementById("contadorCarrito");
const carritoPanel = document.getElementById("carritoPanel");
const overlay = document.getElementById("overlay");

const productosFallback = [
    { id: 1, nombre: "Pantalla OLED iPhone 13", marca: "Apple Compatible", categoria: "Pantallas", precio: 65, precio_anterior: null, imagen: "imagenes/pantalla_oled13iphone.jpg", descripcion: "Pantalla OLED compatible con iPhone 13.", caracteristicas: "OLED de alta definición|Compatible con iPhone 13|Guía de instalación disponible", especificaciones: "Modelo: iPhone 13|Tipo: OLED|Color: Negro", stock: 8, video: 1, oferta: 0 },
    { id: 2, nombre: "Cargador Rápido Samsung 45W USB-C", marca: "Samsung", categoria: "Cargadores", precio: 13.99, precio_anterior: 17.99, imagen: "imagenes/cargador_45wsam.jpg", descripcion: "Cargador rápido USB-C.", caracteristicas: "Carga rápida 45W|Puerto USB-C|Diseño compacto", especificaciones: "Potencia: 45W|Entrada: 100-240V|Salida: USB-C", stock: 15, video: 0, oferta: 1 },
    { id: 3, nombre: "Kit de Herramientas Pro para Celulares", marca: "GearBit Tools", categoria: "Herramientas", precio: 12.5, precio_anterior: null, imagen: "imagenes/kit.jpg", descripcion: "Kit básico para reparación de celulares.", caracteristicas: "Destornilladores de precisión|Palancas plásticas|Pinza técnica", especificaciones: "Piezas: 12|Uso: reparación móvil|Nivel: básico/intermedio", stock: 12, video: 1, oferta: 0 }
];

async function cargarProductos() {
    try {
        const res = await fetch("/api/productos");
        if (!res.ok) throw new Error("API no disponible");
        productos = await res.json();
    } catch (error) {
        productos = productosFallback;
    }
    mostrarProductos(productos);
    actualizarCarrito();
}

function mostrarProductos(lista) {
    grid.innerHTML = "";
    if (!lista.length) {
        grid.innerHTML = `<p class="sobre-card">No se encontraron productos con ese filtro.</p>`;
        return;
    }

    lista.forEach(p => {
        const videoTag = Number(p.video) ? `<span class="badge-v"><i class="fa-solid fa-circle-play"></i> Guía incluida</span>` : "";
        const oferta = Number(p.oferta) ? `<span class="badge-oferta">Oferta</span>` : "";
        const precioAnterior = p.precio_anterior ? `<s>$${Number(p.precio_anterior).toFixed(2)}</s>` : "";

        grid.innerHTML += `
        <article class="tarjeta">
            ${oferta}
            <div class="img-card"><img src="${p.imagen}" alt="${p.nombre}"></div>
            <div class="contenido-card">
                <span class="etiqueta">${p.categoria}</span>
                <h3>${p.nombre}</h3>
                ${videoTag}
                <p class="stock">Marca: ${p.marca} • Stock: ${p.stock}</p>
                <p class="precio-card">$${Number(p.precio).toFixed(2)} ${precioAnterior}</p>
                <div class="card-actions">
                    <button class="btn-add" onclick="agregarAlCarrito(${p.id})">Añadir al carrito</button>
                    <button class="btn-detalles" onclick="abrirDetalle(${p.id})">Ver detalles</button>
                </div>
            </div>
        </article>`;
    });
}

function aplicarFiltros() {
    const texto = buscarProducto.value.toLowerCase().trim();
    const categoria = filtroCategoria.value;

    const filtrosMarca = document.getElementById("filtrosMarcaPantallas");

    if (filtrosMarca) {
        if (categoria === "Pantallas") {
            filtrosMarca.style.display = "flex";
        } else {
            filtrosMarca.style.display = "none";
            marcaSeleccionada = "";
            document.querySelectorAll(".marca-btn").forEach(btn => btn.classList.remove("activa"));
            document.querySelector('.marca-btn[data-marca=""]')?.classList.add("activa");
        }
    }

    const filtrados = productos.filter(p => {
        const textoProducto = `${p.nombre} ${p.marca} ${p.categoria}`.toLowerCase();

        const coincideTexto = textoProducto.includes(texto);
        const coincideCategoria = !categoria || p.categoria === categoria;
        const coincideMarca = !marcaSeleccionada || textoProducto.includes(marcaSeleccionada.toLowerCase());

        return coincideTexto && coincideCategoria && coincideMarca;
    });

    mostrarProductos(filtrados);
}
buscarProducto?.addEventListener("input", aplicarFiltros);
filtroCategoria?.addEventListener("change", aplicarFiltros);

document.querySelectorAll(".marca-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".marca-btn").forEach(b => b.classList.remove("activa"));
        btn.classList.add("activa");

        marcaSeleccionada = btn.dataset.marca;
        filtroCategoria.value = "Pantallas";

        aplicarFiltros();
    });
});
document.querySelectorAll(".cat-item").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".cat-item").forEach(b => b.classList.remove("activa"));
        btn.classList.add("activa");

        filtroCategoria.value = btn.dataset.categoria;

        if (btn.dataset.categoria !== "Pantallas") {
            marcaSeleccionada = "";
            document.querySelectorAll(".marca-btn").forEach(b => b.classList.remove("activa"));
            document.querySelector('.marca-btn[data-marca=""]')?.classList.add("activa");
        }

        aplicarFiltros();
        document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
    });
});
async function abrirDetalle(id) {
    try {
        const res = await fetch(`/api/productos/${id}`);
        productoActivo = res.ok ? await res.json() : productos.find(p => Number(p.id) === Number(id));
    } catch (error) {
        productoActivo = productos.find(p => Number(p.id) === Number(id));
    }
    if (!productoActivo) return;

    document.getElementById("modalProducto").style.display = "block";
    document.getElementById("modalImagen").src = productoActivo.imagen;
    document.getElementById("modalNombre").textContent = productoActivo.nombre;
    document.getElementById("modalMarca").textContent = `Marca: ${productoActivo.marca}`;
    document.getElementById("modalCategoria").textContent = productoActivo.categoria;
    document.getElementById("modalDescripcion").textContent = productoActivo.descripcion;
    document.getElementById("modalPrecio").textContent = `$${Number(productoActivo.precio).toFixed(2)}`;
    document.getElementById("resenaProductoId").value = productoActivo.id;
    document.getElementById("modalWhatsapp").href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola, quiero información del producto: ${productoActivo.nombre}`)}`;

    pintarLista("modalCaracteristicas", productoActivo.caracteristicas);
    pintarLista("modalEspecificaciones", productoActivo.especificaciones);
    pintarResenas(productoActivo.resenas || []);
}

function pintarLista(id, texto) {
    const ul = document.getElementById(id);
    ul.innerHTML = "";
    String(texto || "").split("|").forEach(item => {
        if (item.trim()) ul.innerHTML += `<li>${item.trim()}</li>`;
    });
}

function pintarResenas(resenas) {
    const contenedor = document.getElementById("listaResenas");
    if (!resenas.length) {
        contenedor.innerHTML = `<p>Aún no hay reseñas. Sé el primero en escribir una.</p>`;
        return;
    }
    contenedor.innerHTML = resenas.map(r => `
        <div class="resena">
            <div class="estrellas">${"★".repeat(r.puntuacion)}${"☆".repeat(5 - r.puntuacion)}</div>
            <strong>${r.nombre}</strong>
            <p>${r.comentario}</p>
        </div>
    `).join("");
}

document.getElementById("cerrarModal")?.addEventListener("click", () => document.getElementById("modalProducto").style.display = "none");
window.addEventListener("click", e => { if (e.target.id === "modalProducto") document.getElementById("modalProducto").style.display = "none"; });
document.getElementById("modalAgregar")?.addEventListener("click", () => { if (productoActivo) agregarAlCarrito(productoActivo.id); });

document.getElementById("formResena")?.addEventListener("submit", async e => {
    e.preventDefault();
    const data = {
        producto_id: document.getElementById("resenaProductoId").value,
        puntuacion: document.getElementById("resenaPuntuacion").value,
        comentario: document.getElementById("resenaComentario").value,
        nombre: document.getElementById("resenaNombre").value,
        correo: document.getElementById("resenaCorreo").value
    };
    const mensaje = document.getElementById("mensajeResena");
    try {
        const res = await fetch("/api/resenas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        const json = await res.json();
        mensaje.textContent = json.mensaje || json.error;
        if (res.ok) {
            e.target.reset();
            abrirDetalle(data.producto_id);
        }
    } catch (error) {
        mensaje.textContent = "Reseña simulada. Para guardarla, ejecuta el servidor con SQLite.";
    }
});

function agregarAlCarrito(id) {
    const producto = productos.find(p => Number(p.id) === Number(id));
    if (!producto) return;
    const existente = carrito.find(item => Number(item.id) === Number(id));
    if (existente) existente.cantidad += 1;
    else carrito.push({ ...producto, cantidad: 1 });
    guardarCarrito();
    abrirCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => Number(item.id) !== Number(id));
    guardarCarrito();
}

function guardarCarrito() {
    localStorage.setItem("gearbit_carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

function actualizarCarrito() {
    const items = document.getElementById("itemsCarrito");
    const total = carrito.reduce((sum, item) => sum + Number(item.precio) * item.cantidad, 0);
    contadorCarrito.textContent = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    document.getElementById("totalCarrito").textContent = `$${total.toFixed(2)}`;
    if (!carrito.length) {
        items.innerHTML = `<p>Tu carrito está vacío.</p>`;
        return;
    }
    items.innerHTML = carrito.map(item => `
        <div class="item-carrito">
            <img src="${item.imagen}" alt="${item.nombre}">
            <div>
                <h4>${item.nombre}</h4>
                <span>${item.cantidad} x $${Number(item.precio).toFixed(2)}</span>
            </div>
            <button onclick="eliminarDelCarrito(${item.id})"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join("");
}

function abrirCarrito() { carritoPanel.classList.add("abierto"); overlay.classList.add("activo"); }
function cerrarCarrito() { carritoPanel.classList.remove("abierto"); overlay.classList.remove("activo"); }
document.getElementById("abrirCarrito")?.addEventListener("click", abrirCarrito);
document.getElementById("cerrarCarrito")?.addEventListener("click", cerrarCarrito);
overlay?.addEventListener("click", cerrarCarrito);

function mostrarOpcionesPago() {
    const metodo = document.getElementById("metodoPago")?.value;
    const pagoVisa = document.getElementById("pagoVisa");
    const pagoYappy = document.getElementById("pagoYappy");

    if (pagoVisa) pagoVisa.style.display = metodo === "Visa demo" ? "block" : "none";
    if (pagoYappy) pagoYappy.style.display = metodo === "Yappy QR" ? "block" : "none";
}

document.getElementById("metodoPago")?.addEventListener("change", mostrarOpcionesPago);
mostrarOpcionesPago();

function leerArchivoComoBase64(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = () => resolve(String(lector.result).split(",")[1]);
        lector.onerror = () => reject(new Error("No se pudo leer el comprobante."));
        lector.readAsDataURL(archivo);
    });
}

function validarComprobanteYappy(archivo) {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
    const maxBytes = 5 * 1024 * 1024;

    if (!archivo) return "Sube el comprobante de pago de Yappy.";
    if (!tiposPermitidos.includes(archivo.type)) return "El comprobante debe ser JPG, JPEG, PNG o WEBP.";
    if (archivo.size > maxBytes) return "El comprobante no debe pesar más de 5 MB.";
    return "";
}

document.getElementById("formCheckout")?.addEventListener("submit", async e => {
    e.preventDefault();
    const mensaje = document.getElementById("mensajeCheckout");
    const boton = e.target.querySelector('button[type="submit"]');
    mensaje.innerHTML = "";

    if (!carrito.length) {
        mensaje.textContent = "Agrega al menos un producto antes de pagar.";
        return;
    }

    const total = carrito.reduce((sum, item) => sum + Number(item.precio) * item.cantidad, 0);
    const metodoPago = document.getElementById("metodoPago").value;

    let referencia_pago = "";
    let datos_pago = {};
    let comprobante_pago = null;

    if (metodoPago === "Visa demo") {
        datos_pago = {
            titular: document.getElementById("tarjetaNombre").value.trim(),
            numero_demo: document.getElementById("tarjetaNumero").value.trim(),
            fecha: document.getElementById("tarjetaFecha").value.trim(),
            cvv_demo: document.getElementById("tarjetaCvv").value.trim()
        };

        if (!datos_pago.titular || !datos_pago.numero_demo || !datos_pago.fecha || !datos_pago.cvv_demo) {
            mensaje.textContent = "Completa los datos de la tarjeta demo.";
            return;
        }

        referencia_pago = "Pago con tarjeta Visa demo";
    }

    if (metodoPago === "Yappy QR") {
        referencia_pago = document.getElementById("referenciaYappy").value.trim();
        const archivo = document.getElementById("comprobanteYappy").files[0];

        if (!referencia_pago) {
            mensaje.textContent = "Escribe la referencia o nombre usado en Yappy.";
            return;
        }

        const errorComprobante = validarComprobanteYappy(archivo);
        if (errorComprobante) {
            mensaje.textContent = errorComprobante;
            return;
        }

        comprobante_pago = {
            nombre: archivo.name,
            tipo: archivo.type,
            contenido: await leerArchivoComoBase64(archivo)
        };

        datos_pago = {
            referencia_yappy: referencia_pago,
            qr_mostrado: "imagenes/qr-yappy.jpg",
            comprobante_nombre: archivo.name
        };
    }

    if (metodoPago === "Pago al recibir") {
        referencia_pago = "Pago pendiente al recibir";
        datos_pago = {
            modalidad: "Pago al recibir"
        };
    }

    const pedido = {
        cliente_nombre: document.getElementById("clienteNombre").value,
        cliente_correo: document.getElementById("clienteCorreo").value,
        cliente_telefono: document.getElementById("clienteTelefono").value,
        metodo_pago: metodoPago,
        referencia_pago,
        datos_pago,
        comprobante_pago,
        total,
        detalle: carrito.map(item => ({ id: item.id, nombre: item.nombre, cantidad: item.cantidad, precio: item.precio }))
    };

    try {
        if (boton) {
            boton.disabled = true;
            boton.textContent = "Confirmando pedido...";
        }

        const res = await fetch("/api/pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        });
        const json = await res.json();

        if (json.ok) {
            mensaje.innerHTML = `Pedido #${json.pedido_id} confirmado. ${json.mensaje} <br><a class="link-factura" href="${json.factura_url}" target="_blank">Ver factura digital</a>`;
            carrito = [];
            guardarCarrito();
            e.target.reset();
            mostrarOpcionesPago();
        } else {
            mensaje.textContent = json.error || "No se pudo registrar el pedido.";
        }
    } catch (error) {
        mensaje.textContent = "No se pudo conectar con el servidor para registrar el pedido.";
    } finally {
        if (boton) {
            boton.disabled = false;
            boton.textContent = "Confirmar pedido";
        }
    }
});

let slideActual = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.getElementById("sliderDots");
slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.addEventListener("click", () => cambiarSlide(i));
    dots.appendChild(dot);
});
function cambiarSlide(index) {
    slides[slideActual].classList.remove("activo");
    dots.children[slideActual].classList.remove("activo");
    slideActual = (index + slides.length) % slides.length;
    slides[slideActual].classList.add("activo");
    dots.children[slideActual].classList.add("activo");
}
document.getElementById("nextSlide")?.addEventListener("click", () => cambiarSlide(slideActual + 1));
document.getElementById("prevSlide")?.addEventListener("click", () => cambiarSlide(slideActual - 1));
if (slides.length) {
    dots.children[0].classList.add("activo");
    setInterval(() => cambiarSlide(slideActual + 1), 4500);
}

document.getElementById("btnGuia")?.addEventListener("click", () => {
    const modelo = document.getElementById("modelSearch").value.trim();
    document.getElementById("mensajeGuia").textContent = modelo
        ? `Guía encontrada para ${modelo}: revisa el producto compatible en el catálogo.`
        : "Escribe un modelo para buscar una guía.";
});

document.getElementById("menuToggle")?.addEventListener("click", () => document.getElementById("menuPrincipal").classList.toggle("abierto"));

cargarProductos();
const inputBusquedaVideos = document.getElementById("modelSearch");
const botonBusquedaVideos = document.getElementById("btnGuia");
const mensajeGuia = document.getElementById("mensajeGuia");
const contenedorVideos = document.getElementById("resultadosVideos");
const tarjetasVideos = document.querySelectorAll(".video-guia-card");

function buscarVideoGuia() {
    if (!inputBusquedaVideos || !contenedorVideos) return;

    const textoBuscado = inputBusquedaVideos.value.toLowerCase().trim();
    let resultados = 0;

    if (textoBuscado === "") {
        contenedorVideos.style.display = "none";

        tarjetasVideos.forEach((tarjeta) => {
            tarjeta.style.display = "none";
        });

        if (mensajeGuia) {
            mensajeGuia.textContent = "";
        }

        return;
    }

    tarjetasVideos.forEach((tarjeta) => {
        const palabrasClave = tarjeta.getAttribute("data-keywords").toLowerCase();
        const titulo = tarjeta.querySelector("h3").textContent.toLowerCase();
        const descripcion = tarjeta.querySelector("p").textContent.toLowerCase();

        const coincide =
            palabrasClave.includes(textoBuscado) ||
            titulo.includes(textoBuscado) ||
            descripcion.includes(textoBuscado);

        if (coincide) {
            tarjeta.style.display = "block";
            resultados++;
        } else {
            tarjeta.style.display = "none";
        }
    });

    if (resultados > 0) {
        contenedorVideos.style.display = "grid";

        if (mensajeGuia) {
            mensajeGuia.textContent = `Se encontraron ${resultados} guía(s) para "${inputBusquedaVideos.value}".`;
        }
    } else {
        contenedorVideos.style.display = "none";

        if (mensajeGuia) {
            mensajeGuia.textContent = `No se encontraron guías para "${inputBusquedaVideos.value}".`;
        }
    }
}

if (botonBusquedaVideos) {
    botonBusquedaVideos.addEventListener("click", buscarVideoGuia);
}

if (inputBusquedaVideos) {
    inputBusquedaVideos.addEventListener("input", buscarVideoGuia);
}