(function () {
  'use strict';

  // 🎯 Identidad del script
  const nombreScript = '[Modal Canal & Solicitud]';

  // 🎨 Estilos del modal
  const style = document.createElement("style");
  style.innerHTML = `
    .fade-in { animation: fadeInScale 0.3s ease forwards; }
    .fade-out { animation: fadeOutScale 0.3s ease forwards; }
    @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);} }
    @keyframes fadeOutScale { from { opacity: 1; transform: scale(1);} to { opacity: 0; transform: scale(0.95);} }

    .modal-bg {
      position: fixed; inset: 0; background: rgba(255,255,255,0.2);
      backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999; padding: 18px;
    }
    .modal-card {
      background: white; padding: 18px 20px; border-radius: 12px;
      text-align: center; font-family: "Helvetica Neue", Arial, sans-serif;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12); max-width: 420px; width: 95%;
      box-sizing: border-box; color: #333; position: relative;
    }
    .modal-close { position: absolute; top: 8px; right: 10px; font-size: 16px; font-weight: 700; background: transparent; border: none; cursor: pointer; color: #666; }
    .modal-close:hover { color: #000; }
    .modal-title { display: inline-flex; align-items: center; gap: 8px; margin: 6px 0 14px 0; font-size: 14px; font-weight: 500; line-height: 1; color: #333; }
    .modal-title .title-icon { font-size: 18px; transform: translateY(1px); }
    .modal-preview { border: 1px solid #eee; padding: 10px; margin-bottom: 12px; font-size: 12px; max-height: 90px; overflow-y: auto; text-align: left; white-space: pre-wrap; color: #444; background: #fafafa; border-radius: 8px; }
    .modal-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 6px; }
    .modal-btn { font-size: 13px; font-weight: 600; padding: 7px 16px; border: none; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; line-height: 1; color: #fff; min-height: 36px; box-shadow: 0 4px 8px rgba(0,0,0,0.06); }
    .modal-btn span:last-child { font-weight: 700; }
    .btn-chat { background: #007bff; } .btn-llamada { background: #28a745; } .btn-portapapeles { background: #17a2b8; } .btn-vacio { background: #6c757d; }
    @media (max-width: 420px) { .modal-card { padding: 14px; } .modal-btn { padding: 6px 12px; font-size: 13px; min-height: 34px; } .modal-preview { font-size: 12px; } }
  `;
  document.head.appendChild(style);

  // 🧹 Función para limpiar variables globales
  function limpiarScope() {
    delete window.datosExtraidos;
    delete window.bloqueElemento;
    delete window.datosPanel;
    delete window.bloqueHTMLCapturado;
    console.log(nombreScript + ' Cancelado 🗑 Scope limpiado');
  }

  // ✨ Función para cerrar modales con animación y limpiar scope
  window.cerrarConAnimacion = function(id, callback) {
    const modalEl = document.getElementById(id);
    if (!modalEl) return;

    const inner = modalEl.querySelector(".modal-card");
    if (!inner) {
      modalEl.remove();
      limpiarScope();
      if (callback) callback();
      return;
    }

    inner.classList.remove("fade-in");
    inner.classList.add("fade-out");

    setTimeout(() => {
      modalEl.remove();
      limpiarScope();
      if (callback) callback();
    }, 300);
  };

  // 🪄 Modal Canal
  const modalCanal = document.createElement('div');
  modalCanal.innerHTML = `
    <div id="canal-modal" class="modal-bg">
      <div class="modal-card fade-in">
        <button class="modal-close" onclick="cerrarConAnimacion('canal-modal')">✖</button>
        <div class="modal-title"><span class="title-icon">📞</span><span>Seleccione el Canal</span></div>
        <div class="modal-actions">
          <button id="canal-chat" class="modal-btn btn-chat"><span>💬</span><span>Chat</span></button>
          <button id="canal-llamada" class="modal-btn btn-llamada"><span>📞</span><span>Llamada</span></button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalCanal);

  document.getElementById('canal-chat').onclick = () => seleccionarCanal("Chat");
  document.getElementById('canal-llamada').onclick = () => seleccionarCanal("Llamada");

  function seleccionarCanal(canal) {
    cerrarConAnimacion('canal-modal', () => {
      // 🪄 Modal Solicitud
      const modalSolicitud = document.createElement('div');
      modalSolicitud.innerHTML = `
        <div id="solicitud-modal" class="modal-bg">
          <div class="modal-card fade-in">
            <button class="modal-close" onclick="cerrarConAnimacion('solicitud-modal')">✖</button>
            <div class="modal-title"><span class="title-icon">📝</span><span>Solicitud</span></div>
            <div id="preview" class="modal-preview">Cargando portapapeles...</div>
            <div class="modal-actions">
              <button id="solicitud-portapapeles" class="modal-btn btn-portapapeles"><span>📋</span><span>Usar portapapeles</span></button>
              <button id="solicitud-vacio" class="modal-btn btn-vacio"><span>⬜</span><span>Dejar en blanco</span></button>
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

      document.getElementById('solicitud-portapapeles').onclick = () => finalizar(canal, document.getElementById('preview').innerText);
      document.getElementById('solicitud-vacio').onclick = () => finalizar(canal, "");
    });
  }

  function finalizar(canal, solicitud) {
    cerrarConAnimacion('solicitud-modal', () => {
      // Devuelve valores en window para otros scripts
      window.CanalSeleccionado = canal;
      window.SolicitudIngresada = solicitud;
      console.log(nombreScript + ' ✅ Canal y Solicitud disponibles:', canal, solicitud);
    });
  }

})();
