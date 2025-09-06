//============= Descripción =============
// 🔁 Escanea tarjetas cada 2 segundos en Twilio Flex.
// 📋 Guarda tarjetas activas en localStorage (id, tipo, procesada).
// 🧠 Identifica su tipo (voice, chat, ivr) y ejecuta lógica por tipo.
// 🚦 Usa banderas globales window.estadoEjecutorTIPO.
// 🕒 Espera 2 minutos antes de detener entornos inactivos.
// 📊 Muestra tabla automática en consola al agregar o eliminar tarjeta.
//=======================================

// 🕒 Temporizadores para detener entornos por tipo
const timersDeDetencion = { chat: null, voice: null, ivr: null };

// 🚦 Inicializar banderas globales de estado
window.estadoEjecutorCHAT  = "detenido";
window.estadoEjecutorVOICE = "detenido";
window.estadoEjecutorIVR   = "detenido";

// 📂 Utilidades para manejo de tarjetas en localStorage
function getTarjetasGuardadas() {
  return JSON.parse(localStorage.getItem("TARJETAS_ACTIVAS") || "[]");
}

function setTarjetasGuardadas(tarjetas) {
  localStorage.setItem("TARJETAS_ACTIVAS", JSON.stringify(tarjetas));
}

// 📊 Mostrar tarjetas en consola (tabla)
function listarTarjetas() {
  const tarjetas = getTarjetasGuardadas();
  if (tarjetas.length === 0) {
    console.warn("⚠️ No hay tarjetas guardadas en localStorage");
    return;
  }
  console.log("🗂️ Tarjetas activas en almacenamiento:");
  console.table(tarjetas);
}

// 🔎 Obtener el nombre real de la tarjeta desde el DOM
function obtenerNombreTarjetaDesdeNodo(nodo) {
  // Preferimos el elemento con data-testid="task-item-first-line"
  try {
    const firstLine = nodo.querySelector('[data-testid="task-item-first-line"]');
    if (firstLine) {
      // preferir span si existe (según tu ejemplo)
      const span = firstLine.querySelector('span');
      const textoCrudo = (span?.innerText || firstLine.innerText || firstLine.textContent || '').trim();
      if (textoCrudo) {
        // limpiar espacios extra y puntos suspensivos finales
        return textoCrudo.replace(/\s+/g, ' ').replace(/\s*\.\.+\s*$/,'').trim();
      }
    }
  } catch (e) {
    // no romper si la estructura varía
  }

  // Fallback: usar aria-label (como antes) — trimmed
  const aria = nodo.getAttribute('aria-label') || '';
  if (aria) return aria.split('\n')[0].trim();

  return null;
}

// ➕ Agregar / ➖ Eliminar tarjetas (y mostrar tabla auto)
function addTarjeta(id, tipo) {
  const tarjetas = getTarjetasGuardadas();
  if (!tarjetas.find(t => t.id === id)) {
    tarjetas.push({ id, tipo, procesada: false }); // 🆕 nueva tarjeta no procesada
    setTarjetasGuardadas(tarjetas);
    listarTarjetas(); // 📊 mostrar tabla al agregar
  }
}

function removeTarjeta(id) {
  let tarjetas = getTarjetasGuardadas();
  const nuevaLista = tarjetas.filter(t => t.id !== id);
  if (nuevaLista.length !== tarjetas.length) {
    setTarjetasGuardadas(nuevaLista);
    listarTarjetas(); // 📊 mostrar tabla al borrar
  }
}

// 🧠 Identificar tipo de tarjeta (usa aria-label como antes)
function getTipoDeTarjeta(tarjetaElement) {
  const ariaLabel = tarjetaElement.getAttribute("aria-label") || "";
  if (ariaLabel.includes("voice task")) return "voice";
  if (ariaLabel.includes("chat task"))  return "chat";
  if (ariaLabel.includes("ivr-live-callback task")) return "ivr";

  // Si no viene por aria-label, intentar detectar por texto del first-line (opcional)
  const firstLineText = (tarjetaElement.querySelector('[data-testid="task-item-first-line"]')?.innerText || "").toLowerCase();
  if (firstLineText.includes("voice")) return "voice";
  if (firstLineText.includes("chat") || firstLineText.includes("wa-in")) return "chat"; // heurística leve
  if (firstLineText.includes("ivr")) return "ivr";

  console.warn("⚠️ Tipo de tarjeta no identificado:", ariaLabel || firstLineText);
  return null;
}

