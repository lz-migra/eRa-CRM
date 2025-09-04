(function () {
  'use strict';

  // ℹ️ INFORMACIÓN DEL SCRIPT
  const nombreScript = '[Mercado 🛒]';
  const tipoScript = 'Escalamiento';
  const scriptCancelacionURL = 'https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/Global_Resourses/Detenido.js';

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

      setTimeout(() => {
        const datos = window.datosExtraidos;

        if (!datos) {
          alert(nombreScript + '\n\n❌ Error: "datosExtraidos" no está definido.');
          cargarYEjecutarScript(scriptCancelacionURL + timestamp,
          return;
        }

        // 🧷 Extraer campos necesarios
        const { orden, cuenta } = datos;

        // 📌 Ahora cargamos el modal de Canal & Solicitud
        cargarYEjecutarScript('https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/Global_Resourses/Canal%26Solicitud.js', function () {
          
          // Limpiamos el estado de ejecución previo para asegurar que la cancelación sea intencional
          // delete window.estadoEjecucion;

          // ⚡ Se inicia un único intervalo para verificar el estado
          const verificarEstadoInterval = setInterval(() => {

            // ==================================================================
            // 🛑 CONDICIÓN 1: VERIFICAR SI SE CANCELÓ LA EJECUCIÓN
            // ==================================================================
            if (typeof window.estadoEjecucion !== 'undefined') {
              // Detenemos el intervalo para no seguir verificando
              clearInterval(verificarEstadoInterval);

              console.warn(`${nombreScript} 🛑 Ejecución cancelada. Motivo:`, window.estadoEjecucion);
              
              // 🧹 Limpiamos las variables globales que ya no se usarán
                delete window.datosExtraidos;
                delete window.bloqueElemento;
                delete window.datosPanel;
                delete window.bloqueHTMLCapturado;
                delete window.CanalSeleccionado;
                delete window.SolicitudIngresada;
              
              // 🔄 Cargamos el script de cancelación con la URL fija
                  cargarYEjecutarScript(scriptCancelacionURL + timestamp, () => 
              });

            // ==================================================================
            // ✅ CONDICIÓN 2: VERIFICAR SI LA EJECUCIÓN CONTINÚA NORMALMENTE
            // ==================================================================
            } else if (typeof window.CanalSeleccionado !== 'undefined' && typeof window.SolicitudIngresada !== 'undefined') {
              // Detenemos el intervalo porque ya tenemos los datos
              clearInterval(verificarEstadoInterval);

              // 📋 Crear plantilla con los datos y los valores seleccionados
              const resultadoalert = `🛒 Orden de Mercado
=========================

🆔 Nro de orden: ${orden}
👤 ID cliente: ${cuenta}
🎧 Canal: ${window.CanalSeleccionado}
📝 Solicitud: ${window.SolicitudIngresada || "(vacío)"}`.trim();

              const resultado = `ID cliente: ${cuenta}
Nro de orden: ${orden}
Canal: ${window.CanalSeleccionado}
Solicitud: ${window.SolicitudIngresada || ""}`.trim();

              // 📋 Copiar al portapapeles
              navigator.clipboard.writeText(resultado).then(() => {
                console.log(nombreScript + ' ✅ Información copiada al portapapeles:', resultado);
                alert(
                  nombreScript + '\n\n' +
                  '📋 ¡Todos los datos fueron copiados al portapapeles! 📋\n' +
                  '✅ ' + tipoScript + ' generado con éxito ✅\n\n' +
                  resultadoalert
                );

                // 🧹 Limpiar variables globales de la operación exitosa
                delete window.datosExtraidos;
                delete window.bloqueElemento;
                delete window.datosPanel;
                delete window.bloqueHTMLCapturado;
                delete window.CanalSeleccionado;
                delete window.SolicitudIngresada;
              }).catch(err => {
                console.error(nombreScript + ' ❌ Error al copiar al portapapeles:', err);
              });
            }
          }, 200);

        });

      }, 600); // ⏱️ Espera para asegurar ejecución de módulos
    });
  });

})();
