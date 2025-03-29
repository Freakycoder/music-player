import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../../contexts/PlayerContext';

const CircularVisualizer: React.FC = () => {
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
                currentTrack.colors.darkMuted,
            ];
        }

        // Default colors
        return ['#8b5cf6', '#3b82f6', '#ec4899', '#14b8a6'];
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

            const { frequency, amplitude, waveform } = getAudioData();
            const centerX = width / 2;
            const centerY = height / 2;
            const colors = getColors();
            const sensitivity = visualizationSettings.sensitivity / 10;

            // Create time-based animation elements
            const time = performance.now() / 1000;

            // Draw multiple circular visualizers
            const numCircles = 3;
            const maxRadius = Math.min(width, height) * 0.4;

            for (let c = 0; c < numCircles; c++) {
                const circleRadius = maxRadius * ((c + 1) / numCircles);
                const numPoints = 60 + c * 10; // More points for outer circles
                const rotationOffset = time * (c % 2 === 0 ? 1 : -1) * 0.2; // Alternate rotation direction

                ctx.beginPath();

                for (let i = 0; i <= numPoints; i++) {
                    // Get data point from frequency or waveform array
                    const dataIndex = Math.floor((i / numPoints) * frequency.length);
                    const dataValue = c % 2 === 0 ? frequency[dataIndex] : waveform[dataIndex];

                    // Calculate angle
                    const angle = (i / numPoints) * Math.PI * 2 + rotationOffset;

                    // Calculate radius variation based on audio data
                    const radiusVariation = dataValue * sensitivity * (maxRadius * 0.2);
                    const currentRadius = circleRadius + radiusVariation;

                    // Calculate point position
                    const x = centerX + Math.cos(angle) * currentRadius;
                    const y = centerY + Math.sin(angle) * currentRadius;

                    // First point or connecting point
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                ctx.closePath();

                // Set style
                const colorIndex = c % colors.length;
                ctx.strokeStyle = colors[colorIndex];
                ctx.lineWidth = 3 - c * 0.5; // Thinner lines for outer circles
                ctx.globalAlpha = 0.7 - (c * 0.15); // More transparent for outer circles

                // Add glow effect
                ctx.shadowBlur = 15;
                ctx.shadowColor = colors[colorIndex];

                // Stroke the path
                ctx.stroke();

                // Reset shadow for next path
                ctx.shadowBlur = 0;
            }

            // Draw center circle that pulses with amplitude
            const pulseRadius = maxRadius * 0.15 * (0.8 + amplitude * sensitivity * 0.5);

            ctx.beginPath();
            ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
            ctx.fillStyle = colors[0];
            ctx.globalAlpha = 0.7;
            ctx.fill();

            // Draw a radial gradient for the center
            const gradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, pulseRadius
            );
            gradient.addColorStop(0, colors[2] || colors[0]);
            gradient.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.arc(centerX, centerY, pulseRadius * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.globalAlpha = 0.5;
            ctx.fill();

            // Reset alpha
            ctx.globalAlpha = 1.0;

            // Draw spinning particles around the circle
            const numParticles = 20;
            const particleRadius = 2;

            for (let i = 0; i < numParticles; i++) {
                const particleAngle = (i / numParticles) * Math.PI * 2 + time * 0.5;
                const distanceFromCenter = maxRadius * 0.6 + Math.sin(time * 2 + i) * 20;

                const px = centerX + Math.cos(particleAngle) * distanceFromCenter;
                const py = centerY + Math.sin(particleAngle) * distanceFromCenter;

                ctx.beginPath();
                ctx.arc(px, py, particleRadius, 0, Math.PI * 2);
                ctx.fillStyle = colors[i % colors.length];
                ctx.fill();
            }

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

export default CircularVisualizer;