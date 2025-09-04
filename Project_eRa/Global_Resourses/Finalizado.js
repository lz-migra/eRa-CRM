(function () {
  'use strict';

  const nombreScript = '[Modal Estado Finalización]';

  // 📝 Mensaje de finalización (respetando saltos de línea)
  const mensajeFinalizado = window.estadoFinalizacion || '¡Proceso finalizado con éxito!';

  // 🎨 Estilos para el modal con blur animado
  const style = document.createElement("style");
  style.innerHTML = `
    .modal-bg {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex; justify-content: center; align-items: center;
      z-index: 9999;
      background: rgba(0,0,0,0);
      backdrop-filter: blur(0px);
      transition: background 0.3s ease, backdrop-filter 0.3s ease;
    }
    .modal-bg.fade-in-bg {
      background: rgba(0,0,0,0.45);
      backdrop-filter: blur(6px);
    }
    .modal-bg.fade-out-bg {
      background: rgba(0,0,0,0);
      backdrop-filter: blur(0px);
    }
    .modal-card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.3);
      max-width: 420px;
      width: 90%;
      padding: 20px;
      text-align: center;
      transform: scale(0.95);
      opacity: 0;
    }
    .modal-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .modal-message {
      font-size: 16px;
      margin-bottom: 20px;
      white-space: pre-line; /* 🔹 Respeta saltos de línea y espacios */
    }
    .modal-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 15px;
      font-weight: bold;
    }
    .btn-cerrar {
      background: #43a047; /* Verde */
      color: #fff;
      transition: background 0.2s ease;
    }
    .btn-cerrar:hover {
      background: #2e7d32;
    }
    .fade-in { animation: fadeInScale 0.3s ease forwards; }
    .fade-out { animation: fadeOutScale 0.3s ease forwards; }
    @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);} }
    @keyframes fadeOutScale { from { opacity: 1; transform: scale(1);} to { opacity: 0; transform: scale(0.95);} }
  `;
  document.head.appendChild(style);

  // 🧹 Limpieza: elimina solo la bandera
  function limpiarEstado() {
    delete window.estadoFinalizacion;
    console.log(nombreScript + ' 🗑 Se eliminó EstadoFinalizacion');
  }

  // ✨ Cerrar modal con animación
  window.cerrarModalEstado = function(id) {
    const modalEl = document.getElementById(id);
    if (!modalEl) return;

    const inner = modalEl.querySelector(".modal-card");
    modalEl.classList.remove("fade-in-bg");
    modalEl.classList.add("fade-out-bg");

    if (inner) {
      inner.classList.remove("fade-in");
      inner.classList.add("fade-out");
    }

    setTimeout(() => {
      modalEl.remove();
      limpiarEstado();
    }, 300);
  };

  // 🪄 Crear modal y mostrarlo de inmediato
  (function mostrarAlInstante() {
    const modalEl = document.createElement('div');
    modalEl.id = "estado-modal";
    modalEl.className = "modal-bg";
    modalEl.innerHTML = `
      <div class="modal-card fade-in">
        <div class="modal-title">✅ ¡Éxito!</div>
        <div class="modal-message">${mensajeFinalizado}</div>
        <div class="modal-actions">
          <button class="modal-btn btn-cerrar" onclick="cerrarModalEstado('estado-modal')">Cerrar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalEl);

    // 🚀 Forzar animación de blur
    requestAnimationFrame(() => {
      modalEl.classList.add("fade-in-bg");
    });

    console.log(nombreScript + ' 📌 Modal de finalización mostrado automáticamente');
  })();

})();
