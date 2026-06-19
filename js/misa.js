const MOMENTOS_MISA = [
  "Entrada",
  "Kyrie",
  "Gloria",
  "Aleluya",
  "Ofertorio",
  "Santo",
  "Cordero",
  "Comunión",
  "Salida"
];

let misaHoy = JSON.parse(localStorage.getItem("misaHoyKerigma")) || {};

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

  const cantosElegidos = MOMENTOS_MISA
    .map(momento => {
      const titulo = misaHoy[momento];
      const canto = TODOS_LOS_CANTOS.find(c => c.titulo === titulo);
      return canto ? { momento, canto } : null;
    })
    .filter(item => item !== null);

  if(cantosElegidos.length === 0){
    alert("Primero selecciona al menos un canto");
    return;
  }

  alert(`Misa lista con ${cantosElegidos.length} cantos. El modo presentación lo hacemos en el siguiente paso.`);
}

cargarSelectoresMisa();