(() => {
  const varMonitor = {};
  window.varMonitor = varMonitor; // 🌍 Hacer accesible globalmente

  // 💾 Funciones de persistencia -----------------
  function loadVarsFromStorage() {
    try {
      const saved = localStorage.getItem("VarMonitor_vars");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("❌ Error cargando variables guardadas:", e);
      return [];
    }
  }

  function saveVarsToStorage() {
    try {
      localStorage.setItem("VarMonitor_vars", JSON.stringify(variablesAMonitorear));
    } catch (e) {
      console.error("❌ Error guardando variables:", e);
    }
  }

  // 🟢 Lista inicial (si no hay guardadas)
  let variablesAMonitorear = loadVarsFromStorage();
  if (variablesAMonitorear.length === 0) {
    variablesAMonitorear = ["estadoEjecutorCHAT", "estadoEjecutorVOICE", "estadoEjecutorIVR"];
  }

  let monitor, content, notifArea;

  // 🎨 Crear contenedor flotante
  function createUI() {
    if (monitor) {
      monitor.remove();
    }

    monitor = document.createElement("div");
    monitor.style.cssText = `
      position:fixed; bottom:12px; right:12px;
      background:rgba(34,34,34,0.9); backdrop-filter:blur(5px);
      color:#fff; padding:8px; border-radius:10px;
      box-shadow:0 4px 14px rgba(0,0,0,0.5);
      z-index:999999; font-family:sans-serif; font-size:13px;
      max-height:260px; min-width:240px; display:flex; flex-direction:column;
    `;
    document.body.appendChild(monitor);

    // 🔹 Barra superior con ❌
    const header = document.createElement("div");
    header.style.cssText = `
      display:flex; justify-content:space-between; align-items:center;
      cursor:move; gap:8px; margin-bottom:6px; font-weight:700;
    `;
    header.innerHTML = `
      📎 Monitor JS 
      <div id="ui-notification" style="flex:1; text-align:center; color:#6bffb8; font-size:12px; transition:opacity 0.5s ease; opacity:0;"></div>
      <button id="closeMonitor" style="background:none; border:none; color:#ff6b6b; font-size:14px; cursor:pointer;">❌</button>
    `;
    monitor.appendChild(header);

    notifArea = header.querySelector("#ui-notification");

    // ❌ Cerrar ventana
    header.querySelector("#closeMonitor").onclick = () => {
      monitor.remove();
      monitor = null;
    };

    // 🔹 Contenido dinámico
    content = document.createElement("div");
    content.style.cssText = "flex:1; overflow-y:auto; padding-right:4px;";
    monitor.appendChild(content);

    // 🔹 Controles
    const controls = document.createElement("div");
    controls.style.cssText = "margin-top:6px; display:flex; flex-direction:column; gap:4px;";
    controls.innerHTML = `
      <input id="varName" placeholder="nombreVariable" style="padding:4px; border-radius:4px; border:1px solid #444; background:#111; color:#fff;"/>
      <button id="addVar" style="padding:4px; border-radius:4px; background:#2ecc71; border:1px solid #27ae60; color:white; cursor:pointer;">➕ Agregar</button>
    `;
    monitor.appendChild(controls);

    // Evento agregar
    controls.querySelector("#addVar").onclick = () => {
      const varName = controls.querySelector("#varName").value.trim();
      if (varName) {
        addVar(varName);
        controls.querySelector("#varName").value = "";
      }
    };

    // 🖱️ Hacer ventana arrastrable
    let isDragging = false, offsetX = 0, offsetY = 0;
    header.onmousedown = (e) => {
      if (e.target.id === "closeMonitor") return; // no arrastrar si se clickeó el botón ❌
      isDragging = true;
      const rect = monitor.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      header.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
      document.onmousemove = (ev) => {
        if (!isDragging) return;
        monitor.style.left = (ev.clientX - offsetX) + "px";
        monitor.style.top = (ev.clientY - offsetY) + "px";
        monitor.style.bottom = "auto";
        monitor.style.right = "auto";
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
  }

  // ✨ Notificación sutil
  function showNotification(msg, isError = false) {
    if (!notifArea) return;
    notifArea.textContent = msg;
    notifArea.style.color = isError ? "#ff6b6b" : "#6bffb8";
    notifArea.style.opacity = "1";
    setTimeout(() => notifArea.style.opacity = "0", 2500);
  }

  // 🔄 Render de variables
  function renderVars() {
    if (!content) return;
    content.innerHTML = "";
    variablesAMonitorear.forEach((v, i) => {
      let valor;
      try {
        valor = window[v];
      } catch (e) {
        valor = "❌ No definida";
      }
      const row = document.createElement("div");
      row.style.cssText = `
        display:flex; align-items:center; justify-content:space-between;
        gap:6px; padding:4px; margin-bottom:4px;
        background:#2f2f2f; border:1px solid #444; border-radius:6px;
      `;
      row.innerHTML = `
        <div style="flex:1; display:flex; flex-direction:column; overflow:hidden;">
          <div style="font-weight:600; color:#6bffb8;">${v}</div>
          <div style="font-size:12px; color:#ccc; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${JSON.stringify(valor)}
          </div>
        </div>
        <button style="cursor:pointer;">❌</button>
        <button style="cursor:pointer;">✏️</button>
      `;

      // ❌ Eliminar variable
      row.querySelector("button:nth-child(2)").onclick = () => {
        variablesAMonitorear.splice(i, 1);
        saveVarsToStorage(); // 💾 guardar
        showNotification(`Variable "${v}" eliminada.`);
        renderVars();
      };

      // ✏️ Editar variable
      row.querySelector("button:nth-child(3)").onclick = () => {
        const nuevoValor = prompt(`Nuevo valor para ${v}:`, JSON.stringify(valor));
        if (nuevoValor !== null) {
          try {
            window[v] = JSON.parse(nuevoValor);
            showNotification(`Variable "${v}" actualizada.`);
          } catch {
            window[v] = nuevoValor;
            showNotification(`Variable "${v}" actualizada (string).`);
          }
          renderVars();
        }
      };

      content.appendChild(row);
    });
  }

  // ➕ Agregar variable
  function addVar(varName) {
    if (!variablesAMonitorear.includes(varName)) {
      variablesAMonitorear.push(varName);
      saveVarsToStorage(); // 💾 guardar
      showNotification(`Variable "${varName}" añadida.`);
      renderVars();
    } else {
      showNotification(`⚠️ Ya existe en el monitor.`, true);
    }
  }

  // 🚀 Inicializar
  varMonitor.openui = () => {
    createUI();
    renderVars();
  };

  varMonitor.addVar = addVar;
  varMonitor.removeVar = (v) => {
    const idx = variablesAMonitorear.indexOf(v);
    if (idx > -1) {
      variablesAMonitorear.splice(idx, 1);
      saveVarsToStorage();
      showNotification(`Variable "${v}" eliminada.`);
      renderVars();
    }
  };

// Inicial arranque
varMonitor.openui();

// 🔄 Auto-refresh cada 200ms
setInterval(renderVars, 200);

console.log("🚀 Monitor iniciado. Usa varMonitor.openui(), varMonitor.addVar('nombreVariable') o varMonitor.removeVar('nombreVariable').");
})();
