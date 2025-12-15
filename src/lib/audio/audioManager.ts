import { get } from 'svelte/store';
import { settings } from '../../stores/settings';

class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;

  constructor() {
    // Only load audio in browser environment
    if (typeof window !== 'undefined') {
      // Load audio files
      this.loadSound('warning', '/audio/warning-chime.mp3');
      this.loadSound('roundEnd', '/audio/round-end.mp3');
      
      // Update mute state from settings
      settings.subscribe((s) => {
        this.isMuted = !s.audioEnabled;
      });
    }
  }

  private loadSound(name: string, path: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.volume = 0.5;
      this.sounds.set(name, audio);
    } catch (error) {
      console.warn(`Failed to load audio: ${path}`, error);
    }
  }

  playSound(name: string, volume: number = 0.5): void {
    if (typeof window === 'undefined' || this.isMuted) return;
    
    const audio = this.sounds.get(name);
    if (!audio) {
      console.warn(`Sound not found: ${name}`);
      return;
    }

    try {
      // Clone and play to allow overlapping sounds
      const audioClone = audio.cloneNode() as HTMLAudioElement;
      audioClone.volume = volume;
      audioClone.play().catch((error) => {
        console.warn(`Failed to play sound: ${name}`, error);
      });
    } catch (error) {
      console.warn(`Error playing sound: ${name}`, error);
    }
  }

  setVolume(volume: number): void {
    this.sounds.forEach((audio) => {
      audio.volume = Math.max(0, Math.min(1, volume));
    });
  }

  mute(): void {
    this.isMuted = true;
  }

  unmute(): void {
    this.isMuted = false;
  }

  isAudioEnabled(): boolean {
    return !this.isMuted;
  }
}

// Singleton instance
export const audioManager = new AudioManager();

