necesio integrar toda esta logina en un solo script

no puedo usar funciones globales asi que pense en usar un setinverval para validar ell esado de una varible global y ejecutar aciones de manera interna

function CompararMensajeConGuardado() {
  const STORAGE_KEY = 'mensajes_agente_por_tarjeta'; // 🗂️ Clave del almacenamiento

  // 🧠 Obtener el encabezado (nombre de la tarjeta activa)
  const encabezado = document.querySelector('.Twilio-TaskCanvasHeader-Name span')?.innerText?.trim();
  if (!encabezado) {
    console.warn('⚠️ No se pudo obtener el nombre de la tarjeta activa');
    return false;
  }

  // 💬 Obtener el mensaje actual desde UltimoMensajeAgente()
  const mensajeActual = UltimoMensajeAgente();
  if (!mensajeActual) {
    console.warn('⚠️ No se pudo obtener el mensaje actual del agente');
    return false;
  }

  // 📤 Cargar datos guardados desde localStorage
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const guardado = data[encabezado]?.mensaje;

  if (!guardado) {
    console.warn(`📭 No se encontró un mensaje guardado para la tarjeta: "${encabezado}"`);
    return false;
  }

  // 🔁 Comparar mensajes
  const iguales = mensajeActual === guardado;

  if (iguales) {
    console.log(`✅ El mensaje actual coincide con el guardado para "${encabezado}"`);
  } else {
    console.log(`❌ El mensaje actual es diferente al guardado para "${encabezado}"`);
    console.log('🆕     Actual:', mensajeActual);
    console.log('📦   Guardado:', guardado);
  }

  return iguales;
}

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
 function UltimoMensajeAgente(agentName = window.AGENT_NAME) {
  // ⚠️ Verificar si se proporcionó un nombre de agente
  if (!agentName) {
    console.warn("⚠️ El nombre del agente no está definido ni en window.AGENT_NAME ni como argumento.");
    return null;
  }

  // 🔍 Selectores para identificar los elementos clave del DOM
  const messageSelector = '[data-message-item="true"]';         // 🧱 Contenedor de cada mensaje
  const senderSelector = '[data-testid="message-sendername"]';  // 🏷️ Nombre del remitente
  const bodySelector = '[data-testid="message-body"]';          // 💬 Texto del mensaje
  const timeSelector = '.Twilio-MessageBubble-Time';            // ⏰ Hora del mensaje

  // 📦 Recolectar todos los elementos de mensaje del DOM
  const allMessages = Array.from(document.querySelectorAll(messageSelector));

  // 🧼 Filtrar solo los mensajes enviados por el agente (según el nombre dado)
  const agentMessages = allMessages.filter(msg => {
    const sender = msg.querySelector(senderSelector);           // 🕵️ Obtener nombre del remitente
    return sender && sender.textContent.trim() === agentName;   // ✅ Coincidencia exacta con el nombre del agente
  });

  // ⚠️ Verificar si se encontraron mensajes del agente
  if (agentMessages.length === 0) {
    console.warn("[INFO] No se encontraron mensajes del agente:", agentName);  // 🚫 Nada encontrado
    return null;
  }

  // 📍 Obtener el último mensaje enviado por el agente
  const lastAgentMessage = agentMessages[agentMessages.length - 1];

  // 📝 Extraer el cuerpo y la hora del mensaje
  const messageBody = lastAgentMessage.querySelector(bodySelector); // 💬 Texto
  const messageTime = lastAgentMessage.querySelector(timeSelector); // 🕒 Hora

  // ✅ Si ambos elementos existen, combinarlos y devolver el resultado
  if (messageBody && messageTime) {
    const texto = messageBody.textContent.trim();  // ✂️ Limpiar texto
    const hora = messageTime.textContent.trim();   // ✂️ Limpiar hora
    const resultado = `🕒 ${hora} - 💬 ${texto}`;   // 🧩 Formato de salida

    console.log("[RESULTADO]", resultado);         // 🖨️ Mostrar en consola
    window.ULTIMO_MENSAJE = resultado;             // 💾 Guardar el resultado para otros scripts
    return resultado;                              // 📤 Devolver resultado
  } else {
    // 🚨 Algo salió mal: no se encontró el cuerpo o la hora
    console.warn("[WARN] No se encontró el cuerpo o la hora del mensaje");
    return null;
  }
}

// 🌐 Exponer la función como método global
window.UltimoMensajeAgente = UltimoMensajeAgente;

function detectarNombreAgente(opciones = {}) {
  const {
    intervaloMs = 500,     // ⏱️ Intervalo entre intentos de escaneo
    tiempoMaxMs = 60000,   // ⌛ Tiempo máximo que se intentará detectar
    onDetectado = null     // 🎯 Callback al detectar el nombre
  } = opciones;

  const regexNombre = /User\s(.+?)\. Click for option to log out\./; // 🧩 Patrón para extraer el nombre
  const CLAVE_STORAGE = 'nombre_agente_guardado'; // 🔐 Clave para almacenamiento local

  // 🔄 Función que busca el nombre del agente en el DOM
  function buscarNombre() {
    const elementos = document.querySelectorAll('[title], [aria-label]');

    for (const el of elementos) {
      const attr = el.getAttribute('title') || el.getAttribute('aria-label');
      if (attr && regexNombre.test(attr)) {
        const match = regexNombre.exec(attr);

        if (match && match[1]) {
          const nombre = match[1].trim();

          window.AGENT_NAME = nombre; // 💾 Variable global
          localStorage.setItem(CLAVE_STORAGE, nombre); // 💾 Guardar respaldo local
          console.log("[detectarNombreAgente] ✅ Nombre detectado:", nombre);

          clearInterval(intervalo);
          if (typeof onDetectado === 'function') {
            onDetectado(nombre);
          }
          return;
        }
      }
    }
  }

  // 🕵️ Iniciar escaneo cada X milisegundos
  const intervalo = setInterval(buscarNombre, intervaloMs);

  // ⏳ Detener escaneo después del tiempo máximo y restaurar desde localStorage si es necesario
  setTimeout(() => {
    clearInterval(intervalo);

    if (!window.AGENT_NAME) {
      const nombreGuardado = localStorage.getItem(CLAVE_STORAGE);
      if (nombreGuardado) {
        window.AGENT_NAME = nombreGuardado;
        console.warn("[detectarNombreAgente] ⚠️ Nombre no detectado, restaurado desde localStorage:", nombreGuardado);

        if (typeof onDetectado === 'function') {
          onDetectado(nombreGuardado);
        }
      } else {
        console.error("[detectarNombreAgente] ❌ No se pudo detectar ni restaurar el nombre del agente.");
      }
    }
  }, tiempoMaxMs);
}

// 🌍 Exponer como función global
window.detectarNombreAgente = detectarNombreAgente;
