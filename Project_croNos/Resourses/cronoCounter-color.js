// 🎨 SCRIPT DE COLOR: Lee el tiempo transcurrido y actualiza el color del cronómetro.
(function() {
  setInterval(() => {
    // 💡 CAMBIO CLAVE: Buscamos solo las tarjetas de chat que contienen la línea de cronómetro.
    const chatCards = document.querySelectorAll('[aria-label*="chat task with status accepted"]');

    chatCards.forEach(card => {
      const counter = card.querySelector('.custom-crono-counter');

      if (!counter) return;

      // Si el contador no tiene el dato de segundos, lo ignoramos.
      if (counter.dataset.elapsedSeconds === undefined) return;

      // Leemos los segundos que el otro script calculó.
      const elapsed = parseInt(counter.dataset.elapsedSeconds, 10);
      const estadoActual = counter.dataset.colorState;
      let nuevoEstado;

      counter.style.transition = 'color 1s ease';

      // --- Lógica de color que determina el estado ---
      if (elapsed >= 300) { // 5 minutos
        nuevoEstado = "rojo";
      } else if (elapsed >= 240) { // 4 minutos
        nuevoEstado = "naranja";
      } else {
        nuevoEstado = "gris";
      }

      if (nuevoEstado !== estadoActual) {
        counter.dataset.colorState = nuevoEstado;
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
  }, 500); 
})();