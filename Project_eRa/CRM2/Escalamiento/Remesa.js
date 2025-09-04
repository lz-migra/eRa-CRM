(function () {
  'use strict';

  // ℹ️ INFORMACIÓN DEL SCRIPT
  // versión 1.2.0
  const entornoEjecucion = 'CRM2';
  const nombreScript = '[Remesa 💵]';
  const tipoScript   = 'Escalamiento';
  const timestamp = '?nocache=' + Date.now();

  function cargarYEjecutarScript(url, callback) {
    fetch(url)
      .then(res => res.ok ? res.text() : Promise.reject(res.status))
      .then(code => { new Function(code)(); if (callback) callback(); })
      .catch(err => console.error(`${nombreScript} ❌ Error en ${url}:`, err));
  }

  // Carga inicial de módulos
  cargarYEjecutarScript(
    `https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/CRM2/Resources/IdentificadorHTML.js${timestamp}`,
    () => {
      cargarYEjecutarScript(
        `https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/CRM2/Resources/OrdenExtractor.js${timestamp}`,
        () => {

          setTimeout(() => {
            if (!window.datosExtraidos) {
              alert(nombreScript + '\n\n❌ Error: "datosExtraidos" no está definido.');
              return;
            }

            const { generales, topup, beneficiario } = window.datosExtraidos;
            const ordenID    = generales.ordenID;
            const clienteID  = generales.clienteID;
            const nroReparto = beneficiario.nroReparto;
            const provincia  = beneficiario.provincia;
            const idTopup    = topup.id;
            const proveedor  = topup.proveedor;
            const status     = topup.status;

            // Cargar modal Canal & Solicitud
            cargarYEjecutarScript(
              'https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/Global_Resourses/Canal%26Solicitud.js',
              () => {

                const esperarCanalSolicitud = setInterval(() => {
                  if (window.CanalSeleccionado !== undefined && window.SolicitudIngresada !== undefined) {
                    clearInterval(esperarCanalSolicitud);

                    const resultadoalert = `
💵 Orden de Remesa
=========================

👤 ID del cliente: ${clienteID}
💸 Tipo de remesa: Domicilio
📍 Provincia: ${provincia}
#️⃣ Número de reparto: ${nroReparto}
🔢 Order code: ${ordenID}
🆔 ID o FOI: ${idTopup}
✅ Status: ${status}
🧑‍🔧 Proveedor: ${proveedor}
🎧 Canal: ${window.CanalSeleccionado}
📝 Solicitud: ${window.SolicitudIngresada || ""}
`.trim();

                    const resultado = `
ID del cliente: ${clienteID}
Tipo de remesa: Domicilio
Provincia: ${provincia}
Número de reparto: ${nroReparto}
Order code: ${ordenID}
ID o FOI: ${idTopup}
Status: ${status}
Proveedor: ${proveedor}
Canal: ${window.CanalSeleccionado}
Solicitud: ${window.SolicitudIngresada || ""}
`.trim();

                    navigator.clipboard.writeText(resultado).then(() => {
                      console.log(nombreScript + ' ✅ Información copiada al portapapeles:', resultado);
                      alert(nombreScript + '\n\n📋 ¡Datos copiados con éxito! 📋\n\n' + resultadoalert);

                      // Limpiar variables
          delete window.datosExtraidos;
          delete window.bloqueElemento;
          delete window.datosPanel;
          delete window.bloqueHTMLCapturado;
          delete window.CanalSeleccionado;
          delete window.SolicitudIngresada;
                    }).catch(err => console.error(nombreScript + ' ❌ Error al copiar:', err));

                  }
                }, 200);

              }
            );

          }, 600);

        }
      );
    }
  );

})();
