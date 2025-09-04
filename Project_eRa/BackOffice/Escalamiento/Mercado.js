(function () {
  'use strict';

  // ℹ️ INFORMACIÓN DEL SCRIPT
  const nombreScript = '[Mercado 🛒]';
  const tipoScript = 'Escalamiento';
  const scriptCancelacionURL = 'https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/Global_Resourses/Detenido.js';

  // 🚫 Evitar cache
  const timestamp = '?nocache=' + Date.now();

  // 📝 LOGGER
  const log = {
    info: msg => console.log(`${nombreScript} ℹ️ ${msg}`),
    warn: msg => console.warn(`${nombreScript} ⚠️ ${msg}`),
    error: msg => console.error(`${nombreScript} ❌ ${msg}`)
  };

  // 🔁 Función para cargar scripts remotos
  function cargarYEjecutarScript(url) {
    return fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`Estado: ${response.status}`);
        return response.text();
      })
      .then(code => {
        try {
          new Function(code)();
          log.info(`Script ejecutado ✅: ${url}`);
        } catch (e) {
          throw new Error(`Error al ejecutar script (${url}): ${e.message}`);
        }
      })
      .catch(err => {
        log.error(err);
        throw err;
      });
  }

  // 🧹 Limpiar variables globales
  function limpiarVariables() {
    const varsGlobales = [
      'datosExtraidos',
      'bloqueElemento',
      'datosPanel',
      'bloqueHTMLCapturado',
      'CanalSeleccionado',
      'SolicitudIngresada',
      'estadoEjecucion'
    ];
    varsGlobales.forEach(v => delete window[v]);
  }

  // 🚀 EJECUCIÓN PRINCIPAL
  (async function main() {
    try {
      // 1️⃣ Cargar todos los módulos en secuencia
      const modulos = [
        'https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/BackOffice/Resources/IdentificadorHTML.js',
        'https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/BackOffice/Resources/OrdenExtractor.js',
        'https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/Global_Resourses/Canal%26Solicitud.js'
      ];

      for (const url of modulos) {
        await cargarYEjecutarScript(url + timestamp);
      }

      const datos = window.datosExtraidos;
      if (!datos) {
        alert(`${nombreScript}\n\n❌ Error: "datosExtraidos" no está definido.`);
        await cargarYEjecutarScript(scriptCancelacionURL + timestamp);
        limpiarVariables();
        return;
      }

      const { orden, cuenta } = datos;

      // 2️⃣ SetInterval unificado para monitorear cancelación o finalización
      const verificarInterval = setInterval(async () => {
        // 🛑 Cancelación detectada
        if (typeof window.estadoEjecucion !== 'undefined') {
          clearInterval(verificarInterval);
          log.warn(`🛑 Ejecución cancelada. Motivo: ${window.estadoEjecucion}`);
          limpiarVariables();
          await cargarYEjecutarScript(scriptCancelacionURL + timestamp);
          return;
        }

        // ✅ Variables listas para procesar
        if (typeof window.CanalSeleccionado !== 'undefined' &&
            typeof window.SolicitudIngresada !== 'undefined') {

          clearInterval(verificarInterval);

          const canal = window.CanalSeleccionado;
          const solicitud = window.SolicitudIngresada;

          // 📝 Crear resultados
          const resultadoalert = `🛒 Orden de Mercado
=========================
🆔 Nro de orden: ${orden}
👤 ID cliente: ${cuenta}
🎧 Canal: ${canal}
📝 Solicitud: ${solicitud || "(vacío)"}`.trim();

          const resultado = `ID cliente: ${cuenta}
Nro de orden: ${orden}
Canal: ${canal}
Solicitud: ${solicitud || ""}`.trim();

          // 📋 Copiar al portapapeles
          try {
            await navigator.clipboard.writeText(resultado);
            log.info('Información copiada al portapapeles ✅');
            alert(`${nombreScript}\n\n📋 ¡Todos los datos fueron copiados al portapapeles! 📋\n✅ ${tipoScript} generado con éxito ✅\n\n${resultadoalert}`);
          } catch (err) {
            log.error(`Error al copiar al portapapeles: ${err}`);
          } finally {
            limpiarVariables();
          }
        }
      }, 200); // ⏱️ Intervalo de verificación cada 200ms

    } catch (err) {
      log.error(`Error crítico en la ejecución: ${err}`);
      alert(`${nombreScript}\n\n❌ Error crítico: ${err}`);
      limpiarVariables();
    }
  })();

})();
