(function () {
  'use strict';

  // ℹ️ INFORMACIÓN DEL SCRIPT
  const nombreScript = '[Mercado 🛒]';
  const tipoScript = 'Resumen de Orden';

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

      // ⏳ Esperar que se generen los datos
      setTimeout(() => {
        const datos = window.datosExtraidosNuevo;

        if (!datos) {
          alert(nombreScript + '\n\n❌ Error: "datosExtraidosNuevo" no está definido.');
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

        // 📋 Crear plantilla con los datos
        const resultadoalert = `
📦 Orden de Servicio
=========================
🆔 Nro de orden: ${orden}
👤 ID cliente: ${cuenta}
Solicitud:
`.trim();

//💰 Total: ${total}
//📅 Creado: ${creado}
//🗓️ Fecha programada: ${fechaProgramada}
//👨‍💼 Nombre: ${nombre}
//📞 Teléfono: ${telefono}
//📍 Dirección: ${direccion}
//🏢 Negocio: ${negocio}

        // 📋 Crear plantilla con los datos
        const resultado = `
ID cliente: ${cuenta}
Nro de orden: ${orden}
Solicitud: 
`.trim();

        // 📤 Copiar al portapapeles
        navigator.clipboard.writeText(resultado).then(() => {
          console.log(nombreScript + ' ✅ Copiado:', resultado);
          alert(
            nombreScript + '\n\n📋 Datos copiados al portapapeles con éxito ✅\n\n' + resultado
          );

          // 🧹 Limpiar variables globales si deseas
          delete window.datosExtraidosNuevo;
          delete window.bloqueHTMLCapturado;
        }).catch((err) => {
          console.error(nombreScript + ' ❌ Error al copiar al portapapeles:', err);
        });

      }, 600); // ⏱️ Espera para asegurar ejecución de módulos
    });
  });

})();
