(function () {
  'use strict';

  // ℹ️ INFORMACIÓN DEL SCRIPT
  const nombreScript = '[Mercado 🛒]';
  const tipoScript = 'Escalamiento';

  // 🚫 Evitar cache
  const timestamp = '?nocache=' + Date.now();

  // 🔁 Función para cargar scripts remotos
  function cargarYEjecutarScript(url, callback) {
    console.log(`${nombreScript} 🔄 Cargando script desde: ${url}`);
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`Estado: ${response.status}`);
        return response.text();
      })
      .then(code => {
        try {
          new Function(code)();
          console.log(`${nombreScript} ✅ Script ejecutado: ${url}`);
          if (typeof callback === 'function') callback();
        } catch (e) {
          console.error(`${nombreScript} ❌ Error al ejecutar script (${url}):`, e);
        }
      })
      .catch(error => {
        console.error(`${nombreScript} ❌ Error al cargar el script (${url}):`, error);
      });
  }

  // 🌐 Función global para cerrar modales con animación
  window.cerrarConAnimacion = function(id, callback) {
    const modalEl = document.getElementById(id);
    if (!modalEl) return;
    const inner = modalEl.querySelector(".modal-card");
    if (!inner) { modalEl.remove(); if (callback) callback(); return; }
    inner.classList.remove("fade-in");
    inner.classList.add("fade-out");
    setTimeout(() => { modalEl.remove(); if (callback) callback(); }, 300);
  };

  // 🔃 Ejecutar en cadena los módulos de Mercado
  cargarYEjecutarScript(`https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/BackOffice/Resources/IdentificadorHTML.js${timestamp}`, function () {
    cargarYEjecutarScript(`https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/BackOffice/Resources/OrdenExtractor.js${timestamp}`, function () {

      setTimeout(() => {
        const datos = window.datosExtraidos;
        if (!datos) {
          alert(nombreScript + '\n\n❌ Error: "datosExtraidos" no está definido.');
          return;
        }

        const { orden, cuenta } = datos;

        // 🎨 Estilos globales modal
        const style = document.createElement("style");
        style.innerHTML = `
          /* Animaciones */
          .fade-in { animation: fadeInScale 0.3s ease forwards; }
          .fade-out { animation: fadeOutScale 0.3s ease forwards; }
          @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);} }
          @keyframes fadeOutScale { from { opacity: 1; transform: scale(1);} to { opacity: 0; transform: scale(0.95);} }

          /* Fondo modal */
          .modal-bg {
            position: fixed; inset: 0;
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999;
            padding: 18px;
          }

          /* Card principal */
          .modal-card {
            background: white;
            padding: 18px 20px;
            border-radius: 12px;
            text-align: center;
            font-family: "Helvetica Neue", Arial, sans-serif;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            max-width: 420px;
            width: 95%;
            box-sizing: border-box;
            color: #333;
            position: relative;
          }

          /* Botón de cerrar */
          .modal-close {
            position: absolute; top: 8px; right: 10px;
            font-size: 16px; font-weight: 700;
            background: transparent; border: none; cursor: pointer;
            color: #666;
          }
          .modal-close:hover { color: #000; }

          /* Título con icono */
          .modal-title {
            display: inline-flex; align-items: center; gap: 8px;
            margin: 6px 0 14px 0;
            font-size: 14px; font-weight: 500; line-height: 1;
            color: #333;
          }
          .modal-title .title-icon { font-size: 18px; transform: translateY(1px); }

          /* Preview */
          .modal-preview {
            border: 1px solid #eee;
            padding: 10px;
            margin-bottom: 12px;
            font-size: 12px;
            max-height: 90px;
            overflow-y: auto;
            text-align: left;
            white-space: pre-wrap;
            color: #444;
            background: #fafafa;
            border-radius: 8px;
          }

          /* Botones */
          .modal-actions {
            display: flex; gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 6px;
          }
          .modal-btn {
            font-size: 13px; font-weight: 600;
            padding: 7px 16px;
            border: none; border-radius: 8px;
            cursor: pointer;
            display: inline-flex; align-items: center; justify-content: center;
            gap: 8px; line-height: 1; color: #fff; min-height: 36px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.06);
          }
          .modal-btn span:last-child { font-weight: 700; }

          /* Variantes de color */
          .btn-chat { background: #007bff; }
          .btn-llamada { background: #28a745; }
          .btn-portapapeles { background: #17a2b8; }
          .btn-vacio { background: #6c757d; }
        `;
        document.head.appendChild(style);

        // 🪄 Modal paso 1: seleccionar canal
        const modal1 = document.createElement("div");
        modal1.innerHTML = `
          <div id="canal-modal" class="modal-bg">
            <div class="modal-card fade-in">
              <button class="modal-close" onclick="cerrarConAnimacion('canal-modal')">✖</button>
              <div class="modal-title">
                <span class="title-icon">📞</span>
                <span>Seleccione el Canal</span>
              </div>
              <div class="modal-actions">
                <button id="canal-chat" class="modal-btn btn-chat"><span>💬</span><span>Chat</span></button>
                <button id="canal-llamada" class="modal-btn btn-llamada"><span>📞</span><span>Llamada</span></button>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(modal1);

        document.getElementById("canal-chat").onclick = () => seleccionarCanal("Chat");
        document.getElementById("canal-llamada").onclick = () => seleccionarCanal("Llamada");

        // 🪄 Función seleccionar canal → abrir modal solicitud
        function seleccionarCanal(canal) {
          cerrarConAnimacion("canal-modal", () => {
            const modal2 = document.createElement("div");
            modal2.innerHTML = `
              <div id="solicitud-modal" class="modal-bg">
                <div class="modal-card fade-in">
                  <button class="modal-close" onclick="cerrarConAnimacion('solicitud-modal')">✖</button>
                  <div class="modal-title">
                    <span class="title-icon">📝</span>
                    <span>Solicitud</span>
                  </div>
                  <div id="preview" class="modal-preview">Cargando portapapeles...</div>
                  <div class="modal-actions">
                    <button id="solicitud-portapapeles" class="modal-btn btn-portapapeles"><span>📋</span><span>Usar portapapeles</span></button>
                    <button id="solicitud-vacio" class="modal-btn btn-vacio"><span>⬜</span><span>Dejar en blanco</span></button>
                  </div>
                </div>
              </div>
            `;
            document.body.appendChild(modal2);

            navigator.clipboard.readText().then(texto => {
              document.getElementById("preview").innerText = texto || "(Portapapeles vacío)";
            }).catch(() => {
              document.getElementById("preview").innerText = "(No se pudo acceder al portapapeles)";
            });

            document.getElementById("solicitud-portapapeles").onclick = () => seleccionarSolicitud(canal, document.getElementById("preview").innerText);
            document.getElementById("solicitud-vacio").onclick = () => seleccionarSolicitud(canal, "");
          });
        }

        // 🪄 Función final: copiar datos y alert
        function seleccionarSolicitud(canal, solicitud) {
          cerrarConAnimacion("solicitud-modal", () => {
            const resultadoFinal = `
ID cliente: ${cuenta}
Nro de orden: ${orden}
Canal: ${canal}
Solicitud: ${solicitud || "(vacío)"}
`.trim();

            const resultadoAlertFinal = `
🛒 Orden de Mercado
=========================
🆔 Nro de orden: ${orden}
👤 ID cliente: ${cuenta}
🎧 Canal: ${canal}
📝 Solicitud: ${solicitud || "(vacío)"}
`.trim();

            navigator.clipboard.writeText(resultadoFinal).then(() => {
              console.log(nombreScript + " ✅ Copiado al portapapeles:", resultadoFinal);
              alert(nombreScript + "\n\n📋 ¡Todos los datos fueron copiados al portapapeles! 📋\n✅ " + tipoScript + " generado con éxito ✅\n\n" + resultadoAlertFinal);

              delete window.datosExtraidos;
              delete window.bloqueHTMLCapturado;
            }).catch(err => {
              console.error(nombreScript + " ❌ Error al copiar al portapapeles:", err);
            });
          });
        }

      }, 600); // ⏱️ Espera para asegurar ejecución de módulos
    });
  });

})();
