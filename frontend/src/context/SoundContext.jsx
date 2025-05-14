import { createContext, useContext, useRef, useEffect } from 'react';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const audioContextRef = useRef(null);

  // Initialize audio context on mount
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.error('Error creating audio context:', error);
    }

    // Cleanup on unmount
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Basic oscillator sound generator
  const createSound = (frequency, duration, type = 'sine', volume = 0.3) => {
    if (!audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  // Predefined sound effects
  const sounds = {
    // Timer completion sound - a pleasant chime
    timerComplete: () => {
      // Play a pleasant ascending chime
      const notes = [523, 659, 784]; // C5, E5, G5
      notes.forEach((freq, index) => {
        setTimeout(() => {
          createSound(freq, 0.4, 'sine', 0.2);
        }, index * 150);
      });
    },

    // Simple beep
    beep: () => {
      createSound(800, 0.3, 'sine', 0.3);
    },

    // Success sound - upward sweep
    success: () => {
      if (!audioContextRef.current) return;
      
      try {
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        
        oscillator.frequency.setValueAtTime(400, audioContextRef.current.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContextRef.current.currentTime + 0.3);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);
        
        oscillator.start(audioContextRef.current.currentTime);
        oscillator.stop(audioContextRef.current.currentTime + 0.3);
      } catch (error) {
        console.error('Error playing success sound:', error);
      }
    },

    // Alert sound - repetitive beep
    alert: () => {
      [0, 0.3, 0.6].forEach((delay) => {
        setTimeout(() => {
          createSound(1000, 0.2, 'square', 0.3);
        }, delay * 1000);
      });
    },

    // Click sound - short, subtle
    click: () => {
      createSound(600, 0.1, 'sine', 0.1);
    },

    // Error sound - descending tone
    error: () => {
      if (!audioContextRef.current) return;
      
      try {
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioContextRef.current.currentTime + 0.4);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.4);
        
        oscillator.start(audioContextRef.current.currentTime);
        oscillator.stop(audioContextRef.current.currentTime + 0.4);
      } catch (error) {
        console.error('Error playing error sound:', error);
      }
    }
  };

  // Play a specific sound by name
  const playSound = (soundName) => {
    if (sounds[soundName]) {
      sounds[soundName]();
    } else {
      console.warn(`Sound "${soundName}" not found`);
    }
  };

  // Custom sound generation method
  const createCustomSound = (params) => {
    const {
      frequency = 440,
      duration = 0.5,
      type = 'sine',
      volume = 0.3
    } = params;
    
    createSound(frequency, duration, type, volume);
  };

  const value = {
    playSound,
    createCustomSound,
    sounds
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};