// 🚀 Script para agregar cronómetros ⏱ calculando tiempo transcurrido desde el reloj (VERSIÓN CORREGIDA)
(function() {
  setInterval(() => {
    const container = document.querySelector(".Twilio-TaskList-default");
    if (!container) return;

    const cards = container.querySelectorAll("[data-testid='task-item']");

    cards.forEach(card => {
      const clockLine = card.querySelector(".custom-crono-line");
      if (!clockLine) return;

      let counter = clockLine.querySelector(".custom-crono-counter");

      if (!counter) {
        counter = document.createElement("span");
        counter.className = "custom-crono-counter";
        Object.assign(counter.style, {
          marginLeft: "8px",
          fontFamily: "inherit",
          fontWeight: "bold",
          transition: "color 1s ease" // La transición se define una sola vez
        });
        
        counter.textContent = "⏱ 00:00";
        
        const clockText = clockLine.textContent.trim().replace("🕒", "").trim();
        const [hh, mm, ss] = clockText.split(":").map(Number);
        const now = new Date();
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, ss);
        
        counter.dataset.start = startTime.getTime();
        
        // --- ✨ CAMBIO CLAVE: Guardamos el estado inicial del color ---
        counter.dataset.colorState = "gris"; // Estado inicial
        counter.style.color = "#808080"; // Color inicial
        
        clockLine.appendChild(counter);

      } else {
        // 🔄 Recalcular tiempo transcurrido
        const start = parseInt(counter.dataset.start, 10);
        const elapsed = Math.floor((Date.now() - start) / 1000);

        const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
        const secs = String(elapsed % 60).padStart(2, "0");

        counter.textContent = `⏱ ${mins}:${secs}`;

        // --- ✨ LÓGICA DE ESTADO MEJORADA ---
        const estadoActual = counter.dataset.colorState;
        let nuevoEstado;

        // 1. Determinar cuál debería ser el nuevo estado
        if (elapsed >= 300) { // 5 minutos
          nuevoEstado = "rojo";
        } else if (elapsed >= 240) { // 4 minutos
          nuevoEstado = "naranja";
        } else {
          nuevoEstado = "gris";
        }

        // 2. Solo si el nuevo estado es DIFERENTE al actual, aplicamos los cambios
        if (nuevoEstado !== estadoActual) {
          counter.dataset.colorState = nuevoEstado; // Actualizamos el estado guardado
          
          // Asignamos el color correspondiente al nuevo estado
          switch (nuevoEstado) {
            case "rojo":
              counter.style.color = "#FF0000";
              break;
            case "naranja":
              counter.style.color = "#ffa600";
              break;
            case "gris":
              // Este caso es importante para cuando una tarea se resuelve y vuelve a un estado normal (hipotético)
              // o si se reajusta el tiempo, asegurando que la transición de vuelta también funcione.
              counter.style.color = "#808080";
              break;
          }
        }
      }
    });
  }, 500); // Aumenté el intervalo a 500ms, 100ms es muy agresivo y no es necesario para un contador visual.
})();