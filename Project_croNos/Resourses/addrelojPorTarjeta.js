(function () {
    const relojesMap = new Map(); // 🗺️ Evita duplicar relojes
    const STORAGE_KEY = 'tarjetas_guardadas'; // 🔐 Clave en localStorage

    // 🔍 Buscar si hay una hora guardada en localStorage para esa tarjeta
    function obtenerHoraGuardada(nombreTarjeta) {
        try {
            const tarjetas = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const encontrada = tarjetas.find(t => t.nombre === nombreTarjeta);
            return encontrada?.reloj || null;
        } catch (e) {
            return null;
        }
    }

    // 🕒 Agrega un reloj estático a la tarjeta
    function agregarRelojEstatico(tarjeta, contenedor) {
        const reloj = document.createElement('div');
        reloj.className = 'custom-crono-line';
        reloj.style.fontSize = '13px';
        reloj.style.color = '#0066cc';
        reloj.style.marginTop = '4px';
        reloj.style.fontFamily = 'monospace';

        const nombreTarjeta = tarjeta.querySelector('[data-testid="task-item-first-line"] span')?.textContent?.trim() || '🆔 Desconocido';

        console.log(`📥 Nueva tarjeta encontrada: "${nombreTarjeta}"`);

        let horaParaMostrar = obtenerHoraGuardada(nombreTarjeta);

        if (!horaParaMostrar) {
            // 🆕 No hay hora previa, usamos la del sistema
            const ahora = new Date();
            const hrs = String(ahora.getHours()).padStart(2, '0');
            const mins = String(ahora.getMinutes()).padStart(2, '0');
            const secs = String(ahora.getSeconds()).padStart(2, '0');
            horaParaMostrar = `🕒 ${hrs}:${mins}:${secs}`;

            console.warn(`⚠️ No se encontró la tarjeta "${nombreTarjeta}" en localStorage. Generando nuevo reloj.`);
        } else {
            console.log(`✅ Se encontró la tarjeta "${nombreTarjeta}" en localStorage. Usando hora guardada.`);
        }

        reloj.textContent = horaParaMostrar;
        contenedor.appendChild(reloj);
        relojesMap.set(tarjeta, reloj);
    }

    // 🔄 Recorre todas las tarjetas visibles y les agrega reloj si no lo tienen
    function agregarRelojesATarjetas() {
        const tarjetas = document.querySelectorAll('.Twilio-TaskListBaseItem');

        tarjetas.forEach(tarjeta => {
            if (relojesMap.has(tarjeta)) return;

            const contenedor = tarjeta.querySelector('.Twilio-TaskListBaseItem-Content');
            if (!contenedor) return;

            tarjeta.style.height = 'auto';
            tarjeta.style.overflow = 'visible';

            agregarRelojEstatico(tarjeta, contenedor);
        });
    }

    // 🚀 Arranque del script
    function iniciar() {
        if (document.readyState === 'complete') {
            agregarRelojesATarjetas();
            setInterval(agregarRelojesATarjetas, 2000); // 🔁 Revisa periódicamente nuevas tarjetas
        } else {
            setTimeout(iniciar, 500); // ⏱️ Espera si aún no carga
        }
    }

    iniciar();
})();
