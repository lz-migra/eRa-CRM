// 🎨 SCRIPT DE COLOR: Lee el tiempo transcurrido y actualiza el color del cronómetro.
(function() {
  setInterval(() => {
    // Buscamos directamente todos los contadores que ya existen.
    const counters = document.querySelectorAll('.custom-crono-counter');

    counters.forEach(counter => {
      // Si el contador no tiene el dato de segundos, lo ignoramos.
      if (counter.dataset.elapsedSeconds === undefined) return;

      // Leemos los segundos que el otro script calculó.
      const elapsed = parseInt(counter.dataset.elapsedSeconds, 10);
      const estadoActual = counter.dataset.colorState;
      let nuevoEstado;
      
      // ✨ CAMBIO CLAVE: Aplicamos la transición aquí para que se encargue de todo lo visual.
      counter.style.transition = 'color 1s ease';

      // --- Esta es la lógica de color que aislamos ---
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
  }, 500); // Puede correr al mismo ritmo o incluso un poco más lento (ej. 1000ms).
})();