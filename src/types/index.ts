// Track interface
export interface Track {
    id: string;
    title: string;
    artist: string;
    artistId: string;
    album: string;
    albumId: string;
    cover: string;
    audioUrl: string; // Would be a real URL in production
    duration: number; // Duration in seconds
    genres: string[];
    releaseDate: string;
    popularity: number; // 0-100 scale
    waveformData?: number[]; // For visualization
    colors?: {
        vibrant: string;
        muted: string;
        darkMuted: string;
        lightVibrant: string;
    };
    lyrics?: LyricLine[];
}

// Lyrics with timestamps for sync
export interface LyricLine {
    startTime: number; // Timestamp in seconds
    endTime: number; // Timestamp in seconds
    text: string;
}

// Playlist interface
export interface Playlist {
    id: string;
    name: string;
    description: string;
    coverImage: string;
    createdBy: string;
    createdAt: string;
    isPublic: boolean;
    tracks: Track[];
    followers: number;
}

// Artist interface
export interface Artist {
    id: string;
    name: string;
    bio: string;
    image: string;
    genres: string[];
    popularity: number;
    followers: number;
    albums: Album[];
    topTracks: Track[];
    relatedArtists: string[]; // Artist IDs
}

// Album interface
export interface Album {
    id: string;
    title: string;
    artist: string;
    artistId: string;
    cover: string;
    releaseDate: string;
    tracks: Track[];
    genres: string[];
    popularity: number;
}

// User interface
export interface User {
    id: string;
    name: string;
    avatar: string;
    email: string;
    playlists: Playlist[];
    likedTracks: Track[];
    likedAlbums: Album[];
    followedArtists: Artist[];
    recentlyPlayed: {
        track: Track;
        playedAt: string;
    }[];
}

// Visualization settings
export interface VisualizationSettings {
    type: 'waveform' | 'frequency' | 'circular' | 'particles' | '3d';
    sensitivity: number; // 1-10
    colorScheme: 'track' | 'custom' | 'spectrum';
    customColors?: string[];
    showWaveform: boolean;
    particleDensity?: number; // For particle visualizations
    rotationSpeed?: number; // For 3D visualizations
}

// Player state
export interface PlayerState {
    currentTrack: Track | null;
    isPlaying: boolean;
    queue: Track[];
    history: Track[];
    currentTime: number;
    volume: number;
    isMuted: boolean;
    isShuffled: boolean;
    repeatMode: 'none' | 'track' | 'queue';
    visualizationSettings: VisualizationSettings;
}