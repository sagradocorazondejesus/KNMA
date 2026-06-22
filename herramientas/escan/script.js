const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");

const btnGray = document.getElementById("btnGray");
const btnColor = document.getElementById("btnColor");
const btnClear = document.getElementById("btnClear");
const btnSaveImage = document.getElementById("btnSaveImage");
const btnPDF = document.getElementById("btnPDF");
const btnShare = document.getElementById("btnShare");

let pages = [];
let blackWhite = false;

fileInput.addEventListener("change", async (e) => {
  const files = Array.from(e.target.files);

  for (const file of files) {
    const dataUrl = await readFile(file);
    const scanned = await processImage(dataUrl);
    pages.push(scanned);
  }

  renderPages();
  fileInput.value = "";
});

btnGray.addEventListener("click", async () => {
  blackWhite = true;
  await reprocessPages();
});

btnColor.addEventListener("click", async () => {
  blackWhite = false;
  await reprocessPages();
});

btnClear.addEventListener("click", () => {
  pages = [];
  renderPages();
});

btnSaveImage.addEventListener("click", () => {
  if (!pages.length) return alert("Primero escanea una imagen.");
  downloadFile(pages[0].final, "escaneo.png");
});

btnPDF.addEventListener("click", async () => {
  if (!pages.length) return alert("Primero escanea una imagen.");

  const pdfBlob = await createPDF();
  downloadBlob(pdfBlob, "escaneo.pdf");
});

btnShare.addEventListener("click", async () => {
  if (!pages.length) return alert("Primero escanea una imagen.");

  const pdfBlob = await createPDF();
  const file = new File([pdfBlob], "escaneo.pdf", {
    type: "application/pdf"
  });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title: "Escaneo PDF",
      text: "Te comparto este documento escaneado.",
      files: [file]
    });
  } else {
    alert("Tu navegador no permite compartir archivos. Se descargará el PDF.");
    downloadBlob(pdfBlob, "escaneo.pdf");
  }
});

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

async function reprocessPages() {
  const originals = pages.map(p => p.original);
  pages = [];

  for (const img of originals) {
    const processed = await processImage(img);
    pages.push(processed);
  }

  renderPages();
}

function processImage(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 1400;
      const scale = Math.min(maxWidth / img.width, 1);

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (blackWhite) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const value = avg > 145 ? 255 : 0;
          data[i] = value;
          data[i + 1] = value;
          data[i + 2] = value;
        }

        ctx.putImageData(imageData, 0, 0);
      }

      const final = canvas.toDataURL("image/jpeg", 0.92);

      resolve({
        original: dataUrl,
        final
      });
    };

    img.src = dataUrl;
  });
}

function renderPages() {
  preview.innerHTML = "";

  pages.forEach((page, index) => {
    const div = document.createElement("div");
    div.className = "page";

    div.innerHTML = `
      <img src="${page.final}">
      <button onclick="deletePage(${index})">Eliminar página ${index + 1}</button>
    `;

    preview.appendChild(div);
  });
}

function deletePage(index) {
  pages.splice(index, 1);
  renderPages();
}

async function createPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 8;
  const usableWidth = pageWidth - margin * 2;
  const usableHeight = pageHeight - margin * 2;

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage();

    const img = await loadImage(pages[i].final);

    const ratio = Math.min(
      usableWidth / img.width,
      usableHeight / img.height
    );

    const imgWidth = img.width * ratio;
    const imgHeight = img.height * ratio;

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(pages[i].final, "JPEG", x, y, imgWidth, imgHeight);
  }

  return pdf.output("blob");
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
}

function downloadFile(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}