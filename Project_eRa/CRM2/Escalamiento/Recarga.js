(function () {
  'use strict';

  const nombreScript = '[Recarga📱]';
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

        const { generales, topup } = window.datosExtraidos;
        const ordenID   = generales.ordenID;
        const clienteID = generales.clienteID;
        const status    = topup.status;

        // 🎨 Modal paso 1: elegir canal
        const modal = document.createElement('div');
        modal.innerHTML = `
          <div id="canal-modal" style="
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.5);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999;
          ">
            <div style="
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

        function seleccionarCanal(canal) {
          document.getElementById('canal-modal').remove();

          // 🎨 Modal paso 2: elegir solicitud
          const modal2 = document.createElement('div');
          modal2.innerHTML = `
            <div id="solicitud-modal" style="
              position: fixed; inset: 0;
              background: rgba(0,0,0,0.5);
              display: flex; align-items: center; justify-content: center;
              z-index: 9999;
            ">
              <div style="
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

          // Intentar leer portapapeles
          navigator.clipboard.readText().then(texto => {
            document.getElementById('preview').innerText = texto || "(Portapapeles vacío)";
          }).catch(() => {
            document.getElementById('preview').innerText = "(No se pudo acceder al portapapeles)";
          });

          document.getElementById('solicitud-portapapeles').onclick = () => seleccionarSolicitud(canal, document.getElementById('preview').innerText);
          document.getElementById('solicitud-vacio').onclick = () => seleccionarSolicitud(canal, "");
        }

        function seleccionarSolicitud(canal, solicitud) {
          document.getElementById('solicitud-modal').remove();

          const resultado = `
ID del cliente: ${clienteID}
Order code: ${ordenID}
Servicio: Recarga
Status: ${status}
Canal: ${canal}
Solicitud: ${solicitud}
`.trim();

          const resultadoalert = `
📲 Orden de Recarga
=========================

👤 ID del cliente: ${clienteID}
🔢 Order code: ${ordenID}
📲 Servicio: Recarga
✅ Status: ${status}
🎧 Canal: ${canal}
📝 Solicitud: ${solicitud || ""}
`.trim();

          navigator.clipboard.writeText(resultado).then(() => {
            console.log(nombreScript + ' ✅ Información copiada al portapapeles:', resultado);
            alert(
              nombreScript + '\n\n' +
              '📋 ¡Todos los datos fueron copiados al portapapeles! 📋\n' +
              '✅ ' + tipoScript + ' generado con éxito ✅\n\n' +
              resultadoalert
            );

            // 🧹 Limpiar
            delete window.datosExtraidos;
            delete window.bloqueElemento;
            delete window.datosPanel;
            delete window.bloqueHTMLCapturado;
          }).catch((err) => {
            console.error(nombreScript + '❌ ¡Error al copiar al portapapeles!', err);
          });
        }

      }, 600);
    });
  });

})();
