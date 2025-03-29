import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerProvider } from '../contexts/PlayerContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Initialize audio context on user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      // This function would initialize any audio context, but
      // we'll handle it inside the PlayerContext directly
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  return (
    <PlayerProvider>
      <AnimatePresence mode="wait">
        <motion.div
          key={router.route}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </PlayerProvider>
  );
}

export default MyApp;