const logoUrl = "https://sagradocorazondejesus.github.io/KNMA/img/logo-kerigma.jpg";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let estiloActual = 0;

const estilos = [
  {
    nombre: "Kerigma vino",
    fondo1: "#f7dce5",
    fondo2: "#8a1236",
    texto: "#7a1230",
    texto2: "#b16078",
    tarjeta: "#fff9fb",
    decoracion: "#d8a0b0"
  },
  {
    nombre: "Mariano azul",
    fondo1: "#d9efff",
    fondo2: "#2877b8",
    texto: "#114466",
    texto2: "#5b93b8",
    tarjeta: "#f8fcff",
    decoracion: "#9ecbe8"
  },
  {
    nombre: "Papel cálido",
    fondo1: "#fff0d8",
    fondo2: "#c47a3a",
    texto: "#633719",
    texto2: "#a66c3f",
    tarjeta: "#fffaf2",
    decoracion: "#d8b58e"
  },
  {
    nombre: "Verde esperanza",
    fondo1: "#dcf7ea",
    fondo2: "#299b80",
    texto: "#15574d",
    texto2: "#63a99a",
    tarjeta: "#f7fffb",
    decoracion: "#9bd8c4"
  },
  {
    nombre: "Elegante oscuro",
    fondo1: "#111827",
    fondo2: "#c8a04a",
    texto: "#5d4216",
    texto2: "#b48b37",
    tarjeta: "#fffaf0",
    decoracion: "#d9bc72"
  },
  {
    nombre: "Juvenil morado",
    fondo1: "#25104d",
    fondo2: "#8b5cf6",
    texto: "#3d2475",
    texto2: "#7c5ac8",
    tarjeta: "#fbf8ff",
    decoracion: "#b9a3ef"
  },
  {
    nombre: "Acuarela",
    fondo1: "#e5fff0",
    fondo2: "#7abf91",
    texto: "#236343",
    texto2: "#6ba87c",
    tarjeta: "#fbfffb",
    decoracion: "#b7dfc1"
  },
  {
    nombre: "Noche musical",
    fondo1: "#07111f",
    fondo2: "#263d7a",
    texto: "#13213f",
    texto2: "#355083",
    tarjeta: "#f8fbff",
    decoracion: "#9caed8"
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

function envolverTexto(texto, maxWidth) {
  const parrafos = texto.split("\n");
  const lineasFinales = [];

  parrafos.forEach(parrafo => {
    const palabras = parrafo.split(" ");
    let linea = "";

    palabras.forEach(palabra => {
      const prueba = linea + palabra + " ";
      if (ctx.measureText(prueba).width > maxWidth && linea !== "") {
        lineasFinales.push(linea.trim());
        linea = palabra + " ";
      } else {
        linea = prueba;
      }
    });

    if (linea.trim() !== "") lineasFinales.push(linea.trim());
    lineasFinales.push("");
  });

  if (lineasFinales[lineasFinales.length - 1] === "") lineasFinales.pop();
  return lineasFinales;
}

function dibujarLineas(lineas, x, y, lineHeight) {
  lineas.forEach(linea => {
    if (linea === "") {
      y += lineHeight * 0.45;
    } else {
      ctx.fillText(linea, x, y);
      y += lineHeight;
    }
  });
}

function generarImagen() {
  const estilo = estilos[estiloActual];

  const cita = document.getElementById("cita").value.trim();
  const fecha = document.getElementById("fecha").value.trim();
  const hora = document.getElementById("hora").value.trim();
  const lugar = document.getElementById("lugar").value.trim();

  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, estilo.fondo1);
  grad.addColorStop(1, estilo.fondo2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,0.94)";
  roundRect(70, 80, 940, 1760, 60);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  roundRect(105, 115, 870, 1690, 46);
  ctx.fill();

  ctx.fillStyle = estilo.decoracion;
  ctx.globalAlpha = 0.22;
  ctx.font = "90px serif";
  ctx.fillText("♪", 805, 260);
  ctx.fillText("♫", 855, 335);
  ctx.fillText("♬", 760, 410);
  ctx.globalAlpha = 1;

  const logo = new Image();
  logo.crossOrigin = "anonymous";
  logo.src = logoUrl;

  logo.onload = () => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(235, 265, 125, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logo, 110, 140, 250, 250);
    ctx.restore();

    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(235, 265, 128, 0, Math.PI * 2);
    ctx.stroke();
  };

  ctx.fillStyle = estilo.texto;
  ctx.font = "900 92px system-ui";
  ctx.fillText("ENSAYO", 405, 245);

  ctx.fillStyle = estilo.texto2;
  ctx.font = "800 58px system-ui";
  ctx.fillText("DEL CORO", 410, 320);

  const infoX = 145;
  let infoY = 520;

  ctx.fillStyle = estilo.texto;
  ctx.font = "bold 38px system-ui";

  ctx.fillText("📅", infoX, infoY);
  ctx.fillText("Fecha:", infoX + 70, infoY);
  ctx.font = "38px system-ui";
  ctx.fillText(fecha, infoX + 215, infoY);

  infoY += 85;
  ctx.font = "bold 38px system-ui";
  ctx.fillText("🕖", infoX, infoY);
  ctx.fillText("Hora:", infoX + 70, infoY);
  ctx.font = "38px system-ui";
  ctx.fillText(hora, infoX + 190, infoY);

  infoY += 85;
  ctx.font = "bold 38px system-ui";
  ctx.fillText("📍", infoX, infoY);
  ctx.fillText("Lugar:", infoX + 70, infoY);

  ctx.font = "36px system-ui";
  const lugarLineas = envolverTexto(lugar, 650);
  dibujarLineas(lugarLineas, infoX + 70, infoY + 58, 46);

  ctx.font = "44px Georgia, serif";
  const citaLineas = envolverTexto(cita, 720);

  const lineHeight = 62;
  const citaAlto = Math.max(390, citaLineas.length * lineHeight + 210);
  const citaY = 1630 - citaAlto;

  ctx.fillStyle = estilo.tarjeta;
  roundRect(115, citaY, 850, citaAlto, 44);
  ctx.fill();

  ctx.strokeStyle = estilo.texto;
  ctx.lineWidth = 4;
  roundRect(115, citaY, 850, citaAlto, 44);
  ctx.stroke();

  ctx.fillStyle = estilo.decoracion;
  ctx.globalAlpha = 0.35;
  ctx.font = "90px serif";
  ctx.fillText("❦", 770, citaY + citaAlto - 70);
  ctx.globalAlpha = 1;

  ctx.fillStyle = estilo.texto;
  ctx.font = "bold 72px Georgia, serif";
  ctx.fillText("“", 165, citaY + 105);

  ctx.font = "44px Georgia, serif";
  dibujarLineas(citaLineas, 170, citaY + 190, lineHeight);

  ctx.fillStyle = estilo.texto;
  ctx.textAlign = "center";
  ctx.font = "bold 38px system-ui";
  ctx.fillText("¡Tu presencia hace la diferencia! 🎶", 540, 1755);
  ctx.textAlign = "left";
}

function descargarImagen() {
  generarImagen();

  setTimeout(() => {
    const link = document.createElement("a");
    link.download = "recordatorio-ensayo.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, 400);
}

cargarEstilos();
generarImagen();