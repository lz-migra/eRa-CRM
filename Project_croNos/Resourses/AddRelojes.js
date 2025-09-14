// 🧠 PROCESADOR DE RELOJES PARA TARJETAS DE TWILIO (VERSION OPTIMIZADA)

(function () {
    // --- Claves para el LocalStorage ---
    const COLA_SOLICITUDES_KEY = 'cola_relojes_twilio';
    const TARJETAS_GUARDADAS_KEY = 'tarjetas_guardadas';

    /**
     * Busca una tarjeta visible por su nombre y le agrega o actualiza un reloj.
     * @param {object} solicitud - Objeto de la solicitud.
     * @param {string} solicitud.nombre - Nombre visible de la tarjeta.
     * @param {boolean} [solicitud.actualizar=false] - Si ya tiene reloj, ¿debe actualizarlo?
     * @param {boolean} [solicitud.usarStorage=false] - Si debe usar hora guardada en localStorage.
     */
    function procesarSolicitudDeReloj({ nombre, actualizar = false, usarStorage = false }) {
        const selectorTarjetas = '.Twilio-TaskListBaseItem';

        if (!nombre) {
            console.warn("⚠️ Solicitud inválida: no se proporcionó un nombre de tarjeta.");
            return;
        }

        const tarjetaObjetivo = Array.from(document.querySelectorAll(selectorTarjetas)).find(tarjeta => {
            const nombreDOM = tarjeta.querySelector('[data-testid="task-item-first-line"] span')?.textContent?.trim();
            return nombreDOM === nombre;
        });

        if (!tarjetaObjetivo) {
            console.warn(`❌ No se encontró la tarjeta visible con nombre: "${nombre}"`);
            return;
        }

        const contenedor = tarjetaObjetivo.querySelector('.Twilio-TaskListBaseItem-Content');
        if (!contenedor) {
            console.warn("⚠️ No se encontró el contenedor interno para agregar el reloj.");
            return;
        }

        // --- Intentar obtener el reloj existente ---
        let reloj = tarjetaObjetivo.querySelector('.custom-crono-line');

        if (reloj && !actualizar) {
            console.log(`⏱️ La tarjeta "${nombre}" ya tiene reloj y no se solicitó actualizar.`);
            return;
        }

        // --- Si no existe o se solicita actualizar, crear o actualizar ---
        let horaParaMostrar = null;

        if (usarStorage) {
            try {
                const tarjetasGuardadas = JSON.parse(localStorage.getItem(TARJETAS_GUARDADAS_KEY) || '[]');
                const encontrada = tarjetasGuardadas.find(t => t.nombre === nombre);
                if (encontrada) {
                    horaParaMostrar = encontrada.reloj;
                    console.log(`✅ Usando hora guardada en localStorage para "${nombre}"`);
                }
            } catch (e) {
                console.warn("⚠️ Error al leer las tarjetas guardadas de localStorage.", e);
            }
        }

        if (!horaParaMostrar) {
            const ahora = new Date();
            const hrs = String(ahora.getHours()).padStart(2, '0');
            const mins = String(ahora.getMinutes()).padStart(2, '0');
            const secs = String(ahora.getSeconds()).padStart(2, '0');
            horaParaMostrar = `🕒 ${hrs}:${mins}:${secs}`;
            console.log(`🆕 Generando hora actual para "${nombre}": ${horaParaMostrar}`);
        }

        if (!reloj) {
            // Crear nuevo reloj si no existía
            reloj = document.createElement('div');
            reloj.className = 'custom-crono-line';
            Object.assign(reloj.style, {
                fontSize: '13px',
                color: '#a8a095',
                marginTop: '3px',
                fontFamily: 'inherit',
            });

            tarjetaObjetivo.style.height = '70px';
            tarjetaObjetivo.style.overflow = 'visible';
            contenedor.appendChild(reloj);
            console.log(`✅ Reloj agregado correctamente a la tarjeta "${nombre}"`);
        } else {
            console.log(`🔄 Reloj existente actualizado para la tarjeta "${nombre}"`);
        }

        // Actualiza el contenido del reloj
        reloj.textContent = horaParaMostrar;
    }

    // --- Bucle principal de procesamiento ---
    setInterval(() => {
        let cola = [];
        try {
            cola = JSON.parse(localStorage.getItem(COLA_SOLICITUDES_KEY) || '[]');
        } catch (e) {
            console.error("🚨 Error al parsear la cola de solicitudes. Limpiando...", e);
            localStorage.setItem(COLA_SOLICITUDES_KEY, '[]');
            return;
        }

        if (cola.length === 0) return;

        const solicitudActual = cola.shift();
        console.log(`⚙️ Procesando solicitud para: "${solicitudActual.nombre}"`);
        procesarSolicitudDeReloj(solicitudActual);

        localStorage.setItem(COLA_SOLICITUDES_KEY, JSON.stringify(cola));
    }, 200);

    console.log("🚀 Procesador de relojes para Twilio iniciado. Escuchando solicitudes en localStorage...");
})();
