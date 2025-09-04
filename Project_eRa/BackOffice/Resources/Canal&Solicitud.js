(function () {
  'use strict';

  const nombreScript = '[Modal Canal & Solicitud]';

  // 🎨 Estilos (sin cambios)
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
    /* ...otros estilos... */
    @keyframes fadeOutScale { from {opacity:1; transform:scale(1);} to {opacity:0; transform:scale(0.95);} }
  `;
  document.head.appendChild(style);

  // 🧹 Limpieza de scope (sin cambios)
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
        window.estadoEjecucion = "cancelado"; // 👇 CORRECCIÓN 1/2
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
        window.estadoEjecucion = "cancelado"; // 👇 CORRECCIÓN 2/2
        limpiarScope();
        console.log(nombreScript + " ❌ Cancelado por el usuario");
      }
      if (callback) callback();
    }, 300);
  };

  // El resto del script del modal sigue igual...
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
    cerrarConAnimacion('solicitud-modal', () => {
      window.CanalSeleccionado = canal;
      window.SolicitudIngresada = solicitud;
      console.log(nombreScript + ' ✅ Canal y Solicitud disponibles:', canal, solicitud);
    }, false);
  }

})();
