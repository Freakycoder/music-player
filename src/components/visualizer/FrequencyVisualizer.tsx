import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../../contexts/PlayerContext';

const FrequencyVisualizer: React.FC = () => {
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

        // Default colors
        return ['#10b981', '#6366f1', '#f43f5e'];
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

            const { frequency, amplitude } = getAudioData();
            const barWidth = width / frequency.length;
            const colors = getColors();
            const sensitivity = visualizationSettings.sensitivity / 10;

            // Create gradient
            const gradient = ctx.createLinearGradient(0, height, 0, 0);
            gradient.addColorStop(0, colors[0]);
            gradient.addColorStop(0.5, colors[1] || colors[0]);
            gradient.addColorStop(1, colors[2] || colors[0]);

            ctx.fillStyle = gradient;

            // Get current timestamp for animation
            const time = performance.now() / 1000;

            // Draw frequency bars with smooth top curve
            let lastX = 0;
            let lastHeight = 0;

            frequency.forEach((value, i) => {
                // Amplify the value based on sensitivity
                const amplifiedValue = value * sensitivity;

                // Calculate bar height with some variation
                const sinOffset = Math.sin(time + i * 0.2) * 0.1;
                const rawHeight = Math.max(5, amplifiedValue * height * (1 + sinOffset));

                // Apply smoothing to create more organic shape
                const smoothFactor = 0.3;
                const barHeight = lastHeight === 0
                    ? rawHeight
                    : lastHeight * smoothFactor + rawHeight * (1 - smoothFactor);

                lastHeight = barHeight;

                // Calculate x position
                const x = i * barWidth;

                // Draw rounded top bar
                ctx.beginPath();
                ctx.moveTo(x, height);
                ctx.lineTo(x, height - barHeight);
                ctx.arc(x + barWidth / 2, height - barHeight, barWidth / 2, Math.PI, 0, false);
                ctx.lineTo(x + barWidth, height);
                ctx.fill();

                lastX = x;
            });

            // Add glow effect
            ctx.shadowBlur = 20;
            ctx.shadowColor = colors[0];

            // Pulsating circle in the center
            const centerX = width / 2;
            const centerY = height / 2;
            const maxRadius = Math.min(width, height) * 0.1;
            const currentRadius = maxRadius * amplitude * sensitivity;

            ctx.beginPath();
            ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
            ctx.fillStyle = colors[1] || colors[0];
            ctx.globalAlpha = 0.7;
            ctx.fill();
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

export default FrequencyVisualizer;