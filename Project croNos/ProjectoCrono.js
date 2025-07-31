(function () {
    const cronometrosMap = new Map();

    function iniciarCronometro(tarjeta, contenedor) {
        const reloj = document.createElement('div');
        reloj.className = 'custom-crono-line';
        reloj.style.fontSize = '13px';
        reloj.style.color = '#e26c00';
        reloj.style.marginTop = '4px';
        reloj.style.fontFamily = 'monospace';
        reloj.textContent = '⏱ 00:00';
        contenedor.appendChild(reloj);

        let segundos = 0;
        function actualizar() {
            segundos++;
            const hrs = String(Math.floor(segundos / 3600)).padStart(2, '0');
            const mins = String(Math.floor((segundos % 3600) / 60)).padStart(2, '0');
            const secs = String(segundos % 60).padStart(2, '0');
            reloj.textContent = `⏱ ${mins}:${secs}`;
        }

        const intervalo = setInterval(actualizar, 1000);

        cronometrosMap.set(tarjeta, { reloj, intervalo, reset: () => { segundos = 0; } });
    }

    function agregarCronometrosATarjetas() {
        const tarjetas = document.querySelectorAll('.Twilio-TaskListBaseItem');

        tarjetas.forEach(tarjeta => {
            if (cronometrosMap.has(tarjeta)) return;

            const contenedor = tarjeta.querySelector('.Twilio-TaskListBaseItem-Content');
            if (!contenedor) return;

            tarjeta.style.height = 'auto';
            tarjeta.style.overflow = 'visible';

            iniciarCronometro(tarjeta, contenedor);
        });
    }

    // Detectar nuevos mensajes enviados por el agente (basado en nombre de usuario diferente al cliente)
    function observarMensajesDeAgente() {
        const chatContainer = document.querySelector('[data-testid="ChatTranscript"]') || document.body;

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(nodo => {
                    if (!(nodo instanceof HTMLElement)) return;

                    const bubble = nodo.querySelector?.('[data-testid="MenuListItem-BubbleContainer"]');
                    if (!bubble) return;

                    const nombre = bubble.querySelector('[data-testid="message-sendername"]')?.textContent?.trim();

                    if (nombre && !nombre.toLowerCase().includes("whatsapp") && nombre.length > 1) {
                        // Reiniciar cronómetros si el mensaje es de un agente
                        cronometrosMap.forEach(({ reset }) => reset());
                    }
                });
            });
        });

        observer.observe(chatContainer, {
            childList: true,
            subtree: true
        });
    }

    function iniciar() {
        if (document.readyState === 'complete') {
            agregarCronometrosATarjetas();
            observarMensajesDeAgente();
            setInterval(agregarCronometrosATarjetas, 2000);
        } else {
            setTimeout(iniciar, 500);
        }
    }

    iniciar();
})();
