// 🧠 ESTE SCRIPT PROCESA UNA COLA DE SOLICITUDES DESDE LOCALSTORAGE PARA AGREGAR RELOJES A TARJETAS DE TWILIO.

(function () {
    // --- Claves para el LocalStorage ---
    const COLA_SOLICITUDES_KEY = 'cola_relojes_twilio'; // Clave para la lista de tareas pendientes.
    const TARJETAS_GUARDADAS_KEY = 'tarjetas_guardadas'; // Clave donde se guardan las horas para reutilizar.

    /**
     * Busca una tarjeta visible por su nombre y le agrega o actualiza un reloj.
     * @param {object} solicitud - El objeto de la solicitud.
     * @param {string} solicitud.nombre - Nombre visible de la tarjeta a modificar.
     * @param {boolean} [solicitud.actualizar=false] - Si ya tiene reloj, ¿debe reemplazarlo?
     * @param {boolean} [solicitud.usarStorage=false] - ¿Debe buscar la hora guardada en localStorage?
     */
    function procesarSolicitudDeReloj({ nombre, actualizar = false, usarStorage = false }) {
        const selectorTarjetas = '.Twilio-TaskListBaseItem';

        if (!nombre) {
            console.warn("⚠️ Solicitud inválida: no se proporcionó un nombre de tarjeta.");
            return;
        }

        // Busca la tarjeta visible que coincida con el nombre
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

        const relojExistente = tarjetaObjetivo.querySelector('.custom-crono-line');
        if (relojExistente && !actualizar) {
            console.log(`⏱️ La tarjeta "${nombre}" ya tiene reloj y no se solicitó actualizar.`);
            return;
        }

        if (relojExistente && actualizar) {
            contenedor.removeChild(relojExistente);
            console.log(`🔄 Actualizando reloj de la tarjeta "${nombre}"`);
        }

        // Crear el elemento del reloj
        const reloj = document.createElement('div');
        reloj.className = 'custom-crono-line';
        Object.assign(reloj.style, {
            fontSize: '13px',
            color: '#a8a095',
            marginTop: '3px',
            fontFamily: 'inherit',
        });

        // Obtener la hora a mostrar
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

        reloj.textContent = horaParaMostrar;
        
        tarjetaObjetivo.style.height = '70px';
        tarjetaObjetivo.style.overflow = 'visible';

        contenedor.appendChild(reloj);
        console.log(`✅ Reloj agregado correctamente a la tarjeta "${nombre}"`);
    }


    // --- Bucle principal de procesamiento ---
    // Se ejecuta cada 200ms para verificar si hay nuevas solicitudes en la cola.
    setInterval(() => {
        let cola = [];
        try {
            // Intenta obtener la cola de solicitudes del localStorage
            cola = JSON.parse(localStorage.getItem(COLA_SOLICITUDES_KEY) || '[]');
        } catch (e) {
            console.error("🚨 Error al parsear la cola de solicitudes. Limpiando...", e);
            localStorage.setItem(COLA_SOLICITUDES_KEY, '[]');
            return;
        }

        // Si no hay nada que hacer, termina la ejecución actual.
        if (cola.length === 0) {
            return;
        }

        // Toma la primera solicitud de la cola (la más antigua).
        const solicitudActual = cola.shift();

        // Procesa la solicitud.
        console.log(`⚙️ Procesando solicitud para: "${solicitudActual.nombre}"`);
        procesarSolicitudDeReloj(solicitudActual);

        // Actualiza el localStorage eliminando la solicitud que ya se procesó.
        localStorage.setItem(COLA_SOLICITUDES_KEY, JSON.stringify(cola));

    }, 200);

    console.log("🚀 Procesador de relojes para Twilio iniciado. Escuchando solicitudes en localStorage...");


})();
