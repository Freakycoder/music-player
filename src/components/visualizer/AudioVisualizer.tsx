import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../../contexts/PlayerContext';
// Note: The filename has a typo, but we'll use what exists in the filesystem
import WaveformVisualizer from './WaveformVisualizer';
import FrequencyVisualizer from './FrequencyVisualizer';
import CircularVisualizer from './CircularVisualizer';
import ParticleVisualizer from './ParticleVisualizer';
import ThreeDVisualizer from './ThreeDVisualizer';

interface AudioVisualizerProps {
  fullscreen?: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ fullscreen = false }) => {
  const { playerState, getAudioData } = usePlayer();
  const { currentTrack, isPlaying, visualizationSettings } = playerState;
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Add debug message to console to check if component mounts
  useEffect(() => {
    console.log("AudioVisualizer mounted", { 
      isPlaying, 
      visualizationType: visualizationSettings.type 
    });
    
    // Force periodic re-renders to ensure visualizations update
    const interval = setInterval(() => {
      if (containerRef.current) {
        containerRef.current.classList.toggle('force-update');
      }
    }, 100);

    // Set explicit dimensions for container
    if (containerRef.current) {
      containerRef.current.style.minHeight = fullscreen ? '100vh' : '500px';
      containerRef.current.style.minWidth = '100%';
    }
    
    return () => {
      clearInterval(interval);
      console.log("AudioVisualizer unmounted");
    };
  }, [fullscreen, isPlaying, visualizationSettings.type]);
  
  if (!currentTrack) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-900" style={{ minHeight: '300px' }}>
        <p className="text-zinc-400">Select a track to visualize</p>
      </div>
    );
  }
  
  // Determine which visualizer to show based on settings
  const renderVisualizer = () => {
    console.log("Rendering visualizer type:", visualizationSettings.type);
    
    try {
      switch (visualizationSettings.type) {
        case 'waveform':
          return <WaveformVisualizer />;
        case 'frequency':
          return <FrequencyVisualizer />;
        case 'circular':
          return <CircularVisualizer />;
        case 'particles':
          return <ParticleVisualizer />;
        case '3d':
          return <ThreeDVisualizer />;
        default:
          return <WaveformVisualizer />;
      }
    } catch (error) {
      console.error("Error rendering visualizer:", error);
      return <div className="text-red-500 p-4">Visualizer Error. See console.</div>;
    }
  };
  
  // Get background gradient colors based on track
  const getBackgroundGradient = () => {
    // Always return a visible gradient rather than using track colors
    return 'bg-gradient-to-br from-purple-900 via-zinc-900 to-zinc-800';
  };
  
  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`relative ${getBackgroundGradient()} ${
        fullscreen ? 'fixed inset-0 z-50' : 'w-full h-full rounded-xl overflow-hidden'
      }`}
      style={{ 
        minHeight: fullscreen ? '100vh' : '500px',
        minWidth: '100%'
      }}
    >
      {/* Track Info Overlay */}
      <div className={`absolute z-10 ${fullscreen ? 'bottom-10 left-10' : 'bottom-4 left-4'}`}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col"
        >
          <h2 className="text-white font-bold text-2xl drop-shadow-lg">
            {currentTrack.title}
          </h2>
          <p className="text-zinc-300 text-lg drop-shadow-lg">
            {currentTrack.artist}
          </p>
        </motion.div>
      </div>
      
      {/* Visualizer Container */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ minHeight: '100%', width: '100%' }}
      >
        {renderVisualizer()}
      </div>
      
      {/* Loading/Inactive State */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
            className="text-white text-center"
          >
            <p className="text-xl font-medium mb-2">Press play to visualize</p>
            <p className="text-zinc-400">The visualization responds to the audio</p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AudioVisualizer;