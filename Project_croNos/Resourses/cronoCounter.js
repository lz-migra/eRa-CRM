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
        // 🎨 Aplicar la transición aquí, en el elemento que se actualiza
        counter.style.transition = "color 1s ease-in-out"; 

        // 📖 Tomamos el texto del reloj base
        const clockText = clockLine.textContent.trim().replace("🕒", "").trim();
        // ⏳ Parseamos la hora actual del reloj
        const [hh, mm, ss] = clockText.split(":").map(Number);
        const now = new Date();
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, ss);
        // Guardamos el timestamp en el dataset
        counter.dataset.start = startTime.getTime();
        
        counter.textContent = "⏱ 00:00";
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
        
        // 🎨 Lógica para cambiar el color y el peso de la fuente
        if (mins >= 5) {
          counter.style.color = "#FF0000";
          counter.style.fontWeight = "bold";
        } else if (mins >= 4) {
          counter.style.color = "#ffa600";
          counter.style.fontWeight = "bold";
        } else {
          counter.style.color = "#808080";
          counter.style.fontWeight = "normal"; // Restablecer el grosor
        }
      }
    });
  }, 100);
})();