// 🎯 Script para alternar tarjeta activa y actualizar solo el <span class="Twilio">
(function () {
  const OLD_CLASS = 'css-h9kan6';
  const NEW_CLASS = 'css-1epyp4w';
  const ITEM_SELECTOR = '[data-testid="task-item"]';
  const SPAN_SELECTOR = 'h4.Twilio-TaskCanvasHeader-Name span.Twilio';

  function replaceClass(el, from, to) {
    if (!el) return;
    if (el.classList && typeof el.classList.replace === 'function') {
      el.classList.replace(from, to);
      return;
    }
    if (el.classList.contains(from)) el.classList.remove(from);
    if (!el.classList.contains(to)) el.classList.add(to);
  }

  function revertOthers(selectedEl) {
    const others = document.querySelectorAll(ITEM_SELECTOR + '.' + NEW_CLASS);
    others.forEach(el => {
      if (el !== selectedEl) replaceClass(el, NEW_CLASS, OLD_CLASS);
    });
  }

  function updateHeaderSpanFromCard(card) {
    const headerSpan = document.querySelector(SPAN_SELECTOR);
    if (!headerSpan) return;

    const cardTitle = card.querySelector('.Twilio-TaskListBaseItem-FirstLine .Twilio');
    if (cardTitle) {
      headerSpan.textContent = cardTitle.textContent.trim();
    }
  }

  function onDocumentClick(e) {
    const card = e.target.closest(ITEM_SELECTOR);
    if (!card) return;

    revertOthers(card);

    if (card.classList.contains(OLD_CLASS)) {
      replaceClass(card, OLD_CLASS, NEW_CLASS);
      updateHeaderSpanFromCard(card);
    } else if (card.classList.contains(NEW_CLASS)) {
      // Si quieres desactivar al segundo click:
      // replaceClass(card, NEW_CLASS, OLD_CLASS);
      // document.querySelector(SPAN_SELECTOR).textContent = '';
    } else {
      card.classList.add(NEW_CLASS);
      updateHeaderSpanFromCard(card);
    }
  }

  document.addEventListener('click', onDocumentClick, false);
  console.debug('Card toggle + header span update initialized');
})();
