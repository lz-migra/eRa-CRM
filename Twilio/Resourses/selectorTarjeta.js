(function () {
    // Paso 1: Obtener el texto del encabezado actual (tarjeta activa en vista)
    const encabezadoActivo = document.querySelector(
        '.Twilio-TaskCanvasHeader-Name span'
    )?.innerText?.trim();

    if (!encabezadoActivo) {
        console.warn('No se pudo obtener el encabezado activo');
        return;
    }

    // Paso 2: Buscar todas las tarjetas en la lista lateral
    const tarjetas = document.querySelectorAll('[data-testid="task-item"]');

    for (const tarjeta of tarjetas) {
        // Dentro de cada tarjeta, obtener el encabezado (nombre del cliente)
        const textoTarjeta = tarjeta.querySelector(
            '[data-testid="task-item-first-line"] span'
        )?.innerText?.trim();

        // Paso 3: Comparar con el encabezado activo
        if (textoTarjeta === encabezadoActivo) {
            console.log('Clase de la tarjeta activa:', tarjeta.className);
            return tarjeta.className;
        }
    }

    console.warn('No se encontró una tarjeta que coincida con el encabezado activo');
})();
