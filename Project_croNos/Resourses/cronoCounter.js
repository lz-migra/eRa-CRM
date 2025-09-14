// 📜 SCRIPT DE LÓGICA: Crea, reinicia y calcula el tiempo del cronómetro.
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
        counter.dataset.baseTime = clockText; 
        
        // ✨ Se mantiene la configuración inicial del color y estado.
        counter.dataset.colorState = "gris";
        counter.style.color = "#808080";
        
        clockLine.appendChild(counter);

      } else {
        const currentBaseTimeText = timestampSpan.textContent.trim().replace("🕒", "").trim();
        const lastBaseTimeText = counter.dataset.baseTime;

        if (currentBaseTimeText !== lastBaseTimeText) {
          const [hh, mm, ss] = currentBaseTimeText.split(":").map(Number);
          const now = new Date();
          const newStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, ss);
          
          counter.dataset.start = newStartTime.getTime();
          counter.dataset.baseTime = currentBaseTimeText;
          counter.dataset.colorState = 'gris'; // Reinicia el estado del color
          counter.style.color = '#808080'; // Reinicia el color visualmente
        }

        const start = parseInt(counter.dataset.start, 10);
        const elapsed = Math.floor((Date.now() - start) / 1000);

        // ✨ CAMBIO CLAVE: Escribimos los segundos transcurridos en el dataset.
        // Esto permite que el otro script pueda leerlo.
        counter.dataset.elapsedSeconds = elapsed;

        const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
        const secs = String(elapsed % 60).padStart(2, "0");

        counter.textContent = `⏱ ${mins}:${secs}`;
        
      }
    });
  }, 500);
})();