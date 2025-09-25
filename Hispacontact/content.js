(function() {
    'use strict';

    const overlayId = 'iframePreloader';

    function createOverlay() {iframePreloader
        const prev = document.getElementById(overlayId);
        if (prev) prev.remove();
        const overlay = document.createElement('div');
        overlay.id = overlayId;
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            background: 'rgba(255,255,255,0.95)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: '9999'
        });
        const spinnerStyle = document.createElement('style');
        spinnerStyle.id = 'spinner-styles';
        spinnerStyle.textContent = `
            .loader-spinner { border: 6px solid #f3f3f3; border-top: 6px solid #6b367f;
                border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
        if (!document.getElementById('spinner-styles')) { document.head.appendChild(spinnerStyle); }
        const spinner = document.createElement('div');
        spinner.className = 'loader-spinner';
        overlay.appendChild(spinner);
        document.body.appendChild(overlay);
    }

    function injectCSS(iframe) {
        try {
            const doc = iframe.contentDocument;
            if (!doc || doc.getElementById('customInjectedCSS')) return;
            const style = doc.createElement('style');
            style.id = 'customInjectedCSS';
            
            // Utiliza chrome.runtime.getURL() para obtener la ruta correcta del archivo CSS dentro de la extensión
            // y luego usa @import para cargar el archivo.
            style.textContent = `@import url("${chrome.runtime.getURL('content.css')}");`;
            
            doc.head.appendChild(style);
        } catch (e) {
            console.warn('No se pudo inyectar CSS en el iframe:', e);
        }
    }

    function removeOverlay() {
        const overlay = document.getElementById(overlayId);
        if (overlay) {
            overlay.style.transition = 'opacity 0.3s ease';
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
    }

    function checkAndInjectSuccessPage() {
        const iframe = document.querySelector('#userHtmlFrame');
        if (!iframe) return;

        setTimeout(() => {
            const doc = iframe.contentDocument;
            if (!doc) return;

            const successButton = doc.querySelector('a.button');
            const isSuccessPage = successButton && successButton.textContent.includes('Regresar');

            if (isSuccessPage) {
                console.log('✅ Página de resultado detectada. Modificando HTML...');

                let messageText = 'Operación completada';
                const bodyText = doc.body.textContent.trim();
                const parts = bodyText.split('Regresar');

                if (parts.length > 0) {
                    messageText = parts[0].replace(/\s+/g, ' ').trim();
                }

                const isError = messageText.toLowerCase().includes('errada');
                const icon = isError ? '❌' : '✅';

                doc.body.innerHTML = '';
                doc.body.classList.add('success-page');
                const successContainer = doc.createElement('div');
                successContainer.className = 'success-container';
                if (isError) {
                    successContainer.classList.add('error-state');
                }

                successContainer.innerHTML = `
                    <div class="success-icon">${icon}</div>
                    <div class="success-message">${messageText}</div>
                    <a href="${successButton.href}" class="button">Regresar</a>
                `;
                doc.body.appendChild(successContainer);
            }
        }, 500);
    }

    createOverlay();

    document.addEventListener('DOMContentLoaded', () => {
        const submitButton = document.querySelector('input[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                console.log('Botón de envío clickeado. Creando overlay...');
                createOverlay();
            });
        }
    });

    const checkIframeInterval = setInterval(() => {
        const iframe = document.querySelector('#userHtmlFrame');
        if (iframe) {
            clearInterval(checkIframeInterval);
            const onIframeLoad = () => {
                console.log('✅ Iframe cargado. Inyectando CSS...');
                injectCSS(iframe);
                removeOverlay();
                checkAndInjectSuccessPage();
            };

            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                onIframeLoad();
            } else {
                iframe.addEventListener('load', onIframeLoad, { once: true });
            }
        }
    }, 200);

    setTimeout(() => removeOverlay(), 1000);

})();