(function () {
  'use strict';

  const nombreScript = '[Modal Canal & Solicitud]';

  // 🎨 Estilos
  const style = document.createElement("style");
  style.innerHTML = `
    .modal-bg {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      display: flex; justify-content: center; align-items: center;
      z-index: 9999;
      background: rgba(0,0,0,0); backdrop-filter: blur(0px);
      transition: background 0.3s ease, backdrop-filter 0.3s ease;
    }
    .modal-bg.fade-in-bg { background: rgba(0,0,0,0.45); backdrop-filter: blur(6px); }
    .modal-bg.fade-out-bg { background: rgba(0,0,0,0); backdrop-filter: blur(0px); }
    .modal-card {
      background: #fff; border-radius: 12px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.3);
      max-width: 420px; width: 90%; padding: 20px;
      text-align: center; transform: scale(0.95); opacity: 0;
      position: relative;
    }
    .modal-close {
      position: absolute; top: 10px; right: 12px;
      font-size: 18px; font-weight: bold;
      background: transparent; border: none; cursor: pointer;
      color: #777; transition: color 0.2s ease;
    }
    .modal-close:hover { color: #000; }
    .modal-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
    .modal-preview {
      font-size: 14px; margin-bottom: 18px; color: #444;
      border: 1px solid #eee; border-radius: 8px; padding: 10px;
      background: #fafafa; max-height: 90px; overflow-y: auto;
      text-align: left; white-space: pre-wrap;
    }
    .modal-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
    .modal-btn {
      padding: 10px 20px; border: none; border-radius: 8px;
      cursor: pointer; font-size: 14px; font-weight: bold; color: #fff;
      transition: background 0.2s ease;
    }
    .btn-chat { background: #1e88e5; } .btn-chat:hover { background: #1565c0; }
    .btn-llamada { background: #43a047; } .btn-llamada:hover { background: #2e7d32; }
    .btn-portapapeles { background: #00838f; } .btn-portapapeles:hover { background: #006064; }
    .btn-vacio { background: #6d6d6d; } .btn-vacio:hover { background: #4e4e4e; }
    .fade-in { animation: fadeInScale 0.3s ease forwards; }
    .fade-out { animation: fadeOutScale 0.3s ease forwards; }
    @keyframes fadeInScale { from {opacity:0; transform:scale(0.95);} to {opacity:1; transform:scale(1);} }
    @keyframes fadeOutScale { from {opacity:1; transform:scale(1);} to {opacity:0; transform:scale(0.95);} }
  `;
  document.head.appendChild(style);

  // 🧹 Limpieza de scope
  function limpiarScope() {
    delete window.datosExtraidos;
    delete window.bloqueElemento;
    delete window.datosPanel;
    delete window.bloqueHTMLCapturado;
  }

  // ✨ Cerrar con animación
  window.cerrarConAnimacion = function(id, callback, cancelar = true) {
    const modalEl = document.getElementById(id);
    if (!modalEl) return;
    const inner = modalEl.querySelector(".modal-card");

    if (!inner) {
      modalEl.remove();
      if (cancelar) {
        window.estadoEjecucion = "cancelado";
        limpiarScope();
        console.log(nombreScript + " ❌ Cancelado por el usuario");
      }
      if (callback) callback();
      return;
    }

    inner.classList.remove("fade-in");
    inner.classList.add("fade-out");
    modalEl.classList.remove("fade-in-bg");
    modalEl.classList.add("fade-out-bg");

    setTimeout(() => {
      modalEl.remove();
      if (cancelar) {
        window.estadoEjecucion = "cancelado";
        limpiarScope();
        console.log(nombreScript + " ❌ Cancelado por el usuario");
      }
      if (callback) callback();
    }, 300);
  };

  // 🪄 Modal Canal
  const modalCanal = document.createElement('div');
  modalCanal.innerHTML = `
    <div id="canal-modal" class="modal-bg fade-in-bg">
      <div class="modal-card fade-in">
        <button class="modal-close" onclick="cerrarConAnimacion('canal-modal')">✖</button>
        <div class="modal-title">📞 Seleccione el Canal</div>
        <div class="modal-actions">
          <button id="canal-chat" class="modal-btn btn-chat">💬 Chat</button>
          <button id="canal-llamada" class="modal-btn btn-llamada">📞 Llamada</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalCanal);

  document.getElementById('canal-chat').onclick = () => seleccionarCanal("Chat");
  document.getElementById('canal-llamada').onclick = () => seleccionarCanal("Llamada");

  function seleccionarCanal(canal) {
    // 👇 al cambiar de modal, cancelar = false
    cerrarConAnimacion('canal-modal', () => {
      const modalSolicitud = document.createElement('div');
      modalSolicitud.innerHTML = `
        <div id="solicitud-modal" class="modal-bg fade-in-bg">
          <div class="modal-card fade-in">
            <button class="modal-close" onclick="cerrarConAnimacion('solicitud-modal')">✖</button>
            <div class="modal-title">📝 Solicitud</div>
            <div id="preview" class="modal-preview">Cargando portapapeles...</div>
            <div class="modal-actions">
              <button id="solicitud-portapapeles" class="modal-btn btn-portapapeles">📋 Usar portapapeles</button>
              <button id="solicitud-vacio" class="modal-btn btn-vacio">⬜ Dejar en blanco</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modalSolicitud);

      navigator.clipboard.readText().then(texto => {
        document.getElementById('preview').innerText = texto || "(Portapapeles vacío)";
      }).catch(() => {
        document.getElementById('preview').innerText = "(No se pudo acceder al portapapeles)";
      });

      document.getElementById('solicitud-portapapeles').onclick = () =>
        finalizar(canal, document.getElementById('preview').innerText);

      document.getElementById('solicitud-vacio').onclick = () =>
        finalizar(canal, "");
    }, false);
  }

  function finalizar(canal, solicitud) {
    // 👇 cierre final del flujo, cancelar = false (NO limpiar scope)
    cerrarConAnimacion('solicitud-modal', () => {
      window.CanalSeleccionado = canal;
      window.SolicitudIngresada = solicitud;
      console.log(nombreScript + ' ✅ Canal y Solicitud disponibles:', canal, solicitud);
    }, false);
  }

})();
