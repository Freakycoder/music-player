import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Music as MusicIcon, Disc as DiscIcon, User as UserIcon } from 'lucide-react';

import MainLayout from '../components/layout/MainLayout';
import { playlists, artists } from '../data/mockData';

const LibraryPage: React.FC = () => {
  // Group tabs for the library
  const tabs = [
    { id: 'playlists', name: 'Playlists', icon: MusicIcon },
    { id: 'artists', name: 'Artists', icon: UserIcon },
    { id: 'albums', name: 'Albums', icon: DiscIcon },
  ];
  
  const [activeTab, setActiveTab] = React.useState('playlists');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren", 
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    }
  };

  const tabIndicatorVariants = {
    hidden: { opacity: 0, width: 0 },
    visible: { opacity: 1, width: "100%" }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
        >
          Your Library
        </motion.h1>
        
        {/* Tabs with enhanced animation */}
        <div className="relative mb-8">
          <div className="flex items-center gap-2 mb-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ 
                  color: '#fff',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)'
                }}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-6 text-sm font-medium relative flex items-center space-x-2 rounded-t-lg ${
                  activeTab === tab.id ? 'text-white' : 'text-zinc-400'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeLibraryTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                    initial="hidden"
                    animate="visible"
                    variants={tabIndicatorVariants}
                  />
                )}
              </motion.button>
            ))}
          </div>
          <div className="w-full h-px bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800"></div>
        </div>
        
        {/* Content based on active tab */}
        <AnimatedContent activeTab={activeTab} />
      </div>
    </MainLayout>
  );
};

// Separated animated content component
const AnimatedContent = ({ activeTab }: { activeTab: string }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren", 
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    }
  };

  return (
    <div className="grid gap-6">
      {activeTab === 'playlists' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {/* Create Playlist Card */}
          <motion.div variants={itemVariants}>
            <Link href="/playlists/create">
              <motion.div
                whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-zinc-800/70 to-zinc-900/70 p-6 rounded-xl flex flex-col items-center justify-center h-full aspect-square text-center cursor-pointer group backdrop-blur-sm border border-zinc-700/30"
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/20">
                  <span className="text-2xl font-bold text-white">+</span>
                </div>
                <h3 className="text-white font-medium mb-2">Create Playlist</h3>
                <p className="text-zinc-400 text-sm">Start a new collection</p>
              </motion.div>
            </Link>
          </motion.div>
          
          {/* Playlists */}
          {playlists.map((playlist) => (
            <motion.div key={playlist.id} variants={itemVariants}>
              <Link href={`/playlists/${playlist.id}`} passHref>
                <motion.div
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02, 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-zinc-900/70 rounded-xl overflow-hidden cursor-pointer group backdrop-blur-sm border border-zinc-800/50"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={playlist.coverImage || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'}
                      alt={playlist.name}
                      fill
                      className="object-cover group-hover:opacity-80 transition-opacity group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center shadow-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                          <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-medium truncate">{playlist.name}</h3>
                    <p className="text-zinc-400 text-sm mt-1 truncate">{playlist.tracks.length} songs</p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {activeTab === 'artists' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {artists.map((artist) => (
            <motion.div key={artist.id} variants={itemVariants}>
              <Link href={`/artists/${artist.id}`} passHref>
                <motion.div
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-zinc-900/70 rounded-xl overflow-hidden cursor-pointer group text-center p-5 backdrop-blur-sm border border-zinc-800/50"
                >
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden relative group-hover:shadow-lg group-hover:shadow-purple-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    <Image
                      src={artist.image || 'https://images.unsplash.com/photo-1453738773917-9c3eff1db985?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'}
                      alt={artist.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-white font-medium truncate">{artist.name}</h3>
                  <p className="text-zinc-400 text-sm mt-1 truncate">Artist</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {activeTab === 'albums' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="bg-gradient-to-br from-zinc-700/30 to-zinc-800/30 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-zinc-700/30"
          >
            <DiscIcon className="h-8 w-8 text-zinc-400" />
          </motion.div>
          <h3 className="text-xl font-medium text-white mb-2">No albums yet</h3>
          <p className="text-zinc-400 text-center max-w-md">
            Albums you like will appear here. Start exploring to add to your collection.
          </p>
          <Link href="/discover">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-full shadow-lg shadow-purple-600/20"
            >
              Browse Music
            </motion.button>
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default LibraryPage;