// 👇 Creamos un objeto global para manejar el editor
const ReteUI = {
  iframe: null,
  container: null,

  open() {
    if (this.container) {
      this.container.style.display = "block";
      return;
    }

    // 📦 Contenedor flotante
    this.container = document.createElement("div");
    this.container.style.position = "fixed";
    this.container.style.top = "20px";
    this.container.style.right = "20px";
    this.container.style.width = "600px";
    this.container.style.height = "400px";
    this.container.style.border = "2px solid #444";
    this.container.style.borderRadius = "8px";
    this.container.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
    this.container.style.background = "white";
    this.container.style.zIndex = "9999";

    // ❌ Botón cerrar
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "✖";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "5px";
    closeBtn.style.right = "5px";
    closeBtn.style.border = "none";
    closeBtn.style.background = "transparent";
    closeBtn.style.fontSize = "18px";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = () => this.close();

    // 🖼️ Iframe con el editor Rete
    this.iframe = document.createElement("iframe");
    this.iframe.src = "./Twilio Flex_files/rete.html"; // el archivo donde vive el editor
    this.iframe.style.width = "100%";
    this.iframe.style.height = "100%";
    this.iframe.style.border = "none";

    // Insertamos todo
    this.container.appendChild(this.iframe);
    this.container.appendChild(closeBtn);
    document.body.appendChild(this.container);
  },

  close() {
    if (this.container) {
      this.container.style.display = "none";
    }
  }
};
