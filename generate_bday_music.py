import math
import struct
import wave
import os

SAMPLE_RATE = 22050  # 22.05 kHz is warm, clean, and keeps the file compact
CHANNELS = 2         # Stereo for beautiful spatial depth
SAMPLE_WIDTH = 2     # 16-bit PCM

# Frequencies in Hz
NOTE_FREQ = {
    'C2': 65.41, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
    'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'G6': 1567.98
}

BPM = 66
BEAT = 60.0 / BPM  # ~0.909 seconds per beat

class SoundGenerator:
    def __init__(self, duration_sec):
        self.num_samples = int(SAMPLE_RATE * duration_sec)
        self.left = [0.0] * self.num_samples
        self.right = [0.0] * self.num_samples

    def add_music_box_note(self, note_name, start_time, duration, volume=0.25, pan=0.0):
        if note_name not in NOTE_FREQ:
            return
        freq = NOTE_FREQ[note_name]
        start_idx = int(start_time * SAMPLE_RATE)
        num_note_samples = int(duration * SAMPLE_RATE)
        end_idx = min(start_idx + num_note_samples, self.num_samples)

        # Pan: -1 (left), 0 (center), 1 (right)
        left_gain = math.cos((pan + 1) * math.pi / 4)
        right_gain = math.sin((pan + 1) * math.pi / 4)

        for i in range(start_idx, end_idx):
            t = (i - start_idx) / SAMPLE_RATE
            
            # Music box / Kalimba harmonic blend:
            # Fundamental + bell overtones (subtle inharmonic metallic tines)
            fundamental = math.sin(2 * math.pi * freq * t)
            harm2 = 0.35 * math.sin(2 * math.pi * freq * 2.0 * t)
            chime_bell = 0.22 * math.sin(2 * math.pi * freq * 3.01 * t)
            sparkle = 0.08 * math.sin(2 * math.pi * freq * 4.98 * t)

            # Attack (instant tap) + gentle exponential decay
            # Soft initial click
            attack = min(1.0, t / 0.008)
            decay = math.exp(-3.2 * t / duration)

            sample = (fundamental + harm2 + chime_bell + sparkle) * attack * decay * volume

            self.left[i] += sample * left_gain
            self.right[i] += sample * right_gain

    def add_soft_piano_note(self, note_name, start_time, duration, volume=0.18, pan=0.0):
        if note_name not in NOTE_FREQ:
            return
        freq = NOTE_FREQ[note_name]
        start_idx = int(start_time * SAMPLE_RATE)
        num_note_samples = int(duration * SAMPLE_RATE)
        end_idx = min(start_idx + num_note_samples, self.num_samples)

        left_gain = math.cos((pan + 1) * math.pi / 4)
        right_gain = math.sin((pan + 1) * math.pi / 4)

        for i in range(start_idx, end_idx):
            t = (i - start_idx) / SAMPLE_RATE
            # Warm Rhodes piano / acoustic piano model
            s1 = math.sin(2 * math.pi * freq * t)
            s2 = 0.28 * math.sin(2 * math.pi * freq * 2 * t)
            s3 = 0.12 * math.sin(2 * math.pi * freq * 3 * t)

            attack = min(1.0, t / 0.02)
            decay = math.exp(-1.8 * t / duration)

            sample = (s1 + s2 + s3) * attack * decay * volume

            self.left[i] += sample * left_gain
            self.right[i] += sample * right_gain

    def apply_reverb_delay(self, delay_sec=0.28, decay=0.32):
        """Creates a dreamy, spacious romantic room ambience."""
        delay_samples = int(delay_sec * SAMPLE_RATE)
        for i in range(delay_samples, self.num_samples):
            self.left[i] += self.right[i - delay_samples] * decay
            self.right[i] += self.left[i - delay_samples] * decay

    def export_wav(self, filename):
        # Normalize to prevent clipping and give rich, soothing volume
        max_amp = max(max(abs(x) for x in self.left), max(abs(x) for x in self.right))
        if max_amp == 0:
            max_amp = 1.0

        target_peak = 0.88
        gain = target_peak / max_amp

        with wave.open(filename, 'wb') as wav_file:
            wav_file.setnchannels(CHANNELS)
            wav_file.setsampwidth(SAMPLE_WIDTH)
            wav_file.setframerate(SAMPLE_RATE)

            frames = bytearray()
            for i in range(self.num_samples):
                # Clamp to 16-bit range
                l_val = max(-1.0, min(1.0, self.left[i] * gain))
                r_val = max(-1.0, min(1.0, self.right[i] * gain))

                l_int = int(l_val * 32767.0)
                r_int = int(r_val * 32767.0)

                frames.extend(struct.pack('<hh', l_int, r_int))

            wav_file.writeframes(frames)
        print(f"Exported {filename} ({len(frames)} bytes, {self.num_samples / SAMPLE_RATE:.1f}s)")


