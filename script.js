// Chat WhatsApp animata in loop
(function() {
  const chat = document.getElementById('waChat');
  if (!chat) return;

  const conversations = [
    [
      { side: 'in',  text: 'Ciao, vorrei un preventivo per uno spurgo' },
      { side: 'out', text: 'Certo! Mi può dire l\'indirizzo e il tipo di intervento?' },
      { side: 'in',  text: 'Via Roma 12, Bergamo. Fossa biologica.' },
      { side: 'out', text: 'Perfetto. Volume stimato e ultimo svuotamento?' },
      { side: 'in',  text: '3000 litri, 2 anni fa.' },
      { side: 'out', text: '✓ Preventivo: 180€ + IVA. Le invio il PDF via email?' }
    ],
    [
      { side: 'in',  text: 'Buongiorno, vorrei prenotare un appuntamento' },
      { side: 'out', text: 'Certo! Per quale servizio e quando preferisce?' },
      { side: 'in',  text: 'Giovedì pomeriggio se possibile' },
      { side: 'out', text: 'Ho disponibilità giovedì alle 15:00 o 16:30. Va bene?' },
      { side: 'in',  text: '15:00 perfetto' },
      { side: 'out', text: '✓ Confermato giovedì 15:00. Le invio email di conferma.' }
    ]
  ];

  let convIndex = 0;
  let msgIndex = 0;

  function clearChat() { chat.innerHTML = ''; }

  function appendBubble(side, text, withDelay) {
    return new Promise(resolve => {
      const typing = document.createElement('div');
      typing.className = 'wa-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      typing.style.alignSelf = side === 'in' ? 'flex-start' : 'flex-end';
      chat.appendChild(typing);
      chat.scrollTop = chat.scrollHeight;

      setTimeout(() => {
        typing.remove();
        const b = document.createElement('div');
        b.className = `wa-bubble wa-${side}`;
        b.innerHTML = text;
        chat.appendChild(b);
        chat.scrollTop = chat.scrollHeight;
        resolve();
      }, withDelay);
    });
  }

  async function playConversation() {
    clearChat();
    const conv = conversations[convIndex];
    for (const msg of conv) {
      await appendBubble(msg.side, msg.text, msg.side === 'in' ? 800 : 1200);
      await new Promise(r => setTimeout(r, 600));
    }
    // Pausa finale prima del loop
    await new Promise(r => setTimeout(r, 3000));
    convIndex = (convIndex + 1) % conversations.length;
    playConversation();
  }

  // Avvia quando in viewport
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        playConversation();
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  obs.observe(chat);
})();

// Reveal su scroll per le sezioni
(function() {
  const items = document.querySelectorAll('.section-head, .channel-card, .cg-card, .step, .sf-cell, .perf-cell');
  items.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => obs.observe(el));
})();
