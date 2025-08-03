//============= Descripción =============
// 🧠 Este módulo almacena mensajes recientes de agente por tarjeta usando localStorage.
// 📌 Cada tarjeta se identifica por su encabezado visible en el panel de conversación.
// 💬 Guarda automáticamente el resultado de UltimoMensajeAgente() usando el nombre de la tarjeta como clave.
// 📦 Usa 'mensajes_agente_por_tarjeta' como STORAGE_KEY para no interferir con otros scripts.
// ✅ Puedes llamar:
//    - MensajesAgenteStorage.Guardar();         // Guarda o actualiza el mensaje actual
//    - MensajesAgenteStorage.Ver();             // Muestra todos los mensajes guardados
//    - MensajesAgenteStorage.Eliminar(nombre);  // Elimina un mensaje específico por nombre
//    - MensajesAgenteStorage.EliminarTodos();   // Borra todos los mensajes
// 🔢 Solo se guardan hasta 5 tarjetas activas y se eliminan automáticamente si no se actualizan en 1 hora.
//
{
//  "WA-IN | 📞 | NO | +4747950140 |": {
//    "mensaje": "🕒 06:09 p. m. - 💬 ¡Muy buenos días, le habla Lorenzo, con gusto le asistiré!",
//    "timestamp": 1722718072393
//  },



//============= Descripción =============

const MensajesAgenteStorage = {
  STORAGE_KEY: 'mensajes_agente_por_tarjeta',    // 🗂️ Clave de almacenamiento en localStorage
  LIMITE: 5,                                     // 🔢 Máximo de tarjetas a guardar
  EXPIRA_MS: 60 * 60 * 1000,                     // ⏳ Tiempo de expiración: 1 hora (en milisegundos)

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

    // 📤 Cargar datos existentes desde localStorage
    const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    const ahora = Date.now();

    // 🧹 Eliminar tarjetas expiradas (más de 1 hora)
    for (const [tarjeta, info] of Object.entries(data)) {
      if (ahora - info.timestamp > this.EXPIRA_MS) {
        console.log(`🗑️ Tarjeta eliminada por antigüedad: ${tarjeta}`);
        delete data[tarjeta];
      }
    }

    // ➕ Agregar o actualizar la tarjeta actual
    data[encabezado] = {
      mensaje,
      timestamp: ahora
    };
    console.log(`💾 Tarjeta guardada/actualizada: ${encabezado}`);

    // ⚖️ Verificar si hay más de 5 tarjetas guardadas
    const tarjetas = Object.entries(data);
    if (tarjetas.length > this.LIMITE) {
      tarjetas.sort((a, b) => a[1].timestamp - b[1].timestamp);  // 🕰️ Ordenar por tiempo
      const [tarjetaMasVieja] = tarjetas[0];
      delete data[tarjetaMasVieja];
      console.log(`⚠️ Límite alcanzado. Se eliminó: ${tarjetaMasVieja}`);
    }

    // 📥 Guardar datos nuevamente en localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  // 👁️ Muestra todos los mensajes guardados en consola
  Ver() {
    const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');

    if (Object.keys(data).length === 0) {
      console.log('📭 No hay mensajes guardados actualmente.');
      return;
    }

    console.log('📋 Mensajes guardados por tarjeta:');
    for (const [tarjeta, info] of Object.entries(data)) {
      const fecha = new Date(info.timestamp).toLocaleString();
      console.log(`📌 ${tarjeta}\n🕒 ${fecha}\n💬 ${info.mensaje}\n---`);
    }
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
