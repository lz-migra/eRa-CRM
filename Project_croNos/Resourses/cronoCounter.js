// 🚀 Script para agregar cronómetros (VERSIÓN FINAL CON REINICIO AUTOMÁTICO)
(function() {
  setInterval(() => {
    const container = document.querySelector(".Twilio-TaskList-default");
    if (!container) return;

    const cards = container.querySelectorAll("[data-testid='task-item']");

    cards.forEach(card => {
      const clockLine = card.querySelector(".custom-crono-line");
      if (!clockLine) return;

      let counter = clockLine.querySelector(".custom-crono-counter");
      const timestampSpan = clockLine.querySelector('.custom-crono-timestamp');

      // Si no hay span de hora, no podemos hacer nada.
      if (!timestampSpan) return;

      if (!counter) {
        counter = document.createElement("span");
        counter.className = "custom-crono-counter";
        Object.assign(counter.style, {
          marginLeft: "8px", fontFamily: "inherit", fontWeight: "bold", transition: "color 1s ease"
        });
        
        counter.textContent = "⏱ 00:00";
        
        const clockText = timestampSpan.textContent.trim().replace("🕒", "").trim();
        const [hh, mm, ss] = clockText.split(":").map(Number);
        const now = new Date();
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, ss);
        
        counter.dataset.start = startTime.getTime();
        
        // --- ✨ CAMBIO 1: Guardamos la hora base actual para futuras comparaciones ---
        counter.dataset.baseTime = clockText; 
        
        counter.dataset.colorState = "gris";
        counter.style.color = "#808080";
        
        clockLine.appendChild(counter);

      } else {
        // --- ✨ CAMBIO 2: Lógica de detección y reinicio ---
        // Obtenemos la hora base que se muestra actualmente en el DOM.
        const currentBaseTimeText = timestampSpan.textContent.trim().replace("🕒", "").trim();
        const lastBaseTimeText = counter.dataset.baseTime;

        // Comparamos la hora actual con la última que guardamos.
        if (currentBaseTimeText !== lastBaseTimeText) {
          console.log(`🔄 Detectado cambio en la hora base. Reiniciando contador...`);
          
          // Si son diferentes, recalculamos la hora de inicio.
          const [hh, mm, ss] = currentBaseTimeText.split(":").map(Number);
          const now = new Date();
          const newStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, ss);
          
          // Actualizamos los valores guardados para que el contador empiece de nuevo.
          counter.dataset.start = newStartTime.getTime();
          counter.dataset.baseTime = currentBaseTimeText; // Actualizamos la referencia
          
          // También reiniciamos el estado del color para que la animación empiece de nuevo.
          counter.dataset.colorState = 'gris';
          counter.style.color = '#808080';
        }

        // --- El resto del script sigue igual, pero ahora usará el `dataset.start` actualizado ---
        const start = parseInt(counter.dataset.start, 10);
        const elapsed = Math.floor((Date.now() - start) / 1000);

        const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
        const secs = String(elapsed % 60).padStart(2, "0");

        counter.textContent = `⏱ ${mins}:${secs}`;

        const estadoActual = counter.dataset.colorState;
        let nuevoEstado;

        if (elapsed >= 300) { nuevoEstado = "rojo"; } 
        else if (elapsed >= 240) { nuevoEstado = "naranja"; } 
        else { nuevoEstado = "gris"; }

        if (nuevoEstado !== estadoActual) {
          counter.dataset.colorState = nuevoEstado;
          switch (nuevoEstado) {
            case "rojo": counter.style.color = "#FF0000"; break;
            case "naranja": counter.style.color = "#ffa600"; break;
            case "gris": counter.style.color = "#808080"; break;
          }
        }
      }
    });
  }, 500);
})();