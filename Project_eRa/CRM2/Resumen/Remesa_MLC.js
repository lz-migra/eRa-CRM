(function () {
  'use strict';

  // ℹ️ INFORMACIÓN DEL SCRIPT
  // 1.3.0
  const nombreScript = '[Remesa💵/MLC💳]';
  const tipoScript   = 'Resumen';
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
    delete window.bloqueElemento;
    delete window.datosPanel;
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
        'https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/CRM2/Resources/IdentificadorHTML.js',
        'https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/CRM2/Resources/OrdenExtractor.js'
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

          const { generales, beneficiario } = window.datosExtraidos;

          // 🔢 Datos generales
          const ordenID     = generales.ordenID;
          const fecha       = generales.fecha;
          const montoPagado = generales.montoPagado;
          const moneda      = montoPagado.replace(/[0-9.\s]+/g, '').trim();

          // 👤 Datos del beneficiario
          const fechaEntrega  = beneficiario.fechaReparto;
          const provincia     = beneficiario.provincia;
          const municipio     = beneficiario.municipio;
          const barrio        = beneficiario.barrio;
          const celular       = beneficiario.celular;
          const nombre        = beneficiario.nombre;
          const monto         = beneficiario.monto;
          const fee           = beneficiario.fee;

          // 📋 Plantilla de resultado Alert
          const resultadoalert = `
🧾 Orden Nro. ${ordenID} 🗓️ (${fecha})
👤 ${nombre} | 📱 +${celular}
📍 ${barrio}, ${municipio}, ${provincia}
💵 Monto: ${monto} - 🧾 FEE: ${fee}
🚚 Fecha estimada de entrega: ${fechaEntrega}
`.trim();

          // 📋 Plantilla de resultado
          const resultado = `
Orden Nro. ${ordenID} (${fecha})
${nombre} | +${celular}
${barrio}, ${municipio}, ${provincia}
Monto: ${monto} - FEE: ${fee}
Fecha estimada de entrega: ${fechaEntrega}
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
