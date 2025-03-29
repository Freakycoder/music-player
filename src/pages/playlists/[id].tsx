import React from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  Play as PlayIcon, 
  Pause as PauseIcon, 
  Clock as ClockIcon, 
  MoreHorizontal as DotsHorizontalIcon,
  Heart as HeartIcon,
  Share2 as ShareIcon 
} from 'lucide-react';

import MainLayout from '../../components/layout/MainLayout';
import { usePlayer } from '../../contexts/PlayerContext';
import { Playlist } from '../../types';
import { getPlaylistById } from '../../data/mockData';

interface PlaylistPageProps {
  playlist: Playlist;
}

const PlaylistPage: React.FC<PlaylistPageProps> = ({ playlist }) => {
  const router = useRouter();
  const { playerState, playTrack, pauseTrack } = usePlayer();
  const { currentTrack, isPlaying } = playerState;
  
  if (!playlist) {
    return null; // This will be caught by getServerSideProps
  }
  
  // Format time in mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate total duration
  const totalDuration = playlist.tracks.reduce((total, track) => total + track.duration, 0);
  const formattedTotalDuration = `${Math.floor(totalDuration / 60)} min ${totalDuration % 60} sec`;
  
  // Handle play/pause for a specific track
  const handlePlayPause = (track: any) => {
    if (currentTrack?.id === track.id && isPlaying) {
      pauseTrack();
    } else {
      playTrack(track);
    }
  };
  
  // Play entire playlist
  const playPlaylist = () => {
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  };
  
  return (
    <MainLayout>
      {/* Playlist header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end space-x-6 bg-gradient-to-b from-zinc-700 to-zinc-900 p-8 rounded-xl mb-8"
      >
        <div className="flex-shrink-0 h-48 w-48 relative shadow-2xl rounded-xl overflow-hidden">
          <Image
            src={playlist.coverImage || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'}
            alt={playlist.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div>
          <h2 className="uppercase text-sm font-medium text-zinc-300">Playlist</h2>
          <h1 className="text-4xl font-bold text-white mt-2 mb-4">{playlist.name}</h1>
          <p className="text-zinc-400 max-w-xl mb-4">{playlist.description}</p>
          <div className="flex items-center text-zinc-300">
            <span className="font-medium">Created by {playlist.createdBy}</span>
            <span className="mx-1">•</span>
            <span>{playlist.tracks.length} songs</span>
            <span className="mx-1">•</span>
            <span>{formattedTotalDuration}</span>
          </div>
        </div>
      </motion.div>
      
      {/* Action buttons */}
      <div className="flex items-center space-x-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={playPlaylist}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        >
          <PlayIcon className="h-7 w-7" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 text-zinc-400 hover:text-white"
        >
          <HeartIcon className="h-6 w-6" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 text-zinc-400 hover:text-white"
        >
          <ShareIcon className="h-6 w-6" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 text-zinc-400 hover:text-white"
        >
          <DotsHorizontalIcon className="h-6 w-6" />
        </motion.button>
      </div>
      
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
        {playlist.tracks.length > 0 ? (
          <div className="mt-2">
            {playlist.tracks.map((track, index) => (
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
                      className="w-4 h-4 text-purple-600"
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
                      src={track.cover || 'https://images.unsplash.com/photo-1485579149621-3123dd979885?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1631&q=80'}
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
            <p className="text-zinc-400 text-center">
              This playlist is empty. Add some tracks to get started.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  
  // Get playlist data
  const playlist = getPlaylistById(id as string);
  
  if (!playlist) {
    return {
      notFound: true,
    };
  }
  
  return {
    props: {
      playlist,
    },
  };
};

export default PlaylistPage;