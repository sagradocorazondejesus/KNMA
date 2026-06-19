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
    <pre style="white-space:pre-wrap;">
${actual.canto.letra}
    </pre>
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
}