
(function () {
    // --- CONFIGURACIÓN CENTRALIZADA ---
    const config = {
        selectorTarjeta: '.Twilio-TaskListBaseItem',
        selectorHeaderActivo: '.Twilio-TaskCanvasHeader h4 span',
        selectorContenedorCrono: '.Twilio-TaskListBaseItem-Content',
        selectorChatContainer: '[data-testid="ChatTranscript"]',
        // Selector que identifica un mensaje como enviado por un agente.
        selectorMensajeAgente: '.Twilio-MessageBubble-UserName',
        selectorListaDeTareas: '.Twilio-TaskList'
    };

    // Mapa para almacenar los cronómetros asociados a cada tarjeta.
    const cronometrosMap = new Map();

    /**
     * Convierte un número de segundos en un formato hh:mm:ss.
     * @param {number} totalSegundos - El total de segundos a formatear.
     * @returns {string} El tiempo formateado.
     */
    function formatearTiempo(totalSegundos) {
        const segundos = Math.floor(totalSegundos);
        const hrs = String(Math.floor(segundos / 3600)).padStart(2, '0');
        const mins = String(Math.floor((segundos % 3600) / 60)).padStart(2, '0');
        const secs = String(segundos % 60).padStart(2, '0');
        return `⏱ ${hrs}:${mins}:${secs}`;
    }

    /**
     * Detiene el intervalo, elimina el elemento del DOM y limpia la referencia del mapa.
     * @param {HTMLElement} tarjeta - El elemento de la tarjeta a limpiar.
     */
    function detenerYLimpiarCronometro(tarjeta) {
        if (cronometrosMap.has(tarjeta)) {
            const crono = cronometrosMap.get(tarjeta);
            clearInterval(crono.intervalo);
            crono.reloj.remove();
            cronometrosMap.delete(tarjeta);
        }
    }

    /**
     * Crea e inicia un nuevo cronómetro para una tarjeta específica.
     * @param {HTMLElement} tarjeta - El elemento de la tarjeta.
     */
    function iniciarCronometro(tarjeta) {
        if (cronometrosMap.has(tarjeta)) return;

        const contenedor = tarjeta.querySelector(config.selectorContenedorCrono);
        if (!contenedor) return;

        const reloj = document.createElement('div');
        reloj.className = 'custom-crono-line';
        Object.assign(reloj.style, {
            fontSize: '13px',
            color: '#e26c00',
            marginTop: '4px',
            fontFamily: 'monospace'
        });
        
        contenedor.style.paddingBottom = '20px';

        let startTime = Date.now();
        reloj.textContent = formatearTiempo(0);
        contenedor.appendChild(reloj);

        const intervalo = setInterval(() => {
            const segundosTranscurridos = (Date.now() - startTime) / 1000;
            reloj.textContent = formatearTiempo(segundosTranscurridos);
        }, 1000);

        cronometrosMap.set(tarjeta, {
            reloj,
            intervalo,
            reset: () => {
                startTime = Date.now();
                reloj.textContent = formatearTiempo(0);
            },
        });
    }

    /**
     * Verifica si una tarjeta es la activa comparando su título con el del encabezado.
     * @param {HTMLElement} tarjeta - La tarjeta a verificar.
     * @returns {boolean} - True si la tarjeta es la activa.
     */
    function esTarjetaActiva(tarjeta) {
        const headerTitulo = document.querySelector(config.selectorHeaderActivo)?.textContent?.trim();
        if (!headerTitulo) return false;

        const tarjetaTitulo = tarjeta.querySelector('h4 span')?.textContent?.trim();
        if (!tarjetaTitulo) return false;

        return headerTitulo.includes(tarjetaTitulo);
    }

    /**
     * Busca en el DOM y devuelve el elemento de la tarjeta activa.
     * @returns {HTMLElement|null} - El elemento de la tarjeta activa o null.
     */
    function obtenerTarjetaActiva() {
        const todasLasTarjetas = document.querySelectorAll(config.selectorTarjeta);
        for (const tarjeta of todasLasTarjetas) {
            if (esTarjetaActiva(tarjeta)) {
                return tarjeta;
            }
        }
        return null;
    }

    /**
     * Observa el contenedor de chat por nuevos mensajes del agente para reiniciar el cronómetro.
     */
    function observarMensajesDeAgente() {
        const chatContainer = document.querySelector(config.selectorChatContainer) || document.body;
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.querySelector && node.querySelector(config.selectorMensajeAgente)) {
                        const tarjetaActiva = obtenerTarjetaActiva();
                        if (tarjetaActiva && cronometrosMap.has(tarjetaActiva)) {
                            cronometrosMap.get(tarjetaActiva).reset();
                        }
                        return; // Salimos después de encontrar un mensaje.
                    }
                }
            }
        });
        observer.observe(chatContainer, { childList: true, subtree: true });
    }

    /**
     * Observa la lista de tareas para añadir o quitar cronómetros dinámicamente.
     */
    function observarCambiosEnTarjetas() {
        const listaDeTareas = document.querySelector(config.selectorListaDeTareas);
        if (!listaDeTareas) {
            console.error('No se pudo encontrar el contenedor de la lista de tareas. Se usará polling como respaldo.');
            setInterval(() => document.querySelectorAll(config.selectorTarjeta).forEach(iniciarCronometro), 2000);
            return;
        }

        listaDeTareas.querySelectorAll(config.selectorTarjeta).forEach(iniciarCronometro);
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => node.matches && node.matches(config.selectorTarjeta) && iniciarCronometro(node));
                mutation.removedNodes.forEach(node => node.matches && node.matches(config.selectorTarjeta) && detenerYLimpiarCronometro(node));
            });
        });
        observer.observe(listaDeTareas, { childList: true });
    }

    /**
     * Función principal para arrancar el sistema.
     */
    function iniciar() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', iniciar);
            return;
        }
        observarCambiosEnTarjetas();
        observarMensajesDeAgente();
        console.log('Sistema de cronómetros de agente iniciado.');
    }

    iniciar();
})();