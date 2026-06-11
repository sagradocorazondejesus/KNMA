const TODOS_LOS_CANTOS = [
  ...window.CANTOS_ENTRADA,
  ...window.CANTOS_KYRIE,
  ...window.CANTOS_GLORIA,
  ...window.CANTOS_ALELUYA,
  ...window.CANTOS_OFERTORIO,
  ...window.CANTOS_SANTO,
  ...window.CANTOS_CORDERO,
  ...window.CANTOS_COMUNION,
  ...window.CANTOS_SALIDA,
  ...window.CANTOS_MARIANOS,
  ...window.CANTOS_OTROS
];

let cantoActual = null;
let transposicion = 0;
let sistemaDoReMi = false;
let tamanoLetra = 18;
let verSoloFavoritos = false;
let favoritos = JSON.parse(localStorage.getItem("favoritosKerigma")) || [];
let mostrarAcordes = true;

function cargarLista(){
  let totalMostrados = 0;
  const lista = document.getElementById("listaCantos");
  const buscar = document.getElementById("buscar").value.toLowerCase();
  const categoria = document.getElementById("filtroCategoria").value;
  const tiempo = document.getElementById("filtroTiempo").value;

  lista.innerHTML = "";

  TODOS_LOS_CANTOS.forEach((canto, index) => {
    const texto = `${canto.titulo} ${canto.categoria} ${canto.tiempo} ${canto.letra}`.toLowerCase();

    if(buscar && !texto.includes(buscar)) return;
    if(categoria && canto.categoria !== categoria) return;
    if(tiempo && canto.tiempo !== tiempo) return;
    if(verSoloFavoritos && !favoritos.includes(canto.titulo)) return;
    totalMostrados++;
    lista.innerHTML += `
      <div class="lista-item" onclick="seleccionarCanto(${index})">
        <div class="lista-titulo">${canto.titulo}</div>
        <small>${canto.categoria} · ${canto.tiempo} · Tono: ${canto.tono}</small>
      </div>
    `;
  });
  document.getElementById("contadorCantos").textContent =
  `Mostrando ${totalMostrados} de ${TODOS_LOS_CANTOS.length} cantos`;
}

function seleccionarCanto(index){
  cantoActual = TODOS_LOS_CANTOS[index];
  transposicion = 0;

  document.getElementById("tituloCanto").textContent = cantoActual.titulo;

  actualizarDatosCanto();
  mostrarCanto();
actualizarBotonFavorito();
}

function actualizarDatosCanto(){
  document.getElementById("datosCanto").innerHTML = `
    <span class="etiqueta">${cantoActual.categoria}</span>
    <span class="etiqueta">${cantoActual.tiempo}</span>
    <p><b>Tono original:</b> ${mostrarAcorde(cantoActual.tono)}</p>
    ${cantoActual.autor ? `<p><b>Autor:</b> ${cantoActual.autor}</p>` : ""}
    ${cantoActual.notas ? `<p><b>Notas:</b> ${cantoActual.notas}</p>` : ""}
  `;
}

function mostrarAcorde(acorde){
  let transportado = transportarAcorde(acorde, transposicion);
  return sistemaDoReMi ? acordeADoReMi(transportado) : transportado;
}

function mostrarCanto(){
  if(!cantoActual) return;

  const contenedor = document.getElementById("letraCanto");
  contenedor.style.fontSize = tamanoLetra + "px";
  contenedor.innerHTML = "";

  const lineas = cantoActual.letra.trim().split("\n");

  lineas.forEach(linea => {
    const limpia = linea.trim();

    if(limpia === ""){
      contenedor.innerHTML += `<div class="espacio"></div>`;
      return;
    }

    if(esTituloSeccion(limpia)){
      const titulo = limpia.slice(1, -1);
      contenedor.innerHTML += `<div class="seccion-canto">[${titulo}]</div>`;
      return;
    }

    const resultado = convertirLinea(linea);

    contenedor.innerHTML += `
      <div class="linea-canto">${resultado}</div>
    `;
  });

  document.getElementById("tonoActual").innerHTML =
    `<b>Tono actual:</b> ${mostrarAcorde(cantoActual.tono)} 
     ${transposicion === 0 ? "(Original)" : ""}`;
}

