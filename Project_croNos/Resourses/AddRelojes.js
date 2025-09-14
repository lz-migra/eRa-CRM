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

    // Caso donde ya existe reloj y no se quiere actualizar
    if (reloj && !actualizar && !usarStorage) {
        console.log(`La tarjeta "${nombre}" ya tiene reloj y no se solicitó actualizar.`);
        return;
    }

    let horaParaMostrar = null;

    // Caso: usar hora guardada en LocalStorage
    if (usarStorage) {
        try {
            const tarjetasGuardadas = JSON.parse(localStorage.getItem(TARJETAS_GUARDADAS_KEY) || '[]');
            const tarjetaEncontrada = tarjetasGuardadas.find(t => t.nombre === nombre);
            if (tarjetaEncontrada) {
                horaParaMostrar = tarjetaEncontrada.reloj;
                console.log(`Usando hora guardada en LocalStorage para la tarjeta "${nombre}".`);
            } else {
                console.log(`No se encontró la hora guardada para la tarjeta "${nombre}".`);
            }
        } catch (e) {
            console.error("🚨 Error al leer de LocalStorage para restaurar la hora.", e);
        }
    }

    // Caso: generar hora actual (ya sea por actualización o por no usar storage)
    if (!horaParaMostrar) {
        const ahora = new Date();
        horaParaMostrar = `🕒 ${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}:${String(ahora.getSeconds()).padStart(2, '0')}`;

        if (reloj) {
            console.log(`Actualizado la hora de la tarjeta "${nombre}".`);
        } else {
            console.log(`Generando reloj con la hora actual para la tarjeta "${nombre}".`);
        }
    }

    // --- Crear o actualizar DOM ---
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
