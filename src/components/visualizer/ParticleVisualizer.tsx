import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../../contexts/PlayerContext';

interface Particle {
    x: number;
    y: number;
    radius: number;
    color: string;
    velocity: {
        x: number;
        y: number;
    };
    life: number;
    maxLife: number;
    rotation: number;
    rotationSpeed: number;
    shape: 'circle' | 'square' | 'triangle';
}

const ParticleVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { playerState, getAudioData } = usePlayer();
    const { isPlaying, visualizationSettings, currentTrack } = playerState;
    const animationRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);

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
        return ['#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
    };

    // Create a new particle
    const createParticle = (x: number, y: number, canvas: HTMLCanvasElement, colors: string[]) => {
        const velocityFactor = Math.random() * 1 + 0.5;
        const angle = Math.random() * Math.PI * 2;
        const shape = ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle';

        return {
            x,
            y,
            radius: Math.random() * 6 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            velocity: {
                x: Math.cos(angle) * velocityFactor,
                y: Math.sin(angle) * velocityFactor,
            },
            life: 0,
            maxLife: Math.random() * 100 + 100,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            shape,
        };
    };

    // Draw a particle
    const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
        const { x, y, radius, color, life, maxLife, rotation, shape } = particle;
        const opacity = 1 - (life / maxLife);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);

        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;

        if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();
        } else if (shape === 'square') {
            ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
        } else if (shape === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(0, -radius);
            ctx.lineTo(-radius, radius);
            ctx.lineTo(radius, radius);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
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

        // Initialize particles array
        particlesRef.current = [];

        // Animation function
        const draw = () => {
            if (!ctx || !canvas) return;

            const { width, height } = canvas;

            // Create semi-transparent background for trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);

            if (!isPlaying) {
                // Clear the array if not playing
                particlesRef.current = [];
                animationRef.current = requestAnimationFrame(draw);
                return;
            }

            const { frequency, amplitude } = getAudioData();
            const centerX = width / 2;
            const centerY = height / 2;
            const colors = getColors();
            const sensitivity = visualizationSettings.sensitivity / 10;
            const particleDensity = visualizationSettings.particleDensity || 50;

            // Generate new particles based on audio amplitude
            const particlesToGenerate = Math.floor(amplitude * sensitivity * particleDensity * 0.2);

            for (let i = 0; i < particlesToGenerate; i++) {
                // Create particles in a ring around the center
                const angle = Math.random() * Math.PI * 2;
                const distance = (Math.random() * 50 + 100) * sensitivity;

                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;

                particlesRef.current.push(createParticle(x, y, canvas, colors));
            }

            // Update and draw particles
            const particles = particlesRef.current;

            ctx.save();
            ctx.shadowBlur = 15;

            for (let i = 0; i < particles.length; i++) {
                const particle = particles[i];

                // Update position
                particle.x += particle.velocity.x;
                particle.y += particle.velocity.y;

                // Update rotation
                particle.rotation += particle.rotationSpeed;

                // Increase life
                particle.life += 1;

                // Add some gravity towards center
                const dx = centerX - particle.x;
                const dy = centerY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 50) {
                    const gravitationalPull = 0.02;
                    particle.velocity.x += (dx / distance) * gravitationalPull;
                    particle.velocity.y += (dy / distance) * gravitationalPull;
                }

                // Set shadow color to particle color for glow effect
                ctx.shadowColor = particle.color;

                // Draw the particle
                drawParticle(ctx, particle);
            }

            ctx.restore();

            // Remove dead particles
            particlesRef.current = particles.filter(p => p.life < p.maxLife);

            // Request next frame
            animationRef.current = requestAnimationFrame(draw);
        };

        // Start animation
        animationRef.current = requestAnimationFrame(draw);

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationRef.current);
        };
    }, [visualizationSettings, isPlaying, currentTrack]);

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

export default ParticleVisualizer;