
import { useEffect, useRef } from 'react';

export const useNotificationSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create a simple notification sound using Web Audio API
    const createNotificationSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playSound = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      };

      return playSound;
    };

    try {
      const playSound = createNotificationSound();
      audioRef.current = { play: playSound } as any;
    } catch (error) {
      console.warn('Could not create notification sound:', error);
    }
  }, []);

  const playNotificationSound = () => {
    try {
      if (audioRef.current?.play) {
        audioRef.current.play();
      }
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  };

  return { playNotificationSound };
};
