const logoUrl = "https://sagradocorazondejesus.github.io/KNMA/img/logo-kerigma.jpg";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let estiloActual = 0;

const estilos = [
  { nombre: "Moderno verde", bg: ["#f7fffb", "#2f8f88"], color: "#164b4d" },
  { nombre: "Papel cálido", bg: ["#f8ead1", "#b06a38"], color: "#6d3d1f" },
  { nombre: "Elegante oscuro", bg: ["#07111f", "#c9a44c"], color: "#f4d98a" },
  { nombre: "Juvenil dinámico", bg: ["#3a176d", "#ffcc24"], color: "#ffffff" },
  { nombre: "Mariano azul", bg: ["#eaf5ff", "#2870b8"], color: "#16416d" },
  { nombre: "Kerigma vino", bg: ["#fff5f7", "#7a1230"], color: "#7a1230" },
  { nombre: "Acuarela suave", bg: ["#f6fff7", "#78b68a"], color: "#2d6542" },
  { nombre: "Noche musical", bg: ["#111827", "#8b5cf6"], color: "#ffffff" },
];

function cargarEstilos() {
  const contenedor = document.getElementById("estilos");
  contenedor.innerHTML = "";

  estilos.forEach((e, i) => {
    const div = document.createElement("div");
    div.className = "estilo" + (i === estiloActual ? " activo" : "");
    div.innerHTML = `
      <div class="mini" style="background:linear-gradient(135deg,${e.bg[0]},${e.bg[1]})"></div>
      <strong>Estilo ${i + 1}</strong><br>
      <small>${e.nombre}</small>
    `;
    div.onclick = () => {
      estiloActual = i;
      cargarEstilos();
      generarImagen();
    };
    contenedor.appendChild(div);
  });
}

function textoMultilinea(texto, x, y, maxWidth, lineHeight) {
  const lineas = texto.split("\n");

  lineas.forEach(linea => {
    const palabras = linea.split(" ");
    let actual = "";

    palabras.forEach(palabra => {
      const prueba = actual + palabra + " ";
      if (ctx.measureText(prueba).width > maxWidth) {
        ctx.fillText(actual, x, y);
        actual = palabra + " ";
        y += lineHeight;
      } else {
        actual = prueba;
      }
    });

    ctx.fillText(actual, x, y);
    y += lineHeight;
  });
}

function generarImagen() {
  const estilo = estilos[estiloActual];
  const cita = document.getElementById("cita").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const lugar = document.getElementById("lugar").value;

  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, estilo.bg[0]);
  grad.addColorStop(1, estilo.bg[1]);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,.88)";
  ctx.roundRect(60, 60, 1080, 555, 34);
  ctx.fill();

  ctx.fillStyle = estilo.color;
  ctx.font = "bold 72px system-ui";
  ctx.fillText("ENSAYO", 330, 175);

  ctx.font = "bold 46px system-ui";
  ctx.fillText("DEL CORO", 335, 235);

  ctx.font = "28px system-ui";
  ctx.fillText("📅 Fecha: " + fecha, 335, 320);
  ctx.fillText("🕖 Hora: " + hora, 335, 370);
  ctx.fillText("📍 Lugar: " + lugar, 335, 420);

  ctx.fillStyle = "rgba(255,255,255,.75)";
  ctx.roundRect(735, 120, 340, 370, 24);
  ctx.fill();

  ctx.fillStyle = estilo.color;
  ctx.font = "bold 44px serif";
  ctx.fillText("“", 770, 185);

  ctx.font = "30px serif";
  textoMultilinea(cita, 790, 235, 240, 40);

  ctx.font = "bold 28px system-ui";
  ctx.fillText("¡Tu presencia hace la diferencia! 🎶", 345, 545);

  const logo = new Image();
  logo.crossOrigin = "anonymous";
  logo.src = logoUrl;
  logo.onload = () => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(185, 185, 95, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logo, 90, 90, 190, 190);
    ctx.restore();
  };
}

function descargarImagen() {
  const link = document.createElement("a");
  link.download = "recordatorio-ensayo.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  this.beginPath();
  this.moveTo(x + r, y);
  this.lineTo(x + w - r, y);
  this.quadraticCurveTo(x + w, y, x + w, y + r);
  this.lineTo(x + w, y + h - r);
  this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  this.lineTo(x + r, y + h);
  this.quadraticCurveTo(x, y + h, x, y + h - r);
  this.lineTo(x, y + r);
  this.quadraticCurveTo(x, y, x + r, y);
  this.closePath();
};

cargarEstilos();
generarImagen();3