import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const SOUNDS = {
  bgMusic: require('../assets/sounds/backgroundMusic.mp3'),
  bubbles: require('../assets/sounds/bubbles.mp3'),
  tap: require('../assets/sounds/tap.mp3'),
  correct: require('../assets/sounds/correct.mp3'),
  itemBought: require('../assets/sounds/itemBougt.mp3'),
};

class SoundManager {
  private isMuted: boolean = false;
  private bgMusicSound: Audio.Sound | null = null;
  private bubblesSound: Audio.Sound | null = null;
  private sfxSounds: { [key: string]: Audio.Sound } = {};

  constructor() {
    this.init();
  }

  private async init() {
    if (typeof window === 'undefined') return; // Skip SSR

    try {
      const storedMute = await AsyncStorage.getItem('pulpo_mute_sound');
      if (storedMute === 'true') {
        this.isMuted = true;
      }
      
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      }

      // Pre-load sounds
      await this.preloadSound('tap', SOUNDS.tap);
      await this.preloadSound('correct', SOUNDS.correct);
      await this.preloadSound('itemBought', SOUNDS.itemBought);
    } catch (e) {
      console.warn('Audio init error', e);
    }
  }

  private async preloadSound(name: string, source: any) {
    try {
      const { sound } = await Audio.Sound.createAsync(source);
      this.sfxSounds[name] = sound;
    } catch (e) {
      console.warn(`Failed to load sound ${name}`, e);
    }
  }

  public async setMuted(muted: boolean) {
    this.isMuted = muted;
    await AsyncStorage.setItem('pulpo_mute_sound', muted ? 'true' : 'false');
    
    if (muted) {
      if (this.bgMusicSound) await this.bgMusicSound.pauseAsync();
      if (this.bubblesSound) await this.bubblesSound.pauseAsync();
    } else {
      if (this.bgMusicSound) await this.bgMusicSound.playAsync();
      if (this.bubblesSound) await this.bubblesSound.playAsync();
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public async playBgMusic() {
    if (this.bgMusicSound || this.bubblesSound) return; // Already playing/loaded
    
    try {
      // Loop background music (soft)
      const { sound: bgSound } = await Audio.Sound.createAsync(
        SOUNDS.bgMusic,
        { isLooping: true, volume: 0.15 } // not super loud
      );
      this.bgMusicSound = bgSound;

      // Loop bubbles (soft)
      const { sound: bubbleSound } = await Audio.Sound.createAsync(
        SOUNDS.bubbles,
        { isLooping: true, volume: 0.15 } // not super loud
      );
      this.bubblesSound = bubbleSound;
      
      if (!this.isMuted) {
        await this.bgMusicSound.playAsync();
        await this.bubblesSound.playAsync();
      }
    } catch (e) {
      console.warn('Failed to play bg music, setting up web interaction fallback', e);
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const tryPlay = async () => {
          if (!this.isMuted) {
            try {
              await this.bgMusicSound?.playAsync();
              await this.bubblesSound?.playAsync();
            } catch (err) {
              console.warn('Still failed to play bg music', err);
            }
          }
          document.removeEventListener('click', tryPlay, true);
          document.removeEventListener('touchstart', tryPlay, true);
          document.removeEventListener('pointerdown', tryPlay, true);
        };
        document.addEventListener('click', tryPlay, true);
        document.addEventListener('touchstart', tryPlay, true);
        document.addEventListener('pointerdown', tryPlay, true);
      }
    }
  }

  public async stopBgMusic() {
    try {
      if (this.bgMusicSound) {
        await this.bgMusicSound.stopAsync();
        await this.bgMusicSound.unloadAsync();
        this.bgMusicSound = null;
      }
      if (this.bubblesSound) {
        await this.bubblesSound.stopAsync();
        await this.bubblesSound.unloadAsync();
        this.bubblesSound = null;
      }
    } catch (e) {
      console.warn('Failed to stop bg music', e);
    }
  }

  public async playSfx(name: 'tap' | 'correct' | 'itemBought') {
    if (this.isMuted) return;
    
    try {
      let soundToPlay = this.sfxSounds[name];
      if (soundToPlay) {
        await soundToPlay.replayAsync();
      } else {
        const { sound } = await Audio.Sound.createAsync(SOUNDS[name]);
        this.sfxSounds[name] = sound; // Cache it
        await sound.playAsync();
      }
    } catch (e) {
      console.warn(`Failed to play ${name}`, e);
    }
  }
}

export const soundManager = new SoundManager();
