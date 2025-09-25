(function() {
    'use strict';

    // Creamos un objeto global 'overlay' para controlar el spinner
    window.overlay = (function() {
        let overlayEl; // referencia al overlay
        let spinnerEl;

        // Crear el overlay solo si no existe
        function crearOverlay() {
            if (overlayEl) return;

            overlayEl = document.createElement('div');
            overlayEl.id = 'custom-overlay';
            Object.assign(overlayEl.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.15)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: '9999',
                opacity: '0',
                transition: 'opacity 0.5s ease-in-out',
                pointerEvents: 'none' // evita bloquear clics cuando está oculto
            });

            // Spinner estilo clásico
            spinnerEl = document.createElement('div');
            Object.assign(spinnerEl.style, {
                width: '60px',
                height: '60px',
                border: '6px solid #ccc',
                borderTop: '6px solid #6b367f',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            });

            overlayEl.appendChild(spinnerEl);
            document.body.appendChild(overlayEl);

            // Animación CSS keyframes
            const styleTag = document.createElement('style');
            styleTag.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styleTag);
        }

        // Método para iniciar
        function iniciar() {
            crearOverlay();
            overlayEl.style.pointerEvents = 'auto';
            requestAnimationFrame(() => {
                overlayEl.style.opacity = '1';
            });
        }

        // Método para detener
        function detener() {
            if (!overlayEl) return;
            overlayEl.style.opacity = '0';
            overlayEl.style.pointerEvents = 'none';
        }

        // Retornamos los métodos públicos
        return {
            iniciar,
            detener
        };
    })();

})();
