(function () {
  'use strict';

  // ℹ️ INFORMACIÓN DEL SCRIPT
  // 1.3.0
  const nombreScript = '[Mercado 🛒]';
  const tipoScript = 'Resumen';
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
    delete window.datosExtraidos;
    delete window.bloqueHTMLCapturado;
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
        'https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/BackOffice/Resources/OrdenExtractor.js'
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

      // 2️⃣ Esperar con setInterval hasta que datosExtraidos esté disponible
      const verificarInterval = setInterval(async () => {
        if (typeof window.estadoEjecucion !== 'undefined') {
          clearInterval(verificarInterval);
          await manejarCancelacion();
          return;
        }

        if (typeof window.datosExtraidos !== 'undefined') {
          clearInterval(verificarInterval);

          const datos = window.datosExtraidos;
          const { orden, cuenta, total, creado, fechaProgramada, nombre, telefono, direccion, negocio } = datos;

          // ✅ Resumir dirección y fecha
          const direccionResumida = (direccion.match(/(?:[^,]*,){2}\s*(.*)$/) || [])[1] || direccion;
          const fechaResumida = (creado.match(/\d{4}-\d{2}-\d{2}/) || [])[0] || creado;

          const resultadoalert = `
🛒 Orden de Mercado
=========================

🆔 Orden Nro. ${orden} (📅 ${fechaResumida})
👨‍💼 ${nombre} | 📞 ${telefono}
📍 ${direccionResumida}
🏪 Comercio: ${negocio}
🗓️ Fecha programada: ${fechaProgramada}
`.trim();

          const resultado = `
Orden Nro. ${orden} (${fechaResumida})
${nombre} | ${telefono}
${direccionResumida}
Comercio: ${negocio}
Fecha programada: ${fechaProgramada}
`.trim();

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
            window.estadoEjecucion = 'Error al copiar al portapapeles';
            await manejarCancelacion();
          } finally {
            limpiarVariables();
          }
        }
      }, 200); // ⏱️ Verifica cada 200ms

    } catch (err) {
      log.error(`Error crítico en la ejecución: ${err}`);
      window.estadoEjecucion = `Error crítico: ${err}`;
      await manejarCancelacion();
    }
  })();

})();
