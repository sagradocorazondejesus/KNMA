const logoUrl = "https://sagradocorazondejesus.github.io/KNMA/img/logo-kerigma.jpg";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let estiloActual = 0;

const estilos = [
  {
    nombre: "Kerigma vino",
    fondo1: "#fff6f8",
    fondo2: "#8a1236",
    texto: "#7a1230",
    suave: "#f7edf1",
    tarjeta: "#ffffff"
  },
  {
    nombre: "Mariano azul",
    fondo1: "#eef8ff",
    fondo2: "#2678bb",
    texto: "#114466",
    suave: "#edf7ff",
    tarjeta: "#ffffff"
  },
  {
    nombre: "Papel cálido",
    fondo1: "#fff5e8",
    fondo2: "#c47a3a",
    texto: "#633719",
    suave: "#fff8ed",
    tarjeta: "#ffffff"
  },
  {
    nombre: "Verde esperanza",
    fondo1: "#f3fff8",
    fondo2: "#2f9c82",
    texto: "#15574d",
    suave: "#eefaf5",
    tarjeta: "#ffffff"
  },
  {
    nombre: "Elegante oscuro",
    fondo1: "#101820",
    fondo2: "#c8a04a",
    texto: "#f5d984",
    suave: "#182436",
    tarjeta: "#ffffff"
  },
  {
    nombre: "Juvenil morado",
    fondo1: "#25104d",
    fondo2: "#8b5cf6",
    texto: "#ffffff",
    suave: "#38206a",
    tarjeta: "#ffffff"
  },
  {
    nombre: "Acuarela",
    fondo1: "#f7fff7",
    fondo2: "#7abf91",
    texto: "#236343",
    suave: "#effaf1",
    tarjeta: "#ffffff"
  },
  {
    nombre: "Noche musical",
    fondo1: "#07111f",
    fondo2: "#263d7a",
    texto: "#ffffff",
    suave: "#101d35",
    tarjeta: "#ffffff"
  }
];

function cargarEstilos() {
  const contenedor = document.getElementById("estilos");
  contenedor.innerHTML = "";

  estilos.forEach((e, i) => {
    const div = document.createElement("div");
    div.className = "estilo" + (i === estiloActual ? " activo" : "");
    div.innerHTML = `
      <div class="mini" style="background:linear-gradient(135deg,${e.fondo1},${e.fondo2})"></div>
      <div>
        <strong>Estilo ${i + 1}</strong><br>
        <small>${e.nombre}</small>
      </div>
    `;
    div.onclick = () => {
      estiloActual = i;
      cargarEstilos();
      generarImagen();
    };
    contenedor.appendChild(div);
  });
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function escribirTextoAjustado(texto, x, y, maxWidth, lineHeight, maxY) {
  const lineas = texto.split("\n");

  for (const linea of lineas) {
    const palabras = linea.split(" ");
    let actual = "";

    for (const palabra of palabras) {
      const prueba = actual + palabra + " ";
      if (ctx.measureText(prueba).width > maxWidth && actual !== "") {
        if (y + lineHeight > maxY) return;
        ctx.fillText(actual.trim(), x, y);
        actual = palabra + " ";
        y += lineHeight;
      } else {
        actual = prueba;
      }
    }

    if (actual.trim() !== "") {
      if (y + lineHeight > maxY) return;
      ctx.fillText(actual.trim(), x, y);
      y += lineHeight;
    }

    y += lineHeight * 0.45;
  }
}

function generarImagen() {
  const estilo = estilos[estiloActual];

  const cita = document.getElementById("cita").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const lugar = document.getElementById("lugar").value;

  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, estilo.fondo1);
  grad.addColorStop(1, estilo.fondo2);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  roundRect(70, 90, 940, 1740, 55);
  ctx.fill();

  ctx.fillStyle = estilo.suave;
  roundRect(105, 1230, 870, 470, 42);
  ctx.fill();

  ctx.fillStyle = estilo.texto;

  ctx.font = "900 96px system-ui";
  ctx.fillText("ENSAYO", 100, 520);

  ctx.font = "800 62px system-ui";
  ctx.fillText("DEL CORO", 105, 600);

  ctx.font = "38px system-ui";
  ctx.fillText("📅  Fecha: " + fecha, 105, 760);
  ctx.fillText("🕖  Hora: " + hora, 105, 830);

  ctx.fillText("📍  Lugar:", 105, 900);
  ctx.font = "36px system-ui";
  escribirTextoAjustado(lugar, 165, 955, 720, 46, 1120);

  ctx.fillStyle = estilo.tarjeta;
  roundRect(105, 1230, 870, 470, 42);
  ctx.fill();

  ctx.strokeStyle = estilo.texto;
  ctx.lineWidth = 4;
  roundRect(105, 1230, 870, 470, 42);
  ctx.stroke();

  ctx.fillStyle = estilo.texto;
  ctx.font = "bold 80px serif";
  ctx.fillText("“", 150, 1340);

  ctx.font = "44px Georgia, serif";
  escribirTextoAjustado(cita, 170, 1430, 730, 58, 1625);

  ctx.font = "bold 36px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("¡Tu presencia hace la diferencia! 🎶", 540, 1770);
  ctx.textAlign = "left";

  const logo = new Image();
  logo.crossOrigin = "anonymous";
  logo.src = logoUrl;

  logo.onload = () => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(210, 260, 125, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logo, 85, 135, 250, 250);
    ctx.restore();
  };
}

function descargarImagen() {
  generarImagen();

  setTimeout(() => {
    const link = document.createElement("a");
    link.download = "recordatorio-ensayo.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, 300);
}

cargarEstilos();
generarImagen();