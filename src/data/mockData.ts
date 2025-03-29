import { Track, Artist, Album, Playlist, User } from '../types';

// Mock tracks data
export const tracks: Track[] = [
    {
        id: '1',
        title: 'Midnight City',
        artist: 'M83',
        artistId: 'artist1',
        album: 'Hurry Up, We\'re Dreaming',
        albumId: 'album1',
        cover: '/images/artists/m83.jpg',
        audioUrl: '/audio/midnight-city.mp3',
        duration: 241,
        genres: ['Electronic', 'Synthwave'],
        releaseDate: '2011-10-18',
        popularity: 92,
        colors: {
            vibrant: '#7E57C2',
            muted: '#5E35B1',
            darkMuted: '#311B92',
            lightVibrant: '#B39DDB',
        },
        lyrics: [
            { startTime: 0, endTime: 15, text: 'Waiting in a car' },
            { startTime: 15, endTime: 30, text: 'Waiting for a ride in the dark' },
            { startTime: 30, endTime: 45, text: 'The night city grows' },
            { startTime: 45, endTime: 60, text: 'Look and see her eyes, they glow' },
        ]
    },
    {
        id: '2',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        artistId: 'artist2',
        album: 'After Hours',
        albumId: 'album2',
        cover: '/images/artists/weekend 1.jpg',
        audioUrl: '/audio/blinding-lights.mp3',
        duration: 203,
        genres: ['Pop', 'Synthwave'],
        releaseDate: '2019-11-29',
        popularity: 98,
        colors: {
            vibrant: '#E53935',
            muted: '#C62828',
            darkMuted: '#B71C1C',
            lightVibrant: '#EF5350',
        }
    },
    {
        id: '3',
        title: 'Dreams',
        artist: 'Fleetwood Mac',
        artistId: 'artist3',
        album: 'Rumours',
        albumId: 'album3',
        cover: '/images/artists/fleetwood mac.jpg',
        audioUrl: '/audio/dreams.mp3',
        duration: 254,
        genres: ['Rock', 'Classic Rock'],
        releaseDate: '1977-02-04',
        popularity: 85,
        colors: {
            vibrant: '#FFB300',
            muted: '#FFA000',
            darkMuted: '#FF8F00',
            lightVibrant: '#FFD54F',
        }
    },
    {
        id: '4',
        title: 'Redbone',
        artist: 'Childish Gambino',
        artistId: 'artist4',
        album: 'Awaken, My Love!',
        albumId: 'album4',
        cover: '/images/artists/childish gambino.jpg',
        audioUrl: '/audio/redbone.mp3',
        duration: 327,
        genres: ['R&B', 'Soul', 'Funk'],
        releaseDate: '2016-12-02',
        popularity: 89,
        colors: {
            vibrant: '#FF5722',
            muted: '#E64A19',
            darkMuted: '#BF360C',
            lightVibrant: '#FF8A65',
        }
    },
    {
        id: '5',
        title: 'Get Lucky',
        artist: 'Daft Punk',
        artistId: 'artist5',
        album: 'Random Access Memories',
        albumId: 'album5',
        cover: '/images/artists/daft funk.jpg',
        audioUrl: '/audio/get-lucky.mp3',
        duration: 248,
        genres: ['Electronic', 'Disco', 'Funk'],
        releaseDate: '2013-04-19',
        popularity: 91,
        colors: {
            vibrant: '#212121',
            muted: '#424242',
            darkMuted: '#000000',
            lightVibrant: '#9E9E9E',
        }
    },
    {
        id: '6',
        title: 'Starboy',
        artist: 'The Weeknd',
        artistId: 'artist2',
        album: 'Starboy',
        albumId: 'album6',
        cover: '/images/artists/weekend 2.jpg',
        audioUrl: '/audio/starboy.mp3',
        duration: 230,
        genres: ['R&B', 'Pop'],
        releaseDate: '2016-09-22',
        popularity: 94,
        colors: {
            vibrant: '#D32F2F',
            muted: '#C62828',
            darkMuted: '#B71C1C',
            lightVibrant: '#EF5350',
        }
    },
    {
        id: '7',
        title: 'Uptown Funk',
        artist: 'Mark Ronson',
        artistId: 'artist6',
        album: 'Uptown Special',
        albumId: 'album7',
        cover: '/images/artists/mark ronson.jpg',
        audioUrl: '/audio/uptown-funk.mp3',
        duration: 270,
        genres: ['Funk', 'Pop'],
        releaseDate: '2014-11-10',
        popularity: 96,
        colors: {
            vibrant: '#1E88E5',
            muted: '#1976D2',
            darkMuted: '#0D47A1',
            lightVibrant: '#64B5F6',
        }
    },
    {
        id: '8',
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        artistId: 'artist7',
        album: 'A Night at the Opera',
        albumId: 'album8',
        cover: '/images/artists/queen.jpg',
        audioUrl: '/audio/bohemian-rhapsody.mp3',
        duration: 355,
        genres: ['Rock', 'Classic Rock'],
        releaseDate: '1975-10-31',
        popularity: 93,
        colors: {
            vibrant: '#303F9F',
            muted: '#3F51B5',
            darkMuted: '#1A237E',
            lightVibrant: '#7986CB',
        }
    },
];

