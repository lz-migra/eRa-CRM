(function () {
  'use strict';

  // 🎯 Identidad del script
  const nombreScript = '[MLC💳]';
  const tipoScript   = 'Escalamiento';

  // 🕒 Evitar cache
  const timestamp = '?nocache=' + Date.now();

  // 🔁 Cargar y ejecutar scripts remotos
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

  // 🎨 Estilos (animaciones, blur, tipografía y botones)
  const style = document.createElement("style");
  style.innerHTML = `
    /* Animaciones */
    .fade-in { animation: fadeInScale 0.3s ease forwards; }
    .fade-out { animation: fadeOutScale 0.3s ease forwards; }
    @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);} }
    @keyframes fadeOutScale { from { opacity: 1; transform: scale(1);} to { opacity: 0; transform: scale(0.95);} }

    /* Fondo modal con blur */
    .modal-bg {
      position: fixed;
      inset: 0;
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
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
      position: relative; /* para la X */
    }

    /* Botón de cerrar */
    .modal-close {
      position: absolute;
      top: 8px;
      right: 10px;
      font-size: 16px;
      font-weight: 700;
      background: transparent;
      border: none;
      cursor: pointer;
      color: #666;
    }
    .modal-close:hover { color: #000; }

    /* Título */
    .modal-card .modal-title {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin: 6px 0 14px 0;
      font-size: 14px;
      font-weight: 500;
      line-height: 1;
      color: #333;
    }
    .modal-card .modal-title .title-icon { font-size: 18px; transform: translateY(1px); }

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
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 6px;
    }

    .modal-btn {
      font-size: 13px;
      font-weight: 600;
      padding: 7px 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      line-height: 1;
      color: #fff;
      min-height: 36px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.06);
    }

    /* Texto de botones en negrita */
    .modal-btn span:last-child { font-weight: 700; }

    /* Variantes de color */
    .btn-chat { background: #007bff; }
    .btn-llamada { background: #28a745; }
    .btn-portapapeles { background: #17a2b8; }
    .btn-vacio { background: #6c757d; }

    /* Adaptación responsiva */
    @media (max-width: 420px) {
      .modal-card { padding: 14px; }
      .modal-btn { padding: 6px 12px; font-size: 13px; min-height: 34px; }
      .modal-preview { font-size: 12px; }
    }
  `;
  document.head.appendChild(style);

  // 🔌 Cargar módulos externos
  cargarYEjecutarScript(`https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/CRM2/Resources/IdentificadorHTML.js${timestamp}`, function () {
    cargarYEjecutarScript(`https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/CRM2/Resources/OrdenExtractor.js${timestamp}`, function () {

      setTimeout(() => {
        if (!window.datosExtraidos) {
          alert(nombreScript + '\n\n❌ Error: "datosExtraidos" no está definido.\nNo se generó ningún ' + tipoScript);
          return;
        }

        const { generales, topup, beneficiario } = window.datosExtraidos;
        const ordenID   = generales.ordenID;
        const clienteID = generales.clienteID;
        const status    = topup.status;
        const idTopup   = topup.id;
        const proveedor = topup.proveedor;
        const provincia  = beneficiario.provincia;
        const nroReparto = beneficiario.nroReparto;

        // 🪄 Modal paso 1 (elegir canal)
        const modal1 = document.createElement('div');
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

        document.getElementById('canal-chat').onclick = () => seleccionarCanal("Chat");
        document.getElementById('canal-llamada').onclick = () => seleccionarCanal("Llamada");

        // ✨ Cerrar con animación
        window.cerrarConAnimacion = function(id, callback) {
          const modalEl = document.getElementById(id);
          if (!modalEl) return;
          const inner = modalEl.querySelector(".modal-card");
          if (!inner) { modalEl.remove(); if (callback) callback(); return; }
          inner.classList.remove("fade-in");
          inner.classList.add("fade-out");
          setTimeout(() => { modalEl.remove(); if (callback) callback(); }, 300);
        };

        function seleccionarCanal(canal) {
          cerrarConAnimacion('canal-modal', () => {
            const modal2 = document.createElement('div');
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
              document.getElementById('preview').innerText = texto || "(Portapapeles vacío)";
            }).catch(() => {
              document.getElementById('preview').innerText = "(No se pudo acceder al portapapeles)";
            });

            document.getElementById('solicitud-portapapeles').onclick = () => seleccionarSolicitud(canal, document.getElementById('preview').innerText);
            document.getElementById('solicitud-vacio').onclick = () => seleccionarSolicitud(canal, "");
          });
        }

        function seleccionarSolicitud(canal, solicitud) {
          cerrarConAnimacion('solicitud-modal', () => {
            const resultado = `
ID del cliente: ${clienteID}
Tipo de remesa: MLC
Provincia: ${provincia}
Número de reparto: ${nroReparto}
Order code: ${ordenID}
ID o FOI: ${idTopup}
Status: ${status}
Proveedor: ${proveedor}
Canal: ${canal}
Solicitud: ${solicitud}
`.trim();

            const resultadoalert = `
💳 Orden de Remesa MLC
=========================
👤 ID del cliente: ${clienteID}
💸 Tipo de remesa: MLC
📍 Provincia: ${provincia}
#️⃣ Número de reparto: ${nroReparto}
🔢 Order code: ${ordenID}
🆔 ID o FOI: ${idTopup}
✅ Status: ${status}
🧑‍🔧 Proveedor: ${proveedor}
🎧 Canal: ${canal}
📝 Solicitud: ${solicitud || "(vacío)"}
`.trim();

            navigator.clipboard.writeText(resultado).then(() => {
              console.log(nombreScript + ' ✅ Información copiada al portapapeles:', resultado);
              alert(nombreScript + '\n\n' +
                    '📋 ¡Todos los datos fueron copiados al portapapeles! 📋\n' +
                    '✅ ' + tipoScript + ' generado con éxito ✅\n\n' +
                    resultadoalert
              );
              delete window.datosExtraidos;
              delete window.bloqueElemento;
              delete window.datosPanel;
              delete window.bloqueHTMLCapturado;
            }).catch(err => {
              console.error(nombreScript + '❌ ¡Error al copiar al portapapeles!', err);
            });
          });
        }

      }, 600);
    });
  });

})();
