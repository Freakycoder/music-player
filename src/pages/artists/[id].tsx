import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Play as PlayIcon, 
  Pause as PauseIcon, 
  Clock as ClockIcon,
  Heart as HeartIcon,
  Share2 as ShareIcon,
} from 'lucide-react';

import MainLayout from '../../components/layout/MainLayout';
import { usePlayer } from '../../contexts/PlayerContext';
import { Artist, Track } from '../../types';
import { getArtistById } from '../../data/mockData';

interface ArtistPageProps {
  artist: Artist;
}

const ArtistPage: React.FC<ArtistPageProps> = ({ artist }) => {
  const { playerState, playTrack, pauseTrack } = usePlayer();
  const { currentTrack, isPlaying } = playerState;
  const [followed, setFollowed] = useState(false);
  
  if (!artist) {
    return null; // This will be caught by getServerSideProps
  }
  
  // Format time in mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format number with comma separators
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
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
      {/* Artist header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-80 mb-8 rounded-xl overflow-hidden"
      >
        {/* Background blur image */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/60 to-zinc-900">
          <Image 
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
            alt="Artist background"
            fill
            className="object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 opacity-40 bg-gradient-to-b from-transparent to-zinc-900" />
        </div>
        
        {/* Artist info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end">
          <div className="mr-6 h-48 w-48 relative rounded-full overflow-hidden border-4 border-zinc-900">
            <Image
              src={artist.image || "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80"}
              alt={artist.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div>
            <div className="flex items-center">
              <span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded text-xs font-semibold text-white mr-2">
                ARTIST
              </span>
              {artist.popularity > 90 && (
                <span className="text-blue-500">✓</span>
              )}
            </div>
            <h1 className="text-5xl font-bold text-white mt-2 mb-4">{artist.name}</h1>
            <div className="text-zinc-300">
              <span>{formatNumber(artist.followers)} followers</span>
              <span className="mx-2">•</span>
              <span>{artist.topTracks.length} tracks</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Action buttons */}
      <div className="flex items-center space-x-4 mb-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (artist.topTracks.length > 0) {
              playTrack(artist.topTracks[0]);
            }
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-3 flex items-center"
        >
          <PlayIcon className="h-5 w-5 mr-2" />
          Play
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFollowed(!followed)}
          className={`px-8 py-3 rounded-full flex items-center border ${
            followed 
              ? 'bg-pink-900/30 border-pink-500 text-pink-500' 
              : 'border-zinc-700 text-white hover:border-white'
          }`}
        >
          {followed ? 'Following' : 'Follow'}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 text-zinc-400 hover:text-white"
        >
          <ShareIcon className="h-6 w-6" />
        </motion.button>
      </div>
      
      {/* Artist bio */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">About</h2>
        <p className="text-zinc-300 max-w-3xl">{artist.bio}</p>
      </div>
      
      {/* Popular tracks */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Popular</h2>
        
        <div className="space-y-3">
          {artist.topTracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              className="grid grid-cols-[auto_4fr_2fr_1fr] gap-4 px-4 py-3 rounded-md items-center text-sm"
            >
              <div className="text-zinc-400 font-medium w-6">
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
                    src={track.cover || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"}
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
                </div>
              </div>
              
              <div className="text-zinc-400 truncate">{track.album}</div>
              
              <div className="flex items-center justify-end space-x-4">
                <HeartIcon className="h-4 w-4 text-zinc-400 hover:text-white cursor-pointer" />
                <span className="text-zinc-400">
                  {formatTime(track.duration)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Genres */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Genres</h2>
        <div className="flex flex-wrap gap-2">
          {artist.genres.map((genre) => (
            <Link href={`/discover?genre=${genre}`} key={genre}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-zinc-800 rounded-full text-zinc-300 hover:bg-zinc-700 hover:text-white cursor-pointer"
              >
                {genre}
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Related Artists */}
      {artist.relatedArtists.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Fans Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {artist.relatedArtists.map((relatedId) => (
              <Link href={`/artists/${relatedId}`} key={relatedId}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-zinc-800 rounded-lg p-4 text-center cursor-pointer"
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 relative">
                    <Image
                      src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80"
                      alt="Related Artist"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-white font-medium">Related Artist</div>
                  <div className="text-zinc-400 text-sm">Artist</div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {};
  
  // Get artist data
  const artist = getArtistById(id as string);
  
  if (!artist) {
    return {
      notFound: true,
    };
  }
  
  return {
    props: {
      artist,
    },
  };
};

export default ArtistPage;