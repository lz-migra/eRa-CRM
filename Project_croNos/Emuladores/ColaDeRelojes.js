(() => {
  const COLA_KEY = "cola_relojes_twilio";

  // 🟢 Crear UI principal
  const panel = document.createElement("div");
  panel.style.cssText = `
    position:fixed; top:80px; right:20px;
    background:rgba(34,34,34,0.9); color:#fff;
    padding:8px; border-radius:10px;
    box-shadow:0 4px 14px rgba(0,0,0,0.5);
    z-index:999999; font-family:sans-serif; font-size:13px;
    min-width:260px; max-height:300px; display:flex; flex-direction:column;
  `;
  document.body.appendChild(panel);

  // 🟡 Barra superior
  const header = document.createElement("div");
  header.style.cssText = `
    font-weight:700; margin-bottom:6px;
    display:flex; justify-content:space-between; align-items:center;
    cursor:move;
  `;
  header.textContent = "🗂️ Cola de Relojes";
  panel.appendChild(header);

  // 🔹 Contenedor dinámico
  const content = document.createElement("div");
  content.style.cssText = "flex:1; overflow-y:auto; margin-bottom:6px;";
  panel.appendChild(content);

  // 🔹 Controles
  const controls = document.createElement("div");
  controls.style.cssText = "display:flex; flex-direction:column; gap:4px;";
  controls.innerHTML = `
    <input id="nombreTarjeta" placeholder="Nombre tarjeta" style="padding:4px; border-radius:4px; border:1px solid #444; background:#111; color:#fff;"/>
    <label style="font-size:12px;">
      <input type="checkbox" id="usarStorage"/> usarStorage
    </label>
    <label style="font-size:12px;">
      <input type="checkbox" id="actualizar"/> actualizar
    </label>
    <button id="addSolicitud" style="padding:4px; border-radius:4px; background:#2ecc71; border:1px solid #27ae60; color:white; cursor:pointer;">➕ Agregar Solicitud</button>
    <button id="clearCola" style="padding:4px; border-radius:4px; background:#e74c3c; border:1px solid #c0392b; color:white; cursor:pointer;">🔥 Limpiar Cola</button>
  `;
  panel.appendChild(controls);

  // 📦 Funciones para la cola
  function getCola() {
    try {
      return JSON.parse(localStorage.getItem(COLA_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveCola(cola) {
    localStorage.setItem(COLA_KEY, JSON.stringify(cola));
  }

  function renderCola() {
    const cola = getCola();
    content.innerHTML = "";
    if (cola.length === 0) {
      content.innerHTML = `<div style="color:#aaa; font-size:12px;">(cola vacía)</div>`;
      return;
    }
    cola.forEach((item, i) => {
      const row = document.createElement("div");
      row.style.cssText = `
        display:flex; justify-content:space-between; align-items:center;
        background:#2f2f2f; border:1px solid #444; border-radius:6px;
        padding:4px; margin-bottom:4px;
      `;
      row.innerHTML = `
        <div style="flex:1; overflow:hidden;">
          <div style="font-weight:600; color:#6bffb8;">${item.nombre}</div>
          <div style="font-size:11px; color:#ccc;">actualizar: ${item.actualizar} | usarStorage: ${item.usarStorage}</div>
        </div>
        <button style="cursor:pointer;">❌</button>
      `;
      // ❌ Eliminar este item
      row.querySelector("button").onclick = () => {
        cola.splice(i, 1);
        saveCola(cola);
        renderCola();
      };
      content.appendChild(row);
    });
  }

  // 🎯 Eventos
  controls.querySelector("#addSolicitud").onclick = () => {
    const nombre = controls.querySelector("#nombreTarjeta").value.trim();
    const usarStorage = controls.querySelector("#usarStorage").checked;
    const actualizar = controls.querySelector("#actualizar").checked;
    if (!nombre) {
      alert("Debes poner un nombre de tarjeta");
      return;
    }
    const cola = getCola();
    cola.push({ nombre, usarStorage, actualizar });
    saveCola(cola);
    controls.querySelector("#nombreTarjeta").value = "";
    renderCola();
  };

  controls.querySelector("#clearCola").onclick = () => {
    if (confirm("¿Seguro que quieres limpiar toda la cola?")) {
      saveCola([]);
      renderCola();
    }
  };

  // 🔄 Refrescar automáticamente
  setInterval(renderCola, 1000);
  renderCola();

  // 🖱️ Hacer arrastrable
  let isDragging = false, offsetX = 0, offsetY = 0;
  header.onmousedown = (e) => {
    isDragging = true;
    const rect = panel.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    header.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
    document.onmousemove = (ev) => {
      if (!isDragging) return;
      panel.style.left = (ev.clientX - offsetX) + "px";
      panel.style.top = (ev.clientY - offsetY) + "px";
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    };
    document.onmouseup = () => {
      isDragging = false;
      document.onmousemove = null;
      document.onmouseup = null;
      header.style.cursor = "move";
      document.body.style.userSelect = "auto";
    };
    e.preventDefault();
  };

  console.log("🛠️ Interfaz de depuración para la cola iniciada.");
})();
