import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render on client-side
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Gradient Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800" />
      
      {/* Flowing Animated Wave */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <motion.div
          className="absolute w-[200%] h-[200%] top-0 left-0"
          animate={{
            y: ["0%", "-50%"],
            x: ["0%", "-25%"]
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='1000' height='1000' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>
      
      {/* Animated Gradient Overlays */}
      <div className="absolute inset-0">
        {/* First gradient blob */}
        <motion.div
          className="absolute w-full h-full opacity-20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            repeatType: "mirror"
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.5) 0%, transparent 50%)',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(80px)'
          }}
        />
        
        {/* Second gradient blob */}
        <motion.div
          className="absolute w-full h-full opacity-20"
          animate={{
            backgroundPosition: ['100% 0%', '0% 100%']
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            repeatType: "mirror"
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(236, 72, 153, 0.5) 0%, transparent 40%)',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(80px)'
          }}
        />
      </div>
      
      {/* Simple floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%'
            }}
            animate={{
              y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              x: [Math.random() * 100 + '%', Math.random() * 100 + '%']
            }}
            transition={{
              duration: 30 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
              repeatType: "reverse"
            }}
            style={{
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;