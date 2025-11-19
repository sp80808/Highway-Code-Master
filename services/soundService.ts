
// Simple synthesizer using Web Audio API to avoid external assets
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioContext = new AudioContext();
    }
  }
  return audioContext;
};

const playTone = (freq: number, type: OscillatorType, duration: number, delay: number = 0, vol: number = 0.05) => {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  // Ensure context is running (browsers often suspend it until user interaction)
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  // Envelope to avoid clicking sounds
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
};

export const playClickSound = () => {
  playTone(600, 'sine', 0.1, 0, 0.03);
};

export const playCorrectSound = () => {
  playTone(600, 'sine', 0.1, 0, 0.1);
  playTone(1000, 'sine', 0.3, 0.1, 0.1);
};

export const playIncorrectSound = () => {
  playTone(200, 'sawtooth', 0.3, 0, 0.05);
};

export const playSuccessSound = () => {
  playTone(523.25, 'sine', 0.2, 0, 0.1); // C5
  playTone(659.25, 'sine', 0.2, 0.2, 0.1); // E5
  playTone(783.99, 'sine', 0.6, 0.4, 0.1); // G5
};

export const playFailureSound = () => {
  playTone(300, 'triangle', 0.3, 0, 0.08);
  playTone(200, 'triangle', 0.5, 0.25, 0.08);
};
