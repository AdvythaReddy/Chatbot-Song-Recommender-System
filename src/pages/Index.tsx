
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Sidebar } from "@/components/Sidebar";
import { ContentArea } from "@/components/ContentArea";
import { getMoodPlaylist } from "@/services/musicRecommender";

const Index = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [activeSection, setActiveSection] = useState("chat");
  const [moodPlaylists, setMoodPlaylists] = useState({});
  const [recentSongs, setRecentSongs] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);

  // Load mood playlists on component mount
  useEffect(() => {
    const loadMoodPlaylists = async () => {
      const moods = ['happy', 'sad', 'excited', 'angry', 'neutral'];
      const playlists = {};
      
      for (const mood of moods) {
        try {
          const songs = await getMoodPlaylist(mood);
          playlists[mood] = songs;
        } catch (error) {
          console.error(`Error loading ${mood} playlist:`, error);
          playlists[mood] = [];
        }
      }
      
      setMoodPlaylists(playlists);
    };

    loadMoodPlaylists();
  }, []);

  const handleSongChange = (song: any) => {
    setCurrentSong(song);
    
    // Add to recent songs
    setRecentSongs(prev => {
      const filtered = prev.filter(s => s.title !== song.title);
      return [song, ...filtered].slice(0, 20);
    });
  };

  const handlePlaylistUpdate = (newPlaylist: any[]) => {
    setPlaylist(newPlaylist);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-auto">
          <Sidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            moodPlaylists={moodPlaylists}
            recentSongs={recentSongs}
          />
        </div>
        
        <div className="flex-1 flex">
          <div className="flex-1 p-6 overflow-y-auto">
            <ContentArea
              activeSection={activeSection}
              onSongSelect={handleSongChange}
              onPlaylistUpdate={handlePlaylistUpdate}
              moodPlaylists={moodPlaylists}
              recentSongs={recentSongs}
              likedSongs={likedSongs}
            />
          </div>
          
          <div className="w-80 p-6">
            <MusicPlayer 
              currentSong={currentSong} 
              playlist={playlist}
              onSongChange={handleSongChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
