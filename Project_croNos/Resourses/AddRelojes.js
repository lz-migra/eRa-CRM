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

        if (reloj && !actualizar) return;

        let horaParaMostrar = null;
        if (usarStorage) {
            // ... (lógica de storage sin cambios)
        }

        if (!horaParaMostrar) {
            const ahora = new Date();
            horaParaMostrar = `🕒 ${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}:${String(ahora.getSeconds()).padStart(2, '0')}`;
        }

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

        // --- ✨ MODIFICACIÓN CLAVE ---
        // Buscamos o creamos un span específico para la hora base.
        let timestampSpan = reloj.querySelector('.custom-crono-timestamp');
        if (!timestampSpan) {
            timestampSpan = document.createElement('span');
            timestampSpan.className = 'custom-crono-timestamp';
            // Usamos prepend para asegurarnos de que se inserte ANTES que el contador.
            reloj.prepend(timestampSpan);
        }

        // Actualizamos SOLAMENTE el contenido del span de la hora, sin tocar el resto.
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