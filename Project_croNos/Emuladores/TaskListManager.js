// 🌍 TaskListManager — UI horizontal, plantillas y control completo
// v4.0 - Con ancho dinámico para ajustarse al contenido y evitar recortes.
window.TaskListManager = (function () {
  // 🧭 Estado interno
  let uiElement = null;
  let dragData = { isDragging: false, offsetX: 0, offsetY: 0 };

  // 💾 Cargar plantillas desde localStorage para que persistan entre sesiones.
  function loadTemplatesFromStorage() {
    try {
      const saved = localStorage.getItem('TaskListManager_templates');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Error al cargar plantillas desde localStorage:", e);
      return {};
    }
  }

  // 💾 Guardar las plantillas actuales en localStorage.
  function saveTemplatesToStorage() {
    try {
      localStorage.setItem('TaskListManager_templates', JSON.stringify(templates));
    } catch (e) {
      console.error("Error al guardar plantillas en localStorage:", e);
    }
  }

  // 🔎 Obtener el contenedor real dentro de Twilio (el <div> hijo donde van las tarjetas)
  function getContainer() {
    const outer = document.querySelector(".Twilio-TaskList-default");
    return outer ? outer.querySelector(":scope > div") : null;
  }

  // 🔨 Convertir HTML string a elemento DOM (primer elemento)
  function createElementFromHTML(html) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html.trim();
    return wrapper.firstElementChild;
  }

  // 📦 Plantillas iniciales (se mezclan con las guardadas en localStorage)
  const templates = {
    // Plantillas por defecto por si no hay nada guardado
    "whatsapp": `<div class="Twilio-TaskListBaseItem css-h9kan6" data-testid="task-item"><div class="Twilio-TaskListBaseItem-UpperArea css-rfkibc"><div class="Twilio-TaskListBaseItem-Content css-d2fqj9"><h4 class="Twilio-TaskListBaseItem-FirstLine css-627653"><span class="Twilio">📱 Tarjeta WhatsApp | +13053918485 |</span></h4><div class="Twilio-TaskListBaseItem-SecondLine css-1yl8gv1"><span class="Twilio">Chat entrante desde WhatsApp</span></div></div></div></div>`,
    "sms": `<div class="Twilio-TaskListBaseItem css-h9kan6" data-testid="task-item"><div class="Twilio-TaskListBaseItem-UpperArea css-rfkibc"><div class="Twilio-TaskListBaseItem-Content css-d2fqj9"><h4 class="Twilio-TaskListBaseItem-FirstLine css-627653"><span class="Twilio">💬 Tarjeta SMS | +15005550006 |</span></h4><div class="Twilio-TaskListBaseItem-SecondLine css-1yl8gv1"><span class="Twilio">Mensaje recibido por SMS</span></div></div></div></div>`,
    // Sobrescribimos y añadimos las plantillas guardadas en localStorage
    ...loadTemplatesFromStorage()
  };

  // 🔁 Refrescar lista de plantillas en la UI (fila horizontal)
  function refreshTemplateList() {
    if (!uiElement) return;
    const container = uiElement.querySelector("#template-list");
    container.innerHTML = "";

    Object.keys(templates).forEach((key) => {
      const box = document.createElement("div");
      box.style.cssText = "display:inline-flex; align-items:center; margin-right:6px; padding:4px 6px; background:#2f2f2f; border:1px solid #444; border-radius:6px; gap:6px;";

      const name = document.createElement("div");
      name.innerText = key;
      name.title = key;
      name.style.cssText = "max-width:90px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;";

      const addBtn = document.createElement("button");
      addBtn.innerText = "➕";
      addBtn.title = `Agregar ${key}`;
      addBtn.style.cursor = "pointer";
      addBtn.onclick = () => {
        addCardFromSaved(key);
        refreshActiveList();
      };

      const delBtn = document.createElement("button");
      delBtn.innerText = "🗑️";
      delBtn.title = `Eliminar plantilla ${key}`;
      delBtn.style.cursor = "pointer";
      delBtn.onclick = () => removeTemplate(key);

      box.appendChild(name);
      box.appendChild(addBtn);
      box.appendChild(delBtn);
      container.appendChild(box);
    });
  }

  // 🔁 Refrescar lista de tarjetas activas (vertical dentro de su columna)
  function refreshActiveList() {
    if (!uiElement) return;
    const list = uiElement.querySelector("#active-list");
    list.innerHTML = "";

    const container = getContainer();
    if (!container) {
      const hint = document.createElement("div");
      hint.innerText = "Contenedor no encontrado.";
      hint.style.color = "#f88";
      list.appendChild(hint);
      return;
    }

    container.querySelectorAll(".Twilio-TaskListBaseItem").forEach((card, index) => {
      const cardId = `card-${index}`;
      card.dataset.cardId = cardId;
      
      const title = card.querySelector("h4 span")?.textContent.trim() || "❓ Sin nombre";
      const row = document.createElement("div");
      row.style.cssText = "display:flex; align-items:center; justify-content:space-between; gap:8px; padding:4px; margin-bottom:6px; background:#2f2f2f; border:1px solid #444; border-radius:6px;";

      const nameSpan = document.createElement("div");
      nameSpan.innerText = title;
      nameSpan.style.cssText = "flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;";

      const del = document.createElement("button");
      del.innerText = "❌";
      del.title = "Eliminar tarjeta";
      del.style.cursor = "pointer";
      del.onclick = () => removeCardById(cardId);

      row.appendChild(nameSpan);
      row.appendChild(del);
      list.appendChild(row);
    });
  }
  
  // ✨ Muestra notificaciones sutiles en la UI.
  function showNotification(message, isError = false) {
    if (!uiElement) return;
    const notifArea = uiElement.querySelector("#ui-notification");
    if (!notifArea) return;
    
    notifArea.textContent = message;
    notifArea.style.color = isError ? "#ff6b6b" : "#6bffb8";
    notifArea.style.opacity = "1";
    
    setTimeout(() => { notifArea.style.opacity = "0"; }, 3000);
  }

  // ------------------ API functions ------------------

  function addRawCard(htmlString) {
    const container = getContainer();
    if (!container) {
      showNotification("Contenedor de Twilio no encontrado.", true);
      return null;
    }
    const el = createElementFromHTML(htmlString);
    if (!el) {
      showNotification("HTML inválido.", true);
      return null;
    }
    container.prepend(el);
    refreshActiveList();
    showNotification("Tarjeta Raw agregada.");
    return el;
  }

  function addCardFromSaved(key) {
    if (!templates[key]) {
      showNotification(`Plantilla "${key}" no existe.`, true);
      return null;
    }
    showNotification(`Tarjeta "${key}" agregada.`);
    return addRawCard(templates[key]);
  }

  function saveTemplate(key, htmlString) {
    if (!key || !htmlString) {
      showNotification("Key y HTML son requeridos.", true);
      return;
    }
    templates[key] = htmlString;
    saveTemplatesToStorage();
    showNotification(`Plantilla "${key}" guardada.`);
    refreshTemplateList();
  }

  function removeTemplate(key) {
    if (templates[key]) {
      delete templates[key];
      saveTemplatesToStorage();
      showNotification(`Plantilla "${key}" eliminada.`);
      refreshTemplateList();
    } else {
      showNotification(`Plantilla "${key}" no existe.`, true);
    }
  }

  function removeCardById(cardId) {
    const container = getContainer();
    if (!container) return;
    const cardToRemove = container.querySelector(`[data-card-id="${cardId}"]`);
    if (cardToRemove) {
      cardToRemove.remove();
      refreshActiveList();
    }
  }

  function removeCard(name) {
    const container = getContainer();
    if (!container) return;
    
    let cardToRemove = null;
    for (const card of container.querySelectorAll(".Twilio-TaskListBaseItem")) {
      const title = card.querySelector("h4 span")?.textContent.trim();
      if (title === name) {
        cardToRemove = card;
        break;
      }
    }

    if (cardToRemove) {
      cardToRemove.remove();
      showNotification(`Tarjeta "${name}" eliminada.`);
      refreshActiveList();
    } else {
      showNotification(`Tarjeta "${name}" no encontrada.`, true);
    }
  }

  function removeCardAll() {
    const container = getContainer();
    if (!container) return;
    container.querySelectorAll(".Twilio-TaskListBaseItem").forEach((c) => c.remove());
    showNotification("Todas las tarjetas eliminadas.");
    refreshActiveList();
  }

  function listTemplates() {
    console.table(templates);
  }

  // ------------------ UI ------------------

  function openui() {
    if (uiElement) return;

    uiElement = document.createElement("div");
    // FIX: Se elimina el `width` fijo para que el contenedor se ajuste al contenido.
    uiElement.style.cssText = "position:fixed; bottom:12px; right:12px; background:rgba(34, 34, 34, 0.9); backdrop-filter:blur(5px); color:#fff; padding:8px; border-radius:10px; box-shadow:0 4px 14px rgba(0,0,0,0.5); z-index:999999; font-family:sans-serif; font-size:13px; max-height:240px; overflow:hidden; display:flex; flex-direction:column;";

    const header = document.createElement("div");
    header.id = "ui-header";
    header.style.cssText = "display:flex; justify-content:space-between; align-items:center; cursor:move; gap:8px; margin-bottom:8px;";
    header.innerHTML = `<div style="font-weight:700;">⚙️ TaskListManager</div><div id="ui-notification" style="flex:1; text-align:center; color:#6bffb8; font-size:12px; transition: opacity 0.5s ease; opacity:0;"></div>`;
                      
    const closeBtn = document.createElement("div");
    closeBtn.innerText = "❌";
    closeBtn.style.cssText = "cursor:pointer; padding:4px;";
    closeBtn.onclick = () => closeui();
    header.appendChild(closeBtn);
    uiElement.appendChild(header);

    const main = document.createElement("div");
    main.style.cssText = "display:flex; gap:8px; flex:1; overflow:hidden;";

    // FIX: Se ajustan los anchos de las columnas para un layout estable.
    const tplCol = document.createElement("div");
    // La columna de plantillas será flexible pero con un ancho base.
    tplCol.style.cssText = "flex: 1 1 180px; display:flex; flex-direction:column; min-width:180px;";
    tplCol.innerHTML = `
  <div style="font-weight:600;margin-bottom:6px;">Plantillas Guardadas</div>
  <div id="template-list" 
       style="display:flex; flex-wrap:wrap; gap:6px; max-width:200px; padding-bottom:10px; overflow-y:auto;">
  </div>`;


    const activeCol = document.createElement("div");
    // La columna de activas mantiene su ancho fijo para evitar saltos.
    activeCol.style.cssText = "flex: 0 0 150px; display:flex; flex-direction:column;";
    activeCol.innerHTML = `<div style="font-weight:600;margin-bottom:6px;">Tarjetas Activas</div><div id="active-list" style="overflow-y:auto; max-height:140px; padding-right: 5px;"></div>`;

    const ctrlCol = document.createElement("div");
    // La columna de controles ahora tiene un ancho fijo suficiente para su contenido.
    ctrlCol.style.cssText = "flex: 0 0 170px; display:flex; flex-direction:column; gap:4px;";
    ctrlCol.innerHTML = `
      <div style="font-weight:600;">Controles</div>
      <button id="clearAll" style="width:100%; cursor:pointer; padding: 6px; border-radius:4px; border:1px solid #c0392b; background:#e74c3c; color:white;">🔥 Limpiar Todas</button>
      <div style="font-size:11px;color:#ccc;margin-top:4px;">Guardar plantilla</div>
      <input id="tplKey" placeholder="nombre-plantilla" style="width:100%;padding:6px;border-radius:4px;border:1px solid #444;background:#111;color:#fff; box-sizing: border-box;" />
      <textarea id="tplHtml" placeholder="HTML de la plantilla" style="width:100%;height:52px;padding:6px;border-radius:4px;border:1px solid #444;background:#111;color:#fff; box-sizing: border-box;"></textarea>
      <button id="saveTpl" style="width:100%; cursor:pointer; padding: 6px; border-radius:4px; border:1px solid #27ae60; background:#2ecc71; color:white;">💾 Guardar</button>`;

    main.appendChild(tplCol);
    main.appendChild(activeCol);
    main.appendChild(ctrlCol);
    uiElement.appendChild(main);
    document.body.appendChild(uiElement);

    uiElement.querySelector("#clearAll").onclick = () => removeCardAll();
    uiElement.querySelector("#saveTpl").onclick = () => {
      const key = uiElement.querySelector("#tplKey").value.trim();
      const html = uiElement.querySelector("#tplHtml").value.trim();
      saveTemplate(key, html);
      uiElement.querySelector("#tplKey").value = "";
      uiElement.querySelector("#tplHtml").value = "";
    };

    header.onmousedown = (e) => {
      dragData.isDragging = true;
      const rect = uiElement.getBoundingClientRect();
      dragData.offsetX = e.clientX - rect.left;
      dragData.offsetY = e.clientY - rect.top;
      header.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
      
      document.onmousemove = (ev) => {
        if (!dragData.isDragging) return;
        uiElement.style.left = (ev.clientX - dragData.offsetX) + "px";
        uiElement.style.top = (ev.clientY - dragData.offsetY) + "px";
        uiElement.style.bottom = "auto";
        uiElement.style.right = "auto";
      };
      
      document.onmouseup = () => {
        dragData.isDragging = false;
        document.onmousemove = null;
        document.onmouseup = null;
        header.style.cursor = "move";
        document.body.style.userSelect = "auto";
      };
      e.preventDefault();
    };

    refreshTemplateList();
    refreshActiveList();
  }

  function closeui() {
    if (uiElement) {
      uiElement.remove();
      uiElement = null;
    }
  }

  return {
    addRawCard, addCardFromSaved, saveTemplate, removeTemplate,
    removeCard, removeCardAll, listTemplates, openui, closeui, templates
  };
})();

// Para iniciar, ejecuta en la consola:

TaskListManager.openui();