const MOMENTOS_MISA = [
  "Entrada",
  "Kyrie",
  "Gloria",
  "Aleluya",
  "Ofertorio",
  "Santo",
  "Cordero",
  "Comunion",
  "Salida"
];

let misaHoy = JSON.parse(localStorage.getItem("misaHoyKerigma")) || {};

let cantosPresentacion = [];
let indiceActualMisa = 0;

function cargarSelectoresMisa(){
  const contenedor = document.getElementById("selectoresMisa");
  if(!contenedor) return;

  contenedor.innerHTML = "";

  MOMENTOS_MISA.forEach(momento => {
    const cantosCategoria = TODOS_LOS_CANTOS.filter(canto => canto.categoria === momento);

    let opciones = `<option value="">Seleccionar canto</option>`;

    cantosCategoria.forEach(canto => {
      const seleccionado = misaHoy[momento] === canto.titulo ? "selected" : "";
      opciones += `<option value="${canto.titulo}" ${seleccionado}>${canto.titulo}</option>`;
    });

    contenedor.innerHTML += `
      <div class="misa-item">
        <label>${momento}</label>
        <select id="misa-${momento}">
          ${opciones}
        </select>
      </div>
    `;
  });
}

function guardarMisaHoy(){
  MOMENTOS_MISA.forEach(momento => {
    const select = document.getElementById(`misa-${momento}`);
    misaHoy[momento] = select ? select.value : "";
  });

  localStorage.setItem("misaHoyKerigma", JSON.stringify(misaHoy));
  alert("Misa de Hoy guardada");
}

function iniciarMisaHoy(){

  guardarMisaHoy();

  cantosPresentacion = MOMENTOS_MISA
    .map(momento => {
      const titulo = misaHoy[momento];
      const canto = TODOS_LOS_CANTOS.find(c => c.titulo === titulo);

      return canto ? { momento, canto } : null;
    })
    .filter(item => item !== null);

  if(cantosPresentacion.length === 0){
    alert("Primero selecciona al menos un canto");
    return;
  }

  indiceActualMisa = 0;

  document.getElementById("presentacionMisa").style.display = "block";

document.getElementById("pantallaMisa").style.display = "none";
document.getElementById("pantallaCantos").style.display = "none";
document.getElementById("pantallaFavoritos").style.display = "none";

document.querySelector(".encabezado").style.display = "none";
document.querySelector(".menu-principal").style.display = "none";

setTimeout(() => {
  const presentacion = document.getElementById("presentacionMisa");
  presentacion.scrollIntoView({
    behavior: "auto",
    block: "start"
  });
}, 200);


if(document.documentElement.requestFullscreen){
  document.documentElement.requestFullscreen();
}

document.querySelector(".encabezado").style.display = "none";
document.querySelector(".menu-principal").style.display = "none";



  mostrarCantoMisa();
}

cargarSelectoresMisa();

function mostrarCantoMisa(){

  const actual = cantosPresentacion[indiceActualMisa];

  document.getElementById("misaMomento").textContent =
    actual.momento;

  document.getElementById("misaContador").textContent =
    `${indiceActualMisa + 1} / ${cantosPresentacion.length}`;

  document.getElementById("misaContenido").innerHTML = `
  <h3>${actual.canto.titulo}</h3>
  <div class="letra">${convertirLetraMisa(actual.canto.letra)}</div>
`;
}

function cantoAnterior(){

  if(indiceActualMisa > 0){
    indiceActualMisa--;
    mostrarCantoMisa();
  }
}

function cantoSiguiente(){

  if(indiceActualMisa < cantosPresentacion.length - 1){
    indiceActualMisa++;
    mostrarCantoMisa();
  }
}

function cerrarPresentacionMisa(){

  document.getElementById("presentacionMisa").style.display = "none";

document.getElementById("pantallaMisa").style.display = "block";

document.querySelector(".encabezado").style.display = "block";
document.querySelector(".menu-principal").style.display = "flex";

if(document.fullscreenElement){
  document.exitFullscreen();
}

mostrarPantalla("misa");

}


