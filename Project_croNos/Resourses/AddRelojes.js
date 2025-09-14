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
    let horaParaMostrar = null;

    // --- CASO 1 y 2: actualizar: true ---
    if (actualizar) {
        const ahora = new Date();
        horaParaMostrar = `🕒 ${String(ahora.getHours()).padStart(2,'0')}:${String(ahora.getMinutes()).padStart(2,'0')}:${String(ahora.getSeconds()).padStart(2,'0')}`;

        if (reloj) {
            console.log(`%c🔄 Actualizado la hora de la tarjeta "${nombre}" a ${horaParaMostrar}`, 'color: #ffa500; font-weight: bold;');
        } else {
            console.log(`%c✨ Generando reloj con la hora actual para la tarjeta "${nombre}": ${horaParaMostrar}`, 'color: #32cd32; font-weight: bold;');
        }
    } 
    // --- CASO 3: actualizar: false, storage: true ---
    else if (usarStorage) {
        try {
            const tarjetasGuardadas = JSON.parse(localStorage.getItem(TARJETAS_GUARDADAS_KEY) || '[]');
            const tarjetaEncontrada = tarjetasGuardadas.find(t => t.nombre === nombre);
            if (!reloj) {
                if (tarjetaEncontrada) {
                    horaParaMostrar = tarjetaEncontrada.reloj;
                    console.log(`%c💾 Usando hora guardada en LocalStorage para la tarjeta "${nombre}": ${horaParaMostrar}`, 'color: #00bfff; font-weight: bold;');
                } else {
                    const ahora = new Date();
                    horaParaMostrar = `🕒 ${String(ahora.getHours()).padStart(2,'0')}:${String(ahora.getMinutes()).padStart(2,'0')}:${String(ahora.getSeconds()).padStart(2,'0')}`;
                    console.log(`%c✨ Generando reloj con la hora actual para la tarjeta "${nombre}": ${horaParaMostrar}`, 'color: #32cd32; font-weight: bold;');
                }
            } else {
                console.log(`%c⏱ La tarjeta "${nombre}" ya tiene reloj y no se solicitó actualizar.`, 'color: #808080; font-style: italic;');
            }
        } catch (e) {
            console.error("%c🚨 Error al leer de LocalStorage", 'color: red; font-weight: bold;', e);
        }
    } 
    // --- CASO 4: actualizar: false, storage: false ---
    else {
        if (!reloj) {
            const ahora = new Date();
            horaParaMostrar = `🕒 ${String(ahora.getHours()).padStart(2,'0')}:${String(ahora.getMinutes()).padStart(2,'0')}:${String(ahora.getSeconds()).padStart(2,'0')}`;
            console.log(`%c✨ Generando reloj con la hora actual para la tarjeta "${nombre}": ${horaParaMostrar}`, 'color: #32cd32; font-weight: bold;');
        } else {
            console.log(`%c⏱ La tarjeta "${nombre}" ya tiene reloj y no se solicitó actualizar.`, 'color: #808080; font-style: italic;');
        }
    }

    // --- Monta o actualiza el DOM del reloj ---
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

    if (horaParaMostrar) {
        timestampSpan.textContent = horaParaMostrar;
    }
}
