// 🎨 SCRIPT DE COLOR MEJORADO: Se actualiza al volver a la pestaña para evitar desfases.
(function() {

  // ✅ BUENA PRÁCTICA: Centralizamos toda la lógica de actualización en una sola función.
  function actualizarColores() {
    // Buscamos solo las tarjetas de chat que contienen la línea de cronómetro.
    const chatCards = document.querySelectorAll('[aria-label*="chat task with status accepted"]');

    chatCards.forEach(card => {
      const counter = card.querySelector('.custom-crono-counter');

      if (!counter || counter.dataset.elapsedSeconds === undefined) {
        return; // Salimos antes si el contador no existe o no tiene los datos.
      }

      // Leemos los segundos que el otro script calculó.
      const elapsed = parseInt(counter.dataset.elapsedSeconds, 10);
      const estadoActual = counter.dataset.colorState;
      let nuevoEstado;

      // --- Lógica de color que determina el estado ---
      if (elapsed >= 300) { // 5 minutos o más
        nuevoEstado = "rojo";
      } else if (elapsed >= 240) { // 4 minutos
        nuevoEstado = "naranja";
      } else {
        nuevoEstado = "gris";
      }

      // Solo actualizamos el DOM si el estado ha cambiado.
      if (nuevoEstado !== estadoActual) {
        counter.dataset.colorState = nuevoEstado;
        counter.style.transition = 'color 0.5s ease'; // Una transición más sutil.

        switch (nuevoEstado) {
          case "rojo":
            counter.style.color = "#FF0000";
            break;
          case "naranja":
            counter.style.color = "#ffa600";
            break;
          case "gris":
            counter.style.color = "#808080";
            break;
        }
      }
    });
  }

  // 💡 SOLUCIÓN CLAVE: Escuchamos cuando la visibilidad de la pestaña cambia.
  document.addEventListener('visibilitychange', () => {
    // Si el documento NO está oculto (es decir, el usuario acaba de volver a la pestaña).
    if (!document.hidden) {
      console.log("Tab is visible again. Forcing color update.");
      actualizarColores();
    }
  });

  // Mantenemos el intervalo para actualizaciones mientras la pestaña está activa.
  // Un intervalo de 1000ms (1 segundo) es usualmente suficiente y más eficiente.
  setInterval(actualizarColores, 1000);

  // Ejecutamos una vez al inicio por si acaso.
  actualizarColores();

})();