/* ===================================================================
   TULI'S BIRTHDAY WONDERLAND - COMMON SUITE JS
   Shared Audio Player, Ambient FX, Particles, and Navbar Logic
   Dedicated to Tulsi (Tuli) from Yogi (Kanu) 💍
   =================================================================== */

class CommonRomanticSuite {
  constructor() {
    this.audioContext = null;
    this.isPlaying = false;
    this.isSynth = false;
    this.synthLoopInterval = null;
    this.audioElement = new Audio();
    this.audioElement.loop = true;
    this.hasCustomAudio = false;

    this.initAudio();
    this.initNavbar();
    this.initAmbientCanvas();
    this.initConfetti();
    this.initSparkleTrail();
  }

  // =================================================================
  // AUDIO CONTROLLER (Web Audio API + Custom MP3 Support)
  // =================================================================
  initAudio() {
    this.audioElement.src = 'music/song.mp3';
    this.audioElement.addEventListener('canplaythrough', () => {
      this.hasCustomAudio = true;
    });
    this.audioElement.addEventListener('error', () => {
      this.hasCustomAudio = false;
    });

    // Check localStorage state
    const savedAudioState = localStorage.getItem('tuli_audio_playing');
    if (savedAudioState === 'true') {
      // Browsers often block autoplay on direct page navigation until a user interacts,
      // so we attach a one-time window click listener to resume
      const resumeAudioOnInteract = () => {
        if (!this.isPlaying && localStorage.getItem('tuli_audio_playing') === 'true') {
          this.playAudio();
        }
        window.removeEventListener('click', resumeAudioOnInteract);
        window.removeEventListener('touchstart', resumeAudioOnInteract);
      };
      window.addEventListener('click', resumeAudioOnInteract);
      window.addEventListener('touchstart', resumeAudioOnInteract);
    }
  }

  ensureAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  playChimeTone(freq, time, duration = 1.6, gainLevel = 0.18) {
    if (!this.audioContext) return;
    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.frequency.exponentialRampToValueAtTime(300, time + duration);

    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(gainLevel, time + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  startSynthMelody() {
    this.ensureAudioContext();
    this.isSynth = true;

    // Romantic Lo-Fi Arpeggios: Cmaj7 -> Am9 -> Fmaj7 -> Gsus4
    const chords = [
      [130.81, 196.00, 246.94, 329.63, 392.00], // Cmaj7
      [110.00, 164.81, 196.00, 261.63, 493.88], // Am9
      [87.31, 130.81, 220.00, 329.63, 440.00],  // Fmaj7
      [98.00, 146.83, 196.00, 246.94, 293.66]   // G6/Gsus4
    ];

    let chordIndex = 0;
    const stepDuration = 0.45;

    const scheduleMeasure = () => {
      if (!this.isPlaying || !this.isSynth) return;
      const now = this.audioContext.currentTime;
      const currentChord = chords[chordIndex % chords.length];

      currentChord.forEach((freq, noteIdx) => {
        const noteTime = now + (noteIdx * stepDuration);
        const volume = noteIdx === 0 ? 0.22 : 0.15;
        this.playChimeTone(freq, noteTime, 2.2, volume);
      });

      const melodyNotes = [currentChord[3] * 1.5, currentChord[2] * 2, currentChord[4]];
      melodyNotes.forEach((freq, mIdx) => {
        const noteTime = now + 1.2 + (mIdx * stepDuration);
        this.playChimeTone(freq, noteTime, 1.4, 0.08);
      });

      chordIndex++;
    };

    scheduleMeasure();
    this.synthLoopInterval = setInterval(scheduleMeasure, stepDuration * 5 * 1000);
  }

  stopSynthMelody() {
    if (this.synthLoopInterval) {
      clearInterval(this.synthLoopInterval);
      this.synthLoopInterval = null;
    }
  }

  playAudio() {
    this.ensureAudioContext();
    this.isPlaying = true;
    localStorage.setItem('tuli_audio_playing', 'true');
    this.updateAudioUI(true);

    if (this.hasCustomAudio) {
      this.audioElement.play().catch(() => this.startSynthMelody());
    } else {
      this.startSynthMelody();
    }
  }

  pauseAudio() {
    this.isPlaying = false;
    localStorage.setItem('tuli_audio_playing', 'false');
    this.updateAudioUI(false);

    if (this.hasCustomAudio) {
      this.audioElement.pause();
    }
    this.stopSynthMelody();
  }

  toggleAudio() {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }

  updateAudioUI(playing) {
    const navVinyl = document.getElementById('navVinyl');
    if (navVinyl) {
      if (playing) navVinyl.classList.add('spinning');
      else navVinyl.classList.remove('spinning');
    }
  }

  // Play quick subtle sound effects
  playTickSound() {
    this.ensureAudioContext();
    if (!this.audioContext) return;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.04);
    gain.gain.setValueAtTime(0.08, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.04);
  }

  playSuccessChime() {
    this.ensureAudioContext();
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      this.playChimeTone(freq, now + (idx * 0.1), 1.2, 0.2);
    });
  }

  // =================================================================
  // NAVBAR & MOBILE MENU
  // =================================================================
  initNavbar() {
    const audioWidget = document.getElementById('navAudioWidget');
    if (audioWidget) {
      audioWidget.addEventListener('click', () => this.toggleAudio());
    }

    const mobileToggle = document.getElementById('mobileNavToggle');
    const navLinks = document.getElementById('navLinks');
    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
      });
    }
  }

  // =================================================================
  // AMBIENT PARTICLES CANVAS
  // =================================================================
  initAmbientCanvas() {
    const canvas = document.getElementById('ambientCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = ['#FFCAD4', '#FFE5DA', '#D4BEFF', '#E9DEFA', '#FF8E99', '#FDE2E4'];

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.6 - 0.3,
        alpha: Math.random() * 0.45 + 0.25,
        isHeart: Math.random() > 0.45
      });
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

    function loop() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        if (p.isHeart) {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.alpha);
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
      requestAnimationFrame(loop);
    }
    loop();
  }

  // =================================================================
  // CONFETTI SYSTEM
  // =================================================================
  initConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const confettiParticles = [];
    const palette = ['#FF8E99', '#FFCAD4', '#D4BEFF', '#FFD166', '#E76F51', '#B5EAD7', '#C28490'];

    window.launchConfettiBurst = (originX, originY, count = 75) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 9 + 4;
        confettiParticles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3.5,
          color: palette[Math.floor(Math.random() * palette.length)],
          size: Math.random() * 8 + 6,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          alpha: 1,
          decay: Math.random() * 0.012 + 0.008
        });
      }
    };

    window.launchConfettiCannon = (relX, relY) => {
      window.launchConfettiBurst(window.innerWidth * relX, window.innerHeight * relY, 80);
    };

    function render() {
      ctx.clearRect(0, 0, width, height);
      for (let i = confettiParticles.length - 1; i >= 0; i--) {
        const p = confettiParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22;
        p.vx *= 0.985;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > height + 50) {
          confettiParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      requestAnimationFrame(render);
    }
    render();
  }

  // =================================================================
  // CURSOR / TOUCH SPARKLE TRAILS
  // =================================================================
  initSparkleTrail() {
    let lastTime = 0;
    const addSparkle = (x, y) => {
      const now = Date.now();
      if (now - lastTime < 65) return;
      lastTime = now;

      const el = document.createElement('div');
      el.textContent = Math.random() > 0.5 ? '✨' : '💖';
      el.style.position = 'fixed';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.pointerEvents = 'none';
      el.style.zIndex = '99999';
      el.style.fontSize = `${Math.random() * 10 + 12}px`;
      el.style.transform = 'translate(-50%, -50%) scale(1)';
      el.style.transition = 'all 0.85s ease-out';
      el.style.opacity = '0.9';

      document.body.appendChild(el);

      requestAnimationFrame(() => {
        el.style.transform = `translate(-50%, -85%) scale(0.3) rotate(${Math.random() * 40 - 20}deg)`;
        el.style.opacity = '0';
      });

      setTimeout(() => el.remove(), 900);
    };

    window.addEventListener('mousemove', e => addSparkle(e.clientX, e.clientY));
    window.addEventListener('touchmove', e => {
      if (e.touches && e.touches[0]) addSparkle(e.touches[0].clientX, e.touches[0].clientY);
    });
  }
}

// Global suite instance
document.addEventListener('DOMContentLoaded', () => {
  window.romanticSuite = new CommonRomanticSuite();
});