def compose_happy_birthday():
    # Total song length: ~58 seconds (perfect loop)
    total_duration = 58.0
    synth = SoundGenerator(total_duration)

    t = 0.8  # initial serene pause

    # -------------------------------------------------------------
    # INTRO: Warm Acoustic Chime Harp (4 Bars)
    # -------------------------------------------------------------
    intro_chords = [
        (['C3', 'G3', 'C4', 'E4'], 'Cmaj'),
        (['A2', 'E3', 'A3', 'C4'], 'Am'),
        (['F2', 'C3', 'F3', 'A3'], 'Fmaj'),
        (['G2', 'D3', 'G3', 'B3'], 'G')
    ]
    for chord_notes, _ in intro_chords:
        for idx, n in enumerate(chord_notes):
            synth.add_soft_piano_note(n, t + idx * 0.22, 3.2, volume=0.22, pan=-0.2)
            synth.add_music_box_note(n.replace('2', '4').replace('3', '4'), t + idx * 0.22, 1.8, volume=0.14, pan=0.2)
        t += BEAT * 3  # 3 beats per bar

    # -------------------------------------------------------------
    # VERSE 1: Calm, Sweet Music-Box "Happy Birthday" Melody
    # -------------------------------------------------------------
    def play_happy_birthday_verse(start_time, octave_offset=0, vol=0.32):
        cur = start_time
        # Phrase 1: "Happy Birthday to You"
        # G4 G4 A4 G4 C5 B4
        g4 = 'G4' if octave_offset == 0 else 'G5'
        a4 = 'A4' if octave_offset == 0 else 'A5'
        b4 = 'B4' if octave_offset == 0 else 'B5'
        c5 = 'C5' if octave_offset == 0 else 'C6'
        d5 = 'D5' if octave_offset == 0 else 'D6'
        e5 = 'E5' if octave_offset == 0 else 'E6'
        f5 = 'F5' if octave_offset == 0 else 'F6'
        g5 = 'G5' if octave_offset == 0 else 'G6'

        # Accompaniment: C
        synth.add_soft_piano_note('C3', cur, 4.0, volume=0.22, pan=-0.3)
        synth.add_soft_piano_note('G3', cur + 0.3, 3.0, volume=0.16, pan=-0.1)
        synth.add_soft_piano_note('E4', cur + 0.6, 2.5, volume=0.14, pan=0.1)

        # "Hap-py"
        synth.add_music_box_note(g4, cur, BEAT * 0.65, volume=vol, pan=0.1)
        cur += BEAT * 0.75
        synth.add_music_box_note(g4, cur, BEAT * 0.45, volume=vol * 0.9, pan=0.15)
        cur += BEAT * 0.5

        # "Birth-day"
        synth.add_music_box_note(a4, cur, BEAT * 0.9, volume=vol * 1.1, pan=0.0)
        cur += BEAT * 1.0
        synth.add_music_box_note(g4, cur, BEAT * 0.9, volume=vol, pan=-0.1)
        cur += BEAT * 1.0

        # "To you"
        synth.add_music_box_note(c5, cur, BEAT * 0.9, volume=vol * 1.15, pan=0.2)
        cur += BEAT * 1.0

        # Accompaniment: G7
        synth.add_soft_piano_note('G2', cur, 4.0, volume=0.22, pan=-0.3)
        synth.add_soft_piano_note('D3', cur + 0.3, 3.0, volume=0.16, pan=-0.1)
        synth.add_soft_piano_note('B3', cur + 0.6, 2.5, volume=0.14, pan=0.1)

        synth.add_music_box_note(b4, cur, BEAT * 2.2, volume=vol * 1.05, pan=-0.15)
        cur += BEAT * 2.4

        # Phrase 2: "Happy Birthday to You"
        # G4 G4 A4 G4 D5 C5
        synth.add_music_box_note(g4, cur, BEAT * 0.65, volume=vol, pan=0.1)
        cur += BEAT * 0.75
        synth.add_music_box_note(g4, cur, BEAT * 0.45, volume=vol * 0.9, pan=0.15)
        cur += BEAT * 0.5

        synth.add_music_box_note(a4, cur, BEAT * 0.9, volume=vol * 1.1, pan=0.0)
        cur += BEAT * 1.0
        synth.add_music_box_note(g4, cur, BEAT * 0.9, volume=vol, pan=-0.1)
        cur += BEAT * 1.0

        synth.add_music_box_note(d5, cur, BEAT * 0.9, volume=vol * 1.15, pan=0.2)
        cur += BEAT * 1.0

        # Accompaniment: C
        synth.add_soft_piano_note('C3', cur, 4.0, volume=0.24, pan=-0.3)
        synth.add_soft_piano_note('G3', cur + 0.3, 3.0, volume=0.16, pan=-0.1)
        synth.add_soft_piano_note('E4', cur + 0.6, 2.5, volume=0.15, pan=0.1)

        synth.add_music_box_note(c5, cur, BEAT * 2.2, volume=vol * 1.1, pan=0.0)
        cur += BEAT * 2.4

        # Phrase 3: "Happy Birthday Dear Tulsi (Tuli)"
        # G4 G4 G5 E5 C5 B4 A4
        synth.add_music_box_note(g4, cur, BEAT * 0.65, volume=vol, pan=0.1)
        cur += BEAT * 0.75
        synth.add_music_box_note(g4, cur, BEAT * 0.45, volume=vol * 0.9, pan=0.15)
        cur += BEAT * 0.5

        # High G5 (Emotive climax)
        synth.add_soft_piano_note('C3', cur, 4.0, volume=0.25, pan=-0.3)
        synth.add_soft_piano_note('E3', cur + 0.3, 3.0, volume=0.18, pan=-0.1)
        synth.add_soft_piano_note('G3', cur + 0.6, 2.5, volume=0.16, pan=0.1)

        synth.add_music_box_note(g5, cur, BEAT * 1.0, volume=vol * 1.25, pan=0.25)
        cur += BEAT * 1.0
        synth.add_music_box_note(e5, cur, BEAT * 0.9, volume=vol * 1.1, pan=0.1)
        cur += BEAT * 1.0

        # "Dear Tul-si"
        synth.add_music_box_note(c5, cur, BEAT * 0.9, volume=vol * 1.15, pan=-0.1)
        cur += BEAT * 1.0
        synth.add_music_box_note(b4, cur, BEAT * 0.9, volume=vol, pan=-0.15)
        cur += BEAT * 1.0

        # Accompaniment: F Major (tender subdominant resolution)
        synth.add_soft_piano_note('F2', cur, 4.0, volume=0.26, pan=-0.35)
        synth.add_soft_piano_note('C3', cur + 0.3, 3.0, volume=0.18, pan=-0.15)
        synth.add_soft_piano_note('A3', cur + 0.6, 2.5, volume=0.16, pan=0.15)

        synth.add_music_box_note(a4, cur, BEAT * 2.2, volume=vol * 1.2, pan=-0.2)
        cur += BEAT * 2.4

        # Phrase 4: "Happy Birthday to You"
        # F5 F5 E5 C5 D5 C5
        synth.add_music_box_note(f5, cur, BEAT * 0.65, volume=vol * 1.1, pan=0.2)
        cur += BEAT * 0.75
        synth.add_music_box_note(f5, cur, BEAT * 0.45, volume=vol, pan=0.25)
        cur += BEAT * 0.5

        # Final cadence: C -> G7 -> C
        synth.add_soft_piano_note('C3', cur, 4.0, volume=0.24, pan=-0.3)
        synth.add_soft_piano_note('G3', cur + 0.3, 3.0, volume=0.18, pan=-0.1)
        synth.add_soft_piano_note('E4', cur + 0.6, 2.5, volume=0.16, pan=0.1)

        synth.add_music_box_note(e5, cur, BEAT * 0.9, volume=vol * 1.1, pan=0.1)
        cur += BEAT * 1.0
        synth.add_music_box_note(c5, cur, BEAT * 0.9, volume=vol * 1.05, pan=0.0)
        cur += BEAT * 1.0

        # Accompaniment: G7
        synth.add_soft_piano_note('G2', cur, 3.5, volume=0.22, pan=-0.3)
        synth.add_soft_piano_note('D3', cur + 0.3, 2.5, volume=0.16, pan=-0.1)
        synth.add_soft_piano_note('B3', cur + 0.6, 2.0, volume=0.14, pan=0.1)

        synth.add_music_box_note(d5, cur, BEAT * 1.0, volume=vol * 1.1, pan=-0.1)
        cur += BEAT * 1.0

        # Final C5 resolution
        synth.add_soft_piano_note('C2', cur, 5.0, volume=0.28, pan=-0.4)
        synth.add_soft_piano_note('G2', cur + 0.2, 4.5, volume=0.20, pan=-0.2)
        synth.add_soft_piano_note('E3', cur + 0.4, 4.0, volume=0.18, pan=0.0)
        synth.add_soft_piano_note('B3', cur + 0.6, 3.8, volume=0.15, pan=0.2)
        synth.add_soft_piano_note('D4', cur + 0.8, 3.5, volume=0.12, pan=0.3)

        synth.add_music_box_note(c5, cur, BEAT * 3.0, volume=vol * 1.2, pan=0.0)
        cur += BEAT * 3.2

        return cur

    # Play Verse 1
    t = play_happy_birthday_verse(t, octave_offset=0, vol=0.30)

    # -------------------------------------------------------------
    # INTERLUDE: Romantic Sparkling Celesta Bridge (2 Bars)
    # -------------------------------------------------------------
    bridge_notes = ['E5', 'G5', 'B5', 'C6', 'G5', 'E5']
    for idx, n in enumerate(bridge_notes):
        synth.add_music_box_note(n, t + idx * 0.35, 2.0, volume=0.18, pan=0.2 * ((-1)**idx))
    t += BEAT * 3

    # -------------------------------------------------------------
    # VERSE 2: Softer, Lullaby Octave with Sparkling Bell Dust
    # -------------------------------------------------------------
    t = play_happy_birthday_verse(t, octave_offset=0, vol=0.24)

    # -------------------------------------------------------------
    # OUTRO: Gentle Wind Chime Fadeout
    # -------------------------------------------------------------
    outro_chimes = ['C4', 'E4', 'G4', 'B4', 'C5', 'E5', 'G5', 'C6']
    for idx, n in enumerate(outro_chimes):
        synth.add_music_box_note(n, t + idx * 0.28, 3.8, volume=0.16, pan=(idx / len(outro_chimes)) * 0.6 - 0.3)

    # Add lush dreamy reverb
    synth.apply_reverb_delay(delay_sec=0.26, decay=0.34)

    os.makedirs('music', exist_ok=True)
    out_file = os.path.join('music', 'happy_birthday_calm.wav')
    synth.export_wav(out_file)
    print("Done generating Happy Birthday calm melody!")

if __name__ == '__main__':
    compose_happy_birthday()

