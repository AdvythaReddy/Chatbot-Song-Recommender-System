
import { searchSongsByMood } from './freeMusicApi';

interface Song {
  title: string;
  artist: string;
  album?: string;
  duration?: string;
  image?: string;
  preview_url?: string;
}

export const recommendSongs = async (tone: string, userMessage: string): Promise<Song[]> => {
  try {
    console.log(`Getting recommendations for tone: ${tone}`);
    
    // Use the free iTunes API to get real songs
    const songs = await searchSongsByMood(tone);
    
    if (songs.length === 0) {
      // Fallback to default mood if no songs found
      return await searchSongsByMood('neutral');
    }
    
    return songs.slice(0, 5); // Return top 5 recommendations
  } catch (error) {
    console.error('Error getting song recommendations:', error);
    return [];
  }
};

export const getMoodPlaylist = async (mood: string): Promise<Song[]> => {
  return await searchSongsByMood(mood);
};
