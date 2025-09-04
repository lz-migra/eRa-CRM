(function () {
  'use strict';

  // ℹ️ INFORMACIÓN DEL SCRIPT
  // Version 1.3.0
  const entornoEjecucion = 'BackOffice';
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

  // 🧹 Limpiar variables globales
  function limpiarVariables() {
    const varsGlobales = [
      'datosExtraidos',
      'bloqueElemento',
      'datosPanel',
      'bloqueHTMLCapturado',
      'CanalSeleccionado',
      'SolicitudIngresada'
    ];
    varsGlobales.forEach(v => delete window[v]);
  }

  // 🔁 Función para cargar scripts remotos
  async function cargarYEjecutarScript(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Estado: ${response.status}`);
      const code = await response.text();
      new Function(code)();
      log.info(`Script ejecutado ✅: ${url}`);
    } catch (err) {
      log.error(`Error al cargar/ejecutar el módulo (${url}): ${err}`);
      window.estadoEjecucion = `Error al cargar/ejecutar módulo: ${url}`;
    }
  }

  // 🔹 Bandera para cargar Detenido.js solo una vez
  let detenidoCargado = false;
  async function manejarCancelacion() {
    if (!detenidoCargado) {
      detenidoCargado = true;
      log.warn(`🛑 Ejecución cancelada. Motivo: ${window.estadoEjecucion}`);
      limpiarVariables();
      await cargarYEjecutarScript(scriptCancelacionURL + timestamp);
    }
  }

  // 🚀 EJECUCIÓN PRINCIPAL
  (async function main() {
    try {
      const modulos = [
        'https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/BackOffice/Resources/IdentificadorHTML.js',
        'https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/BackOffice/Resources/OrdenExtractor.js',
        'https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/Global_Resourses/Canal%26Solicitud.js'
      ];

      // ⏩ Cargar módulos en secuencia y detener si alguno falla
      for (const url of modulos) {
        if (typeof window.estadoEjecucion !== 'undefined') {
          await manejarCancelacion();
          return;
        }
        await cargarYEjecutarScript(url + timestamp);
        if (typeof window.estadoEjecucion !== 'undefined') {
          await manejarCancelacion();
          return;
        }
      }

      const datos = window.datosExtraidos;
      if (!datos) {
        alert(`${nombreScript}\n\n❌ Error: "datosExtraidos" no está definido.`);
        await manejarCancelacion();
        return;
      }

      const { orden, cuenta } = datos;

      // 2️⃣ SetInterval para esperar datos finales
      const verificarInterval = setInterval(async () => {
        if (typeof window.estadoEjecucion !== 'undefined') {
          clearInterval(verificarInterval);
          await manejarCancelacion();
          return;
        }

        if (typeof window.CanalSeleccionado !== 'undefined' &&
            typeof window.SolicitudIngresada !== 'undefined') {

          clearInterval(verificarInterval);

          const canal = window.CanalSeleccionado;
          const solicitud = window.SolicitudIngresada;

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

          try {
            // 📋 Copiar al portapapeles
            await navigator.clipboard.writeText(resultado);
            log.info('Información copiada al portapapeles ✅');

            // 🟢 Guardar mensaje de finalización
            window.estadoFinalizacion = `${nombreScript}\n\n📋 ¡Todos los datos fueron copiados al portapapeles! 📋\n✅ ${tipoScript} generado con éxito ✅\n\n${resultadoalert}`;

            // 🚀 Ejecutar script de finalización
            await cargarYEjecutarScript('https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/Global_Resourses/Finalizado.js' + timestamp);

          } catch (err) {
            log.error(`Error al copiar al portapapeles: ${err}`);
          } finally {
            // 🧹 Limpiar variables globales
            limpiarVariables();
          }
        }
      }, 200);

    } catch (err) {
      log.error(`Error crítico en la ejecución: ${err}`);
      alert(`${nombreScript}\n\n❌ Error crítico: ${err}`);
      limpiarVariables();
    }
  })();

})();

