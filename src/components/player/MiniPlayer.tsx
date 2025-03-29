import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play as PlayIcon, 
  Pause as PauseIcon, 
  Rewind as RewindIcon, 
  FastForward, 
  Volume2 as VolumeUpIcon, 
  VolumeX as VolumeOffIcon,
  Heart as HeartIcon,
  ExternalLink as ExternalLinkIcon,
  MoreVertical as DotsVerticalIcon
} from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';

const MiniPlayer: React.FC = () => {
  const { 
    playerState, 
    playTrack, 
    pauseTrack, 
    resumeTrack, 
    skipToNext, 
    skipToPrevious,
    seekToPosition,
    toggleMute,
    setVolume
  } = usePlayer();
  
  const { currentTrack, isPlaying, currentTime, volume, isMuted } = playerState;
  const [hover, setHover] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Calculate progress percentage
  const progress = currentTrack ? (currentTime / currentTrack.duration) * 100 : 0;
  
  // Format time in mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="w-full grid grid-cols-3 items-center gap-4">
      {/* Track Info */}
      <div className="flex items-center space-x-4">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 rounded-md overflow-hidden shadow-lg"
        >
          <Image 
            src={currentTrack.cover || '/images/placeholder.jpg'}
            alt={currentTrack.title}
            fill
            className="object-cover"
          />
        </motion.div>
        
        <div className="flex flex-col">
          <Link href={`/player/${currentTrack.id}`}>
            <motion.span 
              whileHover={{ color: '#fff' }}
              className="font-semibold text-zinc-100 hover:underline"
            >
              {currentTrack.title}
            </motion.span>
          </Link>
          <Link href={`/artists/${currentTrack.artistId}`}>
            <motion.span 
              whileHover={{ color: '#fff' }}
              className="text-sm text-zinc-400 hover:underline"
            >
              {currentTrack.artist}
            </motion.span>
          </Link>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLiked(!isLiked)}
          className={`ml-2 p-1 rounded-full ${isLiked ? 'text-pink-500' : 'text-zinc-400 hover:text-white'}`}
        >
          <HeartIcon size={20} />
        </motion.button>
      </div>
      
      {/* Playback Controls */}
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={skipToPrevious}
            className="p-1 text-zinc-400 hover:text-white"
          >
            <RewindIcon className="h-5 w-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={isPlaying ? pauseTrack : resumeTrack}
            className="p-2 bg-white rounded-full text-black hover:bg-zinc-200"
          >
            {isPlaying ? (
              <PauseIcon className="h-6 w-6" />
            ) : (
              <PlayIcon className="h-6 w-6" />
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={skipToNext}
            className="p-1 text-zinc-400 hover:text-white"
          >
            <FastForward className="h-5 w-5" />
          </motion.button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full mt-2 flex items-center space-x-2">
          <span className="text-xs text-zinc-400">
            {formatTime(currentTime)}
          </span>
          
          <div className="relative flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
              className="absolute h-full bg-white"
            />
            
            <input 
              type="range" 
              min="0" 
              max={currentTrack.duration} 
              value={currentTime} 
              onChange={(e) => seekToPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          
          <span className="text-xs text-zinc-400">
            {formatTime(currentTrack.duration)}
          </span>
        </div>
      </div>
      
      {/* Volume and Additional Controls */}
      <div className="flex items-center justify-end space-x-4">
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
        
        <div
          className="relative w-24 h-1 bg-zinc-700 rounded-full overflow-hidden"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
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
        
        <Link href={`/visualizer/${currentTrack.id}`}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 text-zinc-400 hover:text-white"
          >
            <ExternalLinkIcon className="h-5 w-5" />
          </motion.button>
        </Link>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1 text-zinc-400 hover:text-white"
        >
          <DotsVerticalIcon className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default MiniPlayer;