import { SoundConfig } from '../types/game.types';

export const SOUNDS: Record<string, SoundConfig> = {
  shoot: { 
    type: 'square', 
    frequency: 440, 
    duration: 0.1, 
    volume: 0.3, 
    slide: true, 
    slideTo: 880 
  },
  explosion: { 
    type: 'sawtooth', 
    frequency: 100, 
    duration: 0.3, 
    volume: 0.4, 
    slide: true, 
    slideTo: 50 
  },
  correct: { 
    type: 'sine', 
    frequency: 523, 
    duration: 0.15, 
    volume: 0.3 
  },
  correctHigh: { 
    type: 'sine', 
    frequency: 659, 
    duration: 0.1, 
    volume: 0.3 
  },
  wrong: { 
    type: 'sawtooth', 
    frequency: 150, 
    duration: 0.2, 
    volume: 0.3 
  },
  lifeLost: { 
    type: 'square', 
    frequency: 200, 
    duration: 0.5, 
    volume: 0.4, 
    slide: true, 
    slideTo: 100 
  },
  gameOver: { 
    type: 'sawtooth', 
    frequency: 300, 
    duration: 1, 
    volume: 0.3, 
    slide: true, 
    slideTo: 100 
  },
  waveComplete: { 
    type: 'sine', 
    frequency: 440, 
    duration: 0.2, 
    volume: 0.3,
    slide: true,
    slideTo: 880
  },
  buttonClick: { 
    type: 'square', 
    frequency: 600, 
    duration: 0.05, 
    volume: 0.2 
  },
  comboUp: { 
    type: 'sine', 
    frequency: 523, 
    duration: 0.1, 
    volume: 0.25,
    slide: true,
    slideTo: 659
  }
};

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private masterVolume: number = 0.7;

  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof window !== 'undefined') {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    }
  }

  public resume(): void {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playSound(config: SoundConfig): void {
    if (!this.ctx || !this.enabled) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = config.type;
      osc.frequency.setValueAtTime(config.frequency, this.ctx.currentTime);

      if (config.slide) {
        osc.frequency.exponentialRampToValueAtTime(
          config.slideTo!,
          this.ctx.currentTime + config.duration
        );
      }

      const finalVolume = config.volume * this.masterVolume;
      gain.gain.setValueAtTime(finalVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + config.duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + config.duration);
    } catch (e) {
      console.warn('Error playing sound:', e);
    }
  }

  public play(name: keyof typeof SOUNDS): void {
    this.playSound(SOUNDS[name]);
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  public setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  public isEnabled(): boolean {
    return this.enabled;
  }
}

export const audioEngine = new AudioEngine();

export default audioEngine;
