/* ===================================================================
   TULI'S BIRTHDAY WONDERLAND - CORE INTERACTIONS & VISUAL FX
   Dedicated to Tulsi (Tuli) from Yogi (Kanu) 💍
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const surpriseCurtain = document.getElementById('surpriseCurtain');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const waxSeal = document.getElementById('waxSeal');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const ambientCanvas = document.getElementById('ambientCanvas');
  const confettiCanvas = document.getElementById('confettiCanvas');
  const cakeContainer = document.getElementById('cakeContainer');
  const wishUnlockedBanner = document.getElementById('wishUnlockedBanner');
  const sendKissesBtn = document.getElementById('sendKissesBtn');
  const kissesCounter = document.getElementById('kissesCounter');
  const photoFileInput = document.getElementById('photoFileInput');
  const uploadPhotosBtn = document.getElementById('uploadPhotosBtn');

  // Lightbox elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  // State
  let isEnvelopeOpened = false;
  let kissesCount = 0;
  let isCakeBlown = false;

  // =================================================================
  // 1. OPENING SURPRISE (ENVELOPE UNWRAPPING)
  // =================================================================
  function openEnvelope() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    envelopeWrapper.classList.add('opening');

    // Launch initial celebratory confetti
    launchConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 90);
    setTimeout(() => {
      launchConfettiCannon(0.2, 0.6);
      launchConfettiCannon(0.8, 0.6);
    }, 400);

    // Start background romantic melody
    if (window.romanticAudio) {
      window.romanticAudio.play();
    }

    // Smoothly dissolve curtain to reveal main wonderland
    setTimeout(() => {
      surpriseCurtain.classList.add('opened');
      initBalloonsSpawner();
    }, 1100);
  }

  if (waxSeal) waxSeal.addEventListener('click', openEnvelope);
  if (envelopeWrapper) envelopeWrapper.addEventListener('click', openEnvelope);

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      if (window.romanticAudio) {
        window.romanticAudio.toggle();
      }
    });
  }

  // =================================================================
  // 2. LIVE MILESTONE & TIME COUNTER
  // Tulsi's Birthdate: November 4, 2002 00:00:00 IST
  // =================================================================
  const birthDate = new Date('2002-11-04T00:00:00+05:30');

  function updateLiveCounter() {
    const now = new Date();
    const diffMs = now - birthDate;

    if (diffMs <= 0) return;

    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    // Approximate breakdown
    const years = Math.floor(totalDays / 365.25);
    const remainingDaysAfterYears = Math.floor(totalDays % 365.25);
    const months = Math.floor(remainingDaysAfterYears / 30.4375);
    const days = Math.floor(remainingDaysAfterYears % 30.4375);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    const yEl = document.getElementById('countYears');
    const mEl = document.getElementById('countMonths');
    const dEl = document.getElementById('countDays');
    const hEl = document.getElementById('countHours');
    const minEl = document.getElementById('countMinutes');
    const sEl = document.getElementById('countSeconds');

    if (yEl) yEl.textContent = String(years).padStart(2, '0');
    if (mEl) mEl.textContent = String(months).padStart(2, '0');
    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (minEl) minEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');

    // Fun facts
    const daysFact = document.getElementById('factDays');
    if (daysFact) daysFact.textContent = totalDays.toLocaleString('en-US') + ' Days';

    // Birthday Countdown (Next occurrence of November 4th)
    const currentYear = now.getFullYear();
    let nextBday = new Date(currentYear, 10, 4, 0, 0, 0); // Month is 0-indexed: 10 = November
    
    // If today is November 4th
    const isTodayBday = (now.getMonth() === 10 && now.getDate() === 4);
    const countdownTextEl = document.getElementById('countdownText');

    if (countdownTextEl) {
      if (isTodayBday) {
        countdownTextEl.innerHTML = "🎉 <strong>TODAY IS TULI'S 24TH BIRTHDAY! IT'S CELEBRATION TIME!</strong> 🎂✨";
      } else {
        if (now > nextBday) {
          nextBday = new Date(currentYear + 1, 10, 4, 0, 0, 0);
        }
        const bdayDiffMs = nextBday - now;
        const bdayDays = Math.floor(bdayDiffMs / (1000 * 60 * 60 * 24));
        const bdayHours = Math.floor((bdayDiffMs / (1000 * 60 * 60)) % 24);
        const bdayMins = Math.floor((bdayDiffMs / (1000 * 60)) % 60);
        const bdaySecs = Math.floor((bdayDiffMs / 1000) % 60);

        countdownTextEl.innerHTML = `Birthday Countdown: <strong>${bdayDays}d ${bdayHours}h ${bdayMins}m ${bdaySecs}s</strong> until 04 November! 🌸`;
      }
    }
  }

  setInterval(updateLiveCounter, 1000);
  updateLiveCounter();

  // =================================================================
  // 3. 3D TILT EFFECT ON POLAROID CARDS
  // =================================================================
  const polaroids = document.querySelectorAll('.polaroid-card');

  polaroids.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });

    // Click to open in full Lightbox
    card.addEventListener('click', () => {
      const img = card.querySelector('.polaroid-img');
      const note = card.querySelector('.polaroid-note');
      if (img && note && lightboxModal) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = note.textContent;
        lightboxModal.classList.add('active');
        launchConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 40);
      }
    });
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // Live Photo Replace Support (so Yogi can drop/pick files directly)
  if (uploadPhotosBtn && photoFileInput) {
    uploadPhotosBtn.addEventListener('click', () => {
      photoFileInput.click();
    });

    photoFileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const polaroidImgs = document.querySelectorAll('.polaroid-img');
      files.forEach((file, index) => {
        if (index < polaroidImgs.length) {
          const reader = new FileReader();
          reader.onload = (event) => {
            polaroidImgs[index].src = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
      launchConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 50);
    });
  }

  // Check if user has added actual photos in images/ folder (photo1.jpg, photo2.jpg, etc.)
  const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  const polaroidImgs = document.querySelectorAll('.polaroid-img');

  polaroidImgs.forEach((img, index) => {
    const photoNumber = index + 1;
    // Test if photoX.jpg exists
    const testImg = new Image();
    testImg.src = `images/photo${photoNumber}.jpg`;
    testImg.onload = () => {
      img.src = testImg.src;
    };
  });

  // =================================================================
  // 4. INTERACTIVE VIRTUAL BIRTHDAY CAKE
  // =================================================================
  if (cakeContainer) {
    cakeContainer.addEventListener('click', () => {
      if (isCakeBlown) return;
      isCakeBlown = true;

      const candles = cakeContainer.querySelectorAll('.candle');
      candles.forEach(c => c.classList.add('blown'));

      // Big celebratory fireworks & confetti
      launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 120);
      setTimeout(() => launchConfettiCannon(0.2, 0.5), 300);
      setTimeout(() => launchConfettiCannon(0.8, 0.5), 600);

      if (wishUnlockedBanner) {
        wishUnlockedBanner.classList.add('show');
      }
    });
  }

  // =================================================================
  // 5. INTERACTIVE "SEND KISSES TO KANU" BUTTON
  // =================================================================
  if (sendKissesBtn) {
    sendKissesBtn.addEventListener('click', (e) => {
      kissesCount++;
      if (kissesCounter) {
        kissesCounter.textContent = `💖 ${kissesCount} Sweet Kisses Sent to Kanu!`;
      }

      const rect = sendKissesBtn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top;

      createFloatingEmojiBurst(['💖', '💋', '🌸', '✨', '💍', '🥰'], x, y, 16);
    });
  }

  function createFloatingEmojiBurst(emojis, originX, originY, count = 12) {
    for (let i = 0; i < count; i++) {
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
  }

  // =================================================================
  // 6. AMBIENT PARTICLES (FLOATING HEARTS & SPARKLES ON CANVAS)
  // =================================================================
  if (ambientCanvas) {
    const ctx = ambientCanvas.getContext('2d');
    let width = ambientCanvas.width = window.innerWidth;
    let height = ambientCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = ambientCanvas.width = window.innerWidth;
      height = ambientCanvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = ['#FFCAD4', '#FFE5D9', '#D0BCFF', '#E8DEF8', '#FF9AA2', '#FDE2E4'];

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: -Math.random() * 0.7 - 0.3,
        alpha: Math.random() * 0.5 + 0.3,
        isHeart: Math.random() > 0.4
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
      // Top left curve
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      // Bottom left curve
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
      // Bottom right curve
      c.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      // Top right curve
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fill();
      c.restore();
    }

    function animateAmbient() {
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

      requestAnimationFrame(animateAmbient);
    }

    animateAmbient();
  }

  // =================================================================
  // 7. HIGH-PERFORMANCE CONFETTI SYSTEM
  // =================================================================
  const confettiParticles = [];
  const confettiPalette = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#9A82DB', '#FFD166', '#E76F51'];

  function resizeConfetti() {
    if (confettiCanvas) {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
  }
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  function launchConfettiBurst(originX, originY, count = 70) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      confettiParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        color: confettiPalette[Math.floor(Math.random() * confettiPalette.length)],
        size: Math.random() * 8 + 6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
        decay: Math.random() * 0.012 + 0.008
      });
    }
  }

  function launchConfettiCannon(relX, relY) {
    const originX = window.innerWidth * relX;
    const originY = window.innerHeight * relY;
    launchConfettiBurst(originX, originY, 80);
  }

  function renderConfetti() {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.vx *= 0.985;
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > window.innerHeight + 50) {
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

    requestAnimationFrame(renderConfetti);
  }
  renderConfetti();

  // Expose confetti
  window.launchConfettiBurst = launchConfettiBurst;

  // =================================================================
  // 8. INTERACTIVE FLOATING BALLOONS SPAWNER
  // =================================================================
  function initBalloonsSpawner() {
    const balloonsContainer = document.getElementById('balloonsArea');
    if (!balloonsContainer) return;

    const balloonColors = ['#FFCAD4', '#D0BCFF', '#FFB5A7', '#B5EAD7', '#FFDAC1'];

    function spawnBalloon() {
      const b = document.createElement('div');
      b.className = 'floating-balloon';
      const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
      b.style.background = `radial-gradient(circle at 35% 35%, #FFFFFF, ${color})`;
      b.style.left = `${Math.random() * 85 + 5}%`;
      b.style.animationDuration = `${Math.random() * 6 + 10}s`;

      b.addEventListener('click', () => {
        const rect = b.getBoundingClientRect();
        launchConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
        b.remove();
      });

      balloonsContainer.appendChild(b);

      setTimeout(() => {
        if (b.parentNode) b.remove();
      }, 16000);
    }

    // Spawn periodically
    setInterval(spawnBalloon, 4500);
    spawnBalloon();
  }

  // =================================================================
  // 9. MOUSE / TOUCH SPARKLE TRAILS
  // =================================================================
  let lastSparkleTime = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkleTime > 60) {
      lastSparkleTime = now;
      createTrailSparkle(e.clientX, e.clientY);
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      const now = Date.now();
      if (now - lastSparkleTime > 70) {
        lastSparkleTime = now;
        createTrailSparkle(e.touches[0].clientX, e.touches[0].clientY);
      }
    }
  });

  function createTrailSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.textContent = Math.random() > 0.5 ? '✨' : '💖';
    sparkle.style.position = 'fixed';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.fontSize = `${Math.random() * 10 + 12}px`;
    sparkle.style.transform = `translate(-50%, -50%) scale(1)`;
    sparkle.style.transition = 'all 0.8s ease-out';
    sparkle.style.opacity = '0.9';

    document.body.appendChild(sparkle);

    requestAnimationFrame(() => {
      sparkle.style.transform = `translate(-50%, -80%) scale(0.3) rotate(${Math.random() * 40 - 20}deg)`;
      sparkle.style.opacity = '0';
    });

    setTimeout(() => sparkle.remove(), 850);
  }
});
