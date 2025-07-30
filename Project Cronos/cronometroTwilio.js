
(function () {
    // --- CONFIGURACIÓN CENTRALIZADA ---
    const config = {
        selectorTarjeta: '.Twilio-TaskListBaseItem',
        selectorHeaderActivo: '.Twilio-TaskCanvasHeader h4 span',
        selectorContenedorCrono: '.Twilio-TaskListBaseItem-Content',
        selectorChatContainer: '[data-testid="ChatTranscript"]',
        selectorMensajeAgente: '.Twilio-MessageBubble-UserName',
        selectorListaDeTareas: '.Twilio-TaskList'
    };

    const cronometrosMap = new Map();

    function formatearTiempo(totalSegundos) {
        const segundos = Math.floor(totalSegundos);
        const mins = String(Math.floor(segundos / 60)).padStart(2, '0');
        const secs = String(segundos % 60).padStart(2, '0');
        return `⏱ ${mins}:${secs}`;
    }

    function detenerYLimpiarCronometro(tarjeta) {
        if (cronometrosMap.has(tarjeta)) {
            const crono = cronometrosMap.get(tarjeta);
            clearInterval(crono.intervalo);
            crono.reloj.remove();
            cronometrosMap.delete(tarjeta);

            // Opcional: Revertir los estilos de la tarjeta si es necesario,
            // aunque 'auto' y 'visible' rara vez causan problemas al quitar el elemento.
            // tarjeta.style.height = ''; // O a su valor original si lo conoces
            // tarjeta.style.overflow = ''; // O a su valor original
        }
    }

    function iniciarCronometro(tarjeta) {
        if (cronometrosMap.has(tarjeta)) return;

        const contenedor = tarjeta.querySelector(config.selectorContenedorCrono);
        if (!contenedor) return;

        // --- INICIO DE LAS MODIFICACIONES PARA EL AJUSTE DE LA TARJETA ---
        // Asegurarse de que la tarjeta principal se ajuste a su contenido
        tarjeta.style.height = 'auto';
    

        // Asegurarse de que el contenedor directo del cronómetro también se ajuste
        // y no tenga reglas de overflow que recorten el contenido
        if (contenedor) {
            contenedor.style.height = 'auto';
        }
        // --- FIN DE LAS MODIFICACIONES PARA EL AJUSTE DE LA TARJETA ---


        const reloj = document.createElement('div');
        reloj.className = 'custom-crono-line';
        Object.assign(reloj.style, {
            fontSize: '13px',
            color: '#e26c00', // El color naranja/marrón de tu imagen
            marginTop: '4px',
            fontFamily: 'monospace',
            display: 'block', // Asegura que tome su propia línea
            whiteSpace: 'nowrap', // Evita que el texto del cronómetro se divida
            paddingBottom: '5px' // Añade un pequeño relleno para mejorar la separación visual
        });

        reloj.textContent = '⏱ 00:00';
        contenedor.appendChild(reloj);

        let startTime = Date.now();

        const intervalo = setInterval(() => {
            const segundosTranscurridos = (Date.now() - startTime) / 1000;
            reloj.textContent = formatearTiempo(segundosTranscurridos);
        }, 1000);

        cronometrosMap.set(tarjeta, {
            reloj,
            intervalo,
            lastFingerprint: null,
            reset: () => {
                startTime = Date.now();
                reloj.textContent = formatearTiempo(0);
            }
        });
    }


    function esTarjetaActiva(tarjeta) {
        const headerTitulo = document.querySelector(config.selectorHeaderActivo)?.textContent?.trim();
        if (!headerTitulo) return false;

        const tarjetaTitulo = tarjeta.querySelector('h4 span')?.textContent?.trim();
        if (!tarjetaTitulo) return false;

        // Modificación para hacer la comparación más robusta
        // A veces el título del header puede contener más información que el título de la tarjeta
        // Por ejemplo: "WA-IN | | MX | +52156193562..." vs "+52156193562..."
        // Buscar si el título de la tarjeta está contenido en el título del header.
        return headerTitulo.includes(tarjetaTitulo);
    }

    function obtenerTarjetaActiva() {
        const todasLasTarjetas = document.querySelectorAll(config.selectorTarjeta);
        for (const tarjeta of todasLasTarjetas) {
            if (esTarjetaActiva(tarjeta)) {
                return tarjeta;
            }
        }
        return null;
    }

    function observarMensajesDeAgente() {
        // Usa `document.body` como fallback más robusto si el chatContainer no se encuentra inicialmente
        const chatContainer = document.querySelector(config.selectorChatContainer) || document.body;
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                // Solo nos interesan los nodos añadidos
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        // Asegurarse de que el nodo es un elemento y no un nodo de texto, y que tiene querySelector
                        if (node.nodeType !== 1 || !node.querySelector) continue;

                        const agenteEl = node.querySelector(config.selectorMensajeAgente);
                        if (!agenteEl) continue; // No es un mensaje de agente

                        const tarjetaActiva = obtenerTarjetaActiva();
                        if (!tarjetaActiva || !cronometrosMap.has(tarjetaActiva)) return;

                        const timeEl = node.querySelector('.Twilio-MessageBubble-Time');
                        const bodyEl = node.querySelector('[data-testid="message-body"]'); // Asegúrate que este selector es correcto
                        const ts = timeEl?.textContent?.trim() || '';
                        const body = bodyEl?.textContent?.trim() || '';
                        const fingerprint = `${ts} | ${body}`;

                        const crono = cronometrosMap.get(tarjetaActiva);

                        // Si el mensaje es diferente al último registrado para esta tarjeta activa
                        if (crono.lastFingerprint !== fingerprint) {
                            crono.lastFingerprint = fingerprint;
                            crono.reset(); // Reinicia el cronómetro
                        }
                        // No es necesario 'return' aquí, porque queremos seguir procesando otros 'addedNodes' si los hay
                    }
                }
            }
        });
        observer.observe(chatContainer, { childList: true, subtree: true });
        console.log('Observador de mensajes de agente iniciado.');
    }

    function observarCambiosEnTarjetas() {
        const listaDeTareas = document.querySelector(config.selectorListaDeTareas);
        if (!listaDeTareas) {
            console.error('No se pudo encontrar el contenedor de la lista de tareas. Se usará polling como respaldo.');
            // Fallback: Si no se puede observar la lista, se hace un polling para iniciar cronómetros
            setInterval(() => {
                document.querySelectorAll(config.selectorTarjeta).forEach(tarjeta => {
                    if (!cronometrosMap.has(tarjeta)) { // Solo iniciar si no tiene cronómetro
                        iniciarCronometro(tarjeta);
                    }
                });
            }, 2000);
            return;
        }

        // Iniciar cronómetros para las tarjetas que ya existen al cargar
        listaDeTareas.querySelectorAll(config.selectorTarjeta).forEach(iniciarCronometro);

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    // Solo si el nodo añadido es una tarjeta
                    if (node.nodeType === 1 && node.matches(config.selectorTarjeta)) {
                        iniciarCronometro(node);
                    }
                });
                mutation.removedNodes.forEach(node => {
                    // Solo si el nodo eliminado es una tarjeta
                    if (node.nodeType === 1 && node.matches(config.selectorTarjeta)) {
                        detenerYLimpiarCronometro(node);
                    }
                });
            });
        });
        observer.observe(listaDeTareas, { childList: true });
        console.log('Observador de cambios en tarjetas iniciado.');
    }

    function iniciar() {
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', iniciar);
            return;
        }
        
        // Iniciar observadores
        observarCambiosEnTarjetas();
        observarMensajesDeAgente();
        console.log('Sistema de cronómetros de agente iniciado.');
    }

    // Llamar a la función de inicio
    iniciar();
})();