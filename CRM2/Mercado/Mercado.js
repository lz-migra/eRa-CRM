(function () {
  'use strict';

  // ℹ️ INFORMACIÓN DEL SCRIPT
  const nombreScript = '[NuevoExtract📦]';
  const tipoScript = 'Resumen de Orden';

  // 🚫 Evitar cache
  const timestamp = '?nocache=' + Date.now();

  // 🔁 Cargar scripts necesarios si aún quieres usar otros módulos
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

  // 🕒 Esperar que datos estén disponibles
  setTimeout(() => {
    const datos = window.datosExtraidosNuevo;
    if (!datos) {
      alert(nombreScript + '\n\n❌ Error: "datosExtraidosNuevo" no está definido.');
      return;
    }

    // 🧷 Extraer datos uno por uno (opcional: destructuración)
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
    const resultado = `
📦 Orden de Servicio
=========================
🆔 Orden: ${orden}
👤 Cuenta: ${cuenta}
💰 Total: ${total}
📅 Creado: ${creado}
🗓️ Fecha programada: ${fechaProgramada}
👨‍💼 Nombre: ${nombre}
📞 Teléfono: ${telefono}
📍 Dirección: ${direccion}
🏢 Negocio: ${negocio}
`.trim();

    // 📤 Copiar al portapapeles
    navigator.clipboard.writeText(resultado).then(() => {
      console.log(nombreScript + ' ✅ Copiado:', resultado);
      alert(
        nombreScript + '\n\n📋 Datos copiados al portapapeles con éxito ✅\n\n' + resultado
      );

      // 🧹 Limpiar variables si deseas
      delete window.datosExtraidosNuevo;
      delete window.bloqueHTMLCapturadoo;
    }).catch((err) => {
      console.error(nombreScript + ' ❌ Error al copiar al portapapeles:', err);
    });

  }, 600); // ⏱️ Espera breve para asegurar que datos estén disponibles

})();
