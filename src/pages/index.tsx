import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Pause, Heart } from 'lucide-react';

import MainLayout from '../components/layout/MainLayout';
import AudioVisualizer from '../components/visualizer/AudioVisualizer';
import { usePlayer } from '../contexts/PlayerContext';
import { 
  tracks, 
  artists, 
  recentlyPlayed, 
  featuredPlaylists, 
  newReleases 
} from '../data/mockData';

const HomePage = () => {
  const { playerState, playTrack, pauseTrack } = usePlayer();
  const { currentTrack, isPlaying } = playerState;
  const [featuredTrack, setFeaturedTrack] = useState(tracks[0]);
  
  // Handle play/pause for a specific track
  const handlePlayPause = (track: typeof tracks[0]) => {
    if (currentTrack?.id === track.id && isPlaying) {
      pauseTrack();
    } else {
      playTrack(track);
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-10">
        {/* Featured Track with Visualizer */}
        <section className="mb-10">
          <div className="relative h-80 rounded-2xl overflow-hidden">
            {/* Visualizer Background */}
            <div className="absolute inset-0 z-0">
              <AudioVisualizer />
            </div>
            
            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/50 to-transparent p-8 flex items-end">
              <div className="max-w-md">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {featuredTrack.title}
                </h1>
                
                <p className="text-xl text-zinc-300 mb-6">
                  {featuredTrack.artist}
                </p>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => handlePlayPause(featuredTrack)}
                    className="px-6 py-3 bg-purple-600 rounded-full text-white flex items-center font-medium hover:bg-purple-700"
                  >
                    {currentTrack?.id === featuredTrack.id && isPlaying ? (
                      <>
                        <Pause size={20} className="mr-2" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={20} className="mr-2" />
                        <span>Play</span>
                      </>
                    )}
                  </button>
                  
                  <button className="px-6 py-3 bg-zinc-800/80 backdrop-blur-sm rounded-full text-white flex items-center font-medium">
                    <Heart size={20} className="mr-2" />
                    <span>Like</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Recently Played */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Recently Played</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {recentlyPlayed.slice(0, 5).map((track) => (
              <div key={track.id} className="group">
                <Link href={`/player/${track.id}`}>
                  <div className="cursor-pointer">
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-zinc-800">
                      <Image
                        src={track.cover || '/images/placeholder.jpg'}
                        alt={track.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handlePlayPause(track);
                          }}
                          className="p-3 bg-purple-600 rounded-full text-white"
                        >
                          {currentTrack?.id === track.id && isPlaying ? (
                            <Pause size={24} />
                          ) : (
                            <Play size={24} />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-white truncate">{track.title}</h3>
                    <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
        
        {/* Featured Playlists */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Featured Playlists</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlaylists.map((playlist) => (
              <div key={playlist.id} className="group">
                <Link href={`/playlists/${playlist.id}`}>
                  <div className="cursor-pointer">
                    <div className="relative h-48 rounded-lg overflow-hidden mb-3 bg-zinc-800">
                      <Image
                        src={playlist.coverImage || '/images/placeholder.jpg'}
                        alt={playlist.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button className="p-3 bg-purple-600 rounded-full text-white">
                          <Play size={24} />
                        </button>
                      </div>
                      
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent">
                        <h3 className="font-medium text-white text-lg">{playlist.name}</h3>
                        <p className="text-sm text-zinc-300">{playlist.tracks.length} tracks</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default HomePage;