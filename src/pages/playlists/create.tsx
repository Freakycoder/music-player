import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, Music as MusicIcon, Save as SaveIcon } from 'lucide-react';

import MainLayout from '../../components/layout/MainLayout';
import { tracks } from '../../data/mockData';

const CreatePlaylistPage: React.FC = () => {
  const router = useRouter();
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  
  // Handle track selection
  const toggleTrackSelection = (trackId: string) => {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks(selectedTracks.filter(id => id !== trackId));
    } else {
      setSelectedTracks([...selectedTracks, trackId]);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send data to backend
    // For this mock, we'll just navigate back to library
    if (playlistName.trim() === '') {
      // Simple validation
      alert('Please enter a playlist name');
      return;
    }
    
    // Mock successful creation
    setTimeout(() => {
      router.push('/library');
    }, 1000);
  };
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-8"
        >
          Create Playlist
        </motion.h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
            {/* Playlist Cover */}
            <div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="aspect-square bg-zinc-800 rounded-xl overflow-hidden relative flex items-center justify-center group cursor-pointer"
                onClick={() => {
                  // In a real app, this would open a file picker
                  // For this mock, we'll just set a random color
                  const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6'];
                  const randomColor = colors[Math.floor(Math.random() * colors.length)];
                  setCoverImage(randomColor);
                }}
              >
                {coverImage ? (
                  coverImage.startsWith('#') ? (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: coverImage }}
                    >
                      <MusicIcon className="h-16 w-16 text-white/80" />
                    </div>
                  ) : (
                    <Image 
                      src={coverImage}
                      alt="Playlist cover"
                      fill
                      className="object-cover"
                    />
                  )
                ) : (
                  <>
                    <UploadIcon className="h-12 w-12 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <p className="text-white text-sm font-medium">Choose Image</p>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
            
            {/* Playlist Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <label htmlFor="name" className="block text-zinc-400 mb-2 text-sm font-medium">
                  Playlist Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="My Awesome Playlist"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-zinc-400 mb-2 text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  value={playlistDescription}
                  onChange={(e) => setPlaylistDescription(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent h-32 resize-none"
                  placeholder="Describe your playlist"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 bg-zinc-800 border-zinc-700 rounded text-pink-600 focus:ring-pink-500"
                />
                <label htmlFor="isPublic" className="ml-2 text-zinc-300">
                  Make this playlist public
                </label>
              </div>
            </motion.div>
          </div>
          
          {/* Track Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Add Tracks</h2>
            
            <div className="bg-zinc-800/50 rounded-xl p-4">
              <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center text-sm text-zinc-400 font-medium mb-2 px-2">
                <div></div>
                <div>Title</div>
                <div>Artist</div>
              </div>
              
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {tracks.map((track) => (
                  <motion.div
                    key={track.id}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                    className="grid grid-cols-[auto_1fr_auto] gap-4 items-center p-2 rounded-md cursor-pointer"
                    onClick={() => toggleTrackSelection(track.id)}
                  >
                    <div>
                      <input
                        type="checkbox"
                        checked={selectedTracks.includes(track.id)}
                        onChange={() => {}}
                        className="h-4 w-4 bg-zinc-800 border-zinc-700 rounded text-pink-600 focus:ring-pink-500"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 relative rounded overflow-hidden mr-3">
                        <Image
                          src={track.cover || '/images/placeholder.jpg'}
                          alt={track.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <p className="text-white font-medium truncate">{track.title}</p>
                        <p className="text-zinc-500 text-sm truncate">{track.album}</p>
                      </div>
                    </div>
                    
                    <div className="text-zinc-400">{track.artist}</div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4 text-zinc-400 text-sm">
                {selectedTracks.length} tracks selected
              </div>
            </div>
          </motion.div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-full flex items-center"
            >
              <SaveIcon className="h-5 w-5 mr-2" />
              Save Playlist
            </motion.button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreatePlaylistPage;