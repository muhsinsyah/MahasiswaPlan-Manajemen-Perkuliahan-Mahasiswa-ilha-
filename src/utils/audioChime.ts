/**
 * Web Audio procedural sound generator for class and presentation reminders.
 * Provides multiple chime styles with custom volume control.
 */
export function playChimeSound(
  type: 'gentle_chime' | 'digital_bell' | 'marimba' = 'gentle_chime',
  volume: number = 0.8
): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const vol = Math.max(0.05, Math.min(1.0, volume));

    if (type === 'digital_bell') {
      // Crisp bell triple ring (784Hz, 1046.5Hz, 1318.5Hz)
      const freqs = [784.0, 1046.5, 1318.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.18 * vol, now + idx * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.8);
      });
      return;
    }

    if (type === 'marimba') {
      // Warm marimba arpeggio (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2 * vol, now + idx * 0.08 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
      return;
    }

    // Default: Gentle collegiate two-tone chime (587.33 Hz - D5 -> 880.0 Hz - A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.18 * vol, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.9);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, now + 0.18);

    gain2.gain.setValueAtTime(0, now + 0.18);
    gain2.gain.linearRampToValueAtTime(0.22 * vol, now + 0.23);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.18);
    osc2.stop(now + 1.4);
  } catch (err) {
    console.warn('Audio chime could not play due to browser policy:', err);
  }
}
