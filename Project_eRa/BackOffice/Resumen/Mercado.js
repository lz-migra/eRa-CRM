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
  cargarYEjecutarScript(
    `https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/BackOffice/Resources/IdentificadorHTML.js${timestamp}`,
    function () {
      cargarYEjecutarScript(
        `https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_eRa/BackOffice/Resources/OrdenExtractor.js${timestamp}`,
        function () {

          // ⏳ Esperar que se generen los datos
          setTimeout(() => {
            const datos = window.datosExtraidos;

            if (!datos) {
              alert(nombreScript + '\n\n❌ Error: "datosExtraidos" no está definido.');
              return;
            }

            // 🧷 Extraer campos necesarios
            const {
              orden,
              cuenta,
              total,
              creado,
              fechaProgramada,
              nombre,
              telefono,
              direccion,
              negocio
            } = datos;

            // ✅ Resumir dirección
            function resuDireccion(texto) {
              const match = texto.match(/(?:[^,]*,){2}\s*(.*)$/);
              return match ? match[1].trim() : texto;
            }

            // ✅ Resumir fecha
            function resuFecha(texto) {
              const match = texto.match(/\d{4}-\d{2}-\d{2}/);
              return match ? match[0] : texto;
            }

            const direccionResumida = resuDireccion(direccion);
            const fechaResumida = resuFecha(creado);

            // 📋 Crear plantilla con los datos
            const resultadoalert = `
🛒 Orden de Mercado
=========================

🆔 Orden Nro. ${orden} (📅 ${fechaResumida})
👨‍💼 ${nombre} | 📞 ${telefono}
📍 ${direccionResumida}
🏪 ${negocio}
🗓️ Fecha programada: ${fechaProgramada}
`.trim();

            const resultado = `
Orden Nro. ${orden} (${fechaResumida})
${nombre} | ${telefono}
${direccionResumida}
${negocio}
Fecha programada: ${fechaProgramada}
`.trim();

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
              delete window.bloqueHTMLCapturado;
            }).catch((err) => {
              console.error(nombreScript + ' ❌ Error al copiar al portapapeles:', err);
            });

          }, 600); // ⏱️ Espera para asegurar ejecución de módulos
        }
      );
    }
  );
})();
