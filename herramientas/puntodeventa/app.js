let productos = JSON.parse(localStorage.getItem("productosPOS")) || [];
let ventas = JSON.parse(localStorage.getItem("ventasPOS")) || [];

let codeReader = null;
let escaneando = false;
let ultimoCodigo = "";
let ultimoTiempo = 0;

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

function venderManual() {
  const codigo = document.getElementById("codigoVenta").value.trim();
  vender(codigo);
  document.getElementById("codigoVenta").value = "";
}

function vender(codigo) {
  if (!codigo) return;

  const ahora = Date.now();

  if (codigo === ultimoCodigo && ahora - ultimoTiempo < 2000) {
    return;
  }

  ultimoCodigo = codigo;
  ultimoTiempo = ahora;

  const producto = productos.find(p => p.codigo === codigo);

  if (!producto) {
    mensaje("Producto no encontrado: " + codigo, true);
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

async function iniciarCamara() {
  if (escaneando) return;

  codeReader = new ZXing.BrowserMultiFormatReader();
  escaneando = true;

  try {
    const devices = await codeReader.listVideoInputDevices();

    if (devices.length === 0) {
      mensaje("No se encontró cámara", true);
      escaneando = false;
      return;
    }

    const camaraTrasera =
      devices.find(d => d.label.toLowerCase().includes("back")) ||
      devices.find(d => d.label.toLowerCase().includes("rear")) ||
      devices[devices.length - 1];

    codeReader.decodeFromVideoDevice(
      camaraTrasera.deviceId,
      "video",
      (result, error) => {
        if (result) {
          vender(result.text);
        }
      }
    );

    mensaje("Cámara lista. Escanea un código.");
  } catch (e) {
    mensaje("No se pudo abrir la cámara. Usa GitHub Pages con https.", true);
    escaneando = false;
  }
}

function detenerCamara() {
  if (codeReader) {
    codeReader.reset();
  }

  escaneando = false;
  mensaje("Cámara detenida");
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

function render() {
  const listaProductos = document.getElementById("listaProductos");
  const listaVentas = document.getElementById("listaVentas");

  listaProductos.innerHTML = "";
  listaVentas.innerHTML = "";

  productos.forEach(p => {
    const ganancia = p.precio - p.costo;

    listaProductos.innerHTML += `
      <div class="producto">
        <strong>${p.nombre}</strong><br>
        Código: ${p.codigo}<br>
        Stock: <span class="${p.stock <= 3 ? "low" : ""}">${p.stock}</span><br>
        Compra: $${p.costo} | Venta: $${p.precio}<br>
        Ganancia por pieza: $${ganancia}

        <div class="acciones">
          <button onclick="sumarStock('${p.codigo}')">+ Stock</button>
          <button onclick="restarStock('${p.codigo}')">- Stock</button>
          <button class="danger" onclick="eliminarProducto('${p.codigo}')">Eliminar</button>
        </div>
      </div>
    `;
  });

  ventas.slice(0, 30).forEach(v => {
    listaVentas.innerHTML += `
      <div class="venta">
        <strong>${v.nombre}</strong><br>
        ${v.fecha}<br>
        Venta: $${v.precio} | Ganancia: $${v.ganancia}
      </div>
    `;
  });

  const totalVentas = ventas.reduce((s, v) => s + v.precio, 0);
  const totalGanancia = ventas.reduce((s, v) => s + v.ganancia, 0);
  const totalInversion = productos.reduce((s, p) => s + (p.costo * p.stock), 0);

  document.getElementById("totalVentas").textContent = totalVentas;
  document.getElementById("totalGanancia").textContent = totalGanancia;
  document.getElementById("totalInversion").textContent = totalInversion;
  document.getElementById("totalProductos").textContent = productos.length;
}

function exportarCSV() {
  let csv = "Fecha,Codigo,Producto,Costo,Precio,Ganancia\n";

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
}

render();