(() => {
  // --- CONFIGURACIÓN DE HERRAMIENTAS ---
  const tools = [
    { label: "📦 ColaUI", action: () => ColaUI.openui() },  // ColaUI.openui()
    { label: "📊 VarMonitor", action: () => varMonitor.openui() },
    { label: "📝 TaskListManager", action: () => TaskListManager.openui() },
    { label: "💬 ChatUI", action: () => ChatUI.openui() }
    // Puedes agregar más herramientas aquí
  ];

  // --- CREACIÓN DE ELEMENTOS ---
  const toolBar = document.createElement("div");
  toolBar.id = "floating-toolbar";

  const toggleBtn = document.createElement("button");
  toggleBtn.id = "toolbar-toggle";
  toggleBtn.type = "button";
  toggleBtn.setAttribute("aria-label", "Toggle Toolbar");
  toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" fill="currentColor" width="16px" height="16px">
      <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
    </svg>`;

  const toolsContainer = document.createElement("div");
  toolsContainer.id = "toolbar-buttons-container";

  tools.forEach(tool => {
    const btn = document.createElement("button");
    btn.className = "toolbar-btn";
    btn.textContent = tool.label;
    btn.addEventListener("click", tool.action);
    toolsContainer.appendChild(btn);
  });

  // --- INYECTAR ESTILOS ---
  const style = document.createElement("style");
  style.textContent = `
    :root {
      --toolbar-bg: rgba(33, 37, 41, 0.95);
      --toolbar-border: rgba(255, 255, 255, 0.1);
      --button-bg: rgba(255, 255, 255, 0.08);
      --button-hover-bg: rgba(255, 255, 255, 0.15);
      --text-color: #f8f9fa;
      --shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
      --radius: 8px;
      --transition-speed: 0.3s;
    }

    #floating-toolbar {
      position: fixed;
      bottom: 15px;
      left: 15px;
      display: flex;
      align-items: center;
      background-color: var(--toolbar-bg);
      border: 1px solid var(--toolbar-border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 6px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      transition: all var(--transition-speed) ease-in-out;
      z-index: 9999;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    #toolbar-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--button-bg);
      color: var(--text-color);
      border: none;
      border-radius: 6px;
      cursor: pointer;
      width: 32px;
      height: 32px;
      flex-shrink: 0;
      transition: transform var(--transition-speed) ease-in-out, background-color 0.2s ease;
      margin-right: 6px;
    }

    #toolbar-toggle:hover {
      background-color: var(--button-hover-bg);
    }

    #toolbar-toggle svg {
      transition: transform var(--transition-speed) ease-in-out;
    }

    #toolbar-buttons-container {
      display: flex;
      gap: 6px;
      overflow: hidden;
      transition: width var(--transition-speed) ease-in-out, 
                  opacity var(--transition-speed) ease-in-out;
      width: auto; /* Se ajustará dinámicamente */
      opacity: 1;
    }

    .toolbar-btn {
      background-color: var(--button-bg);
      color: var(--text-color);
      border: none;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      white-space: nowrap;
      transition: background-color 0.2s ease, transform 0.2s ease;
    }

    .toolbar-btn:hover {
      background-color: var(--button-hover-bg);
      transform: translateY(-2px);
    }

    #floating-toolbar.minimized #toolbar-toggle svg {
      transform: rotate(180deg);
    }
  `;
  document.head.appendChild(style);

  // --- ENSAMBLAJE ---
  toolBar.appendChild(toggleBtn);
  toolBar.appendChild(toolsContainer);
  document.body.appendChild(toolBar);

  // --- LÓGICA DE ANIMACIÓN DINÁMICA ---
  const updateContainerWidth = (expand = true) => {
    if (expand) {
      toolsContainer.style.width = toolsContainer.scrollWidth + "px";
      toolsContainer.style.opacity = "1";
    } else {
      toolsContainer.style.width = "0px";
      toolsContainer.style.opacity = "0";
    }
  };

  // Estado inicial expandido
  updateContainerWidth(true);

  toggleBtn.addEventListener("click", () => {
    const minimized = toolBar.classList.toggle("minimized");
    updateContainerWidth(!minimized);
  });

  // Ajuste si la ventana cambia de tamaño
  window.addEventListener("resize", () => {
    if (!toolBar.classList.contains("minimized")) {
      updateContainerWidth(true);
    }
  });
})();
