/* ===================================================================
   TULI'S 24TH BIRTHDAY CELEBRATION — MASTER JAVASCRIPT ENGINE
   Awwwards & La Revoltosa-Caliber Architecture (GSAP, WebGL, Web Audio)
   Dedicated with unconditional love from Kanu (Yogi) to Tulsi (Tuli) 💍
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =================================================================
  // 0. GUARANTEED FRESH START ON EVERY OPEN / RELOAD
  // =================================================================
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Clear any persistent browser storage so site ALWAYS starts 100% fresh from beginning
  try {
    localStorage.removeItem('tuli_balloon_unlocked_ids');
    localStorage.removeItem('tuli_kisses_count');
  } catch (e) {}

  // =================================================================
  // 1. PROCEDURAL AUDIO & CALM BIRTHDAY MELODY SYSTEM
  // =================================================================
  class RomanticAudioSystem {
    constructor() {
      this.ctx = null;
      this.bgMusic = null;
      this.isPlaying = false;
      this.hasInteracted = false;
      this.initBGM();
    }

    initCtx() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    initBGM() {
      this.bgMusic = new Audio('music/happy_birthday_calm.wav');
      this.bgMusic.loop = true;
      this.bgMusic.volume = 0.55;
    }

    play() {
      this.initCtx();
      if (this.bgMusic) {
        this.bgMusic.play().then(() => {
          this.isPlaying = true;
          this.updateUI();
        }).catch(() => {
          this.isPlaying = false;
          this.updateUI();
        });
      }
    }

    pause() {
      if (this.bgMusic) {
        this.bgMusic.pause();
        this.isPlaying = false;
        this.updateUI();
      }
    }

    toggle() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }

    updateUI() {
      const musicBtn = document.getElementById('musicPillBtn');
      const statusText = document.getElementById('musicStatusText');
      if (musicBtn) {
        if (this.isPlaying) {
          musicBtn.classList.remove('paused');
          if (statusText) statusText.textContent = 'Birthday Melody 🌸';
        } else {
          musicBtn.classList.add('paused');
          if (statusText) statusText.textContent = 'Play Melody 🎵';
        }
      }
    }

    playPop() {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    }

    playChime() {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.2, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.65);
      });
    }

    playTick() {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }
  }

  const audioSystem = new RomanticAudioSystem();
  window.romanticAudio = audioSystem;

  // Auto-play on first click anywhere
  const unlockAudioOnFirstGesture = () => {
    if (!audioSystem.hasInteracted) {
      audioSystem.hasInteracted = true;
      audioSystem.play();
    }
    window.removeEventListener('click', unlockAudioOnFirstGesture);
    window.removeEventListener('touchstart', unlockAudioOnFirstGesture);
  };
  window.addEventListener('click', unlockAudioOnFirstGesture);
  window.addEventListener('touchstart', unlockAudioOnFirstGesture, { passive: true });

  const musicPillBtn = document.getElementById('musicPillBtn');
  if (musicPillBtn) {
    musicPillBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audioSystem.toggle();
    });
  }

  // =================================================================
  // 1.5 FULL-SCREEN CINEMATIC INTRO SCREEN (FIREWORKS & BALLOONS)
  // (No touch interruption allowed during the grand animation)
  // =================================================================
  const grandIntroScreen = document.getElementById('grandIntroScreen');
  const introFireworksCanvas = document.getElementById('introFireworksCanvas');
  const introBalloonsContainer = document.getElementById('introBalloonsContainer');
  const introEnterBtn = document.getElementById('introEnterBtn');

  if (grandIntroScreen && introFireworksCanvas && introBalloonsContainer) {
    let introRunning = true;
    let allowInteraction = false;
    const fwCtx = introFireworksCanvas.getContext('2d');

    function resizeIntroCanvas() {
      introFireworksCanvas.width = window.innerWidth;
      introFireworksCanvas.height = window.innerHeight;
    }
    resizeIntroCanvas();
    window.addEventListener('resize', resizeIntroCanvas);

    // Fireworks simulation
    const fireworksParticles = [];
    const fireworksRockets = [];
    const fwColors = ['#FFD166', '#FFCAD4', '#FF7B89', '#D92E4E', '#FFF', '#FFE494', '#E8A598', '#FF9EAA'];

    class Rocket {
      constructor() {
        this.x = Math.random() * introFireworksCanvas.width * 0.8 + introFireworksCanvas.width * 0.1;
        this.y = introFireworksCanvas.height;
        this.targetY = Math.random() * (introFireworksCanvas.height * 0.45) + (introFireworksCanvas.height * 0.15);
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -(Math.random() * 4 + 10);
        this.color = fwColors[Math.floor(Math.random() * fwColors.length)];
        this.alive = true;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.08;
        if (this.vy >= 0 || this.y <= this.targetY) {
          this.alive = false;
          explodeRocket(this.x, this.y, this.color);
        }
      }
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.016 + 0.012;
        this.radius = Math.random() * 2.5 + 1.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.vy += 0.06;
        this.alpha -= this.decay;
      }
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    function explodeRocket(x, y, color) {
      const particleCount = 45;
      for (let i = 0; i < particleCount; i++) {
        fireworksParticles.push(new Particle(x, y, color));
      }
    }

    let lastRocketTime = 0;
    function animateIntroFireworks(now) {
      if (!introRunning) return;
      fwCtx.fillStyle = 'rgba(10, 4, 16, 0.22)';
      fwCtx.fillRect(0, 0, introFireworksCanvas.width, introFireworksCanvas.height);

      if (now - lastRocketTime > 380) {
        fireworksRockets.push(new Rocket());
        if (Math.random() > 0.4) {
          fireworksRockets.push(new Rocket());
        }
        lastRocketTime = now;
      }

      for (let i = fireworksRockets.length - 1; i >= 0; i--) {
        const r = fireworksRockets[i];
        r.update();
        r.draw(fwCtx);
        if (!r.alive) fireworksRockets.splice(i, 1);
      }

      for (let i = fireworksParticles.length - 1; i >= 0; i--) {
        const p = fireworksParticles[i];
        p.update();
        p.draw(fwCtx);
        if (p.alpha <= 0) fireworksParticles.splice(i, 1);
      }

      requestAnimationFrame(animateIntroFireworks);
    }
    requestAnimationFrame(animateIntroFireworks);

    // Floating sky lantern / fire balloons spawner
    const balloonColors = [
      'radial-gradient(circle at 35% 30%, #FFE5DA, #FF7B89 70%, #D92E4E)',
      'radial-gradient(circle at 35% 30%, #FFFDF9, #FFD166 70%, #C59B27)',
      'radial-gradient(circle at 35% 30%, #FFE4EB, #FF9EAA 70%, #FFCAD4)',
      'radial-gradient(circle at 35% 30%, #FFF5EB, #FFB703 70%, #FB8500)'
    ];

    function spawnIntroBalloon() {
      if (!introRunning) return;
      const b = document.createElement('div');
      b.className = 'intro-floating-balloon';
      const size = Math.floor(Math.random() * 26) + 36;
      b.style.width = `${size}px`;
      b.style.height = `${Math.floor(size * 1.25)}px`;
      b.style.left = `${Math.random() * 90 + 5}%`;
      b.style.background = balloonColors[Math.floor(Math.random() * balloonColors.length)];
      const duration = (Math.random() * 2.5 + 4.5).toFixed(1);
      b.style.animationDuration = `${duration}s`;

      const flame = document.createElement('div');
      flame.className = 'intro-balloon-flame';
      b.appendChild(flame);

      introBalloonsContainer.appendChild(b);

      setTimeout(() => {
        if (b.parentNode) b.remove();
      }, parseFloat(duration) * 1000 + 500);
    }

    for (let i = 0; i < 5; i++) {
      setTimeout(spawnIntroBalloon, i * 350);
    }
    const balloonInterval = setInterval(spawnIntroBalloon, 750);

    // NO TOUCH INTERRUPTION for 3.5 seconds
    const touchBlocker = (e) => {
      if (!allowInteraction) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    grandIntroScreen.addEventListener('touchstart', touchBlocker, { passive: false });
    grandIntroScreen.addEventListener('touchmove', touchBlocker, { passive: false });
    grandIntroScreen.addEventListener('click', touchBlocker, { capture: true });

    // Enable interaction & reveal button at 3.5s
    setTimeout(() => {
      allowInteraction = true;
      if (introEnterBtn) {
        introEnterBtn.classList.add('visible');
      }
    }, 3500);

    // Dismiss Intro Screen
    function dismissIntro() {
      if (!introRunning) return;
      introRunning = false;
      clearInterval(balloonInterval);
      grandIntroScreen.classList.add('dismissed');

      // Start music and celebration
      audioSystem.play();
      if (window.launchConfettiBurst) {
        window.launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 90);
      }

      setTimeout(() => {
        window.removeEventListener('resize', resizeIntroCanvas);
      }, 1400);
    }

    if (introEnterBtn) {
      introEnterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissIntro();
      });
    }

    grandIntroScreen.addEventListener('click', () => {
      if (allowInteraction) dismissIntro();
    });
    grandIntroScreen.addEventListener('touchend', () => {
      if (allowInteraction) dismissIntro();
    }, { passive: true });

    setTimeout(() => {
      if (introRunning) dismissIntro();
    }, 6500);
  }

  // =================================================================
  // 2. DISCRETE 1-PAGE DECK CONTROLLER (7 CHAPTERS)
  // =================================================================
  const slides = document.querySelectorAll('.deck-slide');
  const totalSlides = slides.length;
  let activeSlide = 0;
  let isNavigating = false;

  const chapterNames = [
    'Chapter 01 • Royal Entrance',
    'Chapter 02 • Must Watch Film',
    'Chapter 03 • The Sacred Vow',
    'Chapter 04 • Curated Memories',
    'Chapter 05 • 24 Reasons',
    'Chapter 06 • Birthday Tradition',
    'Chapter 07 • Forever Love'
  ];

  const navChapterPill = document.getElementById('navChapterPill');
  const dockDots = document.querySelectorAll('.dock-dot');

  function goToSlide(targetIdx) {
    if (targetIdx < 0 || targetIdx >= totalSlides || targetIdx === activeSlide || isNavigating) return;
    isNavigating = true;

    const currentSlideEl = slides[activeSlide];
    const nextSlideEl = slides[targetIdx];

    // Reset scroll to top on new slide
    if (nextSlideEl) {
      const nextCard = nextSlideEl.querySelector('.slide-content-card');
      if (nextCard) nextCard.scrollTop = 0;
    }

    // GSAP Clean Crossfade (Zero GPU transform glitches)
    if (typeof gsap !== 'undefined') {
      gsap.to(currentSlideEl, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
        onComplete: () => {
          currentSlideEl.classList.remove('active');
          gsap.set(currentSlideEl, { clearProps: 'transform,scale' });
        }
      });

      nextSlideEl.classList.add('active');
      gsap.fromTo(nextSlideEl,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => {
            isNavigating = false;
            gsap.set(nextSlideEl, { clearProps: 'transform,scale' });
          }
        }
      );
    } else {
      currentSlideEl.classList.remove('active');
      nextSlideEl.classList.add('active');
      isNavigating = false;
    }

    activeSlide = targetIdx;

    // Update Dock UI
    if (navChapterPill) {
      navChapterPill.textContent = chapterNames[activeSlide] || `Chapter 0${activeSlide + 1}`;
    }
    dockDots.forEach((d, i) => {
      d.classList.toggle('active', i === activeSlide);
    });

    // Update Story Progress Bar (Instagram / Luxury Editorial Style)
    const storySegments = document.querySelectorAll('.story-segment');
    storySegments.forEach((seg, i) => {
      seg.classList.toggle('completed', i < activeSlide);
      seg.classList.toggle('active', i === activeSlide);
    });

    // Notify WebGL 3D Camera Choreography
    if (window.update3DCamera) {
      window.update3DCamera(activeSlide);
    }

    // Gentle audio tick
    audioSystem.playTick();

    // Calm manual navigation - slide stays active until user swipes
  }

  // Zero auto-advance: Slides stay indefinitely so user can read peacefully

  // Prev / Next Nav Buttons
  const navPrevBtn = document.getElementById('navPrevBtn');
  const navNextBtn = document.getElementById('navNextBtn');
  if (navPrevBtn) navPrevBtn.addEventListener('click', () => goToSlide(activeSlide - 1));
  if (navNextBtn) navNextBtn.addEventListener('click', () => goToSlide(activeSlide + 1));

  // Dock Dots Click
  dockDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => goToSlide(idx));
  });

  // Story Progress Bar Segments Click
  const storySegments = document.querySelectorAll('.story-segment');
  storySegments.forEach((seg, idx) => {
    seg.addEventListener('click', () => goToSlide(idx));
  });

  // Buttons with data-goto
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = parseInt(btn.dataset.goto, 10);
      goToSlide(target);
    });
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      goToSlide(activeSlide + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      goToSlide(activeSlide - 1);
    }
  });

  // Debounced Wheel / Trackpad Gestures (Discrete 1-page step)
  let lastWheelTime = 0;
  window.addEventListener('wheel', (e) => {
    // In Chapter 04 (the photo gallery, index 3), never jump slides via wheel so user can browse all 39 photos calmly!
    if (activeSlide === 3 || e.target.closest('#polaroidDeckGrid, .polaroid-card, .gallery-card, .lightbox-overlay')) {
      return;
    }

    const now = Date.now();
    if (now - lastWheelTime < 750) return;

    // Check if target is inside a scrollable card that has room to scroll
    const scrollableParent = e.target.closest('.slide-content-card, .unlocked-notes-list');
    if (scrollableParent) {
      const atTop = scrollableParent.scrollTop <= 2;
      const atBottom = scrollableParent.scrollTop + scrollableParent.clientHeight >= scrollableParent.scrollHeight - 2;
      if (e.deltaY > 0 && !atBottom) return;
      if (e.deltaY < 0 && !atTop) return;
    }

    if (Math.abs(e.deltaY) > 25) {
      lastWheelTime = now;
      if (e.deltaY > 0) {
        goToSlide(activeSlide + 1);
      } else {
        goToSlide(activeSlide - 1);
      }
    }
  }, { passive: true });

    // =================================================================
  // INTELLIGENT MOBILE TOUCH GESTURES (SWIPE FOR SMOOTH PAGE TURNS)
  // =================================================================
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  window.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    // If inside a modal or lightbox, don't change slides
    if (e.target.closest('.luxury-modal.show, .lightbox-overlay.show, .modal-card, .grand-unlock-card')) {
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    const timeElapsed = Date.now() - touchStartTime;

    // Ignore slow drags or long presses (> 750ms)
    if (timeElapsed > 750) return;

    // Special handling for Slide 5 (Reason flip card swipe left/right to view reasons)
    if (activeSlide === 4 && e.target.closest('#reasonFlipCard, .reason-card-container')) {
      if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          renderReason((currentReasonIdx + 1) % reasonsData.length);
        } else {
          renderReason((currentReasonIdx - 1 + reasonsData.length) % reasonsData.length);
        }
        return;
      }
    }

    // DELIBERATE HORIZONTAL SWIPE FOR SLIDE NAVIGATION:
    // Swipe Left (diffX > 50) = Next Slide
    // Swipe Right (diffX < -50) = Previous Slide
    // Must be predominantly horizontal (|diffX| > |diffY| * 1.35)
    // VERTICAL DRAGGING / SCROLLING NEVER CHANGES SLIDES!
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 1.35) {
      if (diffX > 0) {
        goToSlide(activeSlide + 1);
      } else {
        goToSlide(activeSlide - 1);
      }
    }
  }, { passive: true });

  // =================================================================
  // 3. SLIDE 1: BALLOONS POP-UP & SECRET LOVE NOTES
  // =================================================================
  const balloonElements = document.querySelectorAll('.floating-balloon');
  const balloonModal = document.getElementById('balloonNoteModal');
  const balloonModalQuote = document.getElementById('balloonModalQuote');
  const balloonModalCloseBtn = document.getElementById('balloonModalCloseBtn');
  const balloonModalCollectBtn = document.getElementById('balloonModalCollectBtn');
  const balloonProgressBadge = document.getElementById('balloonProgressBadge');
  const balloonProgressLabel = document.getElementById('balloonProgressLabel');
  const grandUnlockModal = document.getElementById('grandUnlockModal');
  const grandUnlockCloseBtn = document.getElementById('grandUnlockCloseBtn');
  const unlockedNotesList = document.getElementById('unlockedNotesList');
  const respawnBalloonsBtn = document.getElementById('respawnBalloonsBtn');

  const balloonSecretNotes = [
    { id: 1, text: "Bov Badhu love you bacchudi ❤️", emoji: "💖" },
    { id: 2, text: "You are so special to me, my sweetest angel ✨", emoji: "🌸" },
    { id: 3, text: "My future wife, my greatest dream come true 💍", emoji: "👑" },
    { id: 4, text: "Your smile is the most beautiful thing in the whole universe 🌸", emoji: "☀️" },
    { id: 5, text: "Always by your side, holding your hand forever and ever 🤝", emoji: "🕊️" },
    { id: 6, text: "Happy 24th Birthday my princess Tuli, forever yours Kanu 👑💖", emoji: "🎉" }
  ];

  let unlockedIds = [];

  function updateBalloonProgress() {
    const count = unlockedIds.length;
    if (balloonProgressLabel) {
      if (count === 0) {
        balloonProgressLabel.innerHTML = `Pop balloons to unlock Kanu's notes: <strong>0 / 6</strong>`;
      } else if (count < 6) {
        balloonProgressLabel.innerHTML = `💌 Kanu's Secret Notes: <strong>${count} / 6 Unlocked</strong> (Tap to view)`;
      } else {
        balloonProgressLabel.innerHTML = `👑 <strong>ALL 6 NOTES UNLOCKED!</strong> (Tap to open)`;
      }
    }
  }
  updateBalloonProgress();

  function openBalloonModal(noteText, noteId) {
    if (!balloonModal || !balloonModalQuote) return;
    const title = balloonModal.querySelector('.modal-pre-title');
    if (title && noteId) {
      title.textContent = `Secret Message #${noteId} From Kanu`;
    }
    balloonModalQuote.textContent = `"${noteText}"`;
    balloonModal.classList.add('show');
    balloonModal.setAttribute('aria-hidden', 'false');
    audioSystem.playChime();
  }

  function closeBalloonModal() {
    if (balloonModal) {
      balloonModal.classList.remove('show');
      balloonModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (balloonModalCloseBtn) balloonModalCloseBtn.addEventListener('click', closeBalloonModal);
  if (balloonModalCollectBtn) balloonModalCollectBtn.addEventListener('click', closeBalloonModal);

  function openGrandUnlockModal() {
    if (!grandUnlockModal || !unlockedNotesList) return;
    unlockedNotesList.innerHTML = '';
    balloonSecretNotes.forEach(item => {
      const isFound = unlockedIds.includes(item.id);
      const row = document.createElement('div');
      row.className = 'unlocked-note-row';
      row.innerHTML = `<strong>${item.emoji} Note #${item.id}:</strong> ${isFound ? item.text : '<em>[Locked - Pop balloon to reveal]</em>'}`;
      unlockedNotesList.appendChild(row);
    });
    grandUnlockModal.classList.add('show');
    grandUnlockModal.setAttribute('aria-hidden', 'false');
  }

  if (balloonProgressBadge) balloonProgressBadge.addEventListener('click', openGrandUnlockModal);
  if (grandUnlockCloseBtn) {
    grandUnlockCloseBtn.addEventListener('click', () => {
      grandUnlockModal.classList.remove('show');
      grandUnlockModal.setAttribute('aria-hidden', 'true');
    });
  }

  // Respawn Balloons
  if (respawnBalloonsBtn) {
    respawnBalloonsBtn.addEventListener('click', () => {
      grandUnlockModal.classList.remove('show');
      unlockedIds = [];
      updateBalloonProgress();
      balloonElements.forEach(b => {
        b.classList.remove('popped');
        const tip = b.querySelector('.balloon-pop-tip');
        if (tip) tip.textContent = 'POP ME! 🎈';
      });
      launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.4, 100);
      audioSystem.playChime();
    });
  }

  // Balloon Click Handler
  balloonElements.forEach(balloon => {
    balloon.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(balloon.dataset.id, 10);
      const msg = balloon.dataset.msg;

      const rect = balloon.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const wasPopped = balloon.classList.contains('popped');

      if (!wasPopped) {
        audioSystem.playPop();
        launchConfettiBurst(cx, cy, 35);
        balloon.classList.add('popped');
        const tip = balloon.querySelector('.balloon-pop-tip');
        if (tip) tip.textContent = 'UNLOCKED! ✨';

        if (!unlockedIds.includes(id)) {
          unlockedIds.push(id);
        }
        updateBalloonProgress();
      } else {
        audioSystem.playChime();
        launchConfettiBurst(cx, cy, 15);
      }

      setTimeout(() => openBalloonModal(msg, id), 180);

      // Check if all unlocked
      if (unlockedIds.length === 6 && !wasPopped) {
        setTimeout(() => {
          closeBalloonModal();
          setTimeout(() => {
            openGrandUnlockModal();
            launchConfettiCannon(0.2, 0.4);
            launchConfettiCannon(0.8, 0.4);
          }, 300);
        }, 2200);
      }
    });
  });

  // =================================================================
  // 3B. SLIDE 1: ROYAL ARCH PORTRAIT SWITCHER (TAP OR AUTO-CYCLE)
  // =================================================================
  const heroArchImg = document.getElementById('heroArchImg');
  const archPlaqueTitle = document.getElementById('archPlaqueTitle');
  const archPlaqueSub = document.getElementById('archPlaqueSub');
  const heroArchFrame = document.getElementById('heroArchFrame');

  const heroPortraits = [
    { src: 'images/Engagment (2).jpeg', title: 'Two Souls, One Ring', sub: 'Kanu & Tuli • Sacred Vow' },
    { src: 'images/Engagment.jpeg', title: 'The Moment She Said YES', sub: 'Sacred Vow • Engagement' },
    { src: 'images/_RRF6428-web.jpg', title: 'Queen of My Universe', sub: 'Tulsi • Birthday Girl' }
  ];
  let heroPortraitIdx = 0;

  function cycleHeroPortrait(idx) {
    if (!heroArchImg) return;
    heroPortraitIdx = (idx !== undefined) ? idx : (heroPortraitIdx + 1) % heroPortraits.length;
    const item = heroPortraits[heroPortraitIdx];

    heroArchImg.style.opacity = '0';
    heroArchImg.style.transform = 'scale(0.96)';

    setTimeout(() => {
      heroArchImg.src = item.src;
      if (archPlaqueTitle) archPlaqueTitle.textContent = item.title;
      if (archPlaqueSub) archPlaqueSub.textContent = item.sub;
      heroArchImg.style.opacity = '1';
      heroArchImg.style.transform = 'scale(1)';
    }, 200);

    audioSystem.playChime();
  }

  if (heroArchFrame) {
    heroArchFrame.addEventListener('click', () => {
      cycleHeroPortrait();
    });
  }

  // Hero portrait changed on tap only for calm viewing

  // =================================================================
  // 4. SLIDE 1: REAL-TIME CELEBRATION MILESTONE TIMER
  // =================================================================
  const birthDate = new Date('2002-11-04T00:00:00+05:30');

  function updateLiveCounter() {
    const now = new Date();
    const diffMs = now - birthDate;
    if (diffMs <= 0) return;

    const totalSecs = Math.floor(diffMs / 1000);
    const totalDays = Math.floor(totalSecs / 86400);

    const years = Math.floor(totalDays / 365.25);
    const remDays = Math.floor(totalDays % 365.25);
    const months = Math.floor(remDays / 30.4375);
    const days = Math.floor(remDays % 30.4375);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = Math.floor(totalSecs % 60);

    const elY = document.getElementById('countYears');
    const elM = document.getElementById('countMonths');
    const elD = document.getElementById('countDays');
    const elH = document.getElementById('countHours');
    const elMin = document.getElementById('countMinutes');
    const elS = document.getElementById('countSeconds');

    if (elY) elY.textContent = String(years).padStart(2, '0');
    if (elM) elM.textContent = String(months).padStart(2, '0');
    if (elD) elD.textContent = String(days).padStart(2, '0');
    if (elH) elH.textContent = String(hours).padStart(2, '0');
    if (elMin) elMin.textContent = String(minutes).padStart(2, '0');
    if (elS) elS.textContent = String(seconds).padStart(2, '0');
  }
  setInterval(updateLiveCounter, 1000);
  updateLiveCounter();

  // 24-Rose Golden Bouquet Celebration
  const giftRosesBtn = document.getElementById('giftRosesBtn');
  const roseToastPill = document.getElementById('roseToastPill');

  if (giftRosesBtn) {
    giftRosesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audioSystem.playChime();

      const r = giftRosesBtn.getBoundingClientRect();
      const originX = r.left + r.width / 2;
      const originY = r.top + r.height / 2;

      for (let i = 0; i < 24; i++) {
        setTimeout(() => {
          const rose = document.createElement('div');
          rose.textContent = i % 2 === 0 ? '🌹' : '🌸';
          rose.style.position = 'fixed';
          rose.style.left = `${originX}px`;
          rose.style.top = `${originY}px`;
          rose.style.fontSize = `${Math.random() * 16 + 22}px`;
          rose.style.pointerEvents = 'none';
          rose.style.zIndex = '99999';
          rose.style.transition = 'all 2s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
          rose.style.transform = 'translate(0, 0) scale(0.4)';
          rose.style.opacity = '1';
          document.body.appendChild(rose);

          const angle = (i / 24) * Math.PI * 2;
          const dist = Math.random() * 260 + 100;
          const destX = Math.cos(angle) * dist;
          const destY = Math.sin(angle) * dist - 80;

          requestAnimationFrame(() => {
            rose.style.transform = `translate(${destX}px, ${destY}px) scale(1.2) rotate(${Math.random() * 360}deg)`;
            rose.style.opacity = '0';
          });
          setTimeout(() => rose.remove(), 2100);
        }, i * 30);
      }

      launchConfettiBurst(originX, originY, 60);

      if (roseToastPill) {
        roseToastPill.classList.add('show');
        setTimeout(() => roseToastPill.classList.remove('show'), 3800);
      }
    });
  }

  // =================================================================
  // 5. SLIDE 2: CINEMATIC LOVE REEL ("MUST WATCH")
  // =================================================================
  const reelSlides = [
    {
      img: 'images/Engagment.jpeg',
      tag: 'Chapter I • The Sacred Promise 💍',
      heading: 'The Moment She Said YES!',
      desc: 'Slipping that ring on your finger was my vow to love you for all eternity.'
    },
    {
      img: 'images/First date.jpeg',
      tag: 'Chapter II • Where It All Began ☕',
      heading: 'Our First Coffee Date',
      desc: 'The nervous first glance across the table where my heart found its home.'
    },
    {
      img: 'images/_RRF6428-web.jpg',
      tag: 'Chapter III • Royal Grace 👑',
      heading: 'Queen of My Universe',
      desc: 'Your grace, poise, and gentle kindness leave me breathless every single day.'
    },
    {
      img: 'images/Second date.jpeg',
      tag: 'Chapter IV • No Turning Back 🌸',
      heading: 'Walking Hand in Hand',
      desc: 'Laughing with you until our cheeks hurt, realizing home is wherever you are.'
    },
    {
      img: 'images/_RRF6444-web.jpg',
      tag: 'Chapter V • Golden Hour ✨',
      heading: 'Holding You Close',
      desc: 'Holding you in my arms is the safest, happiest feeling in the universe.'
    },
    {
      img: 'images/_RRF6992-web.jpg',
      tag: 'Chapter VI • Forever Yours ❤️',
      heading: 'Happy 24th Birthday, Tulsi',
      desc: 'To my best friend, my fiancée, and my future wife—forever yours, Kanu.'
    }
  ];

  let reelIdx = 0;
  let reelPaused = true; // Start paused for calm reading
  const reelDuration = 4200;
  let reelTimerStart = Date.now();

  const cinemaSegments = document.getElementById('cinemaSegments');
  const cinemaImg = document.getElementById('cinemaImg');
  const cinemaTag = document.getElementById('cinemaTag');
  const cinemaHeading = document.getElementById('cinemaHeading');
  const cinemaDesc = document.getElementById('cinemaDesc');
  const cinemaPlayBtn = document.getElementById('cinemaPlayBtn');
  const cinemaPrevBtn = document.getElementById('cinemaPrevBtn');
  const cinemaNextBtn = document.getElementById('cinemaNextBtn');
  const cinemaPrevZone = document.getElementById('cinemaPrevZone');
  const cinemaNextZone = document.getElementById('cinemaNextZone');

  if (cinemaSegments) {
    cinemaSegments.innerHTML = '';
    reelSlides.forEach((_, i) => {
      const seg = document.createElement('div');
      seg.className = 'cinema-seg-bar';
      seg.innerHTML = `<div class="cinema-seg-fill" id="cinemaSegFill${i}"></div>`;
      cinemaSegments.appendChild(seg);
    });
  }

  function displayReel(idx, immediate = false) {
    if (!cinemaImg) return;
    reelIdx = idx;
    const slide = reelSlides[idx];

    if (immediate || cinemaImg.getAttribute('src') === slide.img) {
      cinemaImg.src = slide.img;
      if (cinemaTag) cinemaTag.textContent = slide.tag;
      if (cinemaHeading) cinemaHeading.textContent = slide.heading;
      if (cinemaDesc) cinemaDesc.textContent = slide.desc;
      cinemaImg.style.opacity = '1';
    } else {
      // Preload image before fading to prevent any white screen/glitch
      const tempImg = new Image();
      tempImg.onload = () => {
        cinemaImg.src = slide.img;
        if (cinemaTag) cinemaTag.textContent = slide.tag;
        if (cinemaHeading) cinemaHeading.textContent = slide.heading;
        if (cinemaDesc) cinemaDesc.textContent = slide.desc;
        cinemaImg.style.opacity = '1';
      };
      cinemaImg.style.opacity = '0.5';
      tempImg.src = slide.img;
    }

    reelSlides.forEach((_, i) => {
      const fill = document.getElementById(`cinemaSegFill${i}`);
      if (!fill) return;
      if (i < idx) fill.style.width = '100%';
      else if (i > idx) fill.style.width = '0%';
      else fill.style.width = '0%';
    });

    reelTimerStart = Date.now();
  }

  function nextReel() {
    displayReel((reelIdx + 1) % reelSlides.length);
  }

  function prevReel() {
    displayReel((reelIdx - 1 + reelSlides.length) % reelSlides.length);
  }

  if (cinemaNextBtn) cinemaNextBtn.addEventListener('click', nextReel);
  if (cinemaPrevBtn) cinemaPrevBtn.addEventListener('click', prevReel);
  const cinemaCenterZone = document.getElementById('cinemaCenterZone');
  if (cinemaNextZone) cinemaNextZone.addEventListener('click', nextReel);
  if (cinemaPrevZone) cinemaPrevZone.addEventListener('click', prevReel);
  if (cinemaCenterZone) {
    cinemaCenterZone.addEventListener('click', () => {
      reelPaused = !reelPaused;
      if (!reelPaused) reelTimerStart = Date.now();
    });
  }

  if (cinemaPlayBtn) {
    cinemaPlayBtn.textContent = '▶ Play';
    cinemaPlayBtn.addEventListener('click', () => {
      reelPaused = !reelPaused;
      cinemaPlayBtn.textContent = reelPaused ? '▶ Play' : '⏸ Pause';
      if (!reelPaused) reelTimerStart = Date.now();
    });
  }

  function reelTicker() {
    if (!reelPaused && activeSlide === 1) {
      const elapsed = Date.now() - reelTimerStart;
      const progress = Math.min((elapsed / reelDuration) * 100, 100);
      const activeFill = document.getElementById(`cinemaSegFill${reelIdx}`);
      if (activeFill) activeFill.style.width = `${progress}%`;

      if (elapsed >= reelDuration) {
        if (reelIdx === reelSlides.length - 1) {
          displayReel(0); // Loop back to first photo, never force slide change
        } else {
          nextReel();
        }
      }
    }
    requestAnimationFrame(reelTicker);
  }
  displayReel(0, true);
  requestAnimationFrame(reelTicker);

  // =================================================================
  // 6. SLIDE 4: 📸 CURATED POLAROID ALBUM (EXACT VERIFIED 39 PHOTOS)
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

  const polaroidGrid = document.getElementById('polaroidDeckGrid');
  const galleryTabs = document.querySelectorAll('.gallery-tab');
  let currentFilter = 'all';
  let activeLightboxIdx = 0;
  let activeVisiblePhotos = [];

  function renderPolaroids() {
    if (!polaroidGrid) return;
    polaroidGrid.innerHTML = '';
    activeVisiblePhotos = galleryPhotos.filter(p => currentFilter === 'all' || p.category === currentFilter);

    activeVisiblePhotos.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      card.innerHTML = `
        <div class="polaroid-photo-box">
          <img src="${item.src}" alt="${item.caption}" loading="lazy" onerror="this.closest('.polaroid-card') && this.closest('.polaroid-card').remove();" />
          <div class="polaroid-heart-btn" title="Love this memory">💖</div>
        </div>
        <div class="polaroid-caption">${item.caption}</div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('polaroid-heart-btn')) {
          e.stopPropagation();
          const r = e.target.getBoundingClientRect();
          launchConfettiBurst(r.left + 14, r.top + 14, 18);
          audioSystem.playTick();
          return;
        }
        openLightbox(index);
      });

      polaroidGrid.appendChild(card);
    });
  }
  renderPolaroids();

  galleryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      galleryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderPolaroids();
    });
  });

  // Lightbox Modal
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxFrameImg = document.getElementById('lightboxFrameImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxHeartBtn = document.getElementById('lightboxHeartBtn');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  function openLightbox(idx) {
    if (!lightboxOverlay || !activeVisiblePhotos[idx]) return;
    activeLightboxIdx = idx;
    const photo = activeVisiblePhotos[idx];
    lightboxFrameImg.src = photo.src;
    if (lightboxCaption) lightboxCaption.textContent = photo.caption;
    if (lightboxCounter) lightboxCounter.textContent = `Memory ${idx + 1} of ${activeVisiblePhotos.length}`;
    lightboxOverlay.classList.add('show');
    lightboxOverlay.setAttribute('aria-hidden', 'false');
    audioSystem.playTick();
  }

  function closeLightbox() {
    if (lightboxOverlay) {
      lightboxOverlay.classList.remove('show');
      lightboxOverlay.setAttribute('aria-hidden', 'true');
    }
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) closeLightbox();
    });

    // Touch Swipe gesture for mobile inside Lightbox
    let lbStartX = 0;
    let lbStartY = 0;
    lightboxOverlay.addEventListener('touchstart', (e) => {
      lbStartX = e.touches[0].clientX;
      lbStartY = e.touches[0].clientY;
    }, { passive: true });

    lightboxOverlay.addEventListener('touchend', (e) => {
      const lbEndX = e.changedTouches[0].clientX;
      const lbEndY = e.changedTouches[0].clientY;
      const diffX = lbStartX - lbEndX;
      const diffY = lbStartY - lbEndY;

      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          activeLightboxIdx = (activeLightboxIdx + 1) % activeVisiblePhotos.length;
          openLightbox(activeLightboxIdx);
        } else {
          activeLightboxIdx = (activeLightboxIdx - 1 + activeVisiblePhotos.length) % activeVisiblePhotos.length;
          openLightbox(activeLightboxIdx);
        }
      }
    }, { passive: true });
  }
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', () => {
    activeLightboxIdx = (activeLightboxIdx - 1 + activeVisiblePhotos.length) % activeVisiblePhotos.length;
    openLightbox(activeLightboxIdx);
  });
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', () => {
    activeLightboxIdx = (activeLightboxIdx + 1) % activeVisiblePhotos.length;
    openLightbox(activeLightboxIdx);
  });

  if (lightboxHeartBtn) {
    lightboxHeartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const r = lightboxHeartBtn.getBoundingClientRect();
      launchConfettiBurst(r.left + r.width / 2, r.top + r.height / 2, 45);
      audioSystem.playChime();
    });
  }

  // Keyboard navigation when Lightbox is active
  window.addEventListener('keydown', (e) => {
    if (lightboxOverlay && lightboxOverlay.classList.contains('show')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        activeLightboxIdx = (activeLightboxIdx - 1 + activeVisiblePhotos.length) % activeVisiblePhotos.length;
        openLightbox(activeLightboxIdx);
      }
      if (e.key === 'ArrowRight') {
        activeLightboxIdx = (activeLightboxIdx + 1) % activeVisiblePhotos.length;
        openLightbox(activeLightboxIdx);
      }
    }
  });

  // =================================================================
  // 8. SLIDE 5: 💖 24 REASONS WHY I LOVE YOU
  // =================================================================
  const reasonsData = [
    { title: "Your Pure, Radiant Heart", desc: "The way you care for people with zero pretension and pure kindness melts me every day.", icon: "🌸" },
    { title: "Your Laughter That Heals Everything", desc: "No matter how tough my day has been, the sound of your chuckle washes every worry away.", icon: "✨" },
    { title: "How You Look in My Hoodies", desc: "You look impossibly cute wearing oversized hoodies with that playful little smile.", icon: "🧸" },
    { title: "Your Unwavering Loyalty", desc: "Knowing that you have my back through every high and low gives me immense strength.", icon: "🤝" },
    { title: "The Cute Way You Tease Me", desc: "Your witty inside jokes and the way you scrunch your nose when teasing Kanu.", icon: "🤭" },
    { title: "Your Endless Grace and Poise", desc: "You carry yourself with a regal dignity that makes me so incredibly proud to stand beside you.", icon: "👑" },
    { title: "Our Late-Night Conversations", desc: "When 2:00 AM feels like afternoon because we can talk about anything and everything.", icon: "🌙" },
    { title: "Your Foodie Passions", desc: "The sheer sparkle in your eyes whenever our favorite desserts or street food arrives.", icon: "🍰" },
    { title: "How You Inspire Me to Be Better", desc: "Your ambition, your kindness, and your patience push me to be the greatest man I can be.", icon: "🌟" },
    { title: "Holding Hands in the Car", desc: "That quiet warmth when your fingers slip into mine while driving into the sunset.", icon: "🚗" },
    { title: "Your Gentle Forgiveness", desc: "Whenever I make silly mistakes, your gentle patience always guides us back into harmony.", icon: "🕊️" },
    { title: "The Adorable Face You Make While Thinking", desc: "Concentrating with your tongue slightly out—the cutest sight in the entire cosmos.", icon: "💭" },
    { title: "Your Deep, Soulful Eyes", desc: "I can look into your eyes forever and still discover new shades of beauty and peace.", icon: "👀" },
    { title: "Your Fierce Support for My Dreams", desc: "You believe in me even when I doubt myself. You are my true anchor.", icon: "⚓" },
    { title: "The Way You Say My Name", desc: "Nobody in this world can say 'Kanu' with the tenderness and sweetness that you do.", icon: "💖" },
    { title: "Our Spontaneous Adventures", desc: "Random drives, sudden café stops, and getting lost just to spend more time together.", icon: "🗺️" },
    { title: "Your Warm, Comforting Hugs", desc: "When you wrap your arms around me, my whole body releases a breath it didn't know it was holding.", icon: "🤗" },
    { title: "You Are My Safe Space", desc: "In a chaotic world full of noise, you are the only sanctuary where my soul finds quiet rest.", icon: "🏡" },
    { title: "The Way You Love Little Things", desc: "Sunsets, tiny flowers, puppies, sweet notes—you appreciate life's smallest miracles.", icon: "🌷" },
    { title: "Your Courage & Resilience", desc: "You handle challenges with quiet strength and bravery that leaves me in total awe.", icon: "💪" },
    { title: "You Make Everyday Moments Magical", desc: "Even grocery shopping or waiting in line is fun when you are by my side.", icon: "🪄" },
    { title: "The Promise of Our Future", desc: "Dreaming about our wedding, our first home, and growing old holding hands.", icon: "💍" },
    { title: "You Chose Me", desc: "Out of 8 billion people, you gave your heart to me. I will cherish this gift forever.", icon: "🏆" },
    { title: "Because You Are You", desc: "Simply because you are Tulsi. My fiancée, my soulmate, my happily ever after.", icon: "❤️" }
  ];

  let currentReasonIdx = 0;
  const reasonCard = document.getElementById('reasonFlipCard');
  const reasonCounterPill = document.getElementById('reasonCounterPill');
  const reasonIconDisplay = document.getElementById('reasonIconDisplay');
  const reasonTitleDisplay = document.getElementById('reasonTitleDisplay');
  const reasonDescDisplay = document.getElementById('reasonDescDisplay');
  const prevReasonBtn = document.getElementById('prevReasonBtn');
  const nextReasonBtn = document.getElementById('nextReasonBtn');
  const reasonDotsTrack = document.getElementById('reasonDotsTrack');

  function renderReason(idx) {
    if (!reasonCard) return;
    currentReasonIdx = idx;
    const r = reasonsData[idx];

    if (typeof gsap !== 'undefined') {
      gsap.to(reasonCard, {
        rotationY: 90,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          if (reasonCounterPill) reasonCounterPill.textContent = `Reason ${String(idx + 1).padStart(2, '0')} / 24`;
          if (reasonIconDisplay) reasonIconDisplay.textContent = r.icon;
          if (reasonTitleDisplay) reasonTitleDisplay.textContent = r.title;
          if (reasonDescDisplay) reasonDescDisplay.textContent = r.desc;
          gsap.fromTo(reasonCard, { rotationY: -90 }, { rotationY: 0, duration: 0.28, ease: 'power2.out' });
        }
      });
    }

    if (reasonDotsTrack) {
      reasonDotsTrack.innerHTML = '';
      reasonsData.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = `reason-dot ${i === idx ? 'active' : ''}`;
        reasonDotsTrack.appendChild(dot);
      });
    }
  }

  if (nextReasonBtn) {
    nextReasonBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audioSystem.playTick();
      renderReason((currentReasonIdx + 1) % reasonsData.length);
    });
  }

  if (prevReasonBtn) {
    prevReasonBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audioSystem.playTick();
      renderReason((currentReasonIdx - 1 + reasonsData.length) % reasonsData.length);
    });
  }

  // Click card directly or swipe to advance reason
  if (reasonCard) {
    reasonCard.addEventListener('click', () => {
      audioSystem.playTick();
      renderReason((currentReasonIdx + 1) % reasonsData.length);
    });

    let reasonTouchStartX = 0;
    reasonCard.addEventListener('touchstart', (e) => {
      reasonTouchStartX = e.touches[0].clientX;
    }, { passive: true });

    reasonCard.addEventListener('touchend', (e) => {
      const diffX = reasonTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diffX) > 40) {
        audioSystem.playTick();
        if (diffX > 0) {
          renderReason((currentReasonIdx + 1) % reasonsData.length);
        } else {
          renderReason((currentReasonIdx - 1 + reasonsData.length) % reasonsData.length);
        }
      }
    }, { passive: true });
  }
  if (reasonCard) {
    reasonCard.addEventListener('click', () => {
      audioSystem.playTick();
      renderReason((currentReasonIdx + 1) % reasonsData.length);
    });
  }

  // Reasons cycled by user tapping card or dots at their own pace

  renderReason(0);

  // =================================================================
  // 9. SLIDE 6: 🎂 BIRTHDAY CAKE & MAKE A WISH
  // =================================================================
  const cakeStage = document.getElementById('cakeStage');
  const wishRevealBox = document.getElementById('wishRevealBox');
  const relightCandlesBtn = document.getElementById('relightCandlesBtn');
  const flameIds = ['flame1', 'flame2', 'flame3'];

  function checkCandlesState() {
    const unblown = document.querySelectorAll('.candle-flame-group:not(.extinguished)');
    if (unblown.length === 0) {
      audioSystem.playChime();
      launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 120);
      setTimeout(() => launchConfettiCannon(0.2, 0.4), 250);
      setTimeout(() => launchConfettiCannon(0.8, 0.4), 500);
      if (wishRevealBox) wishRevealBox.classList.add('show');
      // Wish reveal remains visible calmly until user swipes to Chapter 07
    }
  }

  // Click individual flame
  flameIds.forEach(id => {
    const flame = document.getElementById(id);
    if (flame) {
      flame.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!flame.classList.contains('extinguished')) {
          flame.classList.add('extinguished');
          audioSystem.playPop();
          const r = flame.getBoundingClientRect();
          launchConfettiBurst(r.left + r.width / 2, r.top, 25);
          checkCandlesState();
        }
      });
    }
  });

  // Click anywhere on cake stage
  if (cakeStage) {
    cakeStage.addEventListener('click', () => {
      const anyLit = document.querySelector('.candle-flame-group:not(.extinguished)');
      if (anyLit) {
        document.querySelectorAll('.candle-flame-group, .candle-flame').forEach(f => f.classList.add('extinguished'));
        checkCandlesState();
      }
    });
  }

  // Relight candles button
  if (relightCandlesBtn) {
    relightCandlesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.candle-flame-group').forEach(f => f.classList.remove('extinguished'));
      if (wishRevealBox) wishRevealBox.classList.remove('show');
      audioSystem.playChime();
      launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.5, 50);
    });
  }

  // =================================================================
  // 10. SLIDE 7: 💌 ROYAL WAX-SEALED LETTER
  // =================================================================
  const royalEnvelopeStage = document.getElementById('royalEnvelopeStage');
  const waxSealButton = document.getElementById('waxSealButton');
  const resealEnvelopeBtn = document.getElementById('resealEnvelopeBtn');
  const sendKissesBtn = document.getElementById('sendKissesBtn');
  const kissesTally = document.getElementById('kissesTally');

  let kissesCount = 0;

  function updateKissesTally() {
    if (kissesTally) {
      if (kissesCount > 0) {
        kissesTally.textContent = `💖 ${kissesCount} Sweet Kisses Sent to Kanu!`;
      } else {
        kissesTally.textContent = `Tap to send sweet kisses to Kanu!`;
      }
    }
  }
  updateKissesTally();

  function openRoyalLetter() {
    if (!royalEnvelopeStage || royalEnvelopeStage.classList.contains('opened')) return;
    audioSystem.playChime();
    audioSystem.playTick();

    if (waxSealButton) {
      const r = waxSealButton.getBoundingClientRect();
      launchConfettiBurst(r.left + r.width / 2, r.top + r.height / 2, 70);
    }
    setTimeout(() => launchConfettiCannon(0.25, 0.5), 250);
    setTimeout(() => launchConfettiCannon(0.75, 0.5), 500);

    royalEnvelopeStage.classList.add('opened');
  }

  function resealRoyalLetter() {
    if (!royalEnvelopeStage) return;
    royalEnvelopeStage.classList.remove('opened');
    audioSystem.playTick();
  }

  if (waxSealButton) {
    waxSealButton.addEventListener('click', (e) => {
      e.stopPropagation();
      openRoyalLetter();
    });
  }

  const envelopeSealedView = document.getElementById('envelopeSealedView');
  if (envelopeSealedView) {
    envelopeSealedView.addEventListener('click', openRoyalLetter);
  }

  if (resealEnvelopeBtn) {
    resealEnvelopeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resealRoyalLetter();
    });
  }

  if (sendKissesBtn) {
    sendKissesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      kissesCount++;
      updateKissesTally();
      audioSystem.playTick();

      const r = sendKissesBtn.getBoundingClientRect();
      const originX = r.left + r.width / 2;
      const originY = r.top;

      const emojis = ['💖', '💋', '🌸', '✨', '💍', '🥰'];
      for (let i = 0; i < 12; i++) {
        const el = document.createElement('div');
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.position = 'fixed';
        el.style.left = `${originX}px`;
        el.style.top = `${originY}px`;
        el.style.fontSize = `${Math.random() * 18 + 20}px`;
        el.style.pointerEvents = 'none';
        el.style.zIndex = '99999';
        el.style.transition = 'all 1.6s cubic-bezier(0.2, 0.8, 0.4, 1)';
        el.style.transform = 'translate(0, 0) scale(0.6)';
        el.style.opacity = '1';
        document.body.appendChild(el);

        const destX = (Math.random() - 0.5) * 280;
        const destY = -Math.random() * 220 - 80;

        requestAnimationFrame(() => {
          el.style.transform = `translate(${destX}px, ${destY}px) scale(1.2) rotate(${(Math.random() - 0.5) * 60}deg)`;
          el.style.opacity = '0';
        });
        setTimeout(() => el.remove(), 1650);
      }
    });
  }

  // =================================================================
  // 11. ADORABLE PLUSHIES: KANU BEAR 🧸 & TULI BUNNY 🐰
  // =================================================================
  const plushieKanu = document.getElementById('plushieKanu');
  const plushieTuli = document.getElementById('plushieTuli');
  const kanuSpeech = document.getElementById('kanuSpeech');
  const tuliSpeech = document.getElementById('tuliSpeech');
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

  function spawnPlushieEmojis(x, y, list) {
    for (let i = 0; i < 6; i++) {
      const el = document.createElement('div');
      el.textContent = list[Math.floor(Math.random() * list.length)];
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

      const dx = (Math.random() - 0.5) * 120;
      const dy = -Math.random() * 130 - 40;

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
      if (kanuSpeech) {
        kanuSpeech.textContent = kanuQuotes[kanuQuoteIdx];
        kanuSpeech.classList.add('active');
        setTimeout(() => kanuSpeech.classList.remove('active'), 3200);
      }
      audioSystem.playTick();
      if (typeof gsap !== 'undefined') {
        gsap.timeline()
          .to(plushieKanu, { scale: 1.25, rotation: -8, duration: 0.14, ease: 'power1.out' })
          .to(plushieKanu, { scale: 1.2, rotation: 8, duration: 0.14, ease: 'power1.out' })
          .to(plushieKanu, { scale: 1, rotation: 0, duration: 0.28, ease: 'bounce.out' });
      }
      const r = plushieKanu.getBoundingClientRect();
      spawnPlushieEmojis(r.left + r.width / 2, r.top, ['💖', '🧸', '✨', '💍', '❤️']);
    });
  }

  if (plushieTuli) {
    plushieTuli.addEventListener('click', (e) => {
      e.stopPropagation();
      tuliQuoteIdx = (tuliQuoteIdx + 1) % tuliQuotes.length;
      if (tuliSpeech) {
        tuliSpeech.textContent = tuliQuotes[tuliQuoteIdx];
        tuliSpeech.classList.add('active');
        setTimeout(() => tuliSpeech.classList.remove('active'), 3200);
      }
      audioSystem.playTick();
      if (typeof gsap !== 'undefined') {
        gsap.timeline()
          .to(plushieTuli, { y: -20, scale: 1.25, duration: 0.16, ease: 'power2.out' })
          .to(plushieTuli, { y: 0, scale: 1, duration: 0.32, ease: 'bounce.out' });
      }
      const r = plushieTuli.getBoundingClientRect();
      spawnPlushieEmojis(r.left + r.width / 2, r.top, ['🌸', '🐰', '💕', '✨', '🌷']);
    });
  }

  if (plushieCuddleBtn) {
    plushieCuddleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audioSystem.playChime();
      launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.88, 80);

      if (kanuSpeech) {
        kanuSpeech.textContent = "Forever & Always! 🧸❤️";
        kanuSpeech.classList.add('active');
      }
      if (tuliSpeech) {
        tuliSpeech.textContent = "My Sweetest Kanu! 🐰💖";
        tuliSpeech.classList.add('active');
      }

      if (typeof gsap !== 'undefined' && plushieKanu && plushieTuli) {
        const centerDistance = Math.min(window.innerWidth * 0.38, 280);
        const tl = gsap.timeline();
        tl.to(plushieKanu, { x: centerDistance, duration: 0.65, ease: 'power2.inOut' }, 0)
          .to(plushieTuli, { x: -centerDistance, duration: 0.65, ease: 'power2.inOut' }, 0)
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
              if (kanuSpeech) kanuSpeech.classList.remove('active');
              if (tuliSpeech) tuliSpeech.classList.remove('active');
            }
          });
      }
    });
  }

  // =================================================================
  // 12. AMBIENT PARTICLES CANVAS (FALLING ROSE PETALS, HEARTS, STARS)
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

    for (let i = 0; i < 50; i++) {
      const typeRand = Math.random();
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 9 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: -Math.random() * 0.55 - 0.25,
        alpha: Math.random() * 0.45 + 0.25,
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
  // 13. HIGH PERFORMANCE CONFETTI SYSTEM
  // =================================================================
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  const confParticles = [];
  const confColors = ['#FFD166', '#FF7B89', '#FFCAD4', '#FFE494', '#FFF', '#E2C2FF', '#9B6CE8'];

  function resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
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
  // 14. FLUID MAGNETIC CUSTOM CURSOR
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
    const hoverTargets = document.querySelectorAll('button, a, .floating-balloon, .polaroid-card, .reason-flip-card, .cake-candle, .wax-seal-button, .plushie-corner, .plushie-cuddle-pill, .hero-ptab, .royal-arch-frame');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => cursorRing.classList.add('active-hover'));
      target.addEventListener('mouseleave', () => cursorRing.classList.remove('active-hover'));
    });
  }
});
