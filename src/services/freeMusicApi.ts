
interface iTunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  trackTimeMillis: number;
  previewUrl: string;
  artworkUrl100: string;
  primaryGenreName: string;
}

interface Song {
  title: string;
  artist: string;
  album?: string;
  duration?: string;
  image?: string;
  preview_url?: string;
}

const formatDuration = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const searchTermsByMood = {
  happy: ['happy', 'upbeat', 'joy', 'celebration', 'dance', 'pop'],
  sad: ['sad', 'melancholy', 'heartbreak', 'slow', 'emotional', 'ballad'],
  angry: ['rock', 'metal', 'punk', 'aggressive', 'hardcore', 'rage'],
  excited: ['energetic', 'pump up', 'electronic', 'party', 'hype', 'workout'],
  neutral: ['ambient', 'chill', 'indie', 'alternative', 'focus', 'study']
};

export const searchSongsByMood = async (mood: string): Promise<Song[]> => {
  try {
    const searchTerms = searchTermsByMood[mood as keyof typeof searchTermsByMood] || searchTermsByMood.neutral;
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(randomTerm)}&media=music&entity=song&limit=20`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch songs');
    }
    
    const data = await response.json();
    
    return data.results
      .filter((track: iTunesTrack) => track.previewUrl && track.trackTimeMillis > 60000) // Filter songs longer than 1 minute
      .slice(0, 10)
      .map((track: iTunesTrack): Song => ({
        title: track.trackName,
        artist: track.artistName,
        album: track.collectionName,
        duration: formatDuration(track.trackTimeMillis),
        image: track.artworkUrl100,
        preview_url: track.previewUrl
      }));
  } catch (error) {
    console.error('Error fetching songs:', error);
    return [];
  }
};

export const searchSongsByQuery = async (query: string): Promise<Song[]> => {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=20`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch songs');
    }
    
    const data = await response.json();
    
    return data.results
      .filter((track: iTunesTrack) => track.previewUrl)
      .slice(0, 15)
      .map((track: iTunesTrack): Song => ({
        title: track.trackName,
        artist: track.artistName,
        album: track.collectionName,
        duration: formatDuration(track.trackTimeMillis),
        image: track.artworkUrl100,
        preview_url: track.previewUrl
      }));
  } catch (error) {
    console.error('Error searching songs:', error);
    return [];
  }
};
