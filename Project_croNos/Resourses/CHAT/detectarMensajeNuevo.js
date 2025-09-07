// =====================================================
// 📌 Script unificado: Gestión de mensajes del agente
// =====================================================

// 📝 Objeto principal que agrupa toda la lógica
const AgenteMensajes = {
  STORAGE_KEY: 'mensajes_agente_por_tarjeta',    // 🗂️ Clave de almacenamiento en localStorage
  LIMITE: 10,                                    // 🔢 Máximo de tarjetas a guardar
  EXPIRA_MS: 60 * 60 * 1000,                     // ⏳ Tiempo de expiración: 1 hora
  CLAVE_NOMBRE: 'nombre_agente_guardado',        // 🔐 Clave para almacenar nombre del agente

  // =====================================================
  // 👤 1. Detección del nombre del agente
  // =====================================================
  detectarNombreAgente(opciones = {}) {
    const {
      intervaloMs = 500,     // ⏱️ Intervalo entre intentos de escaneo
      tiempoMaxMs = 60000,   // ⌛ Tiempo máximo que se intentará detectar
      onDetectado = null     // 🎯 Callback al detectar el nombre
    } = opciones;

    const regexNombre = /User\s(.+?)\. Click for option to log out\./; // 🧩 Patrón para extraer

    function buscarNombre() {
      const elementos = document.querySelectorAll('[title], [aria-label]');
      for (const el of elementos) {
        const attr = el.getAttribute('title') || el.getAttribute('aria-label');
        if (attr && regexNombre.test(attr)) {
          const match = regexNombre.exec(attr);
          if (match && match[1]) {
            const nombre = match[1].trim();

            window.AGENT_NAME = nombre; // 💾 Variable global
            localStorage.setItem(AgenteMensajes.CLAVE_NOMBRE, nombre); // 💾 Guardar respaldo local
            console.log("✅ [detectarNombreAgente] Nombre detectado:", nombre);

            clearInterval(intervalo);
            if (typeof onDetectado === 'function') onDetectado(nombre);
            return;
          }
        }
      }
    }

    const intervalo = setInterval(buscarNombre, intervaloMs);

    setTimeout(() => {
      clearInterval(intervalo);
      if (!window.AGENT_NAME) {
        const nombreGuardado = localStorage.getItem(AgenteMensajes.CLAVE_NOMBRE);
        if (nombreGuardado) {
          window.AGENT_NAME = nombreGuardado;
          console.warn("⚠️ [detectarNombreAgente] Restaurado desde localStorage:", nombreGuardado);
          if (typeof onDetectado === 'function') onDetectado(nombreGuardado);
        } else {
          console.error("❌ [detectarNombreAgente] No se pudo detectar ni restaurar el nombre del agente.");
        }
      }
    }, tiempoMaxMs);
  },

  // =====================================================
  // 💬 2. Obtener el último mensaje del agente
  // =====================================================
  UltimoMensajeAgente(agentName = window.AGENT_NAME) {
    if (!agentName) {
      console.warn("⚠️ El nombre del agente no está definido.");
      return null;
    }

    const messageSelector = '[data-message-item="true"]';
    const senderSelector = '[data-testid="message-sendername"]';
    const bodySelector = '[data-testid="message-body"]';
    const timeSelector = '.Twilio-MessageBubble-Time';

    const allMessages = Array.from(document.querySelectorAll(messageSelector));
    const agentMessages = allMessages.filter(msg => {
      const sender = msg.querySelector(senderSelector);
      return sender && sender.textContent.trim() === agentName;
    });

    if (agentMessages.length === 0) {
      console.warn("📭 No se encontraron mensajes del agente:", agentName);
      return null;
    }

    const lastAgentMessage = agentMessages[agentMessages.length - 1];
    const messageBody = lastAgentMessage.querySelector(bodySelector);
    const messageTime = lastAgentMessage.querySelector(timeSelector);

    if (messageBody && messageTime) {
      const texto = messageBody.textContent.trim();
      const hora = messageTime.textContent.trim();
      const resultado = `🕒 ${hora} - 💬 ${texto}`;

      console.log("📤 [UltimoMensajeAgente] Resultado:", resultado);
      window.ULTIMO_MENSAJE = resultado;
      return resultado;
    } else {
      console.warn("⚠️ [UltimoMensajeAgente] No se encontró cuerpo o hora del mensaje");
      return null;
    }
  },

  // =====================================================
  // 💾 3. Guardar mensajes por tarjeta
  // =====================================================
  Guardar() {
    const encabezado = document.querySelector('.Twilio-TaskCanvasHeader-Name span')?.innerText?.trim();
    if (!encabezado) {
      console.warn('⚠️ No se pudo obtener el nombre de la tarjeta');
      return;
    }

    const mensaje = this.UltimoMensajeAgente();
    if (!mensaje) {
      console.warn('⚠️ No se pudo obtener el mensaje del agente');
      return;
    }

    const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    const ahora = Date.now();

    for (const [tarjeta, info] of Object.entries(data)) {
      if (ahora - info.timestamp > this.EXPIRA_MS) {
        console.log(`🗑️ Tarjeta eliminada por antigüedad: ${tarjeta}`);
        delete data[tarjeta];
      }
    }

    const esNueva = !data[encabezado];
    data[encabezado] = { mensaje, timestamp: ahora };

    console.log(esNueva ? `🆕 Nueva tarjeta guardada: ${encabezado}` : `🔁 Tarjeta actualizada: ${encabezado}`);

    const tarjetas = Object.entries(data);
    if (tarjetas.length > this.LIMITE) {
      tarjetas.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const [tarjetaMasVieja] = tarjetas[0];
      delete data[tarjetaMasVieja];
      console.log(`⚠️ Límite alcanzado. Eliminada tarjeta más antigua: ${tarjetaMasVieja}`);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  // =====================================================
  // 👀 4. Ver mensajes guardados
  // =====================================================
  Ver() {
    const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    if (Object.keys(data).length === 0) {
      console.log('📭 No hay mensajes guardados actualmente.');
      return;
    }

    const tabla = Object.entries(data).map(([tarjeta, info]) => ({
      Tarjeta: tarjeta,
      'Fecha guardado': new Date(info.timestamp).toLocaleString(),
      'Mensaje del agente': info.mensaje
    }));

    console.log('📋 Mensajes guardados por tarjeta:');
    console.table(tabla);
  },

  // =====================================================
  // ❌ 5. Eliminar mensajes
  // =====================================================
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

  EliminarTodos() {
    if (localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('🧹 Todos los mensajes fueron eliminados.');
    } else {
      console.log('📭 No hay mensajes guardados para eliminar.');
    }
  },

  // =====================================================
  // 🔁 6. Comparar mensaje actual con el guardado
  // =====================================================
  CompararMensajeConGuardado() {
    const encabezado = document.querySelector('.Twilio-TaskCanvasHeader-Name span')?.innerText?.trim();
    if (!encabezado) {
      console.warn('⚠️ No se pudo obtener el nombre de la tarjeta activa');
      return false;
    }

    const mensajeActual = this.UltimoMensajeAgente();
    if (!mensajeActual) {
      console.warn('⚠️ No se pudo obtener el mensaje actual del agente');
      return false;
    }

    const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    const guardado = data[encabezado]?.mensaje;

    if (!guardado) {
      console.warn(`📭 No se encontró un mensaje guardado para la tarjeta: "${encabezado}"`);
      return false;
    }

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
};

// 🌍 Exponer en window para acceso global
window.AgenteMensajes = AgenteMensajes;
