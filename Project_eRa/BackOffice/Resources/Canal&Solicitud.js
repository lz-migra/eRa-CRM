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
    /* ... resto de estilos igual ... */
  `;
  document.head.appendChild(style);

  // 🛑 Función para cancelar ejecución
  function ejecucionCancelada() {
    delete window.CanalSeleccionado;
    delete window.SolicitudIngresada;
    delete window.datosExtraidos;
    delete window.bloqueElemento;
    delete window.datosPanel;
    delete window.bloqueHTMLCapturado;

    window.EstadoEjecucion = "Cancelado"; // 🚩 bandera cancelada
    console.log(nombreScript + ' ❌ Ejecución cancelada 🗑 Scope limpiado / EstadoEjecucion = Cancelado');
  }

  // ✨ Función para cerrar modales con animación
  //    cancelar = true -> marca cancelación y limpia scope
  //    cancelar = false -> flujo normal
  window.cerrarConAnimacion = function(id, callback, cancelar = false) {
    const modalEl = document.getElementById(id);
    if (!modalEl) return;

    const inner = modalEl.querySelector(".modal-card");
    const finalizarCierre = () => {
      modalEl.remove();
      if (cancelar) ejecucionCancelada();
      if (callback) callback();
    };

    if (!inner) {
      finalizarCierre();
      return;
    }

    inner.classList.remove("fade-in");
    inner.classList.add("fade-out");

    setTimeout(finalizarCierre, 300);
  };

  // 🪄 Modal Canal
  const modalCanal = document.createElement('div');
  modalCanal.innerHTML = `
    <div id="canal-modal" class="modal-bg">
      <div class="modal-card fade-in">
        <!-- ❌ aquí sí marca cancelación -->
        <button class="modal-close" onclick="cerrarConAnimacion('canal-modal', null, true)">✖</button>
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
            <!-- ❌ aquí también solo cancelación -->
            <button class="modal-close" onclick="cerrarConAnimacion('solicitud-modal', null, true)">✖</button>
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
      window.EstadoEjecucion = "Activo"; // 🚩 bandera activa
      console.log(nombreScript + ' ✅ Canal y Solicitud disponibles:', canal, solicitud, '| Estado:', window.EstadoEjecucion);
    }, false); // 🚫 no cancelar en flujo normal
  }

})();
