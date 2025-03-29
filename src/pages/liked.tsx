import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart as HeartIcon, Play as PlayIcon, Pause as PauseIcon, Clock as ClockIcon } from 'lucide-react';

import MainLayout from '../components/layout/MainLayout';
import { usePlayer } from '../contexts/PlayerContext';
import { user } from '../data/mockData';

const LikedSongsPage: React.FC = () => {
  const { playerState, playTrack, pauseTrack } = usePlayer();
  const { currentTrack, isPlaying } = playerState;
  
  const likedTracks = user.likedTracks;
  
  // Format time in mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle play/pause for a specific track
  const handlePlayPause = (track: any) => {
    if (currentTrack?.id === track.id && isPlaying) {
      pauseTrack();
    } else {
      playTrack(track);
    }
  };
  
  return (
    <MainLayout>
      {/* Hero section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end space-x-6 bg-gradient-to-b from-pink-600 to-zinc-900 p-8 rounded-xl mb-8"
      >
        <div className="flex-shrink-0 p-4 bg-pink-700 rounded-xl shadow-xl">
          <HeartIcon className="h-32 w-32 text-white" />
        </div>
        
        <div>
          <h2 className="uppercase text-sm font-medium text-zinc-300">Playlist</h2>
          <h1 className="text-5xl font-bold text-white mt-2 mb-4">Liked Songs</h1>
          <div className="flex items-center text-zinc-300">
            <span className="font-medium">{user.name}</span>
            <span className="mx-1">•</span>
            <span>{likedTracks.length} songs</span>
          </div>
        </div>
      </motion.div>
      
      {/* Tracks table */}
      <div className="mt-6">
        {/* Table header */}
        <div className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2 border-b border-zinc-800 text-sm text-zinc-400 font-medium">
          <div>#</div>
          <div>Title</div>
          <div>Album</div>
          <div className="flex justify-end">
            <ClockIcon className="h-5 w-5" />
          </div>
        </div>
        
        {/* Table body */}
        {likedTracks.length > 0 ? (
          <div className="mt-2">
            {likedTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-3 rounded-md items-center text-sm"
              >
                <div className="text-zinc-400 font-medium">
                  {currentTrack?.id === track.id && isPlaying ? (
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-4 h-4 text-green-500"
                    >
                      <span className="sr-only">Now playing</span>
                      ♫
                    </motion.div>
                  ) : (
                    index + 1
                  )}
                </div>
                
                <div className="flex items-center">
                  <div className="relative w-10 h-10 mr-3 group">
                    <Image
                      src={track.cover || 'https://images.unsplash.com/photo-1458560871784-56d23406c091?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80'}
                      alt={track.title}
                      fill
                      className="object-cover rounded"
                    />
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                      onClick={() => handlePlayPause(track)}
                    >
                      {currentTrack?.id === track.id && isPlaying ? (
                        <PauseIcon className="h-5 w-5 text-white" />
                      ) : (
                        <PlayIcon className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-white">{track.title}</div>
                    <div className="text-zinc-400 text-xs">{track.artist}</div>
                  </div>
                </div>
                
                <div className="text-zinc-400 truncate">{track.album}</div>
                
                <div className="text-zinc-400 text-right">
                  {formatTime(track.duration)}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-pink-900/50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <HeartIcon className="h-8 w-8 text-pink-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Songs you like will appear here</h3>
            <p className="text-zinc-400 text-center max-w-md">
              Save songs by tapping the heart icon.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default LikedSongsPage;