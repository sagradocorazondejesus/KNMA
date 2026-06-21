const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let formato = "vertical";
let estiloActual = 0;

const estilos = [
  {
    nombre: "Juvenil azul",
    fondo1: "#0d4f8b",
    fondo2: "#07345f",
    texto: "#ffffff",
    acento: "#ffd43b",
    extra: "#ff4fa3"
  },
  {
    nombre: "Kerigma vino",
    fondo1: "#f7dce5",
    fondo2: "#8a1236",
    texto: "#7a1230",
    acento: "#ffffff",
    extra: "#d496aa"
  },
  {
    nombre: "Alegre amarillo",
    fondo1: "#fff2a8",
    fondo2: "#ffb703",
    texto: "#7a1230",
    acento: "#ffffff",
    extra: "#219ebc"
  },
  {
    nombre: "Eucaristía",
    fondo1: "#fff8e8",
    fondo2: "#d8a642",
    texto: "#5a3416",
    acento: "#ffffff",
    extra: "#9b1c31"
  },
  {
    nombre: "Paz verde",
    fondo1: "#e5fff0",
    fondo2: "#42a77a",
    texto: "#15573f",
    acento: "#ffffff",
    extra: "#f4c542"
  },
  {
    nombre: "Noche joven",
    fondo1: "#1a1040",
    fondo2: "#6d28d9",
    texto: "#ffffff",
    acento: "#ffd43b",
    extra: "#ff4fa3"
  }
];

const frases = [
  {
    subtitulo: "No por obligación",
    motivo: "Porque Cristo me espera en la Eucaristía."
  },
  {
    subtitulo: "No por costumbre",
    motivo: "Porque necesito alimentar mi alma."
  },
  {
    subtitulo: "Por amor a Cristo",
    motivo: "Para recibirlo vivo en la comunión."
  },
  {
    subtitulo: "Porque ahí encuentro paz",
    motivo: "Esa paz que el mundo no puede dar."
  },
  {
    subtitulo: "Porque Jesús me invita",
    motivo: "Y yo quiero responderle con amor."
  },
  {
    subtitulo: "Porque la fe se vive",
    motivo: "Escuchando su Palabra y compartiendo su mesa."
  },
  {
    subtitulo: "Porque no voy solo",
    motivo: "Voy con mi familia, mi comunidad y mi fe."
  },
  {
    subtitulo: "Porque lo necesito",
    motivo: "Mi corazón también necesita encontrarse con Dios."
  }
];

function cargarEstilos() {
  const cont = document.getElementById("estilos");
  cont.innerHTML = "";

  estilos.forEach((e, i) => {
    const div = document.createElement("div");
    div.className = "opcion" + (i === estiloActual ? " activo" : "");
    div.innerHTML = `
      <div class="mini" style="background:linear-gradient(135deg,${e.fondo1},${e.fondo2})"></div>
      <div>Estilo ${i + 1}<br><small>${e.nombre}</small></div>
    `;
    div.onclick = () => {
      estiloActual = i;
      cargarEstilos();
      generarImagen();
    };
    cont.appendChild(div);
  });
}

function cambiarFormato(tipo) {
  formato = tipo;

  document.getElementById("formatoVertical").classList.toggle("activo", tipo === "vertical");
  document.getElementById("formatoHorizontal").classList.toggle("activo", tipo === "horizontal");

  generarImagen();
}

