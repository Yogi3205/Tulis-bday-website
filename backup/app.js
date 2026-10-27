/* ===================================================================
   TULI'S 24TH BIRTHDAY SUITE - CORE ENGINE (app.js)
   Step-by-step Chapter Flow, 40 Photos, Story Reel, Audio & Cake
   Dedicated to Tulsi (Tuli) from Yogi (Kanu) 💍
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // =================================================================
  // 1. AUDIO CONTROLLER (Calm Happy Birthday Melody + Custom Studio WAV)
  // =================================================================
  class RomanticAudioEngine {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.loopTimer = null;
      this.hasCustomFile = false;

      // Primary audio: Studio-rendered calm music-box & piano Happy Birthday track
      this.audioEl = new Audio('music/happy_birthday_calm.wav');
      this.audioEl.loop = true;
      this.audioEl.volume = 0.55;
      this.audioEl.preload = 'auto';

      this.audioEl.addEventListener('canplaythrough', () => {
        this.hasCustomFile = true;
      });
      this.audioEl.addEventListener('error', () => {
        this.hasCustomFile = false;
      });

      this.vinyl = document.getElementById('floatingAudioVinyl');
      this.pill = document.getElementById('floatingAudioPill');

      if (this.pill) {
        this.pill.addEventListener('click', () => this.toggle());
      }

      // Smooth auto-start on first user interaction (browser autoplay policy safe)
      const resume = () => {
        if (!this.isPlaying) this.play();
        window.removeEventListener('click', resume);
        window.removeEventListener('touchstart', resume);
        window.removeEventListener('keydown', resume);
      };
      window.addEventListener('click', resume, { once: true });
      window.addEventListener('touchstart', resume, { once: true });
      window.addEventListener('keydown', resume, { once: true });
    }

    ensureContext() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playMusicBoxNote(freq, time, duration = 1.8, gainLevel = 0.16) {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      // Delicate bell harmonic overtone
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2.01, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, time);
      filter.frequency.exponentialRampToValueAtTime(320, time + duration);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(gainLevel, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc2.start(time);
      osc.stop(time + duration);
      osc2.stop(time + duration);
    }

    // Procedural Calm Music-Box "Happy Birthday" Melody
    startHappyBirthdaySynth() {
      this.ensureContext();
      const B = 0.72; // Slow, soothing lullaby beat
      const G4 = 392.00, A4 = 440.00, B4 = 493.88;
      const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99;
      const C3 = 130.81, G3 = 196.00, F3 = 174.61, E3 = 164.81;

      const songNotes = [
        // "Happy Birthday to you"
        { f: G4, d: 0.75, c: C3 },
        { f: G4, d: 0.5, c: null },
        { f: A4, d: 1.0, c: null },
        { f: G4, d: 1.0, c: G3 },
        { f: C5, d: 1.0, c: null },
        { f: B4, d: 2.2, c: G3 },

        // "Happy Birthday to you"
        { f: G4, d: 0.75, c: G3 },
        { f: G4, d: 0.5, c: null },
        { f: A4, d: 1.0, c: null },
        { f: G4, d: 1.0, c: C3 },
        { f: D5, d: 1.0, c: null },
        { f: C5, d: 2.2, c: C3 },

        // "Happy Birthday dear Tulsi"
        { f: G4, d: 0.75, c: C3 },
        { f: G4, d: 0.5, c: null },
        { f: G5, d: 1.2, c: E3 },
        { f: E5, d: 1.0, c: null },
        { f: C5, d: 1.0, c: F3 },
        { f: B4, d: 1.0, c: null },
        { f: A4, d: 2.2, c: F3 },

        // "Happy Birthday to you"
        { f: F5, d: 0.75, c: C3 },
        { f: F5, d: 0.5, c: null },
        { f: E5, d: 1.0, c: null },
        { f: C5, d: 1.0, c: G3 },
        { f: D5, d: 1.2, c: null },
        { f: C5, d: 3.2, c: C3 }
      ];

      const playMelodyLoop = () => {
        if (!this.isPlaying) return;
        const now = this.ctx.currentTime + 0.1;
        let noteTime = now;

        songNotes.forEach(item => {
          this.playMusicBoxNote(item.f, noteTime, item.d * B * 1.5, 0.20);
          if (item.c) {
            this.playMusicBoxNote(item.c, noteTime, item.d * B * 2.5, 0.15);
            this.playMusicBoxNote(item.c * 1.5, noteTime + 0.18, item.d * B * 2.0, 0.08);
          }
          noteTime += item.d * B;
        });
      };

      playMelodyLoop();
      const totalLoopMs = songNotes.reduce((acc, n) => acc + n.d * B, 0) * 1000 + 1500;
      this.loopTimer = setInterval(playMelodyLoop, totalLoopMs);
    }

    stopSynth() {
      if (this.loopTimer) {
        clearInterval(this.loopTimer);
        this.loopTimer = null;
      }
    }

    play() {
      this.ensureContext();
      this.isPlaying = true;
      if (this.vinyl) this.vinyl.classList.add('spinning');

      // Try playing the studio WAV track first; if blocked, fallback to live Web Audio Happy Birthday synth
      const playPromise = this.audioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.startHappyBirthdaySynth();
        });
      } else {
        this.startHappyBirthdaySynth();
      }
    }

    pause() {
      this.isPlaying = false;
      if (this.vinyl) this.vinyl.classList.remove('spinning');
      this.audioEl.pause();
      this.stopSynth();
    }

    toggle() {
      if (this.isPlaying) this.pause();
      else this.play();
    }

    playSuccessChime() {
      this.ensureContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        this.playMusicBoxNote(freq, now + (idx * 0.1), 1.6, 0.22);
      });
    }

    playTick() {
      this.ensureContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    }
  }

  window.romanticAudio = new RomanticAudioEngine();

  // =================================================================
  // 2. MASTER SLIDE DECK CONTROLLER (1 Page at a Time • 3D Transitions)
  // =================================================================
  const slides = Array.from(document.querySelectorAll('.deck-slide'));
  const totalSlides = slides.length || 7;
  let currentSlide = 0;
  let isTransitioning = false;

  const dockIndicator = document.getElementById('dockStepIndicator');
  const dockPrevBtn = document.getElementById('dockPrevBtn');
  const dockNextBtn = document.getElementById('dockNextBtn');
  const sideDots = Array.from(document.querySelectorAll('.side-dot'));

  function updateDockAndDots(idx) {
    if (dockIndicator) {
      dockIndicator.textContent = `Chapter 0${idx + 1} of 0${totalSlides}`;
    }
    if (dockPrevBtn) {
      dockPrevBtn.style.opacity = idx === 0 ? '0.35' : '1';
      dockPrevBtn.style.cursor = idx === 0 ? 'default' : 'pointer';
    }
    if (dockNextBtn) {
      dockNextBtn.style.opacity = idx === totalSlides - 1 ? '0.35' : '1';
      dockNextBtn.style.cursor = idx === totalSlides - 1 ? 'default' : 'pointer';
    }
    sideDots.forEach((dot, dIdx) => {
      dot.classList.toggle('active', dIdx === idx);
    });
  }

  function goToSlide(targetIdx, direction = 'auto') {
    if (targetIdx === currentSlide || isTransitioning) return;
    if (targetIdx < 0 || targetIdx >= totalSlides) return;

    isTransitioning = true;
    const isForward = direction === 'auto' ? (targetIdx > currentSlide) : (direction === 'forward');
    const oldSlide = slides[currentSlide];
    const newSlide = slides[targetIdx];

    if (window.romanticAudio) {
      window.romanticAudio.playTick();
    }

    launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 18);

    // Animate old slide out
    oldSlide.classList.remove('active');
    if (isForward) {
      oldSlide.classList.add('slide-exit-up');
    } else {
      oldSlide.classList.add('slide-exit-down');
    }

    // Prepare and animate new slide in
    newSlide.classList.remove('slide-exit-up', 'slide-exit-down');
    if (isForward) {
      newSlide.classList.add('slide-enter-from-down');
    } else {
      newSlide.classList.add('slide-enter-from-up');
    }

    void newSlide.offsetWidth; // Force reflow

    newSlide.classList.remove('slide-enter-from-down', 'slide-enter-from-up');
    newSlide.classList.add('active');

    // Trigger La Revoltosa-style 3D Camera flight & ring choreography
    if (typeof window.update3DCamera === 'function') {
      window.update3DCamera(targetIdx);
    }

    // Scroll internal card of new slide to top smoothly
    const innerCard = newSlide.querySelector('.slide-glass-card');
    if (innerCard) innerCard.scrollTop = 0;

    // GSAP cinematic stagger entrance
    if (typeof gsap !== 'undefined') {
      if (innerCard) {
        gsap.fromTo(innerCard,
          { y: isForward ? 45 : -45, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'power3.out' }
        );
      }
      const staggers = newSlide.querySelectorAll('.slide-pill-tag, .slide-fiancee-badge, .hero-big-title, .hero-cursive-sub, .hero-lead-text, .timer-grid');
      if (staggers.length > 0) {
        gsap.fromTo(staggers,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: 'power2.out', delay: 0.1 }
        );
      }
    }

    currentSlide = targetIdx;
    updateDockAndDots(currentSlide);

    setTimeout(() => {
      oldSlide.classList.remove('slide-exit-up', 'slide-exit-down');
      isTransitioning = false;
    }, 700);
  }

  window.goToSlide = goToSlide;

  // Dock buttons
  if (dockNextBtn) {
    dockNextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1, 'forward');
    });
  }
  if (dockPrevBtn) {
    dockPrevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentSlide > 0) goToSlide(currentSlide - 1, 'backward');
    });
  }

  // Side progress dots
  sideDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.dataset.slide, 10);
      if (!isNaN(target)) goToSlide(target);
    });
  });

  // Intra-slide navigation buttons (data-goto)
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = parseInt(btn.dataset.goto, 10);
      if (!isNaN(target)) goToSlide(target);
    });
  });

  // Mouse wheel slide changing (debounced at 600ms)
  let lastWheelTime = 0;
  window.addEventListener('wheel', (e) => {
    if (document.getElementById('luxuryLightbox')?.classList.contains('active')) return;
    if (document.getElementById('heroUnwrappedMsg')?.classList.contains('show')) return;

    const activeSlide = slides[currentSlide];
    const card = activeSlide ? activeSlide.querySelector('.slide-glass-card') : null;

    if (card) {
      const isScrollable = card.scrollHeight > card.clientHeight + 10;
      if (isScrollable) {
        const atTop = card.scrollTop <= 2;
        const atBottom = card.scrollTop + card.clientHeight >= card.scrollHeight - 4;

        if (e.deltaY > 0 && !atBottom) return; // Allow natural internal downward scroll
        if (e.deltaY < 0 && !atTop) return; // Allow natural internal upward scroll
      }
    }

    const now = Date.now();
    if (now - lastWheelTime < 600) return;

    if (Math.abs(e.deltaY) > 22) {
      lastWheelTime = now;
      if (e.deltaY > 0) {
        if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1, 'forward');
      } else {
        if (currentSlide > 0) goToSlide(currentSlide - 1, 'backward');
      }
    }
  }, { passive: false });

  // Touch swipe gestures for mobile (swipe up -> next slide, swipe down -> prev slide)
  let touchStartY = 0;
  let touchStartX = 0;
  let touchStartTime = 0;

  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    touchStartTime = Date.now();
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (document.getElementById('luxuryLightbox')?.classList.contains('active')) return;
    if (document.getElementById('heroUnwrappedMsg')?.classList.contains('show')) return;

    const deltaY = e.changedTouches[0].clientY - touchStartY;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const duration = Date.now() - touchStartTime;

    if (Math.abs(deltaY) > 45 && Math.abs(deltaY) > Math.abs(deltaX) && duration < 650) {
      const activeSlide = slides[currentSlide];
      const card = activeSlide ? activeSlide.querySelector('.slide-glass-card') : null;

      if (card) {
        const isScrollable = card.scrollHeight > card.clientHeight + 10;
        if (isScrollable) {
          const atTop = card.scrollTop <= 2;
          const atBottom = card.scrollTop + card.clientHeight >= card.scrollHeight - 4;

          if (deltaY < 0 && !atBottom) return;
          if (deltaY > 0 && !atTop) return;
        }
      }

      if (deltaY < 0) {
        if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1, 'forward');
      } else {
        if (currentSlide > 0) goToSlide(currentSlide - 1, 'backward');
      }
    }
  }, { passive: true });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (document.getElementById('luxuryLightbox')?.classList.contains('active')) return;
    if (document.getElementById('heroUnwrappedMsg')?.classList.contains('show')) {
      if (e.key === 'Escape') document.getElementById('heroUnwrappedMsg').classList.remove('show');
      return;
    }

    if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key)) {
      e.preventDefault();
      if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1, 'forward');
    } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      if (currentSlide > 0) goToSlide(currentSlide - 1, 'backward');
    }
  });

  updateDockAndDots(0);

  // =================================================================
  // 3. SLIDE 1: LIVE CLOCK, BALLOONS, GIFT BOX & CELEBRATION
  // =================================================================
  const birthDate = new Date('2002-11-04T00:00:00+05:30');

  function updateLiveClock() {
    const now = new Date();
    const diffMs = now - birthDate;
    if (diffMs <= 0) return;

    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const years = Math.floor(totalDays / 365.25);
    const remDays = Math.floor(totalDays % 365.25);
    const months = Math.floor(remDays / 30.4375);
    const days = Math.floor(remDays % 30.4375);
    const hours = totalHours % 24;
    const mins = totalMinutes % 60;
    const secs = totalSeconds % 60;

    const y = document.getElementById('countYears');
    const m = document.getElementById('countMonths');
    const d = document.getElementById('countDays');
    const h = document.getElementById('countHours');
    const min = document.getElementById('countMinutes');
    const s = document.getElementById('countSeconds');

    if (y) y.textContent = String(years).padStart(2, '0');
    if (m) m.textContent = String(months).padStart(2, '0');
    if (d) d.textContent = String(days).padStart(2, '0');
    if (h) h.textContent = String(hours).padStart(2, '0');
    if (min) min.textContent = String(mins).padStart(2, '0');
    if (s) s.textContent = String(secs).padStart(2, '0');

    // Countdown to upcoming Nov 4
    const currentYear = now.getFullYear();
    let nextBday = new Date(currentYear, 10, 4, 0, 0, 0);
    const isToday = (now.getMonth() === 10 && now.getDate() === 4);
    const bdayText = document.getElementById('bdayCountdownText');

    if (bdayText) {
      if (isToday) {
        bdayText.innerHTML = "🎉 <strong>TODAY IS TULI'S 24TH BIRTHDAY! CELEBRATION TIME!</strong> 🎂✨";
      } else {
        if (now > nextBday) nextBday = new Date(currentYear + 1, 10, 4, 0, 0, 0);
        const bDiff = nextBday - now;
        const bDays = Math.floor(bDiff / (1000 * 60 * 60 * 24));
        const bHours = Math.floor((bDiff / (1000 * 60 * 60)) % 24);
        const bMins = Math.floor((bDiff / (1000 * 60)) % 60);
        const bSecs = Math.floor((bDiff / 1000) % 60);
        bdayText.innerHTML = `Birthday Countdown: <strong>${bDays}d ${bHours}h ${bMins}m ${bSecs}s</strong> until your special day! 🌸`;
      }
    }
  }

  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // 3D Couple Showcase Mouse Parallax Tilt
  const heroCouple = document.getElementById('heroCoupleShowcase');
  if (heroCouple) {
    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const rotX = (e.clientY - cy) * -0.015;
      const rotY = (e.clientX - cx) * 0.02;
      heroCouple.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
  }

  // =================================================================
  // INTERACTIVE 3D POP-UP BALLOONS & KANU'S HIDDEN MESSAGES
  // =================================================================
  const balloonElements = document.querySelectorAll('.interactive-balloon');
  const balloonNoteModal = document.getElementById('balloonNoteModal');
  const balloonNoteText = document.getElementById('balloonNoteText');
  const balloonNoteCloseBtn = document.getElementById('balloonNoteCloseBtn');
  const balloonNoteCollectBtn = document.getElementById('balloonNoteCollectBtn');
  const balloonProgressText = document.getElementById('balloonProgressText');
  const balloonProgressPill = document.getElementById('balloonProgressPill');
  const grandUnlockModal = document.getElementById('grandUnlockModal');
  const grandUnlockCloseBtn = document.getElementById('grandUnlockCloseBtn');
  const respawnBalloonsBtn = document.getElementById('respawnBalloonsBtn');
  const collectedNotesList = document.getElementById('collectedNotesList');

  const balloonMessages = [
    { id: 1, text: "Bov Badhu love you bacchudi ❤️", emoji: "💖" },
    { id: 2, text: "You are so special to me, my sweetest angel ✨", emoji: "🌸" },
    { id: 3, text: "My future wife, my greatest dream come true 💍", emoji: "👑" },
    { id: 4, text: "Your smile is the most beautiful thing in the whole universe 🌸", emoji: "☀️" },
    { id: 5, text: "Always by your side, holding your hand forever and ever 🤝", emoji: "🕊️" },
    { id: 6, text: "Happy 24th Birthday my princess Tuli, forever yours Kanu 👑💖", emoji: "🎉" }
  ];

  let unlockedNotes = JSON.parse(localStorage.getItem('tuli_unlocked_balloon_notes') || '[]');

  function updateBalloonProgressUI() {
    const count = unlockedNotes.length;
    if (balloonProgressText) {
      if (count === 0) {
        balloonProgressText.innerHTML = `Pop balloons to unlock Kanu's hidden notes: <strong>0 / 6 Unlocked</strong>`;
      } else if (count < 6) {
        balloonProgressText.innerHTML = `💌 Kanu's Love Notes: <strong>${count} / 6 Unlocked</strong> (Tap to view)`;
      } else {
        balloonProgressText.innerHTML = `👑 <strong>ALL 6 SECRET NOTES UNLOCKED!</strong> (Tap to open)`;
      }
    }
  }
  updateBalloonProgressUI();

  // Mark already unlocked balloons if any
  unlockedNotes.forEach(id => {
    const b = document.querySelector(`.interactive-balloon[data-id="${id}"]`);
    if (b) b.classList.add('popped');
  });

  function showBalloonLoveNote(message) {
    if (!balloonNoteModal || !balloonNoteText) return;
    balloonNoteText.textContent = `"${message}"`;
    balloonNoteModal.classList.add('show');
    if (window.romanticAudio) window.romanticAudio.playSuccessChime();
  }

  function hideBalloonLoveNote() {
    if (balloonNoteModal) balloonNoteModal.classList.remove('show');
  }

  if (balloonNoteCloseBtn) balloonNoteCloseBtn.addEventListener('click', hideBalloonLoveNote);
  if (balloonNoteCollectBtn) balloonNoteCollectBtn.addEventListener('click', hideBalloonLoveNote);

  // Click on Progress Pill to view unlocked notes
  if (balloonProgressPill) {
    balloonProgressPill.addEventListener('click', () => {
      showGrandUnlockModal();
    });
  }

  function showGrandUnlockModal() {
    if (!grandUnlockModal) return;
    if (collectedNotesList) {
      collectedNotesList.innerHTML = '';
      balloonMessages.forEach(item => {
        const isUnlocked = unlockedNotes.includes(item.id);
        const div = document.createElement('div');
        div.className = 'collected-note-item';
        div.innerHTML = `
          <strong>${item.emoji} Note #${item.id}:</strong> ${isUnlocked ? item.text : '<em>[Locked - Pop balloon to reveal]</em>'}
        `;
        collectedNotesList.appendChild(div);
      });
    }
    grandUnlockModal.classList.add('show');
  }

  if (grandUnlockCloseBtn) {
    grandUnlockCloseBtn.addEventListener('click', () => {
      grandUnlockModal.classList.remove('show');
    });
  }

  // Respawn all balloons
  if (respawnBalloonsBtn) {
    respawnBalloonsBtn.addEventListener('click', () => {
      grandUnlockModal.classList.remove('show');
      unlockedNotes = [];
      localStorage.setItem('tuli_unlocked_balloon_notes', JSON.stringify([]));
      updateBalloonProgressUI();
      balloonElements.forEach(b => {
        b.classList.remove('popped');
      });
      launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 120);
    });
  }

  // Balloon Click & Pop Handler
  balloonElements.forEach(balloon => {
    balloon.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(balloon.dataset.id, 10);
      const msg = balloon.dataset.msg;

      const rect = balloon.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      // Confetti + floating hearts explosion
      launchConfettiBurst(originX, originY, 45);
      if (window.romanticAudio) window.romanticAudio.playTick();

      // Balloon pop effect
      balloon.classList.add('popped');

      // Add to unlocked
      if (!unlockedNotes.includes(id)) {
        unlockedNotes.push(id);
        localStorage.setItem('tuli_unlocked_balloon_notes', JSON.stringify(unlockedNotes));
      }
      updateBalloonProgressUI();

      // Show the sweet love note
      setTimeout(() => {
        showBalloonLoveNote(msg);
      }, 250);

      // Check if all 6 unlocked!
      if (unlockedNotes.length === 6) {
        setTimeout(() => {
          hideBalloonLoveNote();
          showGrandUnlockModal();
          launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 140);
          setTimeout(() => launchConfettiCannon(0.2, 0.5), 350);
          setTimeout(() => launchConfettiCannon(0.8, 0.5), 700);
        }, 3200);
      }
    });
  });

  // Interactive 3D Surprise Birthday Gift Box
  const giftBox = document.getElementById('heroGiftBox');
  const unwrappedMsg = document.getElementById('heroUnwrappedMsg');
  const closeGiftMsgBtn = document.getElementById('closeGiftMsgBtn');

  if (giftBox) {
    giftBox.addEventListener('click', () => {
      if (window.romanticAudio) window.romanticAudio.playSuccessChime();
      launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 120);
      setTimeout(() => launchConfettiCannon(0.2, 0.5), 300);
      setTimeout(() => launchConfettiCannon(0.8, 0.5), 600);
      if (unwrappedMsg) unwrappedMsg.classList.add('show');
    });
  }
  if (closeGiftMsgBtn && unwrappedMsg) {
    closeGiftMsgBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      unwrappedMsg.classList.remove('show');
    });
  }

  const triggerCelebrationBtn = document.getElementById('triggerCelebrationBtn');
  if (triggerCelebrationBtn) {
    triggerCelebrationBtn.addEventListener('click', () => {
      if (window.romanticAudio) {
        window.romanticAudio.play();
        window.romanticAudio.playSuccessChime();
      }
      launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 120);
      setTimeout(() => launchConfettiCannon(0.2, 0.5), 300);
      setTimeout(() => launchConfettiCannon(0.8, 0.5), 600);
    });
  }

  // =================================================================
  // 4. CHAPTER 2: 🎬 "MUST WATCH" CINEMATIC LOVE REEL
  // =================================================================
  const reelSlides = [
    {
      img: 'images/Engagment.jpeg',
      tag: 'Chapter I • The Sacred Promise 💍',
      heading: 'The Moment She Said YES!',
      desc: 'My proudest day. Slipping that ring on your finger was my vow to love, protect, and cherish you through all of eternity.'
    },
    {
      img: 'images/First date.jpeg',
      tag: 'Chapter II • Where It All Began ☕',
      heading: 'Our Very First Coffee Date',
      desc: 'That nervous first glance across the table... Hours flew like minutes, and I walked home knowing I had met my soulmate.'
    },
    {
      img: 'images/_RRF6428-web.jpg',
      tag: 'Chapter III • Royal Grace 👑',
      heading: 'Queen of My Entire Universe',
      desc: 'You possess a beauty, poise, and gentle kindness that leaves me breathless every single time I look at you.'
    },
    {
      img: 'images/Second date.jpeg',
      tag: 'Chapter IV • No Turning Back 🌸',
      heading: 'Falling Deeper into Your Orbit',
      desc: 'Walking hand in hand with you, laughing until our cheeks hurt, and realizing home is not a place—it is you.'
    },
    {
      img: 'images/_RRF6444-web.jpg',
      tag: 'Chapter V • Golden Hour Sunsets ✨',
      heading: 'Holding You Close Forever',
      desc: 'Every sunset is sweeter with you. Holding you close in my arms is the safest, happiest feeling on Earth.'
    },
    {
      img: 'images/_RRF6992-web.jpg',
      tag: 'Chapter VI • Forever Yours ❤️',
      heading: 'Happy 24th Birthday, My Sweet Tulsi',
      desc: 'To my fiancé, my best friend, and my future wife—Kanu loves you beyond words, today and for all tomorrows.'
    }
  ];

  let currentReelIndex = 0;
  let isReelPaused = false;
  const slideDuration = 5500;
  let slideStartTime = Date.now();

  const segmentsContainer = document.getElementById('reelProgressSegments');
  const slideImg = document.getElementById('reelSlideImg');
  const slideTag = document.getElementById('reelSlideTag');
  const slideHeading = document.getElementById('reelSlideHeading');
  const slideDesc = document.getElementById('reelSlideDesc');
  const playPauseBtn = document.getElementById('reelPlayPauseBtn');

  if (segmentsContainer) {
    segmentsContainer.innerHTML = '';
    reelSlides.forEach((_, i) => {
      const seg = document.createElement('div');
      seg.className = 'reel-segment-bar';
      seg.innerHTML = `<div class="reel-segment-fill" id="reelSegFill${i}"></div>`;
      segmentsContainer.appendChild(seg);
    });
  }

  function displayReelSlide(idx) {
    if (!slideImg) return;
    currentReelIndex = idx;
    const slide = reelSlides[idx];

    slideImg.style.opacity = '0';
    setTimeout(() => {
      slideImg.src = slide.img;
      slideImg.style.opacity = '1';
    }, 200);

    slideTag.textContent = slide.tag;
    slideHeading.textContent = slide.heading;
    slideDesc.textContent = slide.desc;

    reelSlides.forEach((_, i) => {
      const fill = document.getElementById(`reelSegFill${i}`);
      if (fill) {
        if (i < idx) fill.style.width = '100%';
        else if (i > idx) fill.style.width = '0%';
        else fill.style.width = '0%';
      }
    });

    startSlideProgress();
  }

  let progressInterval = null;

  function startSlideProgress() {
    clearInterval(progressInterval);
    slideStartTime = Date.now();

    const fill = document.getElementById(`reelSegFill${currentReelIndex}`);
    progressInterval = setInterval(() => {
      if (isReelPaused) return;
      const elapsed = Date.now() - slideStartTime;
      const pct = Math.min(100, (elapsed / slideDuration) * 100);
      if (fill) fill.style.width = `${pct}%`;

      if (elapsed >= slideDuration) {
        clearInterval(progressInterval);
        nextReelSlide();
      }
    }, 50);
  }

  function nextReelSlide() {
    currentReelIndex = (currentReelIndex + 1) % reelSlides.length;
    displayReelSlide(currentReelIndex);
  }

  function prevReelSlide() {
    currentReelIndex = (currentReelIndex - 1 + reelSlides.length) % reelSlides.length;
    displayReelSlide(currentReelIndex);
  }

  function toggleReelPause() {
    isReelPaused = !isReelPaused;
    if (playPauseBtn) {
      playPauseBtn.textContent = isReelPaused ? '▶' : '⏸';
    }
  }

  const tapLeft = document.getElementById('reelTapLeft');
  const tapRight = document.getElementById('reelTapRight');
  const tapCenter = document.getElementById('reelTapCenter');

  if (tapLeft) tapLeft.addEventListener('click', prevReelSlide);
  if (tapRight) tapRight.addEventListener('click', nextReelSlide);
  if (tapCenter) tapCenter.addEventListener('click', toggleReelPause);
  if (playPauseBtn) playPauseBtn.addEventListener('click', toggleReelPause);

  displayReelSlide(0);

  // =================================================================
  // 5. CHAPTER 4: 📸 GRAND POLAROID GALLERY (EXACT 40 PHOTOS)
  // =================================================================
  const galleryPhotos = [
    { src: 'images/Engagment.jpeg', category: 'engagement', caption: 'She Said YES! 💍' },
    { src: 'images/Engagment (2).jpeg', category: 'engagement', caption: 'Two Souls, One Ring 💖' },
    { src: 'images/First date.jpeg', category: 'dates', caption: 'Where It All Began ☕' },
    { src: 'images/Second date.jpeg', category: 'dates', caption: 'Second Date Magic 🌸' },
    { src: 'images/_RRF6428-web.jpg', category: 'photoshoot', caption: 'Queen of My Heart 👑' },
    { src: 'images/_RRF6444-web.jpg', category: 'photoshoot', caption: 'Golden Hour Poetry ✨' },
    { src: 'images/_RRF6356-web.jpg', category: 'photoshoot', caption: 'Your Radiant Smile 🌸' },
    { src: 'images/_RRF6438-web.jpg', category: 'photoshoot', caption: 'Royalty & Grace 🌹' },
    { src: 'images/_RRF6560-web.jpg', category: 'photoshoot', caption: 'Holding You Close Forever 💫' },
    { src: 'images/_RRF6983-web.jpg', category: 'photoshoot', caption: 'Our Tomorrow is Golden 🌅' },
    { src: 'images/_RRF6992-web.jpg', category: 'photoshoot', caption: "Kanu's One & Only Tuli 🕊️" },
    { src: 'images/IMG_2794.JPG.jpeg', category: 'candids', caption: 'Little Moments, Big Love 💖' },
    { src: 'images/IMG_2829.JPG.jpeg', category: 'candids', caption: 'Sun-Kissed & Smiling ☀️' },
    { src: 'images/IMG_7713.JPG.jpeg', category: 'candids', caption: 'Silly Faces & Laughs 🐣' },
    { src: 'images/IMG_7719.JPG.jpeg', category: 'candids', caption: 'My Favorite Distraction 📱' },
    { src: 'images/IMG_7728.JPG.jpeg', category: 'candids', caption: 'Effortlessly Gorgeous 🌸' },
    { src: 'images/IMG_7735.JPG.jpeg', category: 'candids', caption: 'Peace in Your Presence 🕊️' },
    { src: 'images/IMG_8086.JPG.jpeg', category: 'candids', caption: 'Late Night Banter 🌙' },
    { src: 'images/IMG_8099.JPG.jpeg', category: 'candids', caption: 'Everyday Happiness 💕' },
    { src: 'images/IMG_8304.JPG.jpeg', category: 'dates', caption: 'Café Dates with Tuli 🍰' },
    { src: 'images/IMG_8351.JPG.jpeg', category: 'dates', caption: 'Foodie Adventures 🍕' },
    { src: 'images/IMG_8383.JPG.jpeg', category: 'dates', caption: 'A Toast to Us 🥂' },
    { src: 'images/IMG_8473.JPG.jpeg', category: 'candids', caption: 'Your Cute Pouts 🥺' },
    { src: 'images/IMG_8477.JPG.jpeg', category: 'candids', caption: 'Playful Moods 🎀' },
    { src: 'images/IMG_8789.JPG.jpeg', category: 'dates', caption: 'Casual Days, Deep Connection 👟' },
    { src: 'images/IMG_8854.JPG.jpeg', category: 'dates', caption: 'Walking Hand in Hand 🤝' },
    { src: 'images/IMG_8979.JPG.jpeg', category: 'candids', caption: 'Brightening My Dark Days 🌟' },
    { src: 'images/IMG_9058.JPG.jpeg', category: 'candids', caption: 'Deep Conversations 💭' },
    { src: 'images/IMG_9331.JPG.jpeg', category: 'candids', caption: 'Unfiltered Sweetness 🍬' },
    { src: 'images/IMG_9738.JPG.jpeg', category: 'candids', caption: 'Dressed Up & Stunning 💄' },
    { src: 'images/IMG_9750.JPG.jpeg', category: 'candids', caption: 'Candid Beauty in Motion 📸' },
    { src: 'images/IMG_9756.JPG.jpeg', category: 'candids', caption: 'Eyes That Speak Volumes 👀' },
    { src: 'images/IMG_9758.JPG.jpeg', category: 'candids', caption: 'Soft Whispers & Giggles 🤭' },
    { src: 'images/IMG_9772.JPG.jpeg', category: 'candids', caption: 'Unforgettable Moments 🎞️' },
    { src: 'images/IMG_9790.JPG.jpeg', category: 'candids', caption: 'Just You & Me 💑' },
    { src: 'images/IMG_9825.JPG.jpeg', category: 'candids', caption: 'My Heartbeat 💓' },
    { src: 'images/IMG_9832.JPG.jpeg', category: 'candids', caption: 'Golden Memories 🏆' },
    { src: 'images/IMG_9870.JPG.jpeg', category: 'candids', caption: 'My Forever Person 💍' },
    { src: 'images/IMG_9871.JPG.jpeg', category: 'candids', caption: 'To Eternity and Beyond 🚀' }
  ];

  const galleryGrid = document.getElementById('grandPolaroidGrid');
  let activeFilter = 'all';
  let filteredPhotos = [...galleryPhotos];
  let lightboxIdx = 0;

  function renderPolaroids() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    filteredPhotos = galleryPhotos.filter(p => activeFilter === 'all' || p.category === activeFilter);

    filteredPhotos.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'polaroid-card';

      card.innerHTML = `
        <div class="polaroid-photo-box">
          <img src="${item.src}" alt="${item.caption}" loading="lazy" onerror="this.closest('.polaroid-card') && this.closest('.polaroid-card').remove();" />
          <div class="polaroid-heart-btn" title="Love this memory">💖</div>
        </div>
        <div class="polaroid-caption-text">${item.caption}</div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('polaroid-heart-btn')) {
          e.stopPropagation();
          const r = e.target.getBoundingClientRect();
          launchConfettiBurst(r.left + 14, r.top + 14, 18);
          return;
        }
        openLightbox(index);
      });

      galleryGrid.appendChild(card);
    });
  }

  document.querySelectorAll('.cat-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderPolaroids();
    });
  });

  renderPolaroids();

  // Lightbox
  const lightbox = document.getElementById('luxuryLightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbClose = document.getElementById('lightboxCloseBtn');
  const lbPrev = document.getElementById('lightboxPrevBtn');
  const lbNext = document.getElementById('lightboxNextBtn');

  function openLightbox(idx) {
    lightboxIdx = idx;
    updateLightbox();
    if (lightbox) lightbox.classList.add('active');
  }

  function updateLightbox() {
    if (filteredPhotos.length === 0) return;
    const photo = filteredPhotos[lightboxIdx];
    if (lbImg) lbImg.src = photo.src;
    if (lbCaption) lbCaption.textContent = photo.caption;
  }

  if (lbClose) lbClose.addEventListener('click', () => lightbox.classList.remove('active'));
  if (lbNext) lbNext.addEventListener('click', () => {
    lightboxIdx = (lightboxIdx + 1) % filteredPhotos.length;
    updateLightbox();
  });
  if (lbPrev) lbPrev.addEventListener('click', () => {
    lightboxIdx = (lightboxIdx - 1 + filteredPhotos.length) % filteredPhotos.length;
    updateLightbox();
  });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });
  }

  // Global helper for opening lightbox from timeline
  window.openLightbox = function(src, caption) {
    if (lbImg && lbCaption && lightbox) {
      lbImg.src = src;
      lbCaption.textContent = caption;
      lightbox.classList.add('active');
      launchConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 35);
    }
  };

  // =================================================================
  // 6. CHAPTER 6: 🎂 VIRTUAL CAKE BLOWOUT
  // =================================================================
  const cakeBox = document.getElementById('cakeTapContainer');
  const wishBanner = document.getElementById('cakeWishBanner');
  let cakeBlown = false;

  if (cakeBox) {
    cakeBox.addEventListener('click', () => {
      if (cakeBlown) return;
      cakeBlown = true;

      cakeBox.querySelectorAll('.candle').forEach(c => c.classList.add('blown'));

      if (window.romanticAudio) window.romanticAudio.playSuccessChime();
      launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 120);
      setTimeout(() => launchConfettiCannon(0.2, 0.5), 300);
      setTimeout(() => launchConfettiCannon(0.8, 0.5), 600);

      if (wishBanner) wishBanner.classList.add('show');
    });
  }

  // =================================================================
  // 7. CHAPTER 7: 💋 SEND KISSES TO KANU
  // =================================================================
  const kissesBtn = document.getElementById('sendKissesBtn');
  const kissesCounter = document.getElementById('kissesCounter');
  let kissCount = parseInt(localStorage.getItem('tuli_kisses_total') || '0', 10);

  function updateKisses() {
    if (kissCount > 0 && kissesCounter) {
      kissesCounter.textContent = `💖 ${kissCount} Sweet Kisses Sent to Kanu!`;
    }
  }
  updateKisses();

  if (kissesBtn) {
    kissesBtn.addEventListener('click', () => {
      kissCount++;
      localStorage.setItem('tuli_kisses_total', kissCount);
      updateKisses();

      const r = kissesBtn.getBoundingClientRect();
      const originX = r.left + r.width / 2;
      const originY = r.top;

      const emojis = ['💖', '💋', '🌸', '✨', '💍', '🥰'];
      for (let i = 0; i < 14; i++) {
        const el = document.createElement('div');
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.position = 'fixed';
        el.style.left = `${originX}px`;
        el.style.top = `${originY}px`;
        el.style.fontSize = `${Math.random() * 20 + 20}px`;
        el.style.pointerEvents = 'none';
        el.style.zIndex = '99999';
        el.style.transition = 'all 1.6s cubic-bezier(0.2, 0.8, 0.4, 1)';
        el.style.transform = `translate(0, 0) scale(0.6)`;
        el.style.opacity = '1';

        document.body.appendChild(el);

        const destX = (Math.random() - 0.5) * 320;
        const destY = -Math.random() * 260 - 80;

        requestAnimationFrame(() => {
          el.style.transform = `translate(${destX}px, ${destY}px) scale(${Math.random() * 0.8 + 1.1}) rotate(${(Math.random() - 0.5) * 60}deg)`;
          el.style.opacity = '0';
        });

        setTimeout(() => el.remove(), 1650);
      }

      if (window.romanticAudio) window.romanticAudio.playTick();
    });
  }

  // =================================================================
  // 7B. ROYAL ENVELOPE WAX SEAL & UNFOLDING ANIMATION
  // =================================================================
  const envelopeCard = document.getElementById('envelopeCard');
  const waxSealBtn = document.getElementById('waxSealBtn');
  const resealLetterBtn = document.getElementById('resealLetterBtn');
  const unfoldedLetterPaper = document.getElementById('unfoldedLetterPaper');
  const envelopePreviewBox = document.getElementById('envelopePreviewBox');

  function openRoyalEnvelope() {
    if (!envelopeCard || envelopeCard.classList.contains('opened')) return;

    // Celebratory audio chimes & seal crack sound
    if (window.romanticAudio) {
      window.romanticAudio.playSuccessChime();
      window.romanticAudio.playTick();
    }

    // Launch celebratory confetti burst
    if (waxSealBtn) {
      const rect = waxSealBtn.getBoundingClientRect();
      launchConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 75);
    } else {
      launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.5, 75);
    }
    setTimeout(() => launchConfettiCannon(0.2, 0.4), 250);
    setTimeout(() => launchConfettiCannon(0.8, 0.4), 500);

    envelopeCard.classList.add('opened');

    // Smooth GSAP letter unfolding & paragraph stagger
    if (typeof gsap !== 'undefined' && unfoldedLetterPaper) {
      gsap.fromTo(unfoldedLetterPaper,
        { opacity: 0, y: 60, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' }
      );
      const paragraphs = unfoldedLetterPaper.querySelectorAll('.letter-text p, .letter-salut, .letter-end, .letter-from, .send-kisses-card');
      gsap.fromTo(paragraphs,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out', delay: 0.2 }
      );
    }
  }

  function resealRoyalEnvelope() {
    if (!envelopeCard) return;
    envelopeCard.classList.remove('opened');
    if (window.romanticAudio) window.romanticAudio.playTick();
    if (typeof gsap !== 'undefined' && envelopePreviewBox) {
      gsap.fromTo(envelopePreviewBox,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openRoyalEnvelope();
    });
  }

  if (envelopePreviewBox) {
    envelopePreviewBox.addEventListener('click', () => {
      openRoyalEnvelope();
    });
  }

  if (resealLetterBtn) {
    resealLetterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resealRoyalEnvelope();
    });
  }

  // =================================================================
  // 7C. CUTE ANIMATED PLUSHIES: KANU BEAR & TULI BUNNY 🧸🐰
  // =================================================================
  const plushieKanu = document.getElementById('plushieKanu');
  const plushieTuli = document.getElementById('plushieTuli');
  const kanuSpeechBubble = document.getElementById('kanuSpeechBubble');
  const tuliSpeechBubble = document.getElementById('tuliSpeechBubble');
  const plushieCuddleBtn = document.getElementById('plushieCuddleBtn');

  const kanuQuotes = [
    "Bov Badhu love you bacchudi! 🧸❤️",
    "You are my whole universe, Tuli! ✨",
    "Can't wait to be your husband! 💍",
    "My sweetest princess forever! 👑",
    "Kanu's heart belongs only to you! 💕"
  ];
  let kanuQuoteIdx = 0;

  const tuliQuotes = [
    "My sweetest Kanu! 🐰🌸",
    "Hehe, forever your bacchudi! 💖",
    "Best fiancé in the universe! 💍",
    "Always smiling because of you! ✨",
    "Sending you 1,000 warm hugs! 🤗"
  ];
  let tuliQuoteIdx = 0;

  function spawnFloatingEmoji(x, y, emojiList) {
    for (let i = 0; i < 7; i++) {
      const el = document.createElement('div');
      el.textContent = emojiList[Math.floor(Math.random() * emojiList.length)];
      el.style.position = 'fixed';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.fontSize = `${Math.random() * 14 + 18}px`;
      el.style.pointerEvents = 'none';
      el.style.zIndex = '10005';
      el.style.transition = 'all 1.4s cubic-bezier(0.2, 0.8, 0.4, 1)';
      el.style.transform = 'translate(0, 0) scale(0.6)';
      el.style.opacity = '1';
      document.body.appendChild(el);

      const dx = (Math.random() - 0.5) * 140;
      const dy = -Math.random() * 150 - 50;

      requestAnimationFrame(() => {
        el.style.transform = `translate(${dx}px, ${dy}px) scale(1.15) rotate(${(Math.random() - 0.5) * 45}deg)`;
        el.style.opacity = '0';
      });
      setTimeout(() => el.remove(), 1450);
    }
  }

  if (plushieKanu) {
    plushieKanu.addEventListener('click', (e) => {
      e.stopPropagation();
      kanuQuoteIdx = (kanuQuoteIdx + 1) % kanuQuotes.length;
      if (kanuSpeechBubble) {
        kanuSpeechBubble.textContent = kanuQuotes[kanuQuoteIdx];
        kanuSpeechBubble.classList.add('active');
        setTimeout(() => kanuSpeechBubble.classList.remove('active'), 3400);
      }
      if (window.romanticAudio) window.romanticAudio.playTick();
      if (typeof gsap !== 'undefined') {
        gsap.timeline()
          .to(plushieKanu, { scale: 1.25, rotation: -8, duration: 0.14, ease: 'power1.out' })
          .to(plushieKanu, { scale: 1.2, rotation: 8, duration: 0.14, ease: 'power1.out' })
          .to(plushieKanu, { scale: 1, rotation: 0, duration: 0.28, ease: 'bounce.out' });
      }
      const r = plushieKanu.getBoundingClientRect();
      spawnFloatingEmoji(r.left + r.width / 2, r.top, ['💖', '🧸', '✨', '💍', '❤️']);
    });
  }

  if (plushieTuli) {
    plushieTuli.addEventListener('click', (e) => {
      e.stopPropagation();
      tuliQuoteIdx = (tuliQuoteIdx + 1) % tuliQuotes.length;
      if (tuliSpeechBubble) {
        tuliSpeechBubble.textContent = tuliQuotes[tuliQuoteIdx];
        tuliSpeechBubble.classList.add('active');
        setTimeout(() => tuliSpeechBubble.classList.remove('active'), 3400);
      }
      if (window.romanticAudio) window.romanticAudio.playTick();
      if (typeof gsap !== 'undefined') {
        gsap.timeline()
          .to(plushieTuli, { y: -22, scale: 1.25, duration: 0.16, ease: 'power2.out' })
          .to(plushieTuli, { y: 0, scale: 1, duration: 0.32, ease: 'bounce.out' });
      }
      const r = plushieTuli.getBoundingClientRect();
      spawnFloatingEmoji(r.left + r.width / 2, r.top, ['🌸', '🐰', '💕', '✨', '🌷']);
    });
  }

  if (plushieCuddleBtn) {
    plushieCuddleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.romanticAudio) window.romanticAudio.playSuccessChime();
      launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.9, 90);

      if (kanuSpeechBubble) {
        kanuSpeechBubble.textContent = "Forever & Always With You! 🧸❤️";
        kanuSpeechBubble.classList.add('active');
      }
      if (tuliSpeechBubble) {
        tuliSpeechBubble.textContent = "My Sweetest Kanu! 🐰💖";
        tuliSpeechBubble.classList.add('active');
      }

      if (typeof gsap !== 'undefined' && plushieKanu && plushieTuli) {
        const centerOffset = Math.min(window.innerWidth * 0.36, 260);
        const tl = gsap.timeline();
        tl.to(plushieKanu, { x: centerOffset, duration: 0.65, ease: 'power2.inOut' }, 0)
          .to(plushieTuli, { x: -centerOffset, duration: 0.65, ease: 'power2.inOut' }, 0)
          .to(plushieKanu, { rotation: 12, scale: 1.2, duration: 0.25 }, 0.65)
          .to(plushieTuli, { rotation: -12, scale: 1.2, duration: 0.25 }, 0.65)
          .to([plushieKanu, plushieTuli], {
            x: 0,
            rotation: 0,
            scale: 1,
            duration: 0.75,
            ease: 'power2.inOut',
            delay: 1.6,
            onComplete: () => {
              if (kanuSpeechBubble) kanuSpeechBubble.classList.remove('active');
              if (tuliSpeechBubble) tuliSpeechBubble.classList.remove('active');
            }
          });
      }
    });
  }

  // =================================================================
  // 7D. 🌹 24-ROSE GOLDEN BOUQUET CELEBRATION
  // =================================================================
  const giftRosesBtn = document.getElementById('giftRosesBtn');
  const bouquetToastBanner = document.getElementById('bouquetToastBanner');

  if (giftRosesBtn) {
    giftRosesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.romanticAudio) {
        window.romanticAudio.play();
        window.romanticAudio.playSuccessChime();
      }

      const rect = giftRosesBtn.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      // 24 Roses flurry
      for (let i = 0; i < 24; i++) {
        setTimeout(() => {
          const roseEl = document.createElement('div');
          roseEl.textContent = i % 2 === 0 ? '🌹' : '🌸';
          roseEl.style.position = 'fixed';
          roseEl.style.left = `${originX}px`;
          roseEl.style.top = `${originY}px`;
          roseEl.style.fontSize = `${Math.random() * 18 + 26}px`;
          roseEl.style.pointerEvents = 'none';
          roseEl.style.zIndex = '99999';
          roseEl.style.transition = 'all 2.2s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
          roseEl.style.transform = 'translate(0, 0) scale(0.5)';
          roseEl.style.opacity = '1';
          document.body.appendChild(roseEl);

          const angle = (i / 24) * Math.PI * 2;
          const dist = Math.random() * 280 + 120;
          const destX = Math.cos(angle) * dist;
          const destY = Math.sin(angle) * dist - 100;

          requestAnimationFrame(() => {
            roseEl.style.transform = `translate(${destX}px, ${destY}px) scale(1.25) rotate(${Math.random() * 360}deg)`;
            roseEl.style.opacity = '0';
          });
          setTimeout(() => roseEl.remove(), 2300);
        }, i * 35);
      }

      // Launch confetti
      launchConfettiBurst(originX, originY, 65);

      // Show toast
      if (bouquetToastBanner) {
        bouquetToastBanner.classList.add('show');
        setTimeout(() => bouquetToastBanner.classList.remove('show'), 3800);
      }
    });
  }

  // =================================================================
  // 8. AMBIENT PARTICLES CANVAS
  // =================================================================
  const ambCanvas = document.getElementById('ambientCanvas');
  if (ambCanvas) {
    const ctx = ambCanvas.getContext('2d');
    let w = ambCanvas.width = window.innerWidth;
    let h = ambCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      w = ambCanvas.width = window.innerWidth;
      h = ambCanvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = ['#FFCAD4', '#FFE5DA', '#D4BEFF', '#FFB3A7', '#FF7B89', '#FFD166', '#FF9EAA'];

    for (let i = 0; i < 55; i++) {
      const typeRand = Math.random();
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: -Math.random() * 0.55 - 0.25,
        alpha: Math.random() * 0.5 + 0.25,
        type: typeRand > 0.65 ? 'petal' : (typeRand > 0.35 ? 'heart' : (typeRand > 0.15 ? 'star' : 'circle')),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.025
      });
    }

    function drawRosePetal(c, x, y, size, color, alpha, rotation) {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.beginPath();
      c.moveTo(0, -size);
      c.bezierCurveTo(size * 0.75, -size * 0.8, size * 0.9, size * 0.4, 0, size);
      c.bezierCurveTo(-size * 0.9, size * 0.4, -size * 0.75, -size * 0.8, 0, -size);
      c.closePath();
      c.fill();
      c.restore();
    }

    function drawHeart(c, x, y, size, color, alpha) {
      c.save();
      c.translate(x, y);
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
      c.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fill();
      c.restore();
    }

    function drawStar(c, cx, cy, spikes, outerRadius, innerRadius, color, alpha) {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      c.save();
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.beginPath();
      c.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        c.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        c.lineTo(x, y);
        rot += step;
      }
      c.lineTo(cx, cy - outerRadius);
      c.closePath();
      c.fill();
      c.restore();
    }

    function loopAmb() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        if (p.type === 'petal') {
          drawRosePetal(ctx, p.x, p.y, p.size, p.color, p.alpha, p.rotation);
        } else if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.alpha);
        } else if (p.type === 'star') {
          drawStar(ctx, p.x, p.y, 4, p.size, p.size * 0.35, '#FFD166', p.alpha * 1.2);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });
      requestAnimationFrame(loopAmb);
    }
    loopAmb();
  }

  // =================================================================
  // 9. CONFETTI SYSTEM
  // =================================================================
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  const confParticles = [];
  const confColors = ['#FF7B89', '#FFB3A7', '#D4BEFF', '#FFD166', '#E76F51', '#B5EAD7', '#FFF'];

  function resizeConfetti() {
    if (confettiCanvas) {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
  }
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  function launchConfettiBurst(originX, originY, count = 75) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      confParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5,
        color: confColors[Math.floor(Math.random() * confColors.length)],
        size: Math.random() * 8 + 6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
        decay: Math.random() * 0.012 + 0.008
      });
    }
  }

  function launchConfettiCannon(relX, relY) {
    launchConfettiBurst(window.innerWidth * relX, window.innerHeight * relY, 80);
  }

  function renderConfetti() {
    if (!confCtx) return;
    confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confParticles.length - 1; i >= 0; i--) {
      const p = confParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22;
      p.vx *= 0.985;
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > window.innerHeight + 50) {
        confParticles.splice(i, 1);
        continue;
      }

      confCtx.save();
      confCtx.translate(p.x, p.y);
      confCtx.rotate((p.rotation * Math.PI) / 180);
      confCtx.globalAlpha = p.alpha;
      confCtx.fillStyle = p.color;
      confCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      confCtx.restore();
    }
    requestAnimationFrame(renderConfetti);
  }
  renderConfetti();

  window.launchConfettiBurst = launchConfettiBurst;
  window.launchConfettiCannon = launchConfettiCannon;

  // =================================================================
  // 10. AWWWARDS GSAP MAGNETIC BUTTONS
  // =================================================================
  if (typeof gsap !== 'undefined') {
    const magneticElements = document.querySelectorAll('.btn-primary-glow, .btn-secondary-glass, .dock-btn, .floating-audio-pill, .cat-tab-btn');
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        gsap.to(el, {
          x: relX * 0.32,
          y: relY * 0.32,
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    });
  }

  // =================================================================
  // 11. LA REVOLTOSA DRAGGABLE VINTAGE LOVE BADGES
  // =================================================================
  const badges = document.querySelectorAll('.draggable-badge');
  badges.forEach(badge => {
    let isDragging = false;
    let startX = 0, startY = 0, origLeft = 0, origTop = 0;

    badge.addEventListener('pointerdown', (e) => {
      isDragging = true;
      try { badge.setPointerCapture(e.pointerId); } catch (_) {}
      const rect = badge.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      origLeft = rect.left;
      origTop = rect.top;
      badge.style.transition = 'none';
      if (window.romanticAudio) window.romanticAudio.playTick();
    });

    badge.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      badge.style.left = `${origLeft + dx}px`;
      badge.style.top = `${origTop + dy}px`;
      badge.style.transform = `rotate(${dx * 0.05}deg) scale(1.15)`;
    });

    const endDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try { badge.releasePointerCapture(e.pointerId); } catch (_) {}
      badge.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      badge.style.transform = '';
      const r = badge.getBoundingClientRect();
      launchConfettiBurst(r.left + r.width / 2, r.top + r.height / 2, 22);
    };

    badge.addEventListener('pointerup', endDrag);
    badge.addEventListener('pointercancel', endDrag);
  });

  // =================================================================
  // 12. FLUID MAGNETIC CUSTOM CURSOR
  // =================================================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && window.innerWidth > 768) {
    let curX = window.innerWidth / 2;
    let curY = window.innerHeight / 2;
    let ringX = curX;
    let ringY = curY;

    window.addEventListener('mousemove', (e) => {
      curX = e.clientX;
      curY = e.clientY;
      cursorDot.style.left = `${curX}px`;
      cursorDot.style.top = `${curY}px`;
    });

    function updateCursorRing() {
      ringX += (curX - ringX) * 0.16;
      ringY += (curY - ringY) * 0.16;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(updateCursorRing);
    }
    updateCursorRing();

    // Hover morphing on interactive elements
    const hoverTargets = document.querySelectorAll('button, a, .polaroid-card, .draggable-badge, .interactive-balloon, .hero-gift-card, .reason-flip-card, .candle, .cat-tab-btn, .timeline-thumb, .balloon-progress-pill, .wax-seal-btn, .plushie-item, .plushie-cuddle-btn, .flower-bouquet-pill');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => cursorRing.classList.add('active-hover'));
      target.addEventListener('mouseleave', () => cursorRing.classList.remove('active-hover'));
    });
  }
});
