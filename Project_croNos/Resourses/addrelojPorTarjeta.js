(function () {
    const relojesMap = new Map(); // 🗺️ Mapa para evitar duplicar relojes en tarjetas
    const STORAGE_KEY = 'tarjetas_guardadas'; // 🔐 Clave usada en localStorage

    // 🔍 Buscar si hay una hora guardada en localStorage para una tarjeta específica
    function obtenerHoraGuardada(nombreTarjeta) {
        try {
            const tarjetas = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); // 📥 Cargar datos del almacenamiento
            const encontrada = tarjetas.find(t => t.nombre === nombreTarjeta);      // 🔎 Buscar por nombre
            return encontrada?.reloj || null; // ✅ Devolver hora si existe, si no, null
        } catch (e) {
            return null; // ❌ En caso de error, devolver null
        }
    }

    // 🕒 Agregar reloj estático a una tarjeta
    function agregarRelojEstatico(tarjeta, contenedor) {
        const reloj = document.createElement('div'); // 🧱 Crear elemento visual
        reloj.className = 'custom-crono-line';
        reloj.style.fontSize = '13px';
        reloj.style.color = '#0066cc';
        reloj.style.marginTop = '4px';
        reloj.style.fontFamily = 'monospace';

        // 🏷️ Extraer el nombre identificador de la tarjeta
        const nombreTarjeta = tarjeta.querySelector('[data-testid="task-item-first-line"] span')?.textContent?.trim();

        // 🔁 Ver si ya hay una hora guardada para esta tarjeta
        let horaParaMostrar = obtenerHoraGuardada(nombreTarjeta);

        // 🆕 Si no hay hora guardada, usar la hora actual del sistema
        if (!horaParaMostrar) {
            const ahora = new Date();
            const hrs = String(ahora.getHours()).padStart(2, '0');
            const mins = String(ahora.getMinutes()).padStart(2, '0');
            const secs = String(ahora.getSeconds()).padStart(2, '0');
            horaParaMostrar = `🕒 ${hrs}:${mins}:${secs}`; // 🕒 Formato de reloj
        }

        // 📌 Mostrar la hora en pantalla
        reloj.textContent = horaParaMostrar;
        contenedor.appendChild(reloj);

        // 💾 Registrar en el mapa local
        relojesMap.set(tarjeta, reloj);
    }

    // 🔄 Buscar todas las tarjetas visibles y agregar reloj si no lo tienen
    function agregarRelojesATarjetas() {
        const tarjetas = document.querySelectorAll('.Twilio-TaskListBaseItem'); // 🧱 Todas las tarjetas

        tarjetas.forEach(tarjeta => {
            if (relojesMap.has(tarjeta)) return; // 🛑 Ya tiene reloj, saltar

            const contenedor = tarjeta.querySelector('.Twilio-TaskListBaseItem-Content'); // 📦 Contenedor interno
            if (!contenedor) return; // ❌ No se encontró, salir

            // 🧰 Ajustes visuales por si se oculta el reloj
            tarjeta.style.height = 'auto';
            tarjeta.style.overflow = 'visible';

            // ⌚ Insertar el reloj en la tarjeta
            agregarRelojEstatico(tarjeta, contenedor);
        });
    }

    // 🚀 Iniciar todo una vez que la página esté lista
    function iniciar() {
        if (document.readyState === 'complete') {
            agregarRelojesATarjetas();                      // ➕ Agrega reloj a las tarjetas visibles
            setInterval(agregarRelojesATarjetas, 2000);     // 🔁 Revisa cada 2s por nuevas tarjetas
        } else {
            setTimeout(iniciar, 500); // ⏱️ Espera y vuelve a intentar si aún no carga
        }
    }

    iniciar(); // 🔁 Ejecuta el flujo
})();