function convertirLetraMisa(letra){
  let html = "";
  const lineas = letra.trim().split("\n");

  lineas.forEach(linea => {
    const limpia = linea.trim();

    if(limpia === ""){
      html += `<div class="espacio"></div>`;
      return;
    }

    if(esTituloSeccion(limpia)){
      html += `<div class="seccion-canto">${limpia}</div>`;
      return;
    }

    html += `
      <div class="linea-canto">
        ${convertirLinea(linea)}
      </div>
    `;
  });

  return html;
}





let toqueInicioX = 0;
let toqueInicioY = 0;

const presentacion = document.getElementById("presentacionMisa");

if(presentacion){
  presentacion.addEventListener("touchstart", function(e){
    toqueInicioX = e.touches[0].clientX;
    toqueInicioY = e.touches[0].clientY;
  });

  presentacion.addEventListener("touchend", function(e){
    const toqueFinX = e.changedTouches[0].clientX;
    const toqueFinY = e.changedTouches[0].clientY;

    const diferenciaX = toqueFinX - toqueInicioX;
    const diferenciaY = toqueFinY - toqueInicioY;

    if(Math.abs(diferenciaX) > 70 && Math.abs(diferenciaX) > Math.abs(diferenciaY)){
      if(diferenciaX < 0){
        cantoSiguiente();
      }else{
        cantoAnterior();
      }
    }
  });
}

function compartirProximaMisa(){
  guardarMisaHoy();

  let mensaje = "🎵 *Próxima Misa*\n\n";

  MOMENTOS_MISA.forEach(momento => {
    const titulo = misaHoy[momento];

    if(titulo){
      const canto = TODOS_LOS_CANTOS.find(c => c.titulo === titulo);
      const tono = canto ? canto.tono : "";

      mensaje += `*${momento}:*\n`;
      mensaje += `${titulo}${tono ? " (" + tono + ")" : ""}\n\n`;
    }
  });

  mensaje += "Kerigma - Nuevo Milagro de Amor";

  const texto = encodeURIComponent(mensaje);

  window.open(`https://wa.me/?text=${texto}`, "_blank");
}






async function compartirImagenProximaMisa(){
  guardarMisaHoy();

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;

  const ctx = canvas.getContext("2d");

  // Fondo
  ctx.fillStyle = "#f7f1ec";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Tarjeta
  ctx.fillStyle = "#ffffff";
  ctx.roundRect(60, 60, 960, 1230, 35);
  ctx.fill();

  // Logo
  const logo = new Image();
  logo.src = "img/logo-kerigma.jpg";

  logo.onload = async function(){

    ctx.drawImage(logo, 360, 90, 360, 160);

    // Título
    ctx.fillStyle = "#7b1020";
    ctx.font = "bold 58px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Próxima Misa", 540, 330);

    ctx.font = "30px Arial";
    ctx.fillStyle = "#555";
    ctx.fillText("Kerigma - Nuevo Milagro de Amor", 540, 380);

    // Lista
    ctx.textAlign = "left";
    ctx.font = "bold 34px Arial";

    let y = 470;

    MOMENTOS_MISA.forEach(momento => {
      const titulo = misaHoy[momento];

      if(titulo){
        const canto = TODOS_LOS_CANTOS.find(c => c.titulo === titulo);
        const tono = canto ? canto.tono : "";

        ctx.fillStyle = "#7b1020";
        ctx.font = "bold 32px Arial";
        ctx.fillText(momento + ":", 110, y);

        ctx.fillStyle = "#222";
        ctx.font = "30px Arial";
        ctx.fillText(`${titulo}${tono ? " (" + tono + ")" : ""}`, 280, y);

        y += 75;
      }
    });

    // Pie
    ctx.fillStyle = "#999";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Cantoral Kerigma", 540, 1225);

    canvas.toBlob(async function(blob){
      const archivo = new File([blob], "proxima-misa-kerigma.png", {
        type: "image/png"
      });

      if(navigator.canShare && navigator.canShare({ files: [archivo] })){
        await navigator.share({
          title: "Próxima Misa",
          text: "Cantos para la próxima misa",
          files: [archivo]
        });
      }else{
        const enlace = document.createElement("a");
        enlace.href = URL.createObjectURL(blob);
        enlace.download = "proxima-misa-kerigma.png";
        enlace.click();
      }
    }, "image/png");
  };
}