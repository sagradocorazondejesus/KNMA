const NOTAS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

const LETRAS_A_DOREMI = {
  "C":"Do",
  "C#":"Do#",
  "D":"Re",
  "D#":"Re#",
  "E":"Mi",
  "F":"Fa",
  "F#":"Fa#",
  "G":"Sol",
  "G#":"Sol#",
  "A":"La",
  "A#":"La#",
  "B":"Si"
};

function convertirBemol(nota){
  const bemoles = {
    "Db":"C#",
    "Eb":"D#",
    "Gb":"F#",
    "Ab":"G#",
    "Bb":"A#"
  };
  return bemoles[nota] || nota;
}

function transportarAcorde(acorde, pasos){
  const match = acorde.match(/^([A-G](#|b)?)(.*)$/);
  if(!match) return acorde;

  let base = match[1];
  const resto = match[3];

  base = convertirBemol(base);

  const index = NOTAS.indexOf(base);
  if(index === -1) return acorde;

  const nuevoIndex = (index + pasos + 120) % 12;
  return NOTAS[nuevoIndex] + resto;
}

function acordeADoReMi(acorde){
  const match = acorde.match(/^([A-G](#)?)(.*)$/);
  if(!match) return acorde;

  const base = match[1];
  const resto = match[3];

  return (LETRAS_A_DOREMI[base] || base) + resto;
}