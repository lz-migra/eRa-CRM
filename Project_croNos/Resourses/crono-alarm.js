// 🚨 SCRIPT DE ANIMACIÓN: Aplica un parpadeo a las tarjetas de chat que superen los 5 minutos.
(function() {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes blink-background {
      0%, 100% { background-color: #ffe2e2; }
      50% { background-color: transparent; }
    }

    .blinking-card {
      animation: blink-background 2s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);

  setInterval(() => {
    // 💡 Buscamos solo las tarjetas de chat que contienen el cronómetro.
    const chatCards = document.querySelectorAll('[aria-label*="chat task with status accepted"]');

    chatCards.forEach(card => {
      const counter = card.querySelector('.custom-crono-counter');

      if (!counter) return;

      // Si el contador no tiene el dato de segundos, lo ignoramos.
      if (counter.dataset.elapsedSeconds === undefined) return;

      const elapsed = parseInt(counter.dataset.elapsedSeconds, 10);
      
      // Aplicar o remover la clase de animación si es necesario.
      if (elapsed >= 360) { // 6 minutos o más
        // Verifica si la clase ya está aplicada para evitar re-aplicar.
        if (!card.classList.contains('blinking-card')) {
          card.classList.add('blinking-card');
        }
      } else {
        // Remueve la clase si el tiempo baja de 5 minutos (por ejemplo, si se detiene el contador).
        if (card.classList.contains('blinking-card')) {
          card.classList.remove('blinking-card');
          card.style.animation = ''; // Limpia el estilo para evitar glitches.
        }
      }
    });
  }, 1000); 
})();