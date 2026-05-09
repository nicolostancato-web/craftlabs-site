// Reveal su scroll
(function() {
  const items = document.querySelectorAll('.agent-card, .extra-card, .proc-col, .t-card, .display-h, .display-p, .demo-card, .triple-head');
  items.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  });
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  items.forEach(el => obs.observe(el));
})();

// Play Marco — browser TTS in italiano (real preventivo conversation)
(function() {
  const btn = document.getElementById('playMarco');
  if (!btn) return;
  if (!('speechSynthesis' in window)) {
    btn.style.display = 'none';
    return;
  }

  const dialogue = [
    { voice: 'marco', text: 'Pronto, sono Marco di Craftlabs. Mi dica pure.' },
    { voice: 'cliente', text: 'Buongiorno, vorrei un preventivo per uno spurgo della fossa biologica.' },
    { voice: 'marco', text: 'Certo. Mi può dire l\'indirizzo e il volume stimato della fossa?' },
    { voice: 'cliente', text: 'Via Roma 12 a Bergamo, circa 3000 litri.' },
    { voice: 'marco', text: 'Perfetto. Il preventivo base è 180 euro più IVA. Procedo con l\'invio del dettaglio via email?' }
  ];

  let italianVoices = [];
  function loadVoices() {
    const all = window.speechSynthesis.getVoices();
    italianVoices = all.filter(v => v.lang.startsWith('it'));
    if (!italianVoices.length) italianVoices = all.filter(v => /italian|italia/i.test(v.name));
  }
  loadVoices();
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  let isPlaying = false;
  let currentIndex = 0;

  function speak(line, onEnd) {
    const utt = new SpeechSynthesisUtterance(line.text);
    utt.lang = 'it-IT';
    // Marco: voce maschile più grave/lenta. Cliente: voce diversa
    const males = italianVoices.filter(v => /male|marco|paolo|alessandro|luca/i.test(v.name) && !/female/i.test(v.name));
    const females = italianVoices.filter(v => /female|elsa|alice|chiara|silvia/i.test(v.name));
    if (line.voice === 'marco') {
      utt.voice = males[0] || italianVoices[0] || null;
      utt.rate = 0.95;
      utt.pitch = 0.9;
    } else {
      utt.voice = females[0] || italianVoices[1] || italianVoices[0] || null;
      utt.rate = 1.0;
      utt.pitch = 1.05;
    }
    utt.onend = onEnd;
    window.speechSynthesis.speak(utt);
  }

  function playNext() {
    if (!isPlaying || currentIndex >= dialogue.length) {
      stop();
      return;
    }
    speak(dialogue[currentIndex], () => {
      currentIndex++;
      setTimeout(playNext, 350);
    });
  }

  function start() {
    isPlaying = true;
    currentIndex = 0;
    btn.classList.add('playing');
    document.querySelector('#playMarco .play-label').textContent = 'In riproduzione...';
    playNext();
  }

  function stop() {
    isPlaying = false;
    window.speechSynthesis.cancel();
    btn.classList.remove('playing');
    document.querySelector('#playMarco .play-label').textContent = 'Ascolta Marco';
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  });
})();
