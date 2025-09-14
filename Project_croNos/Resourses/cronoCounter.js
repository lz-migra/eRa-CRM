// 🚀 Script para agregar cronómetros ⏱ calculando tiempo transcurrido desde el reloj
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
        // --- CÓDIGO DE INICIALIZACIÓN ---
        counter = document.createElement("span");
        counter.className = "custom-crono-counter";
        counter.style.marginLeft = "8px";
        counter.style.fontFamily = "inherit";
        counter.style.fontWeight = "bold";
        
        // 🎨 Añadir la transición aquí
        counter.style.transition = "color 1s ease-in-out"; 

        // Tomamos el texto del reloj base
        const clockText = clockLine.textContent.trim().replace("🕒", "").trim();
        // Parseamos la hora actual del reloj
        const [hh, mm, ss] = clockText.split(":").map(Number);
        // Creamos un Date "hoy con esa hora"
        const now = new Date();
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, ss);
        // Guardamos el timestamp
        counter.dataset.start = startTime.getTime();
        
        // Establecemos el color inicial
        counter.style.color = "#808080";
        counter.textContent = "⏱ 00:00";
        
        // Lo agregamos al DOM
        clockLine.appendChild(counter);

      } else {
        // --- CÓDIGO DE REFRESCADO Y CAMBIO DE COLOR ---
        const start = parseInt(counter.dataset.start, 10);
        const elapsed = Math.floor((Date.now() - start) / 1000);

        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        
        const minsDisplay = String(mins).padStart(2, "0");
        const secsDisplay = String(secs).padStart(2, "0");

        counter.textContent = `⏱ ${minsDisplay}:${secsDisplay}`;
        
        // Lógica para cambiar el color según el tiempo
        if (mins >= 5) {
          counter.style.color = "#FF0000";
        } else if (mins >= 4) {
          counter.style.color = "#ffa600";
        } else {
          counter.style.color = "#808080";
        }
      }
    });
  }, 100);
})();