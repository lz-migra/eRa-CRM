// 🧠 PROCESADOR DE RELOJES PARA TARJETAS DE TWILIO (VERSIÓN FINAL, CON CONSOLAS BONITAS Y COMPARACIÓN ROBUSTA)

(function () {
    const COLA_SOLICITUDES_KEY = 'cola_relojes_twilio';
    const TARJETAS_GUARDADAS_KEY = 'tarjetas_guardadas';

    function procesarSolicitudDeReloj({ nombre, actualizar = false, usarStorage = false }) {
        const selectorTarjetas = '.Twilio-TaskListBaseItem';
        if (!nombre) return;

        // --- SECCIÓN MODIFICADA ---
        const tarjetaObjetivo = Array.from(document.querySelectorAll(selectorTarjetas)).find(tarjeta => {
            const nombreDOM = tarjeta.querySelector('[data-testid="task-item-first-line"] span')?.textContent;
            if (!nombreDOM) return false;

            // Normalizamos ambas cadenas para ignorar diferencias en espacios en blanco.
            // La expresión regular /\s+/g reemplaza cualquier tipo de espacio (incluido &nbsp;)
            // por un único espacio normal, haciendo la comparación fiable.
            const nombreNormalizadoDOM = nombreDOM.replace(/\s+/g, ' ').trim();
            const nombreNormalizadoSolicitud = nombre.replace(/\s+/g, ' ').trim();

            return nombreNormalizadoDOM === nombreNormalizadoSolicitud;
        });
        // --- FIN DE LA SECCIÓN MODIFICADA ---

        if (!tarjetaObjetivo) return;

        const contenedor = tarjetaObjetivo.querySelector('.Twilio-TaskListBaseItem-Content');
        if (!contenedor) return;

        let reloj = tarjetaObjetivo.querySelector('.custom-crono-line');

        // ✅ REGLA #1: Si el reloj ya existe y NO se pide actualizar, no hacemos nada.
        if (reloj && !actualizar) {
            console.log(`%c⏱ La tarjeta "${nombre}" ya tiene reloj y no se solicitó actualizar.`, 'color: #ffa500; font-weight: bold;');
            return;
        }

        let horaParaMostrar = null;

        // ✅ REGLA #2: Si se pide ACTUALIZAR, siempre generamos la hora actual.
        // Esto tiene prioridad sobre `usarStorage`.
        if (actualizar) {
            const ahora = new Date();
            horaParaMostrar = `🕒 ${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}:${String(ahora.getSeconds()).padStart(2, '0')}`;
            console.log(`%c🔄 Actualizando la hora de "${nombre}" a ${horaParaMostrar}`, 'color: #ffa500; font-weight: bold;');
        
        // ✅ REGLA #3: Si NO se actualiza, pero SÍ se permite usar storage (y no hay reloj).
        } else if (usarStorage) { 
            try {
                const tarjetasGuardadas = JSON.parse(localStorage.getItem(TARJETAS_GUARDADAS_KEY) || '[]');
                const tarjetaEncontrada = tarjetasGuardadas.find(t => t.nombre === nombre);
                if (tarjetaEncontrada) {
                    horaParaMostrar = tarjetaEncontrada.reloj;
                    console.log(`%c💾 Usando hora guardada en LocalStorage para "${nombre}": ${horaParaMostrar}`, 'color: #00bfff; font-weight: bold;');
                }
            } catch (e) {
                console.error("%c🚨 Error al leer de LocalStorage para restaurar la hora:", 'color: red; font-weight: bold;', e);
            }
        }

        // ✅ REGLA #4: FALLBACK. Si después de lo anterior aún no tenemos hora, generamos la actual.
        // Esto cubre los casos de creación de un reloj nuevo cuando `usarStorage` es false o no se encontró nada.
        if (!horaParaMostrar) {
            const ahora = new Date();
            horaParaMostrar = `🕒 ${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}:${String(ahora.getSeconds()).padStart(2, '0')}`;
            
            // Solo mostramos el mensaje de "Generando" si realmente es un reloj nuevo.
            // El de "Actualizando" ya se mostró arriba.
            if (!reloj) {
                console.log(`%c✨ Generando reloj para "${nombre}": ${horaParaMostrar}`, 'color: #32cd32; font-weight: bold;');
            }
        }

        // --- Monta o actualiza el DOM del reloj (esta parte no necesita cambios) ---
        if (!reloj) {
            reloj = document.createElement('div');
            reloj.className = 'custom-crono-line';
            Object.assign(reloj.style, {
                fontSize: '13px', color: '#a8a095', marginTop: '3px', fontFamily: 'inherit'
            });
            tarjetaObjetivo.style.height = '70px';
            tarjetaObjetivo.style.overflow = 'visible';
            contenedor.appendChild(reloj);
        }

        let timestampSpan = reloj.querySelector('.custom-crono-timestamp');
        if (!timestampSpan) {
            timestampSpan = document.createElement('span');
            timestampSpan.className = 'custom-crono-timestamp';
            reloj.prepend(timestampSpan);
        }

        timestampSpan.textContent = horaParaMostrar;
    }

    setInterval(() => {
        let cola = [];
        try {
            cola = JSON.parse(localStorage.getItem(COLA_SOLICITUDES_KEY) || '[]');
        } catch (e) {
            console.error("%c🚨 Error al parsear la cola. Limpiando...", 'color: red; font-weight: bold;', e);
            localStorage.setItem(COLA_SOLICITUDES_KEY, '[]');
            return;
        }

        if (cola.length === 0) return;
        
        const solicitudActual = cola.shift();
        procesarSolicitudDeReloj(solicitudActual);
        localStorage.setItem(COLA_SOLICITUDES_KEY, JSON.stringify(cola));
    }, 200);

    console.log("%c🚀 Procesador de relojes (v2) para Twilio iniciado.", 'color: #32cd32; font-weight: bold; font-size: 12px;');
})();