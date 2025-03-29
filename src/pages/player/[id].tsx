import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play as PlayIcon,
  Pause as PauseIcon,
  Rewind as RewindIcon,
  FastForward,
  Volume2 as VolumeUpIcon,
  VolumeX as VolumeOffIcon,
  Heart as HeartIcon,
  MoreHorizontal as DotsHorizontalIcon,
  Clock as ClockIcon,
  ArrowLeft as ArrowLeftIcon,
  Share as ShareIcon,
  Shuffle as SwitchHorizontalIcon,
  RotateCcw as ReplyIcon,
  FastForwardIcon,
} from 'lucide-react';
import {
  LayoutGrid as ViewGridIcon,
  Columns as ViewBoardsIcon,
  Sliders as AdjustmentsIcon,
  BarChart as ChartBarIcon,
  Circle as DotsCircleHorizontalIcon,
} from 'lucide-react';

import MainLayout from '../../components/layout/MainLayout';
import AudioVisualizer from '../../components/visualizer/AudioVisualizer';
import { usePlayer } from '../../contexts/PlayerContext';
import { Track, VisualizationSettings } from '../../types';
import { getTrackById, tracks } from '../../data/mockData';

interface PlayerPageProps {
  track: Track;
  recommendedTracks: Track[];
}

const PlayerPage: React.FC<PlayerPageProps> = ({ track, recommendedTracks }) => {
  const router = useRouter();
  const { playerState, playTrack, pauseTrack, resumeTrack, skipToNext, skipToPrevious, toggleMute, setVolume, seekToPosition, updateVisualizationSettings } = usePlayer();
  const { currentTrack, isPlaying, volume, isMuted, currentTime, visualizationSettings } = playerState;
  
  const [isLiked, setIsLiked] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'lyrics' | 'related'>('visualizer');
  
  // Calculate progress percentage
  const progress = currentTrack ? (currentTime / currentTrack.duration) * 100 : 0;
  
  // Format time in mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle track play
  useEffect(() => {
    if (track && (!currentTrack || currentTrack.id !== track.id || !isPlaying)) {
      playTrack(track);
    }
  }, [track, currentTrack, isPlaying, playTrack]);
  
  // Visualizer type options
  const visualizerTypes: { value: VisualizationSettings['type']; label: string; icon: React.ComponentType<React.ComponentProps<'svg'>> }[] = [
    { value: 'waveform', label: 'Waveform', icon: ChartBarIcon },
    { value: 'frequency', label: 'Frequency', icon: AdjustmentsIcon },
    { value: 'circular', label: 'Circular', icon: DotsCircleHorizontalIcon },
    { value: 'particles', label: 'Particles', icon: ViewBoardsIcon },
  ];
  
  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center text-zinc-300 hover:text-white"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span>Back</span>
          </motion.button>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <ShareIcon className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full bg-zinc-800 ${isLiked ? 'text-pink-500' : 'text-zinc-400 hover:text-white'}`}
            >
              <HeartIcon className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <DotsHorizontalIcon className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 grid grid-cols-3 gap-8">
          {/* Left Column - Album Art */}
          <div className="col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="aspect-square relative rounded-xl overflow-hidden shadow-2xl"
            >
              <Image
                src={track.cover || '/images/placeholder.jpg'}
                alt={track.title}
                fill
                className="object-cover"
              />
            </motion.div>
            
            <div className="mt-6">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl font-bold text-white"
              >
                {track.title}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-zinc-400 mt-2"
              >
                {track.artist}
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-sm text-zinc-500 mt-1"
              >
                {track.album} · {new Date(track.releaseDate).getFullYear()}
              </motion.p>
            </div>
            
            {/* Transport Controls */}
            <div className="mt-8">
              {/* Progress Bar */}
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-sm text-zinc-400">{formatTime(currentTime)}</span>
                
                <div className="relative flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden group">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1, ease: "linear" }}
                    className="absolute h-full bg-white group-hover:bg-purple-500"
                  />
                  
                  <input
                    type="range"
                    min="0"
                    max={track.duration}
                    value={currentTime}
                    onChange={(e) => seekToPosition(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                
                <span className="text-sm text-zinc-400">{formatTime(track.duration)}</span>
              </div>
              
              {/* Playback Controls */}
              <div className="flex justify-between items-center mb-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-zinc-400 hover:text-white"
                >
                  <SwitchHorizontalIcon className="h-5 w-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={skipToPrevious}
                  className="p-2 text-zinc-400 hover:text-white"
                >
                  <RewindIcon className="h-6 w-6" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={isPlaying ? pauseTrack : resumeTrack}
                  className="p-4 bg-white rounded-full text-black hover:bg-zinc-200"
                >
                  {isPlaying ? (
                    <PauseIcon className="h-8 w-8" />
                  ) : (
                    <PlayIcon className="h-8 w-8" />
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={skipToNext}
                  className="p-2 text-zinc-400 hover:text-white"
                >
                  <FastForwardIcon className="h-6 w-6" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-zinc-400 hover:text-white"
                >
                  <ReplyIcon className="h-5 w-5" />
                </motion.button>
              </div>
              
              {/* Volume Control */}
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  {isMuted ? (
                    <VolumeOffIcon className="h-5 w-5" />
                  ) : (
                    <VolumeUpIcon className="h-5 w-5" />
                  )}
                </motion.button>
                
                <div className="relative flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
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
            </div>
          </div>
          
          {/* Right Column - Visualizer/Lyrics/Related */}
          <div className="col-span-2">
            {/* Tabs */}
            <div className="flex items-center mb-4 border-b border-zinc-800">
              <motion.button
                whileHover={{ color: '#fff' }}
                onClick={() => setActiveTab('visualizer')}
                className={`py-3 px-4 text-sm font-medium relative ${
                  activeTab === 'visualizer' ? 'text-white' : 'text-zinc-400'
                }`}
              >
                Visualizer
                {activeTab === 'visualizer' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                  />
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ color: '#fff' }}
                onClick={() => setActiveTab('lyrics')}
                className={`py-3 px-4 text-sm font-medium relative ${
                  activeTab === 'lyrics' ? 'text-white' : 'text-zinc-400'
                }`}
              >
                Lyrics
                {activeTab === 'lyrics' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                  />
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ color: '#fff' }}
                onClick={() => setActiveTab('related')}
                className={`py-3 px-4 text-sm font-medium relative ${
                  activeTab === 'related' ? 'text-white' : 'text-zinc-400'
                }`}
              >
                Related Tracks
                {activeTab === 'related' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                  />
                )}
              </motion.button>
            </div>
            
            {/* Content based on active tab */}
            <AnimatePresence mode="wait">
              {activeTab === 'visualizer' && (
                <motion.div
                  key="visualizer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[500px] rounded-xl overflow-hidden relative"
                >
                  <AudioVisualizer />
                  
                  {/* Visualizer type selector */}
                  <div className="absolute bottom-4 right-4 flex bg-black/40 backdrop-blur-md rounded-full p-1">
                    {visualizerTypes.map((type) => (
                      <motion.button
                        key={type.value}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateVisualizationSettings({ type: type.value })}
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
                </motion.div>
              )}
              
              {activeTab === 'lyrics' && (
                <motion.div
                  key="lyrics"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-zinc-800/50 rounded-xl p-6 h-[500px] overflow-auto"
                >
                  {track.lyrics ? (
                    <div className="space-y-6">
                      {track.lyrics.map((line, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0.5 }}
                          animate={{
                            opacity: currentTime >= line.startTime && currentTime <= line.endTime ? 1 : 0.5,
                            scale: currentTime >= line.startTime && currentTime <= line.endTime ? 1.05 : 1,
                          }}
                          className="text-xl text-center"
                        >
                          {line.text}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-zinc-400">No lyrics available for this track</p>
                    </div>
                  )}
                </motion.div>
              )}
              
              {activeTab === 'related' && (
                <motion.div
                  key="related"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-zinc-800/50 rounded-xl p-6 h-[500px] overflow-auto"
                >
                  <h3 className="text-xl font-semibold mb-4">Similar Tracks</h3>
                  
                  <div className="space-y-2">
                    {recommendedTracks.map((relatedTrack) => (
                      <motion.div
                        key={relatedTrack.id}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                        className="flex items-center p-2 rounded-md cursor-pointer"
                        onClick={() => router.push(`/player/${relatedTrack.id}`)}
                      >
                        <div className="w-12 h-12 relative rounded overflow-hidden mr-3">
                          <Image
                            src={relatedTrack.cover || '/images/placeholder.jpg'}
                            alt={relatedTrack.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <p className="font-medium text-white">{relatedTrack.title}</p>
                          <p className="text-sm text-zinc-400">{relatedTrack.artist}</p>
                        </div>
                        
                        <div className="flex items-center text-zinc-400">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">{formatTime(relatedTrack.duration)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </MainLayout>
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
  
  // Get recommended tracks (similar genre or by same artist)
  const recommendedTracks = tracks
    .filter(t => 
      (t.id !== track.id) && 
      (t.artistId === track.artistId || t.genres.some(g => track.genres.includes(g)))
    )
    .slice(0, 5);
  
  return {
    props: {
      track,
      recommendedTracks,
    },
  };
};

export default PlayerPage;