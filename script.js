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

// Play Marco — usa MP3 reale generato con ElevenLabs (no più Web Speech API)
(function() {
  const btn = document.getElementById('playMarco');
  if (!btn) return;

  const audio = new Audio('/marco_demo.mp3');
  audio.preload = 'auto';

  const label = btn.querySelector('.play-label');
  const originalText = label ? label.textContent : 'Ascolta Marco';

  let isPlaying = false;

  function start() {
    audio.currentTime = 0;
    audio.play().catch(err => {
      console.error('Audio play error:', err);
      stop();
    });
    isPlaying = true;
    btn.classList.add('playing');
    if (label) label.textContent = 'In riproduzione...';
  }

  function stop() {
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    btn.classList.remove('playing');
    if (label) label.textContent = originalText;
  }

  audio.addEventListener('ended', stop);
  audio.addEventListener('error', stop);

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isPlaying) stop();
    else start();
  });
})();
