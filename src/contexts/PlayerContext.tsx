import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Track, PlayerState, VisualizationSettings } from '../types';
import * as Tone from 'tone';
import { tracks } from '../data/mockData';

interface PlayerContextType {
    playerState: PlayerState;
    initializeAudio: () => Promise<void>;
    playTrack: (track: Track) => void;
    pauseTrack: () => void;
    resumeTrack: () => void;
    seekToPosition: (position: number) => void;
    skipToNext: () => void;
    skipToPrevious: () => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    addToQueue: (track: Track) => void;
    removeFromQueue: (trackId: string) => void;
    clearQueue: () => void;
    updateVisualizationSettings: (settings: Partial<VisualizationSettings>) => void;
    getAudioData: () => {
      waveform: number[];
      frequency: number[];
      amplitude: number;
    };
  }

const defaultVisualizationSettings: VisualizationSettings = {
  type: 'waveform',
  sensitivity: 7,
  colorScheme: 'track',
  showWaveform: true,
  particleDensity: 50,
  rotationSpeed: 1,
};

const defaultPlayerState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  queue: [],
  history: [],
  currentTime: 0,
  volume: 0.8,
  isMuted: false,
  isShuffled: false,
  repeatMode: 'none',
  visualizationSettings: defaultVisualizationSettings,
};

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerState, setPlayerState] = useState<PlayerState>(defaultPlayerState);
  const playerRef = useRef<HTMLAudioElement | null>(null);
  const tonePlayerRef = useRef<Tone.Player | null>(null);
  const analyzerRef = useRef<Tone.Analyser | null>(null);
  const waveformAnalyzerRef = useRef<Tone.Analyser | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Initialize audio system
  const initializeAudio = async (): Promise<void> => {
    try {
      await Tone.start();
      
      // Create Tone.js player
      const player = new Tone.Player().toDestination();
      tonePlayerRef.current = player;
      
      // Create analyzers for visualization
      const analyzer = new Tone.Analyser('fft', 1024);
      const waveformAnalyzer = new Tone.Analyser('waveform', 1024);
      
      player.connect(analyzer);
      player.connect(waveformAnalyzer);
      
      analyzerRef.current = analyzer;
      waveformAnalyzerRef.current = waveformAnalyzer;
      
      // For traditional Web Audio API
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      console.log('Audio system initialized');
    } catch (error) {
      console.error('Failed to initialize audio system:', error);
    }
  };

  // Play a track
  const playTrack = (track: Track) => {
    if (!tonePlayerRef.current) {
      console.error('Tone player not initialized');
      return;
    }

    // Update player state
    setPlayerState(prev => ({
      ...prev,
      currentTrack: track,
      isPlaying: true,
      currentTime: 0,
      history: prev.currentTrack 
        ? [...prev.history, prev.currentTrack].slice(-10) 
        : prev.history,
    }));

    try {
      // In a real app, we would load the audio file
      // For mock purposes, we'll just pretend it's playing
      tonePlayerRef.current.start();

      // Start the visualization update loop
      startVisualizationLoop();
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  };

  // Pause current track
  const pauseTrack = () => {
    if (tonePlayerRef.current) {
      tonePlayerRef.current.stop();
    }
    
    setPlayerState(prev => ({
      ...prev,
      isPlaying: false,
    }));

    // Stop the visualization loop
    stopVisualizationLoop();
  };

  // Resume playback
  const resumeTrack = () => {
    if (!tonePlayerRef.current || !playerState.currentTrack) return;
    
    tonePlayerRef.current.start();
    setPlayerState(prev => ({
      ...prev,
      isPlaying: true,
    }));

    // Resume the visualization loop
    startVisualizationLoop();
  };

  // Seek to position
  const seekToPosition = (position: number) => {
    if (!tonePlayerRef.current) return;
    
    try {
      // In a real implementation, we would seek the audio
      setPlayerState(prev => ({
        ...prev,
        currentTime: position,
      }));
    } catch (error) {
      console.error('Failed to seek:', error);
    }
  };

  // Skip to next track
  const skipToNext = () => {
    if (playerState.queue.length === 0) return;
    
    const nextTrack = playerState.queue[0];
    const newQueue = playerState.queue.slice(1);
    
    setPlayerState(prev => ({
      ...prev,
      queue: newQueue,
    }));
    
    playTrack(nextTrack);
  };

  // Skip to previous track
  const skipToPrevious = () => {
    if (playerState.history.length === 0) return;
    
    const prevTrack = playerState.history[playerState.history.length - 1];
    const newHistory = playerState.history.slice(0, -1);
    
    setPlayerState(prev => ({
      ...prev,
      history: newHistory,
    }));
    
    playTrack(prevTrack);
  };

  // Toggle shuffle mode
  const toggleShuffle = () => {
    setPlayerState(prev => ({
      ...prev,
      isShuffled: !prev.isShuffled,
      queue: prev.isShuffled 
        ? [...prev.queue] // Already shuffled, do nothing
        : [...prev.queue].sort(() => Math.random() - 0.5), // Shuffle
    }));
  };

  // Toggle repeat mode
  const toggleRepeat = () => {
    const modes: PlayerState['repeatMode'][] = ['none', 'track', 'queue'];
    const currentIndex = modes.indexOf(playerState.repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    
    setPlayerState(prev => ({
      ...prev,
      repeatMode: modes[nextIndex],
    }));
  };

  // Set volume
  const setVolume = (volume: number) => {
    if (!tonePlayerRef.current) return;
    
    // Ensure volume is between 0 and 1
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    
    tonePlayerRef.current.volume.value = Tone.gainToDb(normalizedVolume);
    
    setPlayerState(prev => ({
      ...prev,
      volume: normalizedVolume,
      isMuted: normalizedVolume === 0,
    }));
  };

  // Toggle mute
  const toggleMute = () => {
    if (!tonePlayerRef.current) return;
    
    const newMutedState = !playerState.isMuted;
    
    if (newMutedState) {
      tonePlayerRef.current.volume.value = Tone.gainToDb(0);
    } else {
      tonePlayerRef.current.volume.value = Tone.gainToDb(playerState.volume);
    }
    
    setPlayerState(prev => ({
      ...prev,
      isMuted: newMutedState,
    }));
  };

  // Add track to queue
  const addToQueue = (track: Track) => {
    setPlayerState(prev => ({
      ...prev,
      queue: [...prev.queue, track],
    }));
  };

  // Remove track from queue
  const removeFromQueue = (trackId: string) => {
    setPlayerState(prev => ({
      ...prev,
      queue: prev.queue.filter(track => track.id !== trackId),
    }));
  };

  // Clear the queue
  const clearQueue = () => {
    setPlayerState(prev => ({
      ...prev,
      queue: [],
    }));
  };

  // Update visualization settings
  const updateVisualizationSettings = (settings: Partial<VisualizationSettings>) => {
    setPlayerState(prev => ({
      ...prev,
      visualizationSettings: {
        ...prev.visualizationSettings,
        ...settings,
      },
    }));
  };

  // Get audio data for visualizations
  const getAudioData = () => {
    // Generate mock audio data for visualization demo purposes
    // In a real implementation, this would use the analyzers
    
    const mockWaveform = Array.from(
      { length: 128 }, 
      () => (Math.random() * 0.5) + (playerState.isPlaying ? 0.5 : 0)
    );
    
    const mockFrequency = Array.from(
      { length: 128 },
      (_, i) => {
        // Create a curve that peaks in the mids for more realistic frequency data
        const normalizedIndex = i / 128;
        const value = Math.sin(normalizedIndex * Math.PI) * 
                    (playerState.isPlaying ? 0.8 : 0.1) * 
                    (Math.random() * 0.4 + 0.6);
        return value;
      }
    );
    
    const mockAmplitude = playerState.isPlaying ? 
      Math.random() * 0.3 + 0.7 : 
      Math.random() * 0.1;
    
    return {
      waveform: mockWaveform,
      frequency: mockFrequency,
      amplitude: mockAmplitude,
    };
  };

  // Start visualization loop
  const startVisualizationLoop = () => {
    if (rafIdRef.current) return;
    
    const updateLoop = () => {
      // In a real app, this would analyze actual audio data
      // and update state accordingly
      
      // For our mock, we'll just update the current time
      setPlayerState(prev => {
        if (!prev.isPlaying || !prev.currentTrack) return prev;
        
        const newTime = prev.currentTime + 0.1;
        
        // Check if we've reached the end of the track
        if (newTime >= prev.currentTrack.duration) {
          if (prev.repeatMode === 'track') {
            return { ...prev, currentTime: 0 };
          } else if (prev.queue.length > 0) {
            // Auto-play next track logic would go here
            // For simplicity, we'll just loop back
            return { ...prev, currentTime: 0 };
          } else {
            stopVisualizationLoop();
            return { ...prev, isPlaying: false, currentTime: 0 };
          }
        }
        
        return { ...prev, currentTime: newTime };
      });
      
      rafIdRef.current = requestAnimationFrame(updateLoop);
    };
    
    rafIdRef.current = requestAnimationFrame(updateLoop);
  };

  // Stop visualization loop
  const stopVisualizationLoop = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVisualizationLoop();
      if (tonePlayerRef.current) {
        tonePlayerRef.current.dispose();
      }
      if (analyzerRef.current) {
        analyzerRef.current.dispose();
      }
      if (waveformAnalyzerRef.current) {
        waveformAnalyzerRef.current.dispose();
      }
    };
  }, []);

  const contextValue: PlayerContextType = {
    playerState,
    initializeAudio,
    playTrack,
    pauseTrack,
    resumeTrack,
    seekToPosition,
    skipToNext,
    skipToPrevious,
    toggleShuffle,
    toggleRepeat,
    setVolume,
    toggleMute,
    addToQueue,
    removeFromQueue,
    clearQueue,
    updateVisualizationSettings,
    getAudioData,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

// Custom hook for using the player context
export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  
  return context;
};