function esTituloSeccion(linea){
  return /^\[[^\]]+\]$/.test(linea) && !esAcorde(linea.slice(1, -1));
}

function esAcorde(texto){
  return /^[A-G](#|b)?(m|maj|min|dim|aug|sus|add)?[0-9]*(\/[A-G](#|b)?)?$/.test(texto);
}

function convertirLinea(linea){
  let textoVisible = "";
  let acordesPorPosicion = {};
  let posicion = 0;
  let i = 0;

  while(i < linea.length){
    if(linea[i] === "["){
      const cierre = linea.indexOf("]", i);

      if(cierre !== -1){
        const acordeOriginal = linea.substring(i + 1, cierre);

        if(esAcorde(acordeOriginal)){
          acordesPorPosicion[posicion] = mostrarAcorde(acordeOriginal);
          i = cierre + 1;
          continue;
        }
      }
    }

    textoVisible += linea[i];
    posicion++;
    i++;
  }

  let lineaAcordes = "";

  for(let j = 0; j <= textoVisible.length; j++){
    if(acordesPorPosicion[j]){
      lineaAcordes += acordesPorPosicion[j];
      j += acordesPorPosicion[j].length - 1;
    }else{
      lineaAcordes += " ";
    }
  }

 return `
  ${mostrarAcordes ? `<div class="linea-acordes-nueva">${lineaAcordes}</div>` : ""}
  <div class="linea-letra-nueva">${textoVisible}</div>
`;
}

function cambiarTono(pasos){
  if(!cantoActual) return;
  transposicion += pasos;
  actualizarDatosCanto();
  mostrarCanto();
}

function tonoOriginal(){
  if(!cantoActual) return;
  transposicion = 0;
  actualizarDatosCanto();
  mostrarCanto();
}

function cambiarSistema(){
  sistemaDoReMi = !sistemaDoReMi;

  if(cantoActual){
    actualizarDatosCanto();
    mostrarCanto();
  }

  cargarLista();
}

function cambiarLetra(cambio){
  tamanoLetra += cambio;

  if(tamanoLetra < 14) tamanoLetra = 14;
  if(tamanoLetra > 28) tamanoLetra = 28;

  mostrarCanto();
}

function guardarFavoritos(){
  localStorage.setItem("favoritosKerigma", JSON.stringify(favoritos));
}

function marcarFavorito(){
  if(!cantoActual) return;

  const titulo = cantoActual.titulo;

  if(favoritos.includes(titulo)){
    favoritos = favoritos.filter(item => item !== titulo);
  }else{
    favoritos.push(titulo);
  }

  guardarFavoritos();
  actualizarBotonFavorito();
  cargarLista();
}

function actualizarBotonFavorito(){
  const btn = document.getElementById("btnMarcarFavorito");
  if(!btn || !cantoActual) return;

  if(favoritos.includes(cantoActual.titulo)){
    btn.textContent = "★ Quitar de favoritos";
  }else{
    btn.textContent = "☆ Agregar a favoritos";
  }
}

function alternarVerFavoritos(){
  verSoloFavoritos = !verSoloFavoritos;

  const btn = document.getElementById("btnFavoritos");

  if(verSoloFavoritos){
    btn.textContent = "★ Mostrando favoritos";
  }else{
    btn.textContent = "☆ Ver favoritos";
  }

  cargarLista();
}


document.getElementById("buscar").addEventListener("input", cargarLista);
document.getElementById("filtroCategoria").addEventListener("change", cargarLista);
document.getElementById("filtroTiempo").addEventListener("change", cargarLista);

cargarLista();


function alternarAcordes(){
  mostrarAcordes = !mostrarAcordes;

  const btn = document.getElementById("btnAcordes");
  btn.textContent = mostrarAcordes ? "Acordes ON" : "Solo letra";

  mostrarCanto();
}