// 🧩 Ejecutar lógica personalizada por tipo (solo 1 vez por tarjeta)
function ejecutarTipo(id, tipo) {
  const tarjetas = getTarjetasGuardadas();
  const tarjeta = tarjetas.find(t => t.id === id);

  if (tarjeta?.procesada) return; // 🚫 evitar repeticiones infinitas

  const tipoMayus = tipo.toUpperCase();
  const ejecutor = window[`Ejecutor${tipoMayus}`];

  console.log(`🎯 ${tipoMayus} task detectada:`, id);
  ejecutor?.iniciar?.();

  // 🚦 actualizar bandera global
  window[`estadoEjecutor${tipoMayus}`] = "activo";

  // ✅ marcar como procesada y guardar
  if (tarjeta) {
    tarjeta.procesada = true;
    setTarjetasGuardadas(tarjetas);
  }
}

// 🔄 Gestionar inicio/detención de entornos según existan tarjetas
function gestionarEntornoPorTipo(tipo, estaActivo) {
  const tipoMayus = tipo.toUpperCase();
  const ejecutor = window[`Ejecutor${tipoMayus}`];

  if (estaActivo && window[`estadoEjecutor${tipoMayus}`] === "detenido") {
    console.log(`✅ Tarjetas ${tipoMayus} encontradas — iniciando entorno`);
    window[`estadoEjecutor${tipoMayus}`] = "activo";
    if (timersDeDetencion[tipo]) { clearTimeout(timersDeDetencion[tipo]); timersDeDetencion[tipo] = null; }
    ejecutor?.iniciar?.();
    return;
  }

  if (!estaActivo && window[`estadoEjecutor${tipoMayus}`] === "activo") {
    if (!timersDeDetencion[tipo]) {
      timersDeDetencion[tipo] = setTimeout(() => {
        const sigueInactivo = !getTarjetasGuardadas().some(t => t.tipo === tipo);
        if (sigueInactivo) {
          console.log(`🛑 No hay tarjetas ${tipoMayus} — deteniendo entorno`);
          window[`estadoEjecutor${tipoMayus}`] = "detenido";
          ejecutor?.detener?.();
        }
        timersDeDetencion[tipo] = null;
      }, 2 * 60 * 1000);
    }
  }
}

function gestionarEntornos() {
  const tarjetas = getTarjetasGuardadas();
  const hayChat  = tarjetas.some(t => t.tipo === "chat");
  const hayVoice = tarjetas.some(t => t.tipo === "voice");
  const hayIVR   = tarjetas.some(t => t.tipo === "ivr");

  gestionarEntornoPorTipo("chat", hayChat);
  gestionarEntornoPorTipo("voice", hayVoice);
  gestionarEntornoPorTipo("ivr", hayIVR);
}

// 🔄 Escanear tarjetas activas periódicamente (usa el nombre real ahora)
function iniciarEscaneoPeriodico() {
  setInterval(() => {
    const tarjetasDOM = document.querySelectorAll('[data-testid="task-item"]');

    // ➕ Detectar/ procesar tarjetas en DOM
    tarjetasDOM.forEach(nodo => {
      const nombre = obtenerNombreTarjetaDesdeNodo(nodo);
      if (!nombre) return;

      const tipo = getTipoDeTarjeta(nodo);
      if (!tipo) return;

      const tarjetas = getTarjetasGuardadas();
      const existente = tarjetas.find(t => t.id === nombre);

      if (!existente) {
        addTarjeta(nombre, tipo);
        ejecutarTipo(nombre, tipo);
      } else if (!existente.procesada) {
        // si está guardada pero no procesada (p.e. recarga), procesarla
        ejecutarTipo(nombre, tipo);
      }
    });

    // ➖ Eliminar guardadas que ya no están en el DOM (comparando por nombre real)
    const actualesSet = new Set(Array.from(tarjetasDOM).map(n => obtenerNombreTarjetaDesdeNodo(n)).filter(Boolean));
    getTarjetasGuardadas().forEach(t => {
      if (!actualesSet.has(t.id)) {
        removeTarjeta(t.id);
      }
    });

    // 🔧 Gestionar entornos (inicio / posible detención con timeout)
    gestionarEntornos();
  }, 2000); // cada 2 seg
}

// 🚀 Iniciar escaneo al cargar
iniciarEscaneoPeriodico();

// 📊 Exponer función manual de listado
getTipoDeTarjeta.listarTarjetas = listarTarjetas;