// Mock artists data
export const artists: Artist[] = [
    {
        id: 'artist1',
        name: 'M83',
        bio: 'M83 is a French electronic music project formed in 2001 by Anthony Gonzalez and Nicolas Fromageau.',
        image: '/images/artists/m83.jpg',
        genres: ['Electronic', 'Synthwave', 'Dream Pop'],
        popularity: 86,
        followers: 2500000,
        albums: [],
        topTracks: [],
        relatedArtists: ['artist5'],
    },
    {
        id: 'artist2',
        name: 'The Weeknd',
        bio: 'Abel Makkonen Tesfaye, known professionally as the Weeknd, is a Canadian singer, songwriter, and record producer.',
        image: '/images/artists/weekend 1.jpg',
        genres: ['R&B', 'Pop', 'Alternative R&B'],
        popularity: 98,
        followers: 15000000,
        albums: [],
        topTracks: [],
        relatedArtists: ['artist4', 'artist6'],
    },
    {
        id: 'artist3',
        name: 'Fleetwood Mac',
        bio: 'Fleetwood Mac are a British-American rock band, formed in London in 1967.',
        image: '/images/artists/fleetwood mac.jpg',
        genres: ['Rock', 'Classic Rock', 'Soft Rock'],
        popularity: 88,
        followers: 8750000,
        albums: [],
        topTracks: [],
        relatedArtists: ['artist7'],
    },
    {
        id: 'artist4',
        name: 'Childish Gambino',
        bio: 'Donald Glover, also known by his stage name Childish Gambino, is an American actor, comedian, writer, producer, director, musician, and DJ.',
        image: '/images/artists/childish gambino.jpg',
        genres: ['Hip Hop', 'R&B', 'Funk', 'Soul'],
        popularity: 90,
        followers: 7500000,
        albums: [],
        topTracks: [],
        relatedArtists: ['artist2', 'artist6'],
    },
    {
        id: 'artist5',
        name: 'Daft Punk',
        bio: 'Daft Punk were a French electronic music duo formed in 1993 in Paris by Guy-Manuel de Homem-Christo and Thomas Bangalter.',
        image: '/images/artists/daft punk.jpg',
        genres: ['Electronic', 'House', 'Disco', 'Funk'],
        popularity: 93,
        followers: 10200000,
        albums: [],
        topTracks: [],
        relatedArtists: ['artist1'],
    },
    {
        id: 'artist6',
        name: 'Mark Ronson',
        bio: 'Mark Daniel Ronson is a British-American musician, DJ, songwriter and record producer.',
        image: '/images/artists/mark ronson.jpg',
        genres: ['Pop', 'Funk', 'R&B'],
        popularity: 84,
        followers: 3500000,
        albums: [],
        topTracks: [],
        relatedArtists: ['artist4'],
    },
    {
        id: 'artist7',
        name: 'Queen',
        bio: 'Queen are a British rock band formed in London in 1970. The band comprised Freddie Mercury, Brian May, Roger Taylor and John Deacon.',
        image: '/images/artists/queen.jpg',
        genres: ['Rock', 'Classic Rock', 'Glam Rock'],
        popularity: 96,
        followers: 20500000,
        albums: [],
        topTracks: [],
        relatedArtists: ['artist3'],
    },
];

