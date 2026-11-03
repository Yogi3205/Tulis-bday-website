/* ===================================================================
   ROMANTIC AUDIO CONTROLLER
   Supports custom MP3 files ('music/song.mp3') with an automated fallback
   to a built-in procedural Romantic Lo-Fi Piano & Music Box Synthesizer
   using the Web Audio API. 
   Works 100% offline, zero external downloads required!
   =================================================================== */

class RomanticAudioController {
  constructor() {
    this.isPlaying = false;
    this.audioElement = new Audio();
    this.audioElement.loop = true;
    this.audioContext = null;
    this.synthLoopInterval = null;
    this.isSynth = false;

    this.vinylDisc = document.getElementById('vinylDisc');
    this.musicToggleBtn = document.getElementById('musicToggleBtn');
    this.musicStatus = document.getElementById('musicStatus');

    this.initCustomAudioCheck();
  }

  initCustomAudioCheck() {
    // Try to load custom MP3 from music/song.mp3
    this.audioElement.src = 'music/song.mp3';
    
    this.audioElement.addEventListener('canplaythrough', () => {
      this.hasCustomAudio = true;
    });

    this.audioElement.addEventListener('error', () => {
      // If no file found, fallback to Web Audio API Lo-Fi Synth
      this.hasCustomAudio = false;
    });
  }

  initWebAudio() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Play a soft, dreamy piano/music-box chime note
  playChimeNote(freq, time, duration = 1.6, gainLevel = 0.18) {
    if (!this.audioContext) return;
    const ctx = this.audioContext;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Gentle triangle wave with lowpass filtering gives an acoustic music-box vibe
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    // Warm filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.frequency.exponentialRampToValueAtTime(300, time + duration);

    // Envelope
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(gainLevel, time + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Procedural Romantic Arpeggio loop (Key: C Major / A Minor)
  startSynthMelody() {
    this.initWebAudio();
    this.isSynth = true;

    // Frequencies for a romantic acoustic progression:
    // Cmaj7 -> Am9 -> Fmaj7 -> Gsus4
    const chords = [
      // Cmaj7 (C3, G3, B3, E4, G4)
      [130.81, 196.00, 246.94, 329.63, 392.00],
      // Am9 (A2, E3, G3, C4, B4)
      [110.00, 164.81, 196.00, 261.63, 493.88],
      // Fmaj7 (F2, C3, A3, E4, A4)
      [87.31, 130.81, 220.00, 329.63, 440.00],
      // G6 / Gsus4 (G2, D3, G3, B3, D4)
      [98.00, 146.83, 196.00, 246.94, 293.66]
    ];

    let chordIndex = 0;
    const stepDuration = 0.45; // seconds per note

    const scheduleMeasure = () => {
      if (!this.isPlaying || !this.isSynth) return;
      const now = this.audioContext.currentTime;
      const currentChord = chords[chordIndex % chords.length];

      // Arpeggiate chord notes smoothly
      currentChord.forEach((freq, noteIdx) => {
        const noteTime = now + (noteIdx * stepDuration);
        const volume = noteIdx === 0 ? 0.22 : 0.15; // deeper bass note
        this.playChimeNote(freq, noteTime, 2.2, volume);
      });

      // Sweet accent melody on top
      const melodyNotes = [currentChord[3] * 1.5, currentChord[2] * 2, currentChord[4]];
      melodyNotes.forEach((freq, mIdx) => {
        const noteTime = now + 1.2 + (mIdx * stepDuration);
        this.playChimeNote(freq, noteTime, 1.4, 0.08);
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

  play() {
    this.isPlaying = true;
    this.updateUI(true);

    if (this.hasCustomAudio) {
      this.audioElement.play().catch(() => {
        // Fallback to synth if browser blocks autoplay or format unsupported
        this.startSynthMelody();
      });
    } else {
      this.startSynthMelody();
    }
  }

  pause() {
    this.isPlaying = false;
    this.updateUI(false);

    if (this.hasCustomAudio) {
      this.audioElement.pause();
    }
    this.stopSynthMelody();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  updateUI(playing) {
    if (this.vinylDisc) {
      if (playing) {
        this.vinylDisc.classList.add('spinning');
      } else {
        this.vinylDisc.classList.remove('spinning');
      }
    }

    if (this.musicToggleBtn) {
      this.musicToggleBtn.innerHTML = playing 
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>' 
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    }

    if (this.musicStatus) {
      this.musicStatus.innerHTML = playing ? 'Playing romantic melody...' : 'Paused';
    }
  }
}

// Global instance
window.romanticAudio = new RomanticAudioController();

