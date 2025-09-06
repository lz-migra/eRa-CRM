(() => {
  // 🟢 Lista inicial de variables globales a monitorear
  const variablesAMonitorear = [

    "estadoEjecutorCHAT",
    "estadoEjecutorVOICE", 
    "estadoEjecutorIVR"
    
];

  // 🟡 Crear contenedor flotante
  const monitor = document.createElement("div");
  monitor.style.position = "fixed";
  monitor.style.bottom = "10px";
  monitor.style.right = "10px";
  monitor.style.width = "250px";
  monitor.style.maxHeight = "200px";
  monitor.style.overflowY = "auto";
  monitor.style.background = "rgba(0,0,0,0.85)";
  monitor.style.color = "lime";
  monitor.style.fontFamily = "monospace";
  monitor.style.fontSize = "12px";
  monitor.style.borderRadius = "8px";
  monitor.style.zIndex = "99999";
  monitor.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
  monitor.style.userSelect = "none";
  document.body.appendChild(monitor);

  // 🔹 Barra superior (clip para mover)
  const header = document.createElement("div");
  header.style.background = "#333";
  header.style.color = "#fff";
  header.style.padding = "4px";
  header.style.cursor = "grab";
  header.style.borderTopLeftRadius = "8px";
  header.style.borderTopRightRadius = "8px";
  header.innerHTML = "📎 Monitor JS";
  monitor.appendChild(header);

  // 🔹 Contenido dinámico
  const content = document.createElement("div");
  content.style.padding = "5px";
  monitor.appendChild(content);

  // 🔄 Actualizar contenido cada 200ms
  setInterval(() => {
    content.innerHTML = "";
    variablesAMonitorear.forEach(v => {
      let valor;
      try {
        valor = window[v]; // Obtener valor global
      } catch (e) {
        valor = "❌ No definida";
      }
      content.innerHTML += `<div>${v}: ${JSON.stringify(valor)}</div>`;
    });
  }, 200);

  // 🖱️ Hacer ventana arrastrable
  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - monitor.offsetLeft;
    offsetY = e.clientY - monitor.offsetTop;
    header.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      monitor.style.left = e.clientX - offsetX + "px";
      monitor.style.top = e.clientY - offsetY + "px";
      monitor.style.right = "auto";  
      monitor.style.bottom = "auto"; 
      monitor.style.position = "fixed";
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    header.style.cursor = "grab";
  });

  // ✨ Extra: función para agregar variables desde consola
  window.addVarToMonitor = (varName) => {
    if (!variablesAMonitorear.includes(varName)) {
      variablesAMonitorear.push(varName);
      console.log(`✅ Variable "${varName}" añadida al monitor.`);
    } else {
      console.warn(`⚠️ Variable "${varName}" ya está en el monitor.`);
    }
  };

  console.log("🚀 Monitor iniciado. Usa addVarToMonitor('nombreVariable') para añadir más.");
})();