// Mock playlists data
export const playlists: Playlist[] = [
    {
        id: 'playlist1',
        name: 'Weekend Vibes',
        description: 'Perfect playlist for your weekend relaxation',
        coverImage: '/images/artists/weekend 2.jpg',
        createdBy: 'user1',
        createdAt: '2023-01-15',
        isPublic: true,
        tracks: [tracks[0], tracks[1], tracks[4]],
        followers: 1250,
    },
    {
        id: 'playlist2',
        name: 'Throwback Classics',
        description: 'Take a trip down memory lane with these timeless hits',
        coverImage: '/images/artists/uptown funk.jpg',
        createdBy: 'user1',
        createdAt: '2022-11-22',
        isPublic: true,
        tracks: [tracks[2], tracks[7]],
        followers: 943,
    },
    {
        id: 'playlist3',
        name: 'Workout Mix',
        description: 'High-energy tracks to fuel your workout',
        coverImage: '/images/artists/m83.jpg',
        createdBy: 'user1',
        createdAt: '2023-02-05',
        isPublic: true,
        tracks: [tracks[1], tracks[5], tracks[6]],
        followers: 785,
    },
    {
        id: 'playlist4',
        name: 'Focus Flow',
        description: 'Concentration-enhancing tracks for deep work',
        coverImage: '/images/artists/daft funk.jpg',
        createdBy: 'user1',
        createdAt: '2023-03-10',
        isPublic: false,
        tracks: [tracks[0], tracks[3], tracks[4]],
        followers: 612,
    },
];

// Mock user data
export const user: User = {
    id: 'user1',
    name: 'Ishaan Sharma',
    avatar: '/images/artists/m83.jpg',
    email: 'alex@example.com',
    playlists: playlists,
    likedTracks: [tracks[0], tracks[2], tracks[5]],
    likedAlbums: [],
    followedArtists: [artists[1], artists[4]],
    recentlyPlayed: [
        { track: tracks[1], playedAt: '2023-04-02T14:30:00' },
        { track: tracks[5], playedAt: '2023-04-02T13:15:00' },
        { track: tracks[3], playedAt: '2023-04-01T19:45:00' },
        { track: tracks[0], playedAt: '2023-04-01T16:20:00' },
    ],
};

// Fill in album and top tracks for artists
artists.forEach(artist => {
    artist.topTracks = tracks.filter(track => track.artistId === artist.id);
    // Mock albums data will be filled later
});

// Generate more random waveform data for visualizations
export const generateWaveformData = (length = 100): number[] => {
    return Array.from({ length }, () => Math.random());
};

export const getTrackById = (id: string): Track | undefined => {
    return tracks.find(track => track.id === id);
};

export const getArtistById = (id: string): Artist | undefined => {
    return artists.find(artist => artist.id === id);
};

export const getPlaylistById = (id: string): Playlist | undefined => {
    return playlists.find(playlist => playlist.id === id);
};

// Mock recently played tracks
export const recentlyPlayed = user.recentlyPlayed.map(item => item.track);

// Mock featured playlists
export const featuredPlaylists = playlists.slice(0, 2);

// Mock new releases
export const newReleases = tracks.slice(0, 4);