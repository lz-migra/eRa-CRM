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
    "CHAT": `
      <div class="Twilio-TaskListBaseItem css-h9kan6" data-testid="task-item" tabindex="0" role="button" aria-label="chat task with status accepted from WA-IN | 📞 | US | +13053918485 | for queue IN_WHATSAPP_CLL. . Attention required.. 2 unread messages.. Customer is offline."><div class="Twilio-TaskListBaseItem-UpperArea css-rfkibc"><div class="Twilio-TaskListBaseItem-IconAreaContainer css-1r1u88g"><button class="MuiButtonBase-root MuiIconButton-root Twilio-IconButton css-169h1y7 Twilio-TaskListBaseItem-IconArea css-19145cc" tabindex="-1" type="button" aria-hidden="true"><span class="MuiIconButton-label"><div data-testid="Twilio-Icon" class="Twilio-Icon Twilio-Icon-Whatsapp  css-1j3rlv1"><svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" class="Twilio-Icon-Content"><path d="M13.973 11.729c.146.07.245.117.287.187.052.087.053.504-.122.992-.175.487-1.012.931-1.414.991a2.883 2.883 0 01-1.32-.082 12.06 12.06 0 01-1.195-.44c-1.963-.843-3.29-2.737-3.542-3.096a2.543 2.543 0 00-.037-.052l-.001-.002c-.11-.146-.855-1.134-.855-2.156 0-.96.474-1.464.693-1.695l.04-.044a.771.771 0 01.56-.261c.139 0 .279.001.4.007h.048c.122 0 .274 0 .424.358l.233.562c.18.436.378.917.413.986.053.105.088.227.018.366l-.03.058c-.052.107-.09.186-.18.29a8.54 8.54 0 00-.105.126c-.073.088-.146.176-.209.239-.105.104-.214.217-.092.426.122.208.543.891 1.166 1.444.67.595 1.251.846 1.546.973.058.025.105.045.139.063.21.104.331.087.454-.053.122-.139.524-.609.663-.817.14-.21.28-.174.472-.105.192.07 1.222.574 1.431.679l.115.056z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10 2a8 8 0 00-7.02 11.84c.003.005.003.01.003.01l-.78 2.916a.842.842 0 001.03 1.031l2.917-.78s.004 0 .01.003A8 8 0 1010 2zm-7.158 8a7.158 7.158 0 113.723 6.281.855.855 0 00-.632-.078l-2.917.78.78-2.916a.855.855 0 00-.077-.632A7.124 7.124 0 012.842 10z" fill="currentColor"></path></svg></div></span></button><div class="Twilio-Badge-OuterCircle css-wcl2mj"><div class="Twilio-Badge-InnerCircle css-e0wrci"><span class="Twilio-Badge-TextContainer css-dr2ko4">2</span></div></div></div><div class="Twilio-TaskListBaseItem-Content css-d2fqj9"><h4 class="Twilio-TaskListBaseItem-FirstLine css-627653" data-testid="task-item-first-line"><span class="Twilio"> WA-IN | 📞 | US | +13053918485 | </span></h4><div class="Twilio-TaskListBaseItem-SecondLine css-1yl8gv1"><span class="Twilio css-1o089kg">06:14 |    whatsapp:+13053918485:  3053918485 </span></div></div><div class="Twilio-TaskListBaseItem-Actions css-4x1hxs"></div></div></div>
    `,
    "VOICE": `
      <div class="Twilio-TaskListBaseItem css-1epyp4w" data-testid="task-item" tabindex="0" role="button" aria-label="voice task with status accepted from 📦 | IN_CALL_ENVIOS_HC | +13465564113 for queue IN_CALL_ENVIOS_HC. . . ."><div class="Twilio-TaskListBaseItem-UpperArea css-rfkibc"><div class="Twilio-TaskListBaseItem-IconAreaContainer css-1r1u88g"><button class="MuiButtonBase-root MuiIconButton-root Twilio-IconButton css-169h1y7 Twilio-TaskListBaseItem-IconArea css-148zgv3" tabindex="-1" type="button" aria-hidden="true"><span class="MuiIconButton-label"><div data-testid="Twilio-Icon" class="Twilio-Icon Twilio-Icon-Call  css-1j3rlv1"><svg width="1em" height="1em" viewBox="0 0 24 24" class="Twilio-Icon-Content"><path d="M6.924 4.57a.29.29 0 00-.116.023.621.621 0 00-.1.054c-.431.308-.84.652-1.225 1.032-.385.38-.608.658-.67.832.02.463.136.969.347 1.518.21.55.51 1.132.901 1.749.39.616.866 1.263 1.425 1.941a32.29 32.29 0 001.903 2.095c.72.72 1.42 1.359 2.103 1.918.683.56 1.333 1.033 1.95 1.418.615.385 1.198.685 1.748.901.55.216 1.055.334 1.517.355.175-.072.452-.3.832-.686.38-.385.724-.794 1.033-1.225a.292.292 0 00.069-.139.817.817 0 00.008-.092 28.76 28.76 0 00-.601-.4c-.298-.196-.617-.406-.956-.632l-1.525-1.017h-.015a.65.65 0 00-.108.015.654.654 0 00-.2.093 27.775 27.775 0 00-1.371.77l-.555.308-.509-.37c-.184-.133-.485-.37-.9-.708a21.965 21.965 0 01-1.565-1.449 28.089 28.089 0 01-1.456-1.571c-.344-.41-.583-.714-.716-.909l-.354-.508.308-.54c.195-.349.362-.644.5-.886.14-.241.229-.403.27-.485a.813.813 0 00.092-.323c-.061-.103-.19-.303-.385-.601a97.481 97.481 0 00-.624-.94 97.48 97.48 0 01-.624-.94 11.001 11.001 0 00-.4-.585c0-.01-.005-.016-.016-.016h-.015zm.01-.96c.165 0 .319.03.463.092a.753.753 0 01.338.277l.378.554c.21.309.436.645.678 1.01.241.364.467.703.678 1.016.21.314.341.511.393.594a.999.999 0 01.123.57c-.01.226-.077.462-.2.708-.072.124-.196.34-.37.648-.175.308-.313.56-.416.754.113.165.331.442.655.832.323.39.788.889 1.394 1.495.616.616 1.12 1.086 1.51 1.41.39.323.667.541.832.654.185-.102.434-.244.747-.423.313-.18.532-.3.655-.362.133-.072.264-.126.393-.162.128-.036.254-.054.377-.054.093 0 .18.013.262.038.082.026.16.06.231.1l.609.393a373.833 373.833 0 012.041 1.348c.308.206.493.334.555.386.205.133.331.352.377.655.046.303-.038.613-.254.932l-.277.362c-.185.241-.411.506-.678.793a7.786 7.786 0 01-.855.794c-.303.241-.573.362-.81.362h-.015c-.677-.02-1.376-.185-2.095-.493a13.117 13.117 0 01-2.126-1.164 19.865 19.865 0 01-2.026-1.556 36.632 36.632 0 01-1.795-1.671 34.26 34.26 0 01-1.664-1.795 20.545 20.545 0 01-1.548-2.026A13.27 13.27 0 014.33 8.562c-.309-.713-.473-1.404-.493-2.072-.01-.246.105-.519.346-.816.242-.298.506-.58.794-.848.287-.267.552-.493.793-.678.241-.185.367-.282.378-.292.123-.083.251-.144.385-.185.133-.041.267-.062.4-.062z" fill="currentColor" stroke="none" stroke-width="1" fill-rule="evenodd"></path></svg></div></span></button></div><div class="Twilio-TaskListBaseItem-Content css-d2fqj9"><h4 class="Twilio-TaskListBaseItem-FirstLine css-627653" data-testid="task-item-first-line"><span class="Twilio"> 📦 | IN_CALL_ENVIOS_HC | +13465564113 </span></h4><div class="Twilio-TaskListBaseItem-SecondLine css-1yl8gv1"><div class="TCYUgjU+8ix6qsiJSXAWWQ=="><span class="qBm7Ax9ryCnP2Xdp6Ky4-A==">Live | 00:36</span></div></div></div><div class="Twilio-TaskListBaseItem-Actions css-4x1hxs"><button class="MuiButtonBase-root MuiIconButton-root Twilio-IconButton css-169h1y7 Twilio-TaskButton-Hold MuiIconButton-colorSecondary MuiIconButton-sizeSmall" tabindex="0" type="button" aria-disabled="false" aria-label="Hold Customer" data-testid="hold-task" title="Hold Customer"><span class="MuiIconButton-label"><div data-testid="Twilio-Icon" class="Twilio-Icon Twilio-Icon-Hold  css-1j3rlv1"><svg width="1em" height="1em" viewBox="0 0 24 24" class="Twilio-Icon-Content"><g stroke="none" stroke-width="1" fill="currentColor" fill-rule="nonzero"><path d="M8 5h2a1 1 0 011 1v12a1 1 0 01-1 1H8a1 1 0 01-1-1V6a1 1 0 011-1zm0 1v12h2V6H8zM14 5h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V6a1 1 0 011-1zm0 1v12h2V6h-2z"></path></g></svg></div></span></button><button class="MuiButtonBase-root MuiIconButton-root Twilio-IconButton jss52 css-169h1y7 Twilio-TaskButton-Hangup MuiIconButton-sizeSmall" tabindex="0" type="button" aria-disabled="false" aria-label="Hang up" data-testid="hangup-task" title="Hang up"><span class="MuiIconButton-label"><div data-testid="Twilio-Icon" class="Twilio-Icon Twilio-Icon-Hangup  css-1j3rlv1"><svg width="1em" height="1em" viewBox="0 0 24 24" class="Twilio-Icon-Content"><path d="M19.862 14.102a.275.275 0 00.062-.093.588.588 0 00.031-.103c.083-.495.126-1 .13-1.512.003-.512-.034-.848-.11-1.006-.323-.296-.739-.557-1.248-.785a9.456 9.456 0 00-1.775-.567 18.266 18.266 0 00-2.255-.346 30.59 30.59 0 00-2.679-.129c-.963 0-1.86.041-2.693.124-.833.082-1.585.201-2.256.356-.67.155-1.262.344-1.775.568-.512.223-.93.483-1.254.779-.069.165-.101.504-.098 1.016.004.513.047 1.017.13 1.512a.276.276 0 00.046.14.774.774 0 00.056.067c.117-.02.341-.065.671-.134.33-.07.685-.141 1.063-.217l1.703-.34.01-.01a.615.615 0 00.062-.083.62.62 0 00.073-.197 26.313 26.313 0 00.403-1.435l.164-.577.589-.093c.213-.034.572-.077 1.078-.13a20.81 20.81 0 012.018-.076 26.61 26.61 0 012.028.077c.506.045.869.088 1.089.129l.578.103.155.568c.103.364.189.674.258.929.068.254.117.423.144.505a.77.77 0 00.155.28c.11.027.33.075.66.144.33.068.68.139 1.048.211.368.072.717.143 1.048.212.33.069.55.11.66.124.007.006.014.006.02 0l.011-.01zm.637.651a1.1 1.1 0 01-.371.248.714.714 0 01-.413.041 89.21 89.21 0 00-.625-.119c-.347-.065-.724-.139-1.13-.222-.406-.082-.784-.158-1.135-.227-.351-.068-.571-.113-.66-.134a.946.946 0 01-.465-.3 1.675 1.675 0 01-.34-.608l-.186-.681c-.09-.324-.166-.585-.228-.785a13.12 13.12 0 00-.996-.118 21.859 21.859 0 00-1.935-.067c-.825 0-1.477.022-1.956.067-.478.044-.81.084-.995.118-.056.193-.128.454-.217.785-.09.33-.155.557-.196.681a1.826 1.826 0 01-.155.372c-.062.11-.134.206-.217.288a.827.827 0 01-.201.15 1.103 1.103 0 01-.222.088 150.187 150.187 0 01-1.816.382l-1.125.227a9.179 9.179 0 01-.63.113c-.227.048-.458-.013-.692-.185-.233-.172-.385-.437-.454-.795l-.056-.428a10.562 10.562 0 01-.078-.986c-.014-.372 0-.74.041-1.104.042-.365.141-.627.3-.785l.01-.01c.468-.44 1.046-.798 1.734-1.074.688-.275 1.423-.49 2.203-.645a18.82 18.82 0 012.4-.314 34.704 34.704 0 012.322-.083c.73 0 1.502.03 2.317.088.816.058 1.614.165 2.395.32.78.155 1.514.368 2.198.64.685.271 1.258.624 1.719 1.058.172.158.277.418.314.779.038.361.05.727.036 1.099-.013.371-.04.7-.077.986-.038.285-.057.435-.057.449a1.397 1.397 0 01-.134.381c-.062.117-.137.22-.227.31z" fill="currentColor" stroke="none" stroke-width="1" fill-rule="evenodd"></path></svg></div></span></button></div></div></div>
    `,
    "IVR": `
      <div class="Twilio-TaskListBaseItem css-1epyp4w" data-testid="task-item" tabindex="0" role="button" aria-label="ivr-live-callback task with status accepted from Remesas Round 1 | Acc: 2250455 for queue Campaña Remesas. . . ."><div class="Twilio-TaskListBaseItem-UpperArea css-rfkibc"><div class="Twilio-TaskListBaseItem-IconAreaContainer css-1r1u88g"><button class="MuiButtonBase-root MuiIconButton-root Twilio-IconButton css-169h1y7 Twilio-TaskListBaseItem-IconArea css-148zgv3" tabindex="-1" type="button" aria-hidden="true"><span class="MuiIconButton-label"><div data-testid="Twilio-Icon" class="Twilio-Icon Twilio-Icon-GenericTask  css-1j3rlv1"><svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" class="Twilio-Icon-Content"><path d="M13.487 8.146a.5.5 0 010 .708L9.51 12.83a1.085 1.085 0 01-1.53 0l-1.334-1.334a.5.5 0 11.708-.707l1.332 1.334a.084.084 0 00.118 0l3.976-3.977a.5.5 0 01.707 0zM10 4.5A.75.75 0 1010 3a.75.75 0 000 1.5z" fill="currentColor" data-darkreader-inline-fill="" style="--darkreader-inline-fill: currentColor;"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M7.867 1.94A2.923 2.923 0 0110 1c.806 0 1.573.342 2.133.94.445.474.732 1.08.83 1.727H15c.409 0 .793.173 1.072.47.277.296.428.69.428 1.096v11.2c0 .406-.15.8-.428 1.097A1.47 1.47 0 0115 18H5a1.47 1.47 0 01-1.072-.47 1.604 1.604 0 01-.428-1.097v-11.2c0-.405.15-.8.428-1.096A1.47 1.47 0 015 3.667h2.038a3.233 3.233 0 01.83-1.728zM10 2c-.52 0-1.025.22-1.403.623A2.26 2.26 0 008 4.167a.5.5 0 01-.5.5H5a.47.47 0 00-.342.154.604.604 0 00-.158.412v11.2c0 .16.06.308.158.413A.47.47 0 005 17h10a.47.47 0 00.342-.154.604.604 0 00.158-.413v-11.2c0-.16-.06-.308-.158-.412A.47.47 0 0015 4.667h-2.5a.5.5 0 01-.5-.5 2.26 2.26 0 00-.597-1.544A1.924 1.924 0 0010 2z" fill="currentColor" data-darkreader-inline-fill="" style="--darkreader-inline-fill: currentColor;"></path></svg></div></span></button></div><div class="Twilio-TaskListBaseItem-Content css-d2fqj9"><h4 class="Twilio-TaskListBaseItem-FirstLine css-627653" data-testid="task-item-first-line"><span class="Twilio"> Remesas Round 1 | Acc: 2250455 </span></h4><div class="Twilio-TaskListBaseItem-SecondLine css-1yl8gv1"><span class="Twilio css-1o089kg">Assigned</span></div></div><div class="Twilio-TaskListBaseItem-Actions css-4x1hxs"></div></div></div>
    `
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
    tplCol.innerHTML = `<div style="font-weight:600;margin-bottom:6px;">Plantillas Guardadas</div><div id="template-list" style="overflow-x:auto; white-space:nowrap; padding-bottom:10px;"></div>`;

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
// TaskListManager.openui();