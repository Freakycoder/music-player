import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play as PlayIcon,
  Pause as PauseIcon,
  X as XIcon,
  Maximize as ArrowsExpandIcon,
  Settings as CogIcon,
  Music as MusicNoteIcon,
  Volume2 as VolumeUpIcon,
  VolumeX as VolumeOffIcon,
} from 'lucide-react';
import {
  BarChart as ChartBarIcon,
  Sliders as AdjustmentsIcon,
  Circle as DotsCircleHorizontalIcon,
  Columns as ViewBoardsIcon,
  Palette as ColorSwatchIcon,
} from 'lucide-react';

import AudioVisualizer from '../../components/visualizer/AudioVisualizer';
import { usePlayer } from '../../contexts/PlayerContext';
import { Track, VisualizationSettings } from '../../types';
import { getTrackById } from '../../data/mockData';

interface VisualizerPageProps {
  track: Track;
}

const VisualizerPage: React.FC<VisualizerPageProps> = ({ track }) => {
  const router = useRouter();
  const { playerState, playTrack, pauseTrack, resumeTrack, toggleMute, setVolume, updateVisualizationSettings } = usePlayer();
  const { currentTrack, isPlaying, isMuted, volume, visualizationSettings } = playerState;
  
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Auto-hide controls after inactivity
  const resetControlsTimeout = () => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    setShowControls(true);
    
    const timeout = setTimeout(() => {
      if (!showSettings) {
        setShowControls(false);
      }
    }, 3000);
    
    setControlsTimeout(timeout);
  };
  
  // Mouse movement detection
  useEffect(() => {
    const handleMouseMove = () => {
      resetControlsTimeout();
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    resetControlsTimeout();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [showSettings]);
  
  // Initialize track playback
  useEffect(() => {
    if (track && (!currentTrack || currentTrack.id !== track.id || !isPlaying)) {
      playTrack(track);
    }
  }, [track, currentTrack, isPlaying, playTrack]);
  
  // Visualizer type options
  const visualizerTypes = [
    { value: 'waveform', label: 'Waveform', icon: ChartBarIcon },
    { value: 'frequency', label: 'Frequency', icon: AdjustmentsIcon },
    { value: 'circular', label: 'Circular', icon: DotsCircleHorizontalIcon },
    { value: 'particles', label: 'Particles', icon: ViewBoardsIcon },
  ];
  
  // Color scheme options
  const colorSchemes = [
    { value: 'track', label: 'From Track' },
    { value: 'custom', label: 'Custom' },
    { value: 'spectrum', label: 'Spectrum' },
  ];
  
  return (
    <div className="fixed inset-0 bg-black">
      {/* Full Screen Visualizer */}
      <div className="absolute inset-0 z-0">
        <AudioVisualizer fullscreen />
      </div>
      
      {/* UI Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center pointer-events-auto">
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.back()}
                  className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70"
                >
                  <XIcon className="h-5 w-5" />
                </motion.button>
                
                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full">
                  <div className="flex items-center space-x-2">
                    <MusicNoteIcon className="h-4 w-4 text-white" />
                    <div>
                      <p className="text-white font-medium">{track.title}</p>
                      <p className="text-zinc-400 text-sm">{track.artist}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70"
              >
                <CogIcon className="h-5 w-5" />
              </motion.button>
            </div>
            
            {/* Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex justify-center pointer-events-auto">
                <div className="bg-black/50 backdrop-blur-md p-4 rounded-full">
                  <div className="flex items-center space-x-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white"
                      onClick={isPlaying ? pauseTrack : resumeTrack}
                    >
                      {isPlaying ? (
                        <PauseIcon className="h-8 w-8" />
                      ) : (
                        <PlayIcon className="h-8 w-8" />
                      )}
                    </motion.button>
                    
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleMute}
                        className="text-white"
                      >
                        {isMuted ? (
                          <VolumeOffIcon className="h-6 w-6" />
                        ) : (
                          <VolumeUpIcon className="h-6 w-6" />
                        )}
                      </motion.button>
                      
                      <div className="relative w-24 h-1 bg-zinc-700 rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: `${isMuted ? 0 : volume * 100}%` }}
                          className="absolute h-full bg-white"
                        />
                        
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={(e) => setVolume(Number(e.target.value))}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {visualizerTypes.map((type) => (
                        <motion.button
                          key={type.value}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateVisualizationSettings({ type: type.value as VisualizationSettings['type'] })}
                          className={`p-2 rounded-full ${
                            visualizationSettings.type === type.value
                              ? 'bg-white text-black'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <type.icon className="h-5 w-5" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute top-0 right-0 bottom-0 w-80 bg-zinc-900/90 backdrop-blur-lg z-20 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Visualization Settings</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSettings(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <XIcon className="h-5 w-5" />
              </motion.button>
            </div>
            
            {/* Visualization Type */}
            <div className="mb-6">
              <h3 className="text-sm uppercase text-zinc-500 font-semibold mb-3">Visualization Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {visualizerTypes.map((type) => (
                  <motion.button
                    key={type.value}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => updateVisualizationSettings({ type: type.value as VisualizationSettings['type'] })}
                    className={`p-3 rounded-lg flex items-center ${
                      visualizationSettings.type === type.value
                        ? 'bg-white/10 border border-white/30'
                        : 'bg-zinc-800/80 hover:bg-zinc-700/80'
                    }`}
                  >
                    <type.icon className="h-5 w-5 mr-2 text-zinc-300" />
                    <span className="text-white">{type.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Sensitivity */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm uppercase text-zinc-500 font-semibold">Sensitivity</h3>
                <span className="text-white font-medium">{visualizationSettings.sensitivity}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={visualizationSettings.sensitivity}
                onChange={(e) => updateVisualizationSettings({ sensitivity: Number(e.target.value) })}
                className="w-full h-2 rounded-full appearance-none bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <div className="flex justify-between text-xs text-zinc-500 mt-1">
                <span>Subtle</span>
                <span>Intense</span>
              </div>
            </div>
            
            {/* Color Scheme */}
            <div className="mb-6">
              <h3 className="text-sm uppercase text-zinc-500 font-semibold mb-3">Color Scheme</h3>
              <div className="space-y-2">
                {colorSchemes.map((scheme) => (
                  <motion.button
                    key={scheme.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateVisualizationSettings({ colorScheme: scheme.value as VisualizationSettings['colorScheme'] })}
                    className={`w-full p-3 rounded-lg flex items-center justify-between ${
                      visualizationSettings.colorScheme === scheme.value
                        ? 'bg-white/10 border border-white/30'
                        : 'bg-zinc-800/80 hover:bg-zinc-700/80'
                    }`}
                  >
                    <span className="text-white">{scheme.label}</span>
                    {visualizationSettings.colorScheme === scheme.value && (
                      <div className="h-3 w-3 rounded-full bg-white" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Custom Colors (if custom color scheme is selected) */}
            {visualizationSettings.colorScheme === 'custom' && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm uppercase text-zinc-500 font-semibold">Custom Colors</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    <ColorSwatchIcon className="h-5 w-5" />
                  </motion.button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(visualizationSettings.customColors || []).map((color, index) => (
                    <div
                      key={index}
                      className="h-12 rounded-md cursor-pointer"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  {(!visualizationSettings.customColors || visualizationSettings.customColors.length < 4) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-12 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
                    >
                      +
                    </motion.button>
                  )}
                </div>
              </div>
            )}
            
            {/* Additional Settings based on visualization type */}
            {visualizationSettings.type === 'particles' && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm uppercase text-zinc-500 font-semibold">Particle Density</h3>
                  <span className="text-white font-medium">{visualizationSettings.particleDensity}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={visualizationSettings.particleDensity}
                  onChange={(e) => updateVisualizationSettings({ particleDensity: Number(e.target.value) })}
                  className="w-full h-2 rounded-full appearance-none bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-1">
                  <span>Few</span>
                  <span>Many</span>
                </div>
              </div>
            )}
            
            {visualizationSettings.type === '3d' && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm uppercase text-zinc-500 font-semibold">Rotation Speed</h3>
                  <span className="text-white font-medium">{visualizationSettings.rotationSpeed}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={visualizationSettings.rotationSpeed}
                  onChange={(e) => updateVisualizationSettings({ rotationSpeed: Number(e.target.value) })}
                  className="w-full h-2 rounded-full appearance-none bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-1">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>
            )}
            
            <div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => updateVisualizationSettings({
                  type: 'waveform',
                  sensitivity: 7,
                  colorScheme: 'track',
                  showWaveform: true,
                  particleDensity: 50,
                  rotationSpeed: 1,
                })}
                className="w-full p-3 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 mt-auto"
              >
                Reset to Defaults
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  
  // Get track data
  const track = getTrackById(id as string);
  
  if (!track) {
    return {
      notFound: true,
    };
  }
  
  return {
    props: {
      track,
    },
  };
};

export default VisualizerPage;