const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");

const btnGray = document.getElementById("btnGray");
const btnColor = document.getElementById("btnColor");
const btnClear = document.getElementById("btnClear");
const btnSaveImage = document.getElementById("btnSaveImage");
const btnPDF = document.getElementById("btnPDF");
const btnShare = document.getElementById("btnShare");

const btnOpenCamera = document.getElementById("btnOpenCamera");
const btnCloseCamera = document.getElementById("btnCloseCamera");
const btnCapture = document.getElementById("btnCapture");
const cameraBox = document.getElementById("cameraBox");
const video = document.getElementById("video");
const guide = document.querySelector(".guide");
const counter = document.getElementById("counter");

const paperSize = document.getElementById("paperSize");

let pages = [];
let blackWhite = false;
let stream = null;
let autoTimer = null;
let autoCaptureRunning = false;

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

btnOpenCamera.addEventListener("click", openCamera);
btnCloseCamera.addEventListener("click", closeCamera);
btnCapture.addEventListener("click", captureFromCamera);

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
  downloadFile(pages[0].final, "escaneo.jpg");
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
    alert("Tu navegador no permite compartir el PDF. Se descargará.");
    downloadBlob(pdfBlob, "escaneo.pdf");
  }
});

async function openCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: false
    });

    video.srcObject = stream;
    cameraBox.classList.remove("hidden");

guide.classList.remove("letter", "legal", "a4", "free");
guide.classList.add(paperSize.value);

    startAutoCapture();
  } catch (error) {
    alert("No se pudo abrir la cámara. Revisa permisos del navegador.");
  }
}

function closeCamera() {
  stopAutoCapture();

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  video.srcObject = null;
  cameraBox.classList.add("hidden");
}

function startAutoCapture() {
  if (autoCaptureRunning) return;

  autoCaptureRunning = true;
  guide.classList.add("scanning");
  counter.textContent = "Mantén la hoja dentro del marco...";

  autoTimer = setTimeout(async () => {
  counter.textContent = "Escaneando...";
  await captureFromCamera();

  stopAutoCapture();

  counter.textContent = `Página ${pages.length} agregada`;

  setTimeout(() => {
    closeCamera();
  }, 700);
}, 3000);
}

function stopAutoCapture() {
  autoCaptureRunning = false;
  clearTimeout(autoTimer);
  guide.classList.remove("scanning");
}

async function captureFromCamera() {
  if (!video.videoWidth) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const guideRect = guide.getBoundingClientRect();
  const videoRect = video.getBoundingClientRect();

  const scaleX = video.videoWidth / videoRect.width;
  const scaleY = video.videoHeight / videoRect.height;

  const sx = (guideRect.left - videoRect.left) * scaleX;
  const sy = (guideRect.top - videoRect.top) * scaleY;
  const sw = guideRect.width * scaleX;
  const sh = guideRect.height * scaleY;

  canvas.width = sw;
  canvas.height = sh;

  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

  const cropped = await autoCropDocument(dataUrl);
  const scanned = await processImage(cropped);

  pages.push(scanned);
  renderPages();

  counter.textContent = `Página ${pages.length} agregada`;
}

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
      const maxWidth = 1600;
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

      const final = canvas.toDataURL("image/jpeg", 0.94);

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
      <div class="pageActions">
        <button onclick="deletePage(${index})">Eliminar</button>
        <button onclick="rotatePage(${index})">Rotar</button>
      </div>
    `;

    preview.appendChild(div);
  });
}

function deletePage(index) {
  pages.splice(index, 1);
  renderPages();
}

async function rotatePage(index) {
  const img = await loadImage(pages[index].final);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.height;
  canvas.height = img.width;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(90 * Math.PI / 180);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  const rotated = canvas.toDataURL("image/jpeg", 0.94);

  pages[index] = {
    original: rotated,
    final: rotated
  };

  renderPages();
}

async function createPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = 210;
  const pageHeight = 297;

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage();

    const img = await loadImage(pages[i].final);

    const ratio = Math.max(
      pageWidth / img.width,
      pageHeight / img.height
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

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

paperSize.addEventListener("change", () => {
  guide.classList.remove("letter", "legal", "a4", "free");
  guide.classList.add(paperSize.value);
});

function autoCropDocument(dataUrl) {
  return new Promise((resolve) => {
    if (typeof cv === "undefined") {
      resolve(dataUrl);
      return;
    }

    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      let src = cv.imread(canvas);
      let gray = new cv.Mat();
      let blur = new cv.Mat();
      let edges = new cv.Mat();
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();

      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 0);
      cv.Canny(blur, edges, 50, 150);

      cv.findContours(
        edges,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
      );

      let bestRect = null;
      let bestArea = 0;

      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const rect = cv.boundingRect(contour);
        const area = rect.width * rect.height;

        const minArea = canvas.width * canvas.height * 0.25;

        if (area > bestArea && area > minArea) {
          bestArea = area;
          bestRect = rect;
        }

        contour.delete();
      }

      if (!bestRect) {
        src.delete();
        gray.delete();
        blur.delete();
        edges.delete();
        contours.delete();
        hierarchy.delete();

        resolve(dataUrl);
        return;
      }

      const padding = 8;

      const x = Math.max(bestRect.x - padding, 0);
      const y = Math.max(bestRect.y - padding, 0);
      const w = Math.min(bestRect.width + padding * 2, canvas.width - x);
      const h = Math.min(bestRect.height + padding * 2, canvas.height - y);

      const cropCanvas = document.createElement("canvas");
      const cropCtx = cropCanvas.getContext("2d");

      cropCanvas.width = w;
      cropCanvas.height = h;

      cropCtx.drawImage(
        canvas,
        x, y, w, h,
        0, 0, w, h
      );

      src.delete();
      gray.delete();
      blur.delete();
      edges.delete();
      contours.delete();
      hierarchy.delete();

      resolve(cropCanvas.toDataURL("image/jpeg", 0.95));
    };

    img.src = dataUrl;
  });
}