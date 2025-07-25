function () {
  'use strict';

  // 📦 Función reutilizable para cargar y ejecutar scripts remotos
  function cargarYEjecutarScript(url, callback) {
    console.log(`[RECARGA📱] 🔄 Cargando script desde: ${url}`);
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`Estado: ${response.status}`);
        return response.text();
      })
      .then(code => {
        try {
          new Function(code)(); // Ejecuta el código
          console.log(`[RECARGA📱] ✅ Script ejecutado: ${url}`);
          if (typeof callback === 'function') callback();
        } catch (e) {
          console.error(`[RECARGA📱] ❌ Error al ejecutar script (${url}):`, e);
        }
      })
      .catch(error => {
        console.error(`[RECARGA📱] ❌ Error al cargar el script (${url}):`, error);
      });
  }

  // 🚀 Inicia la carga en cadena
  cargarYEjecutarScript('https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/CRM2/Resources/IdentificadorHTML.js', function () {
    cargarYEjecutarScript('https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/CRM2/Resources/OrdenExtractor.js', function () {

      // Esperar un momento para asegurar que los scripts hayan terminado de procesar
      setTimeout(() => {
        if (!window.datosExtraidos) {
          alert('[RECARGA📱] \n\n' +
          '❌ Error: "datosExtraidos" no está definido. \n' +
          'No se genero el escalamiento');
          return;
        }

        const { generales, oferta, topup, beneficiario } = window.datosExtraidos;

        // 🔢 Datos generales
        const ordenID       = generales.ordenID;
        const clienteID     = generales.clienteID;
        const fecha         = generales.fecha;
        const estadoOrden   = generales.estadoOrden;
        const montoPagado   = generales.montoPagado;
        const tarjeta       = generales.tarjeta;

        // 🎁 Datos de oferta
        const tituloOferta     = oferta.titulo;
        const estadoOferta     = oferta.estado;
        const precioListado    = oferta.precioListado;
        const descuento        = oferta.descuento;
        const precioTotal      = oferta.precioTotal;

        // 📦 Datos Topup
        const idTopup     = topup.id;
        const proveedor   = topup.proveedor;
        const status      = topup.status;
        const operador    = topup.operador;
        const destino     = topup.destino;
const rawNombre = topup.nombre || '';
const nombreTopup = rawNombre
  .replace(/[^a-zA-Z() ]/g, '') // Elimina todo excepto letras A-Z, espacios y paréntesis
  .toLowerCase()
  .replace(/\b[a-z]/g, c => c.toUpperCase()); // Capitaliza la primera letra de cada palabra


        // 👤 Datos del beneficiario
        const provincia     = beneficiario.provincia;
        const municipio     = beneficiario.municipio;
        const direccion     = beneficiario.direccion;
        const barrio        = beneficiario.barrio;
        const instrucciones = beneficiario.instrucciones;
        const nroReparto    = beneficiario.nroReparto;
        const celular       = beneficiario.celular;
        const nombre        = beneficiario.nombre;
        const monto         = beneficiario.monto;
        const fee           = beneficiario.fee;

        // 📋 Plantilla de resultado
        const resultado = `
Orden Nro. ${ordenID}
${nombreTopup} - 
Status: ${status}
solicitud: 
`.trim();

        // 📋 Copiar al portapapeles
navigator.clipboard.writeText(resultado).then(() => {
  console.log('[RECARGA📱] ✅ Información copiada al portapapeles:', resultado);
  alert('[RECARGA📱] \n\n' +
  '📋 ¡Todos los datos fueron copiados al portapapeles! 📋 \n' + 
  '✅ El escalamiento ha sido generado correctamente ✅');

  // 🧹 Limpiar variables globales
  delete window.datosExtraidos;
  delete window.bloqueElemento;
  delete window.datosPanel;
  delete window.bloqueHTMLCapturado

}).catch((err) => {
  console.error('[RECARGA📱] ❌ ¡Error al copiar al portapapeles!', err);
});

      }, 600); // Espera corta para asegurar ejecución de scripts
    });
  });

})();
