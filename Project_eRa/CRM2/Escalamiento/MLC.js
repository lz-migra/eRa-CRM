(function () {
  'use strict';

  const nombreScript = '[MLC💳]';
  const tipoScript   = 'Escalamiento';
  
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

  const timestamp = '?nocache=' + Date.now();

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

        // 🎨 Estilos animaciones
        const style = document.createElement("style");
        style.innerHTML = `
          .fade-in {
            animation: fadeInScale 0.3s ease forwards;
          }
          .fade-out {
            animation: fadeOutScale 0.3s ease forwards;
          }
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes fadeOutScale {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.8); }
          }
        `;
        document.head.appendChild(style);

        // 🎨 Modal paso 1: elegir canal
        const modal = document.createElement('div');
        modal.innerHTML = `
          <div id="canal-modal" style="
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.5);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999;
          ">
            <div class="fade-in" style="
              background: white;
              padding: 20px;
              border-radius: 12px;
              text-align: center;
              font-family: sans-serif;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              max-width: 320px; width: 90%;
            ">
              <h3 style="margin-bottom: 15px;">📞 Seleccione el Canal</h3>
              <button id="canal-chat" style="
                background: #007bff; color: white;
                padding: 10px 20px;
                border: none; border-radius: 8px;
                cursor: pointer; margin: 5px;
              ">💬 Chat</button>
              <button id="canal-llamada" style="
                background: #28a745; color: white;
                padding: 10px 20px;
                border: none; border-radius: 8px;
                cursor: pointer; margin: 5px;
              ">📞 Llamada</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('canal-chat').onclick = () => seleccionarCanal("Chat");
        document.getElementById('canal-llamada').onclick = () => seleccionarCanal("Llamada");

        function cerrarConAnimacion(id, callback) {
          const modalEl = document.getElementById(id);
          if (!modalEl) return;
          const inner = modalEl.querySelector("div");
          inner.classList.remove("fade-in");
          inner.classList.add("fade-out");
          setTimeout(() => {
            modalEl.remove();
            if (callback) callback();
          }, 300); // coincide con duración animación
        }

        function seleccionarCanal(canal) {
          cerrarConAnimacion('canal-modal', () => {

            // 🎨 Modal paso 2: elegir solicitud
            const modal2 = document.createElement('div');
            modal2.innerHTML = `
              <div id="solicitud-modal" style="
                position: fixed; inset: 0;
                background: rgba(0,0,0,0.5);
                display: flex; align-items: center; justify-content: center;
                z-index: 9999;
              ">
                <div class="fade-in" style="
                  background: white;
                  padding: 20px;
                  border-radius: 12px;
                  text-align: center;
                  font-family: sans-serif;
                  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                  max-width: 360px; width: 90%;
                ">
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
                  <button id="solicitud-portapapeles" style="
                    background: #17a2b8; color: white;
                    padding: 8px 15px;
                    border: none; border-radius: 8px;
                    cursor: pointer; margin: 5px;
                  ">📋 Usar portapapeles</button>
                  <button id="solicitud-vacio" style="
                    background: #6c757d; color: white;
                    padding: 8px 15px;
                    border: none; border-radius: 8px;
                    cursor: pointer; margin: 5px;
                  ">⬜ Dejar en blanco</button>
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
              alert(
                nombreScript + '\n\n' +
                '📋 ¡Todos los datos fueron copiados al portapapeles! 📋\n' +
                '✅ ' + tipoScript + ' generado con éxito ✅\n\n' +
                resultadoalert
              );

              delete window.datosExtraidos;
              delete window.bloqueElemento;
              delete window.datosPanel;
              delete window.bloqueHTMLCapturado;
            }).catch((err) => {
              console.error(nombreScript + '❌ ¡Error al copiar al portapapeles!', err);
            });
          });
        }

      }, 600);
    });
  });

})();
