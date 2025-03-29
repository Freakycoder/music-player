import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { usePlayer } from '../../contexts/PlayerContext';

const ThreeDVisualizer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { playerState, getAudioData } = usePlayer();
    const { isPlaying, visualizationSettings, currentTrack } = playerState;

    // References to three.js objects
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const barsRef = useRef<THREE.Mesh[]>([]);
    const frameIdRef = useRef<number>(0);

    // Get colors from track or settings
    const getColors = () => {
        const { colorScheme, customColors } = visualizationSettings;

        if (colorScheme === 'custom' && customColors && customColors.length > 0) {
            return customColors.map(color => new THREE.Color(color));
        }

        if (colorScheme === 'track' && currentTrack?.colors) {
            return [
                new THREE.Color(currentTrack.colors.vibrant),
                new THREE.Color(currentTrack.colors.lightVibrant),
                new THREE.Color(currentTrack.colors.muted),
                new THREE.Color(currentTrack.colors.darkMuted),
            ];
        }

        // Default colors
        return [
            new THREE.Color('#3b82f6'),
            new THREE.Color('#8b5cf6'),
            new THREE.Color('#ec4899'),
            new THREE.Color('#10b981'),
        ];
    };

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        const container = containerRef.current;
        const { clientWidth, clientHeight } = container;

        renderer.setSize(clientWidth, clientHeight);
        renderer.setClearColor(0x000000, 0); // Transparent background
        container.appendChild(renderer.domElement);

        // Set references
        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        // Configure camera
        camera.position.z = 30;

        // Create lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(25, 50, 25);
        scene.add(pointLight);

        // Create circular bars
        const colors = getColors();
        const numBars = 48;
        const bars: THREE.Mesh[] = [];

        for (let i = 0; i < numBars; i++) {
            const angle = (i / numBars) * Math.PI * 2;
            const radius = 10;

            // Position around a circle
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;

            // Create bar geometry (width, height, depth)
            const geometry = new THREE.BoxGeometry(0.5, 1, 0.5);

            // Create material with color
            const colorIndex = i % colors.length;
            const material = new THREE.MeshPhongMaterial({
                color: colors[colorIndex],
                emissive: colors[colorIndex].clone().multiplyScalar(0.3),
                specular: 0xffffff,
                shininess: 50,
            });

            // Create mesh and add to scene
            const bar = new THREE.Mesh(geometry, material);
            bar.position.set(x, 0, z);

            // Rotate to face center
            bar.lookAt(new THREE.Vector3(0, 0, 0));

            scene.add(bar);
            bars.push(bar);
        }

        // Add a center sphere
        const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: colors[0],
            emissive: colors[0].clone().multiplyScalar(0.3),
            specular: 0xffffff,
            shininess: 30,
        });

        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);

        // Store reference to bars
        barsRef.current = bars;

        // Handle window resize
        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

            const { clientWidth, clientHeight } = containerRef.current;

            cameraRef.current.aspect = clientWidth / clientHeight;
            cameraRef.current.updateProjectionMatrix();

            rendererRef.current.setSize(clientWidth, clientHeight);
        };

        window.addEventListener('resize', handleResize);

        // Animation function
        const animate = () => {
            if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

            const { frequency, amplitude } = getAudioData();
            const sensitivity = visualizationSettings.sensitivity / 5;
            const rotationSpeed = (visualizationSettings.rotationSpeed || 1) * 0.01;

            // Update bars based on frequency data
            barsRef.current.forEach((bar, i) => {
                const index = Math.floor((i / barsRef.current.length) * frequency.length);
                const value = frequency[index] * sensitivity;

                // Update bar height based on audio data
                bar.scale.y = 1 + value * 15;

                // Reposition top of bar
                bar.position.y = bar.scale.y / 2;

                // Add slight rotation for movement
                const angle = (i / barsRef.current.length) * Math.PI * 2;
                bar.position.x = Math.sin(angle) * 10;
                bar.position.z = Math.cos(angle) * 10;

                // Always look at center
                bar.lookAt(new THREE.Vector3(0, 0, 0));

                // Update material based on audio
                const material = bar.material as THREE.MeshPhongMaterial;
                material.emissiveIntensity = Math.min(value * 2, 1);
            });

            // Update center sphere
            sphere.scale.set(
                1 + amplitude * sensitivity,
                1 + amplitude * sensitivity,
                1 + amplitude * sensitivity
            );

            // Rotate camera slowly around scene
            if (cameraRef.current) {
                const time = Date.now() * 0.001;
                const radius = 30;

                cameraRef.current.position.x = Math.sin(time * rotationSpeed) * radius;
                cameraRef.current.position.z = Math.cos(time * rotationSpeed) * radius;
                cameraRef.current.position.y = Math.sin(time * rotationSpeed * 0.5) * 5 + 5;

                cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));
            }

            // Render scene
            rendererRef.current.render(sceneRef.current, cameraRef.current);

            // Continue animation loop
            frameIdRef.current = requestAnimationFrame(animate);
        };

        // Start or pause animation based on playing state
        if (isPlaying) {
            animate();
        } else {
            cancelAnimationFrame(frameIdRef.current);
        }

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameIdRef.current);

            if (rendererRef.current && containerRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
            }

            // Dispose geometries and materials
            barsRef.current.forEach(bar => {
                bar.geometry.dispose();
                (bar.material as THREE.Material).dispose();
            });

            sphereGeometry.dispose();
            sphereMaterial.dispose();
        };
    }, [isPlaying, visualizationSettings]);

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex items-center justify-center"
        />
    );
};

export default ThreeDVisualizer;