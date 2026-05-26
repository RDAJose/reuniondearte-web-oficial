const form = document.querySelector("#article-form");
const statusMessage = document.querySelector("#status-message");
const dateInput = form.elements.namedItem("publishedAt");
const coverInput = form.elements.namedItem("cover");
const coverAltInput = form.elements.namedItem("coverAlt");

dateInput.value = new Date().toISOString().slice(0, 10);

coverInput.addEventListener("change", () => {
  coverAltInput.required = coverInput.files.length > 0;
});

function setStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = type;
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("Guardando...");

  const submitButton = form.querySelector("button");
  submitButton.disabled = true;

  try {
    const formData = new FormData(form);
    const imageFile = coverInput.files[0];
    const payload = {
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      category: formData.get("category"),
      publishedAt: formData.get("publishedAt"),
      status: formData.get("status") || "draft",
      body: formData.get("body"),
      coverAlt: formData.get("coverAlt"),
      coverCaption: formData.get("coverCaption"),
      externalUrl: formData.get("externalUrl"),
      videoUrl: formData.get("videoUrl"),
      image: null,
    };

    if (imageFile) {
      payload.image = {
        name: imageFile.name,
        type: imageFile.type,
        data: await readFileAsBase64(imageFile),
      };
    }

    const response = await fetch("/api/articles", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      setStatus((result.errors || ["No se pudo guardar."]).join(" "), "error");
      return;
    }

    setStatus(`Guardado: ${result.articlePath}`, "ok");
    form.reset();
    dateInput.value = new Date().toISOString().slice(0, 10);
    form.elements.namedItem("status").value = "draft";
    coverAltInput.required = false;
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Error inesperado.", "error");
  } finally {
    submitButton.disabled = false;
  }
});
