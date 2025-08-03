//============= Descripción =============
// 🧠 Este módulo guarda los últimos mensajes enviados por agentes, organizados por tarjeta.
// 💬 Usa la función UltimoMensajeAgente() y el nombre visible de la tarjeta actual como clave.
// 📦 Guarda los datos en localStorage bajo la clave 'mensajes_agente_por_tarjeta'.
// 🔢 Solo se conservan las últimas 5 tarjetas activas.
// ⏳ Si una tarjeta tiene más de 1 hora sin actualizarse, se elimina automáticamente.
// ✅ Métodos disponibles:
//       MensajesAgenteStorage.Guardar();                         // 💾 Guarda o actualiza tarjeta actual
//       MensajesAgenteStorage.Ver();                             // 📊 Ver todos los mensajes en tabla
//       MensajesAgenteStorage.Eliminar("Nombre Tarjeta");        // ❌ Eliminar uno específico
//       MensajesAgenteStorage.EliminarTodos();                   // 💣 Eliminar todo
//============= Descripción =============

const MensajesAgenteStorage = {
  STORAGE_KEY: 'mensajes_agente_por_tarjeta',    // 🗂️ Clave de almacenamiento en localStorage
  LIMITE: 10,                                    // 🔢 Máximo de tarjetas a guardar
  EXPIRA_MS: 60 * 60 * 1000,                     // ⏳ Tiempo de expiración: 1 hora

  // 💾 Guarda el mensaje del agente actual para la tarjeta activa
  Guardar() {
    // 🧠 Obtener el nombre de la tarjeta activa
    const encabezado = document.querySelector('.Twilio-TaskCanvasHeader-Name span')?.innerText?.trim();
    if (!encabezado) {
      console.warn('⚠️ No se pudo obtener el nombre de la tarjeta');
      return;
    }

    // 💬 Obtener el mensaje del agente
    const mensaje = UltimoMensajeAgente();
    if (!mensaje) {
      console.warn('⚠️ No se pudo obtener el mensaje del agente');
      return;
    }

    // 📤 Cargar datos existentes
    const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    const ahora = Date.now();

    // 🧹 Eliminar entradas vencidas
    for (const [tarjeta, info] of Object.entries(data)) {
      if (ahora - info.timestamp > this.EXPIRA_MS) {
        console.log(`🗑️ Tarjeta eliminada por antigüedad: ${tarjeta}`);
        delete data[tarjeta];
      }
    }

    // ➕ Agregar o actualizar tarjeta actual
    const esNueva = !data[encabezado];
    data[encabezado] = { mensaje, timestamp: ahora };

    if (esNueva) {
      console.log(`🆕 Nueva tarjeta guardada: ${encabezado}`);
    } else {
      console.log(`🔁 Tarjeta actualizada: ${encabezado}`);
    }

    // 📉 Limitar a 5 tarjetas
    const tarjetas = Object.entries(data);
    if (tarjetas.length > this.LIMITE) {
      tarjetas.sort((a, b) => a[1].timestamp - b[1].timestamp);  // 🕰️ Orden por tiempo
      const [tarjetaMasVieja] = tarjetas[0];
      delete data[tarjetaMasVieja];
      console.log(`⚠️ Límite alcanzado. Eliminada tarjeta más antigua: ${tarjetaMasVieja}`);
    }

    // 📥 Guardar en localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  // 👁️ Muestra los mensajes guardados en formato de tabla
  Ver() {
    const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');

    if (Object.keys(data).length === 0) {
      console.log('📭 No hay mensajes guardados actualmente.');
      return;
    }

    // 🧾 Convertir a formato tabla
    const tabla = Object.entries(data).map(([tarjeta, info]) => ({
      Tarjeta: tarjeta,
      'Fecha guardado': new Date(info.timestamp).toLocaleString(),
      'Mensaje del agente': info.mensaje
    }));

    console.log('📋 Mensajes guardados por tarjeta:');
    console.table(tabla);
  },

  // ❌ Elimina un mensaje específico por nombre de tarjeta
  Eliminar(nombreTarjeta) {
    const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');

    if (data[nombreTarjeta]) {
      delete data[nombreTarjeta];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      console.log(`🗑️ Mensaje eliminado para la tarjeta: ${nombreTarjeta}`);
    } else {
      console.warn(`⚠️ No se encontró la tarjeta: ${nombreTarjeta}`);
    }
  },

  // 💣 Elimina todos los mensajes guardados
  EliminarTodos() {
    if (localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('🧹 Todos los mensajes fueron eliminados.');
    } else {
      console.log('📭 No hay mensajes guardados para eliminar.');
    }
  }
};