function datos() {
  return {
    titulo: document.getElementById("titulo").value.trim(),
    subtitulo: document.getElementById("subtitulo").value.trim(),
    motivo: document.getElementById("motivo").value.trim(),
    firma: document.getElementById("firma").value.trim()
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

function textoLineas(texto, maxWidth) {
  const palabras = texto.split(" ");
  const lineas = [];
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
  return lineas;
}

function dibujarLineas(lineas, x, y, alto, centrado = true) {
  lineas.forEach(linea => {
    ctx.fillText(linea, x, y);
    y += alto;
  });
}

function dibujarVertical() {
  const e = estilos[estiloActual];
  const d = datos();

  canvas.width = 1080;
  canvas.height = 1920;

  const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
  grad.addColorStop(0, e.fondo1);
  grad.addColorStop(1, e.fondo2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1920);

  ctx.fillStyle = "rgba(255,255,255,0.16)";
  roundRect(70, 80, 940, 1760, 70);
  ctx.fill();

  ctx.fillStyle = e.extra;
  ctx.globalAlpha = 0.18;
  ctx.beginPath();
  ctx.arc(90, 180, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(1030, 1740, 330, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.textAlign = "center";

  ctx.fillStyle = e.acento;
  ctx.font = "900 120px system-ui";
  ctx.fillText("YO VOY", 540, 330);

  ctx.fillStyle = e.extra;
  ctx.font = "900 78px system-ui";
  ctx.fillText(d.subtitulo.toUpperCase(), 540, 450);

  ctx.fillStyle = e.texto;
  ctx.font = "900 175px system-ui";
  ctx.strokeStyle = "rgba(0,0,0,0.22)";
  ctx.lineWidth = 10;
  ctx.strokeText("A MISA", 540, 650);
  ctx.fillText("A MISA", 540, 650);

  ctx.fillStyle = "rgba(255,255,255,0.88)";
  roundRect(105, 820, 870, 620, 48);
  ctx.fill();

  ctx.fillStyle = e.texto;
  ctx.font = "bold 66px Georgia, serif";

  const motivoLineas = textoLineas(d.motivo, 720);
  let y = 1000;
  motivoLineas.forEach(linea => {
    ctx.fillText(linea, 540, y);
    y += 84;
  });

  ctx.fillStyle = e.extra;
  ctx.font = "80px serif";
  ctx.fillText("✝", 540, 1330);

  ctx.fillStyle = e.acento;
  roundRect(145, 1585, 790, 130, 65);
  ctx.fill();

  ctx.fillStyle = e.texto;
  ctx.font = "bold 44px system-ui";
  ctx.fillText(d.firma, 540, 1665);

  ctx.font = "bold 52px system-ui";
  ctx.fillStyle = "rgba(255,255,255,0.86)";
  ctx.fillText("Domingo: día del Señor", 540, 1805);

  ctx.textAlign = "left";
}

function dibujarHorizontal() {
  const e = estilos[estiloActual];
  const d = datos();

  canvas.width = 1200;
  canvas.height = 675;

  const grad = ctx.createLinearGradient(0, 0, 1200, 675);
  grad.addColorStop(0, e.fondo1);
  grad.addColorStop(1, e.fondo2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 675);

  ctx.fillStyle = "rgba(255,255,255,0.16)";
  roundRect(50, 45, 1100, 585, 55);
  ctx.fill();

  ctx.fillStyle = e.extra;
  ctx.globalAlpha = 0.18;
  ctx.beginPath();
  ctx.arc(80, 100, 190, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(1130, 610, 230, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.textAlign = "left";

  ctx.fillStyle = e.acento;
  ctx.font = "900 90px system-ui";
  ctx.fillText("YO VOY", 90, 180);

  ctx.fillStyle = e.extra;
  ctx.font = "900 54px system-ui";
  ctx.fillText(d.subtitulo.toUpperCase(), 95, 250);

  ctx.fillStyle = e.texto;
  ctx.font = "900 135px system-ui";
  ctx.strokeStyle = "rgba(0,0,0,0.22)";
  ctx.lineWidth = 8;
  ctx.strokeText("A MISA", 85, 405);
  ctx.fillText("A MISA", 85, 405);

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  roundRect(650, 105, 460, 370, 38);
  ctx.fill();

  ctx.fillStyle = e.texto;
  ctx.textAlign = "center";
  ctx.font = "bold 44px Georgia, serif";

  const motivoLineas = textoLineas(d.motivo, 380);
  let y = 220;
  motivoLineas.forEach(linea => {
    ctx.fillText(linea, 880, y);
    y += 58;
  });

  ctx.fillStyle = e.extra;
  ctx.font = "62px serif";
  ctx.fillText("✝", 880, 430);

  ctx.fillStyle = e.acento;
  roundRect(250, 535, 700, 78, 40);
  ctx.fill();

  ctx.fillStyle = e.texto;
  ctx.font = "bold 34px system-ui";
  ctx.fillText(d.firma, 600, 586);

  ctx.textAlign = "left";
}

function generarTexto() {
  const d = datos();

  const texto =
`╔════════════════════╗
       ⛪ *YO VOY A MISA*
╚════════════════════╝

*${d.subtitulo}.*

${d.motivo}

${d.firma}`;

  document.getElementById("textoWhatsApp").value = texto;
}

function generarImagen() {
  if (formato === "vertical") {
    dibujarVertical();
  } else {
    dibujarHorizontal();
  }

  generarTexto();
}

function fraseAleatoria() {
  const f = frases[Math.floor(Math.random() * frases.length)];
  document.getElementById("subtitulo").value = f.subtitulo;
  document.getElementById("motivo").value = f.motivo;
  generarImagen();
}

function descargarImagen() {
  generarImagen();

  setTimeout(() => {
    const link = document.createElement("a");
    link.download = formato === "vertical" ? "yo-voy-a-misa-vertical.png" : "yo-voy-a-misa-horizontal.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, 200);
}

function copiarTexto() {
  const texto = document.getElementById("textoWhatsApp");
  texto.select();
  texto.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(texto.value);
  alert("Texto copiado");
}

document.querySelectorAll("input, textarea").forEach(el => {
  el.addEventListener("input", generarImagen);
});

cargarEstilos();
cambiarFormato("vertical");
generarImagen();3