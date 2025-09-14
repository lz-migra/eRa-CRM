// 🧠 PROCESADOR DE RELOJES PARA TARJETAS DE TWILIO (VERSIÓN FINAL)

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

        // Lógica para decidir si continuar o no
        if (reloj && !actualizar) {
            console.log(`La tarjeta "${nombre}" ya tiene reloj y no se solicitó actualizar.`);
            return;
        }

        let horaParaMostrar = null;
        if (usarStorage) {
            try {
                const tarjetasGuardadas = JSON.parse(localStorage.getItem(TARJETAS_GUARDADAS_KEY) || '[]');
                const tarjetaEncontrada = tarjetasGuardadas.find(t => t.nombre === nombre);
                if (tarjetaEncontrada) {
                    horaParaMostrar = tarjetaEncontrada.reloj;
                    console.log(`Usando hora guardada en LocalStorage para la tarjeta "${nombre}".`);
                } else {
                    console.log(`No se encontró la hora guardada para la tarjeta "${nombre}". Generando hora actual.`);
                }
            } catch (e) {
                console.error("🚨 Error al leer de LocalStorage para restaurar la hora.", e);
            }
        }
        
        // Si no se encontró en storage o no se solicitó usarlo, genera la hora actual
        if (!horaParaMostrar) {
            const ahora = new Date();
            horaParaMostrar = `🕒 ${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}:${String(ahora.getSeconds()).padStart(2, '0')}`;
            if (reloj) {
                console.log(`Actualizado la hora de la tarjeta "${nombre}".`);
            } else {
                console.log(`Generando reloj con la hora actual para la tarjeta "${nombre}".`);
            }
        }

        // --- Mantiene la forma de montar/actualizar el DOM ---
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
            console.error("🚨 Error al parsear la cola. Limpiando...", e);
            localStorage.setItem(COLA_SOLICITUDES_KEY, '[]');
            return;
        }

        if (cola.length === 0) return;
        
        const solicitudActual = cola.shift();
        procesarSolicitudDeReloj(solicitudActual);
        localStorage.setItem(COLA_SOLICITUDES_KEY, JSON.stringify(cola));
    }, 200);

    console.log("🚀 Procesador de relojes (v2) para Twilio iniciado.");
})();