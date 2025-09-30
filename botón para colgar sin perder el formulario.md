
```javascript
(function () {
  const manager = Twilio.Flex.Manager.getInstance();

  const btn = document.createElement("button");
  btn.innerText = "📞 Colgar llamada";
  btn.style = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 15px;
    border-radius: 8px;
    background: #e74c3c;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    z-index: 9999;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  `;

  btn.onclick = () => {
    const state = manager.store.getState();
    const tasks = Array.from(state.flex.worker.tasks.values());
    const activeCall = state.flex.phone.activeCall;

    if (!activeCall) {
      console.warn("❌ No hay llamada activa.");
      return;
    }

    // Solo tasks de tipo VOICE
    const voiceTasks = tasks.filter(t => t.taskChannelUniqueName === "voice");

    // Buscar la task que tenga el call_sid correcto
    const task = voiceTasks.find(
      t => t.attributes && t.attributes.call_sid === state.flex.phone.lastCallSid
    );

    if (task) {
      console.log("☎️ Colgando vía Flex la task de voz:", task.sid);
      Twilio.Flex.Actions.invokeAction("HangupCall", { task });
    } else {
      console.warn("⚠️ No encontré task de voz asociada, uso disconnect() directo.");
      activeCall.disconnect();
    }
  };

  document.body.appendChild(btn);
})();
```

