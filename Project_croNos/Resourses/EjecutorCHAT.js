(() => {
  // 🎯 Texto a detectar
  const triggerText = '✨ creado por el agente';

  // ⚙️ Opciones
  const strictMatch = false; // false = busca el texto en cualquier parte del mensaje

  // 🧾 Referencias originales de la consola
  const originals = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
  };

  /**
   * Lógica principal que se ejecuta cuando el disparador se activa.
   * Sigue los pasos 2, 3 y 4 de tu descripción.
   */
  function guardarTarjetaEnStorage() {
    originals.info('[Detector] Disparador activado. Ejecutando lógica de guardado...');

    // --- 2️⃣ Capturar el nombre de la tarjeta ---
    const selectorTarjeta = 'h4.Twilio-TaskCanvasHeader-Name';
    const elementoTarjeta = document.querySelector(selectorTarjeta);

    if (!elementoTarjeta) {
      originals.error(`[Detector] Error: No se pudo encontrar el elemento con el selector: "${selectorTarjeta}".`);
      return; // Detiene la ejecución si no se encuentra el elemento
    }
    const nombreTarjeta = elementoTarjeta.innerText.trim();
    originals.info(`[Detector] Nombre de tarjeta capturado: "${nombreTarjeta}"`);

    // --- 3️⃣ Preparar el objeto que irá al localStorage ---
    const nuevoObjeto = {
      nombre: nombreTarjeta,
      usarStorage: false,
      actualizar: true
    };

    // --- 4️⃣ Manejo del localStorage ---
    const storageKey = "cola_relojes_twilio";
    try {
      // Leer el valor actual o inicializar un array vacío
      const datosActualesRaw = localStorage.getItem(storageKey);
      let datosActuales = datosActualesRaw ? JSON.parse(datosActualesRaw) : [];

      // Asegurarse de que es un array para evitar errores
      if (!Array.isArray(datosActuales)) {
          originals.warn(`[Detector] El valor en localStorage para "${storageKey}" no era un array. Se reiniciará.`);
          datosActuales = [];
      }

      // Agregar el nuevo objeto al array
      datosActuales.push(nuevoObjeto);

      // Guardar el array actualizado de nuevo en localStorage
      localStorage.setItem(storageKey, JSON.stringify(datosActuales));

      originals.info(`[Detector] ✅ Objeto guardado exitosamente en "${storageKey}". Total de elementos: ${datosActuales.length}`);
    } catch (e) {
      originals.error(`[Detector] Error al manipular localStorage:`, e);
    }
  }

  // Normaliza un argumento para la búsqueda
  function normalizeArg(a) {
    if (typeof a === 'string') {
      return a.replace(/%[cdfiosOxX%]/g, '').replace(/%c/g, '').replace(/\s+/g, ' ').trim();
    }
    try { return JSON.stringify(a); }
    catch (e) { return String(a); }
  }

  // Construye el mensaje final a partir de los argumentos de console
  function buildMessage(args) {
    return args.map(normalizeArg).join(' ').replace(/\s+/g, ' ').trim();
  }

  // Comprobación y disparo
  function checkAndTrigger(args) {
    const msg = buildMessage(args);
    const normTrigger = triggerText.replace(/\s+/g, ' ').trim();
    const matched = strictMatch ? (msg === normTrigger) : (msg.includes(normTrigger));
    
    if (matched) {
      // --- AQUÍ SE EJECUTA LA ACCIÓN PRINCIPAL ---
      guardarTarjetaEnStorage();
      // -------------------------------------------
    }
  }

  // Reemplazamos métodos de consola para interceptar los mensajes
  ['log', 'info', 'warn', 'error'].forEach(method => {
    console[method] = function(...args) {
      originals[method](...args); // Mantiene la salida original en consola
      try {
        checkAndTrigger(args); // Comprueba si el mensaje activa el disparador
      } catch (e) {
        originals.error('[Detector] Error interno:', e);
      }
    };
  });

  // Función para restaurar la consola si es necesario
  window.restoreConsoleDetector = function() {
    ['log', 'info', 'warn', 'error'].forEach(m => (console[m] = originals[m]));
    originals.info('[Detector] Consola restaurada a su estado original.');
  };

  originals.info('[Detector] Iniciado. Esperando el texto ->', triggerText);
})();