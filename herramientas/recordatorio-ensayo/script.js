const logoUrl = "https://sagradocorazondejesus.github.io/KNMA/img/logo-kerigma.jpg";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let estiloImagenActual = 0;
let estiloTextoActual = 0;

const estilosImagen = [
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
  }
];

const estilosTexto = [
  { nombre: "Marco elegante" },
  { nombre: "Marco sencillo" },
  { nombre: "Juvenil" },
  { nombre: "Espiritual" },
  { nombre: "Minimalista" },
  { nombre: "Sin emojis" }
];

function cargarOpciones() {
  const contImagen = document.getElementById("estilosImagen");
  contImagen.innerHTML = "";

  estilosImagen.forEach((e, i) => {
    const div = document.createElement("div");
    div.className = "opcion" + (i === estiloImagenActual ? " activo" : "");
    div.innerHTML = `
      <div class="mini" style="background:linear-gradient(135deg,${e.fondo1},${e.fondo2})"></div>
      <div><strong>Estilo ${i + 1}</strong><br><small>${e.nombre}</small></div>
    `;
    div.onclick = () => {
      estiloImagenActual = i;
      cargarOpciones();
      generarTodo();
    };
    contImagen.appendChild(div);
  });

  const contTexto = document.getElementById("estilosTexto");
  contTexto.innerHTML = "";

  estilosTexto.forEach((e, i) => {
    const div = document.createElement("div");
    div.className = "opcion" + (i === estiloTextoActual ? " activo" : "");
    div.innerHTML = `<strong>${e.nombre}</strong>`;
    div.onclick = () => {
      estiloTextoActual = i;
      cargarOpciones();
      generarTodo();
    };
    contTexto.appendChild(div);
  });
}

function datos() {
  return {
    fecha: document.getElementById("fecha").value.trim(),
    hora: document.getElementById("hora").value.trim(),
    lugar: document.getElementById("lugar").value.trim(),
    cita: document.getElementById("cita").value.trim(),
    fraseFinal: document.getElementById("fraseFinal").value.trim()
  };
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
  const lineas = [];

  parrafos.forEach(parrafo => {
    const palabras = parrafo.split(" ");
    let linea = "";

    palabras.forEach(palabra => {
      const prueba = linea + palabra + " ";
      if (ctx.measureText(prueba).width > maxWidth && linea !== "") {
        lineas.push(linea.trim());
        linea = palabra + " ";
      } else {
        linea = prueba;
      }
    });

    if (linea.trim()) lineas.push(linea.trim());
    lineas.push("");
  });

  if (lineas[lineas.length - 1] === "") lineas.pop();
  return lineas;
}

function dibujarLineas(lineas, x, y, altoLinea) {
  lineas.forEach(linea => {
    if (linea === "") {
      y += altoLinea * 0.45;
    } else {
      ctx.fillText(linea, x, y);
      y += altoLinea;
    }
  });
}

