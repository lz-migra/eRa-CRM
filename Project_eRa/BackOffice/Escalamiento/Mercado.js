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

  // ⏳ Función para esperar una variable global
  function esperarVariable(variableName, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (typeof window[variableName] !== 'undefined') {
          clearInterval(interval);
          resolve(window[variableName]);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        reject(`${variableName} no se definió en ${timeout}ms`);
      }, timeout);
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
      // 1️⃣ Cargar módulos necesarios
      await cargarYEjecutarScript(`https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/BackOffice/Resources/IdentificadorHTML.js${timestamp}`);
      await cargarYEjecutarScript(`https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/BackOffice/Resources/OrdenExtractor.js${timestamp}`);

      const datos = window.datosExtraidos;
      if (!datos) {
        alert(`${nombreScript}\n\n❌ Error: "datosExtraidos" no está definido.`);
        await cargarYEjecutarScript(scriptCancelacionURL + timestamp);
        return;
      }

      const { orden, cuenta } = datos;

      // 2️⃣ Cargar modal Canal & Solicitud
      await cargarYEjecutarScript(`https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/Global_Resourses/Canal%26Solicitud.js${timestamp}`);

      // 3️⃣ Esperar selección de Canal y Solicitud
      try {
        const [canal, solicitud] = await Promise.all([
          esperarVariable('CanalSeleccionado', 10000),
          esperarVariable('SolicitudIngresada', 10000)
        ]);

        // 4️⃣ Crear plantillas de resultado
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

        // 5️⃣ Copiar al portapapeles
        await navigator.clipboard.writeText(resultado);
        log.info('Información copiada al portapapeles ✅');
        alert(`${nombreScript}\n\n📋 ¡Todos los datos fueron copiados al portapapeles! 📋\n✅ ${tipoScript} generado con éxito ✅\n\n${resultadoalert}`);

      } catch (err) {
        log.warn(`⏳ Tiempo de espera superado o cancelación detectada: ${err}`);
        if (window.estadoEjecucion) {
          log.warn(`🛑 Ejecución cancelada. Motivo: ${window.estadoEjecucion}`);
        }
        await cargarYEjecutarScript(scriptCancelacionURL + timestamp);
      } finally {
        // 6️⃣ Limpiar todas las variables globales usadas
        limpiarVariables();
      }

    } catch (err) {
      log.error(`Error crítico en la ejecución: ${err}`);
      alert(`${nombreScript}\n\n❌ Error crítico: ${err}`);
      limpiarVariables();
    }
  })();

})();
