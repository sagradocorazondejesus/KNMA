let productos = JSON.parse(localStorage.getItem("productosPOS")) || [];
let ventas = JSON.parse(localStorage.getItem("ventasPOS")) || [];

function guardar() {
  localStorage.setItem("productosPOS", JSON.stringify(productos));
  localStorage.setItem("ventasPOS", JSON.stringify(ventas));
}

function mensaje(texto, error = false) {
  const m = document.getElementById("mensaje");
  m.textContent = texto;
  m.style.color = error ? "#b91c1c" : "#0f766e";
}

function agregarProducto() {
  const codigo = document.getElementById("codigo").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const costo = Number(document.getElementById("costo").value);
  const precio = Number(document.getElementById("precio").value);
  const stock = Number(document.getElementById("stock").value);

  if (!codigo || !nombre || costo < 0 || precio <= 0 || stock < 0) {
    alert("Revisa los datos del producto");
    return;
  }

  const existente = productos.find(p => p.codigo === codigo);

  if (existente) {
    existente.nombre = nombre;
    existente.costo = costo;
    existente.precio = precio;
    existente.stock += stock;
  } else {
    productos.push({ codigo, nombre, costo, precio, stock });
  }

  guardar();
  limpiarFormulario();
  render();
  mensaje("Producto guardado correctamente");
}

function limpiarFormulario() {
  document.getElementById("codigo").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("costo").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("stock").value = "";
}

function vender(codigo) {
  const producto = productos.find(p => p.codigo === codigo);

  if (!producto) {
    mensaje("Producto no encontrado", true);
    return;
  }

  if (producto.stock <= 0) {
    mensaje("Sin stock: " + producto.nombre, true);
    return;
  }

  producto.stock--;

  ventas.unshift({
    fecha: new Date().toLocaleString(),
    codigo: producto.codigo,
    nombre: producto.nombre,
    costo: producto.costo,
    precio: producto.precio,
    ganancia: producto.precio - producto.costo
  });

  guardar();
  render();
  mensaje("Venta registrada: " + producto.nombre);
}

function devolverVenta(index) {
  const venta = ventas[index];

  if (!venta) return;

  if (!confirm("¿Devolver esta venta al stock?")) return;

  const producto = productos.find(p => p.codigo === venta.codigo);

  if (producto) {
    producto.stock++;
  }

  ventas.splice(index, 1);

  guardar();
  render();
  mensaje("Venta devuelta al stock");
}

function sumarStock(codigo) {
  const producto = productos.find(p => p.codigo === codigo);

  if (producto) {
    producto.stock++;
    guardar();
    render();
  }
}

function restarStock(codigo) {
  const producto = productos.find(p => p.codigo === codigo);

  if (producto && producto.stock > 0) {
    producto.stock--;
    guardar();
    render();
  }
}

function eliminarProducto(codigo) {
  if (!confirm("¿Eliminar este producto?")) return;

  productos = productos.filter(p => p.codigo !== codigo);
  guardar();
  render();
}


function dinero(valor) {
  return Number(valor || 0).toFixed(2);
}


function render() {
  const listaProductos = document.getElementById("listaProductos");
  const listaVentas = document.getElementById("listaVentas");
  const ventaRapida = document.getElementById("ventaRapida");

  listaProductos.innerHTML = "";
  listaVentas.innerHTML = "";
  ventaRapida.innerHTML = "";

  productos.forEach(p => {
    const ganancia = p.precio - p.costo;

    ventaRapida.innerHTML += `
      <button 
        class="btn-producto ${p.stock <= 0 ? "sin-stock" : ""}" 
        onclick="vender('${p.codigo}')"
        ${p.stock <= 0 ? "disabled" : ""}
      >
        ${p.nombre}
        <small>Stock: ${p.stock} | Venta: $${dinero(p.precio)}</small>

      </button>
    `;

    listaProductos.innerHTML += `
      <div class="producto">
        <strong>${p.nombre}</strong><br>
        Clave: ${p.codigo}<br>
        Stock: <span class="${p.stock <= 3 ? "low" : ""}">${p.stock}</span>

<br>

        Compra: $${p.costo.toFixed(2)} | Venta: $${p.precio.toFixed(2)}

<br>
        Ganancia por pieza: $${ganancia.toFixed(2)}

        <div class="acciones">
          <button onclick="sumarStock('${p.codigo}')">+ Stock</button>
          <button onclick="restarStock('${p.codigo}')">- Stock</button>
          <button class="danger" onclick="eliminarProducto('${p.codigo}')">Eliminar</button>
        </div>
      </div>
    `;
  });

  ventas.slice(0, 30).forEach((v, index) => {
    listaVentas.innerHTML += `
      <div class="venta">
        <strong>${v.nombre}</strong><br>
        ${v.fecha}<br>
        Venta: $${v.precio.toFixed(2)}
| Ganancia: $${v.ganancia.toFixed(2)}
        <button class="danger" onclick="devolverVenta(${index})">Devolver al stock</button>
      </div>
    `;
  });

  const totalVentas = ventas.reduce((s, v) => s + Number(v.precio || 0), 0);
const totalGanancia = ventas.reduce((s, v) => s + Number(v.ganancia || 0), 0);
const totalInversion = productos.reduce(
  (s, p) => s + (Number(p.costo || 0) * Number(p.stock || 0)),
  0
);

  document.getElementById("totalVentas").textContent = dinero(totalVentas);
document.getElementById("totalGanancia").textContent = dinero(totalGanancia);
document.getElementById("totalInversion").textContent = dinero(totalInversion);

  document.getElementById("totalProductos").textContent = productos.length;
  document.getElementById("piezasVendidas").textContent = ventas.length;
}

function exportarCSV() {
  let csv = "Fecha,Clave,Producto,Costo,Precio,Ganancia\n";

  ventas.forEach(v => {
    csv += `${v.fecha},${v.codigo},${v.nombre},${v.costo},${v.precio},${v.ganancia}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "ventas_punto_de_venta.csv";
  a.click();

  URL.revokeObjectURL(url);
}

function borrarVentas() {
  if (!confirm("¿Borrar historial de ventas?")) return;

  ventas = [];
  guardar();
  render();
  mensaje("Historial de ventas borrado");
}

render();



function descargarRespaldo() {
  const respaldo = {
    productos: productos,
    ventas: ventas,
    fechaRespaldo: new Date().toISOString(),
    app: "Punto de Venta"
  };

  const texto = JSON.stringify(respaldo, null, 2);
  const archivo = new Blob([texto], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(archivo);

  const fecha = new Date().toLocaleDateString("es-MX").replaceAll("/", "-");
  link.download = `respaldo-punto-venta-${fecha}.json`;

  link.click();

  URL.revokeObjectURL(link.href);
}

function cargarRespaldo(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();

  lector.onload = function(e) {
    try {
      const datos = JSON.parse(e.target.result);

      if (!Array.isArray(datos.productos) || !Array.isArray(datos.ventas)) {
        alert("Este archivo no parece ser un respaldo válido.");
        return;
      }

      const confirmar = confirm(
        "Esto reemplazará los productos y ventas actuales. ¿Deseas continuar?"
      );

      if (!confirmar) return;

      productos = datos.productos;
      ventas = datos.ventas;

      guardar();
      render();

      alert("Respaldo cargado correctamente.");
    } catch (error) {
      alert("No se pudo cargar el respaldo.");
    }
  };

  lector.readAsText(archivo);
}