function generarImagen() {
  const e = estilosImagen[estiloImagenActual];
  const d = datos();

  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, e.fondo1);
  grad.addColorStop(1, e.fondo2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,0.94)";
  roundRect(70, 80, 940, 1760, 60);
  ctx.fill();

  ctx.fillStyle = e.decoracion;
  ctx.globalAlpha = 0.22;
  ctx.font = "95px serif";
  ctx.fillText("♪", 790, 250);
  ctx.fillText("♫", 860, 350);
  ctx.fillText("♬", 740, 430);
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

  ctx.fillStyle = e.texto;
  ctx.font = "900 92px system-ui";
  ctx.fillText("ENSAYO", 405, 245);

  ctx.fillStyle = e.texto2;
  ctx.font = "800 58px system-ui";
  ctx.fillText("DEL CORO", 410, 320);

  let y = 520;
  const x = 145;

  ctx.fillStyle = e.texto;
  ctx.font = "bold 38px system-ui";
  ctx.fillText("📅 Fecha:", x, y);
  ctx.font = "38px system-ui";
  ctx.fillText(d.fecha, x + 210, y);

  y += 85;
  ctx.font = "bold 38px system-ui";
  ctx.fillText("🕖 Hora:", x, y);
  ctx.font = "38px system-ui";
  ctx.fillText(d.hora, x + 190, y);

  y += 85;
  ctx.font = "bold 38px system-ui";
  ctx.fillText("📍 Lugar:", x, y);
  ctx.font = "36px system-ui";
  const lugarLineas = envolverTexto(d.lugar, 690);
  dibujarLineas(lugarLineas, x + 55, y + 60, 46);

  ctx.font = "44px Georgia, serif";
  const citaLineas = envolverTexto(d.cita, 720);
  const altoLinea = 62;
  const altoCita = Math.max(360, citaLineas.length * altoLinea + 210);
  const citaY = 1630 - altoCita;

  ctx.fillStyle = e.tarjeta;
  roundRect(115, citaY, 850, altoCita, 44);
  ctx.fill();

  ctx.strokeStyle = e.texto;
  ctx.lineWidth = 4;
  roundRect(115, citaY, 850, altoCita, 44);
  ctx.stroke();

  ctx.fillStyle = e.texto;
  ctx.font = "bold 72px Georgia, serif";
  ctx.fillText("“", 165, citaY + 105);

  ctx.font = "44px Georgia, serif";
  dibujarLineas(citaLineas, 170, citaY + 190, altoLinea);

  ctx.textAlign = "center";
  ctx.font = "bold 38px system-ui";
  ctx.fillText(d.fraseFinal, 540, 1755);
  ctx.textAlign = "left";
}

function generarTexto() {
  const d = datos();
  let texto = "";

  switch (estiloTextoActual) {
    case 0:
      texto =
`╔════════════════════╗
     🎵 *ENSAYO KERIGMA*
╚════════════════════╝

Hola familia Kerigma 😊

📅 *Fecha:* ${d.fecha}
🕖 *Hora:* ${d.hora}
📍 *Lugar:* ${d.lugar}

┌────────────────────┐
       📖 _“${d.cita}”_
└────────────────────┘

${d.fraseFinal}`;
      break;

    case 1:
      texto =
`━━━━━━━━━━━━━━━━━━━━━━
🎵 *Recordatorio de ensayo*
━━━━━━━━━━━━━━━━━━━━━━

📅 ${d.fecha}
🕖 ${d.hora}
📍 ${d.lugar}

📖 _${d.cita}_

━━━━━━━━━━━━━━━━━━━━━━
${d.fraseFinal}`;
      break;

    case 2:
      texto =
`🎶✨ *¡Hoy toca ensayo!* ✨🎶

Familia Kerigma, nos vemos:

📅 *${d.fecha}*
🕖 *${d.hora}*
📍 *${d.lugar}*

┌────────────────────┐
       📖 _“${d.cita}”_
└────────────────────┘

¡Ánimo! Nos vemos al ratito 😄`;
      break;

    case 3:
      texto =
`✝️ *Recordatorio de ensayo* 🎵

Antes de cantar, preparemos también el corazón.

📖 _${d.cita}_

Nos vemos:
📅 ${d.fecha}
🕖 ${d.hora}
📍 ${d.lugar}

${d.fraseFinal}`;
      break;

    case 4:
      texto =
`*Ensayo Kerigma*

${d.fecha}
${d.hora}
${d.lugar}

_${d.cita}_

${d.fraseFinal}`;
      break;

    case 5:
      texto =
`*RECORDATORIO DE ENSAYO*

Hola familia Kerigma.

Fecha: ${d.fecha}
Hora: ${d.hora}
Lugar: ${d.lugar}

"${d.cita}"

${d.fraseFinal}`;
      break;
  }

  document.getElementById("mensajeWhatsApp").value = texto;
}




function generarTodo() {
  generarImagen();
  generarTexto();
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

function copiarTexto() {
  const texto = document.getElementById("mensajeWhatsApp");
  texto.select();
  texto.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(texto.value);
  alert("Texto copiado para WhatsApp");
}

document.querySelectorAll("input, textarea").forEach(el => {
  el.addEventListener("input", generarTodo);
});

cargarOpciones();
generarTodo();