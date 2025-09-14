// 🧠 PROCESADOR DE RELOJES PARA TARJETAS DE TWILIO (VERSIÓN FINAL, CON CONSOLAS BONITAS)

(function () {
    const COLA_SOLICITUDES_KEY = 'cola_relojes_twilio';
    const TARJETAS_GUARDADAS_KEY = 'tarjetas_guardadas';

    function procesarSolicitudDeReloj({ nombre, actualizar = false, usarStorage = false }) {
        const selectorTarjetas = '.Twilio-TaskListBaseItem';
        if (!nombre) return;

        const tarjetaObjetivo = Array.from(document.querySelectorAll(selectorTarjetas)).find(tarjeta => {
            const nombreDOM = tarjeta.querySelector('[data-testid="task-item-first-line"] span')?.textContent?.trim();
            return nombreDOM === nombre;
        });

        if (!tarjetaObjetivo) return;

        const contenedor = tarjetaObjetivo.querySelector('.Twilio-TaskListBaseItem-Content');
        if (!contenedor) return;

        let reloj = tarjetaObjetivo.querySelector('.custom-crono-line');

        // ⚠️ Revisar si ya existe reloj y no se pidió actualización
        if (reloj && !actualizar) {
            console.log(`%c⏱ La tarjeta "${nombre}" ya tiene reloj y no se solicitó actualizar.`, 'color: #ffa500; font-weight: bold;');
            return;
        }

        let horaParaMostrar = null;

        if (usarStorage) {
            try {
                const tarjetasGuardadas = JSON.parse(localStorage.getItem(TARJETAS_GUARDADAS_KEY) || '[]');
                const tarjetaEncontrada = tarjetasGuardadas.find(t => t.nombre === nombre);
                if (tarjetaEncontrada) {
                    horaParaMostrar = tarjetaEncontrada.reloj;
                    console.log(`%c💾 Usando hora guardada en LocalStorage para "${nombre}": ${horaParaMostrar}`, 'color: #00bfff; font-weight: bold;');
                } else {
                    console.log(`%c📝 No se encontró hora guardada para "${nombre}". Generando hora actual...`, 'color: #808080; font-style: italic;');
                }
            } catch (e) {
                console.error("%c🚨 Error al leer de LocalStorage para restaurar la hora:", 'color: red; font-weight: bold;', e);
            }
        }

        if (!horaParaMostrar) {
            const ahora = new Date();
            horaParaMostrar = `🕒 ${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}:${String(ahora.getSeconds()).padStart(2, '0')}`;

            if (reloj) {
                console.log(`%c🔄 Actualizando la hora de "${nombre}" a ${horaParaMostrar}`, 'color: #ffa500; font-weight: bold;');
            } else {
                console.log(`%c✨ Generando reloj para "${nombre}": ${horaParaMostrar}`, 'color: #32cd32; font-weight: bold;');
            }
        }

        // --- Monta o actualiza el DOM del reloj ---
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
