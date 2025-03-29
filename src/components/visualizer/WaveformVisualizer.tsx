import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../../contexts/PlayerContext';

const WaveformVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { playerState, getAudioData } = usePlayer();
    const { isPlaying, visualizationSettings, currentTrack } = playerState;
    const animationRef = useRef<number>(0);

    // Log component mount
    useEffect(() => {
        console.log("WaveformVisualizer mounted");
        return () => console.log("WaveformVisualizer unmounted");
    }, []);

    // Get colors from track or settings
    const getColors = () => {
        // Use fixed colors for more reliable display
        return ['#f43f5e', '#ec4899', '#d946ef'];
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("Canvas ref is null");
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("Could not get 2D context");
            return;
        }

        console.log("Canvas initialized", canvas.width, canvas.height);

        // Set canvas dimensions to match container
        const resizeCanvas = () => {
            if (!canvas || !ctx) return;
            
            // Get parent dimensions
            const parent = canvas.parentElement;
            if (!parent) return;
            
            const width = parent.clientWidth || 500;
            const height = parent.clientHeight || 300;
            
            // Apply dimensions and scale
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            
            console.log("Canvas resized to", width, height);
        };

        // Initial resize
        resizeCanvas();
        
        // Listen for resize events
        window.addEventListener('resize', resizeCanvas);

        // Animation function - completely rewritten for reliability
        const draw = () => {
            if (!ctx || !canvas) return;

            const width = canvas.width;
            const height = canvas.height;
            
            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // If not playing, draw a flat line
            if (!isPlaying) {
                ctx.beginPath();
                ctx.moveTo(0, height / 2);
                ctx.lineTo(width, height / 2);
                ctx.strokeStyle = '#666';
                ctx.lineWidth = 2;
                ctx.stroke();
                animationRef.current = requestAnimationFrame(draw);
                return;
            }

            try {
                // Get audio data
                const { waveform } = getAudioData();
                if (!waveform || waveform.length === 0) {
                    console.warn("No waveform data");
                    animationRef.current = requestAnimationFrame(draw);
                    return;
                }

                // Configure styling
                const barWidth = width / (waveform.length * 2);
                const colors = getColors();
                const sensitivity = 5; // Fixed sensitivity for demo

                // Create gradient
                const gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, colors[0]);
                gradient.addColorStop(0.5, colors[1] || colors[0]);
                gradient.addColorStop(1, colors[2] || colors[0]);

                // Apply fill style
                ctx.fillStyle = gradient;

                // Center line position
                const centerY = height / 2;

                // Draw each bar
                waveform.forEach((value, i) => {
                    // Calculate bar height
                    const barHeight = Math.max(2, value * sensitivity * (height / 2));

                    // Calculate x position with gaps
                    const x = i * barWidth * 2;

                    // Draw upper bar
                    ctx.fillRect(x, centerY - barHeight, barWidth, barHeight);

                    // Draw lower bar (mirrored)
                    ctx.fillRect(x, centerY, barWidth, barHeight);
                });

                // Add glow effect
                ctx.shadowBlur = 15;
                ctx.shadowColor = colors[0];

                // Draw a center line
                ctx.beginPath();
                ctx.moveTo(0, centerY);
                ctx.lineTo(width, centerY);
                ctx.strokeStyle = colors[1] || colors[0];
                ctx.globalAlpha = 0.3;
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Reset alpha
                ctx.globalAlpha = 1.0;
                ctx.shadowBlur = 0;
            } catch (error) {
                console.error("Error drawing waveform:", error);
            }

            // Request next frame
            animationRef.current = requestAnimationFrame(draw);
        };

        // Start animation immediately
        draw();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, visualizationSettings, currentTrack, getAudioData]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex items-center justify-center"
            style={{ minHeight: '100%', minWidth: '100%' }}
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ 
                    minHeight: '100%', 
                    minWidth: '100%',
                    backgroundColor: 'rgba(0,0,0,0.1)'
                }}
            />
        </motion.div>
    );
};

export default WaveformVisualizer;