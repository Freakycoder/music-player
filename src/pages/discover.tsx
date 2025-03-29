import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Play as PlayIcon, Pause as PauseIcon } from 'lucide-react';

import MainLayout from '../components/layout/MainLayout';
import { usePlayer } from '../contexts/PlayerContext';
import { Track } from '../types';
import { tracks } from '../data/mockData';

const DiscoverPage: React.FC = () => {
  const router = useRouter();
  const { playerState, playTrack, pauseTrack } = usePlayer();
  const { currentTrack, isPlaying } = playerState;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTracks, setFilteredTracks] = useState<Track[]>(tracks);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  // Get all unique genres from tracks
  const allGenres = Array.from(
    new Set(tracks.flatMap(track => track.genres))
  ).sort();
  
  // Filter tracks based on search query and selected genre
  useEffect(() => {
    let filtered = [...tracks];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        track => 
          track.title.toLowerCase().includes(query) ||
          track.artist.toLowerCase().includes(query) ||
          track.album.toLowerCase().includes(query)
      );
    }
    
    if (selectedGenre) {
      filtered = filtered.filter(
        track => track.genres.includes(selectedGenre)
      );
    }
    
    setFilteredTracks(filtered);
  }, [searchQuery, selectedGenre]);
  
  // Handle play/pause for a specific track
  const handlePlayPause = (track: Track) => {
    if (currentTrack?.id === track.id && isPlaying) {
      pauseTrack();
    } else {
      playTrack(track);
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white"
          >
            Discover
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search tracks, artists, or albums"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-800 rounded-full py-2 pl-10 pr-4 w-80 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
            />
          </motion.div>
        </div>
        
        {/* Genre filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedGenre(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedGenre === null
                ? 'bg-white text-black'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            All
          </motion.button>
          
          {allGenres.map((genre) => (
            <motion.button
              key={genre}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedGenre === genre
                  ? 'bg-white text-black'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {genre}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Results */}
        <div className="mt-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid gap-4"
          >
            {filteredTracks.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-zinc-400 text-lg">No tracks found matching your criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGenre(null);
                  }}
                  className="mt-4 text-white underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className="p-3 rounded-lg grid grid-cols-[auto_1fr_auto] gap-4 items-center"
                >
                  <div className="relative">
                    <div className="w-12 h-12 relative rounded overflow-hidden bg-zinc-800">
                      <Image
                        src={track.cover || '/images/placeholder.jpg'}
                        alt={track.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePlayPause(track)}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      {currentTrack?.id === track.id && isPlaying ? (
                        <PauseIcon className="h-6 w-6 text-white" />
                      ) : (
                        <PlayIcon className="h-6 w-6 text-white" />
                      )}
                    </motion.button>
                  </div>
                  
                  <div>
                    <Link href={`/player/${track.id}`}>
                      <h3 className="font-medium text-white hover:underline">{track.title}</h3>
                    </Link>
                    <div className="flex items-center text-sm">
                      <Link href={`/artists/${track.artistId}`}>
                        <span className="text-zinc-400 hover:text-white hover:underline">{track.artist}</span>
                      </Link>
                      <span className="mx-2 text-zinc-500">•</span>
                      <span className="text-zinc-500">{track.album}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-zinc-400">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                    
                    <div className="flex">
                      {track.genres.slice(0, 2).map((genre) => (
                        <span 
                          key={genre} 
                          className="text-xs bg-zinc-800 px-2 py-1 rounded-full mr-1 hover:bg-zinc-700 cursor-pointer"
                          onClick={() => setSelectedGenre(genre)}
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DiscoverPage;