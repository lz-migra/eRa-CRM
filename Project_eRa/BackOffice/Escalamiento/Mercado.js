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

      setTimeout(() => {
        const datos = window.datosExtraidos;

        if (!datos) {
          alert(nombreScript + '\n\n❌ Error: "datosExtraidos" no está definido.');
          return;
        }

        // 🧷 Extraer campos necesarios
        const { orden, cuenta, total, creado, fechaProgramada, nombre, telefono, direccion, negocio } = datos;

        // 📌 Ahora cargamos el modal de Canal & Solicitud
        cargarYEjecutarScript('https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/BackOffice/Resources/Canal%26Solicitud.js', function () {
          
          let esperarCanalSolicitud;
          let verificarCancelacion;

          // ==================================================================
          // 🛑 INICIO: LÓGICA DE CANCELACIÓN AÑADIDA
          // ==================================================================
verificarCancelacion = setInterval(() => {
  // Si `estadoEjecucion` tiene cualquier valor, se cancela todo.
  if (typeof window.estadoEjecucion !== 'undefined') {
    // Detenemos ambos intervalos
    clearInterval(esperarCanalSolicitud);
    clearInterval(verificarCancelacion);
    
    console.warn(`${nombreScript} 🛑 Ejecución cancelada por el usuario. Motivo:`, window.estadoEjecucion);

    // Limpiamos las variables globales para evitar estados inconsistentes
    delete window.estadoEjecucion;
    delete window.CanalSeleccionado;
    delete window.SolicitudIngresada;

    // 🔹 Cargamos y ejecutamos el script externo
    cargarYEjecutarScript(
      'https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/BackOffice/Resources/Detenido.js', 
      function () {
        console.log('Script de detención cargado y ejecutado ✅');
      }
    );
  }
}, 200);
          // ==================================================================
          // 🛑 FIN: LÓGICA DE CANCELACIÓN AÑADIDA
          // ==================================================================


          // ⚡ Esperamos a que el usuario seleccione Canal y Solicitud
          esperarCanalSolicitud = setInterval(() => {
            if (typeof window.CanalSeleccionado !== 'undefined' && typeof window.SolicitudIngresada !== 'undefined') {
              // Detenemos ambos intervalos, ya que la ejecución fue exitosa
              clearInterval(esperarCanalSolicitud);
              clearInterval(verificarCancelacion);

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

                // 🧹 Limpiar variables globales
                delete window.datosExtraidos;
                delete window.bloqueElemento;
                delete window.datosPanel;
                delete window.bloqueHTMLCapturado;
                delete window.CanalSeleccionado;
                delete window.SolicitudIngresada;
                delete window.estadoEjecucion;
                clearInterval(esperarCanalSolicitud);
                clearInterval(verificarCancelacion); 
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
