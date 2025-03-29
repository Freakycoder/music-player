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

  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white"
        >
          Your Library
        </motion.h1>
        
        {/* Tabs */}
        <div className="flex items-center mb-8 border-b border-zinc-800">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ color: '#fff' }}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-6 text-sm font-medium relative flex items-center space-x-2 ${
                activeTab === tab.id ? 'text-white' : 'text-zinc-400'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeLibraryTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                />
              )}
            </motion.button>
          ))}
        </div>
        
        {/* Content based on active tab */}
        <div className="grid gap-6">
          {activeTab === 'playlists' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {/* Create Playlist Card */}
              <Link href="/playlists/create">
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-xl flex flex-col items-center justify-center h-full aspect-square text-center cursor-pointer group"
                >
                  <div className="h-12 w-12 rounded-full bg-zinc-700 flex items-center justify-center mb-4 group-hover:bg-zinc-600">
                    <span className="text-2xl font-bold text-white">+</span>
                  </div>
                  <h3 className="text-white font-medium mb-2">Create Playlist</h3>
                  <p className="text-zinc-400 text-sm">Start a new collection</p>
                </motion.div>
              </Link>
              
              {/* Playlists */}
              {playlists.map((playlist) => (
                <Link key={playlist.id} href={`/playlists/${playlist.id}`} passHref>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-zinc-900 rounded-xl overflow-hidden cursor-pointer group"
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={playlist.coverImage || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'}
                        alt={playlist.name}
                        fill
                        className="object-cover group-hover:opacity-80 transition-opacity"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-medium truncate">{playlist.name}</h3>
                      <p className="text-zinc-400 text-sm mt-1 truncate">{playlist.tracks.length} songs</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
          
          {activeTab === 'artists' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {artists.map((artist) => (
                <Link key={artist.id} href={`/artists/${artist.id}`} passHref>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-zinc-900 rounded-xl overflow-hidden cursor-pointer group text-center p-4"
                  >
                    <div className="aspect-square relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                      <Image
                        src={artist.image || 'https://images.unsplash.com/photo-1453738773917-9c3eff1db985?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'}
                        alt={artist.name}
                        fill
                        className="object-cover group-hover:opacity-80 transition-opacity"
                      />
                    </div>
                    <h3 className="text-white font-medium truncate">{artist.name}</h3>
                    <p className="text-zinc-400 text-sm mt-1 truncate">Artist</p>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
          
          {activeTab === 'albums' && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <DiscIcon className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No albums yet</h3>
              <p className="text-zinc-400 text-center max-w-md">
                Albums you like will appear here. Start exploring to add to your collection.
              </p>
              <Link href="/discover">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 px-6 py-3 bg-white text-black font-medium rounded-full"
                >
                  Browse Music
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default LibraryPage;