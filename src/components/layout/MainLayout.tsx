import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  Home as HomeIcon, 
  Search as SearchIcon, 
  Library as LibraryIcon, 
  Heart as HeartIcon, 
  PlusCircle as PlusCircleIcon, 
  Rss as RssIcon 
} from 'lucide-react';
import MiniPlayer from '../player/MiniPlayer';
import { usePlayer } from '../../contexts/PlayerContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { playerState } = usePlayer();
  const { currentTrack, isPlaying } = playerState;

  const menuItems = [
    { icon: HomeIcon, name: 'Home', path: '/' },
    { icon: SearchIcon, name: 'Discover', path: '/discover' },
    { icon: LibraryIcon, name: 'Library', path: '/library' },
    { icon: HeartIcon, name: 'Liked Songs', path: '/liked' },
    { icon: PlusCircleIcon, name: 'Create Playlist', path: '/playlists/create' },
  ];

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <div className="flex h-screen bg-zinc-900 text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-64 flex-shrink-0 bg-black p-6 flex flex-col"
      >
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl font-bold text-white"
          >
            WavePlay
          </motion.div>
        </Link>

        {/* Navigation */}
        <nav className="mb-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path} passHref>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center p-2 rounded-md ${
                      isActive(item.path)
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <item.icon size={20} className="mr-3" />
                    <span>{item.name}</span>
                  </motion.div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Playlists Section */}
        <div className="mt-4">
          <h3 className="text-zinc-400 text-sm uppercase font-semibold tracking-wider mb-4">
            Your Playlists
          </h3>
          <ul className="space-y-2 text-zinc-400">
            <li>
              <Link href="/playlists/playlist1" passHref>
                <motion.div
                  whileHover={{ x: 4, color: "#fff" }}
                  className="truncate hover:text-white"
                >
                  Weekend Vibes
                </motion.div>
              </Link>
            </li>
            <li>
              <Link href="/playlists/playlist2" passHref>
                <motion.div
                  whileHover={{ x: 4, color: "#fff" }}
                  className="truncate hover:text-white"
                >
                  Throwback Classics
                </motion.div>
              </Link>
            </li>
            <li>
              <Link href="/playlists/playlist3" passHref>
                <motion.div
                  whileHover={{ x: 4, color: "#fff" }}
                  className="truncate hover:text-white"
                >
                  Workout Mix
                </motion.div>
              </Link>
            </li>
          </ul>
        </div>

        {/* Install App button */}
        <div className="mt-auto pt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 px-4 rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 flex items-center justify-center"
          >
            <RssIcon className="h-4 w-4 mr-2" />
            <span>Install App</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <motion.div 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          className="h-16 flex-shrink-0 bg-zinc-800/50 backdrop-blur-md flex items-center justify-between px-8 border-b border-zinc-800"
        >
          {/* Navigation Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => router.forward()}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium"
            >
              A
            </motion.div>
            <span className="font-medium">Alex Johnson</span>
          </div>
        </motion.div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>

        {/* Now Playing Bar (conditional) */}
        {currentTrack && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-20 bg-zinc-800/90 backdrop-blur-md border-t border-zinc-700 flex items-center px-4"
          >
            <MiniPlayer />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MainLayout;