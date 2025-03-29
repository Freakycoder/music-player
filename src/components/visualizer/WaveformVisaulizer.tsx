import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../../contexts/PlayerContext';

const WaveformVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { playerState, getAudioData } = usePlayer();
    const { isPlaying, visualizationSettings, currentTrack } = playerState;
    const animationRef = useRef<number>(0);

    // Get colors from track or settings
    const getColors = () => {
        const { colorScheme, customColors } = visualizationSettings;

        if (colorScheme === 'custom' && customColors && customColors.length > 0) {
            return customColors;
        }

        if (colorScheme === 'track' && currentTrack?.colors) {
            return [
                currentTrack.colors.vibrant,
                currentTrack.colors.lightVibrant,
                currentTrack.colors.muted,
            ];
        }

        // Default colors (spectrum not implemented for simplicity)
        return ['#f43f5e', '#ec4899', '#d946ef'];
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions to match container
        const resizeCanvas = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Animation function
        const draw = () => {
            if (!ctx || !canvas) return;

            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            if (!isPlaying) return;

            const { waveform } = getAudioData();
            const barWidth = width / (waveform.length * 2);
            const colors = getColors();
            const sensitivity = visualizationSettings.sensitivity / 10;

            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, colors[0]);
            gradient.addColorStop(0.5, colors[1] || colors[0]);
            gradient.addColorStop(1, colors[2] || colors[0]);

            // Draw mirrored waveform bars
            ctx.fillStyle = gradient;

            // Center line
            const centerY = height / 2;

            // Draw each bar
            waveform.forEach((value, i) => {
                // Amplify the value based on sensitivity
                const amplifiedValue = value * sensitivity * (height / 2);

                // Calculate bar height (both up and down from center)
                const barHeight = Math.max(2, amplifiedValue);

                // Calculate x position with gaps between bars
                const x = i * barWidth * 2;

                // Draw upper bar
                ctx.fillRect(x, centerY - barHeight, barWidth, barHeight);

                // Draw lower bar (mirrored)
                ctx.fillRect(x, centerY, barWidth, barHeight);
            });

            // Apply a glow effect
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
            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 0;

            // Request next frame
            animationRef.current = requestAnimationFrame(draw);
        };

        // Start or stop animation based on playing state
        if (isPlaying) {
            draw();
        } else {
            cancelAnimationFrame(animationRef.current);
        }

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, visualizationSettings, currentTrack]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex items-center justify-center"
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />
        </motion.div>
    );
};

export default WaveformVisualizer;