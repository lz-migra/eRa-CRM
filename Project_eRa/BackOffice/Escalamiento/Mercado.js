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

  // 🔃 Ejecutar en cadena los módulos de Mercado
  cargarYEjecutarScript(`https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/BackOffice/Resources/IdentificadorHTML.js${timestamp}`, function () {
    cargarYEjecutarScript(`https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/BackOffice/Resources/OrdenExtractor.js${timestamp}`, function () {

      // ⏳ Esperar que se generen los datos
      setTimeout(() => {
        const datos = window.datosExtraidos;

        if (!datos) {
          alert(nombreScript + '\n\n❌ Error: "datosExtraidos" no está definido.');
          return;
        }

        // 🧷 Extraer campos necesarios
        const { orden, cuenta } = datos;

        // 🎨 Estilos animaciones + blur
        const style = document.createElement("style");
        style.innerHTML = `
          .fade-in { animation: fadeInScale 0.3s ease forwards; }
          .fade-out { animation: fadeOutScale 0.3s ease forwards; }
          @keyframes fadeInScale { from { opacity: 0; transform: scale(0.8);} to { opacity: 1; transform: scale(1);} }
          @keyframes fadeOutScale { from { opacity: 1; transform: scale(1);} to { opacity: 0; transform: scale(0.8);} }
          .modal-bg {
            position: fixed; inset: 0;
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999;
          }
          .modal-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            font-family: sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            max-width: 360px; width: 90%;
          }
          .modal-btn {
            padding: 10px 20px;
            border: none; border-radius: 8px;
            cursor: pointer; margin: 5px;
            color: white; font-weight: bold;
          }
        `;
        document.head.appendChild(style);

        // 📍 Modal paso 1: canal
        const modal1 = document.createElement("div");
        modal1.innerHTML = `
          <div id="canal-modal" class="modal-bg">
            <div class="modal-card fade-in">
              <h3 style="margin-bottom: 15px;">📞 Seleccione el Canal</h3>
              <button id="canal-chat" class="modal-btn" style="background:#007bff;">💬 Chat</button>
              <button id="canal-llamada" class="modal-btn" style="background:#28a745;">📞 Llamada</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal1);

        function cerrarConAnimacion(id, callback) {
          const modalEl = document.getElementById(id);
          if (!modalEl) return;
          const inner = modalEl.querySelector(".modal-card");
          inner.classList.remove("fade-in");
          inner.classList.add("fade-out");
          setTimeout(() => {
            modalEl.remove();
            if (callback) callback();
          }, 300);
        }

        document.getElementById("canal-chat").onclick = () => seleccionarCanal("Chat");
        document.getElementById("canal-llamada").onclick = () => seleccionarCanal("Llamada");

        function seleccionarCanal(canal) {
          cerrarConAnimacion("canal-modal", () => {
            // 📍 Modal paso 2: solicitud
            const modal2 = document.createElement("div");
            modal2.innerHTML = `
              <div id="solicitud-modal" class="modal-bg">
                <div class="modal-card fade-in">
                  <h3 style="margin-bottom: 15px;">📝 Campo Solicitud</h3>
                  <div id="preview" style="
                    border: 1px solid #ddd;
                    padding: 10px;
                    margin-bottom: 10px;
                    font-size: 12px;
                    max-height: 80px;
                    overflow-y: auto;
                    text-align: left;
                    white-space: pre-wrap;
                  ">Cargando portapapeles...</div>
                  <button id="solicitud-portapapeles" class="modal-btn" style="background:#17a2b8;">📋 Usar portapapeles</button>
                  <button id="solicitud-vacio" class="modal-btn" style="background:#6c757d;">⬜ Dejar en blanco</button>
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

        function seleccionarSolicitud(canal, solicitud) {
          cerrarConAnimacion("solicitud-modal", () => {
            // 📋 Plantilla resultado final (para copiar)
            const resultadoFinal = `
ID cliente: ${cuenta}
Nro de orden: ${orden}
Canal: ${canal}
Solicitud: ${solicitud || "(vacío)"}
`.trim();

            // 📋 Plantilla resultado alert
            const resultadoAlertFinal = `
🛒 Orden de Mercado
=========================

🆔 Nro de orden: ${orden}
👤 ID cliente: ${cuenta}
🎧 Canal: ${canal}
📝 Solicitud: ${solicitud || "(vacío)"}
`.trim();

            navigator.clipboard.writeText(resultadoFinal).then(() => {
              console.log(nombreScript + " ✅ Información copiada al portapapeles:", resultadoFinal);
              alert(
                nombreScript + "\n\n" +
                "📋 ¡Todos los datos fueron copiados al portapapeles! 📋\n" +
                "✅ " + tipoScript + " generado con éxito ✅\n\n" +
                resultadoAlertFinal
              );

              // 🧹 Limpiar variables globales
              delete window.datosExtraidos;
              delete window.bloqueHTMLCapturado;
            }).catch((err) => {
              console.error(nombreScript + " ❌ Error al copiar al portapapeles:", err);
            });
          });
        }

      }, 600); // ⏱️ Espera para asegurar ejecución de módulos
    });
  });

})();
