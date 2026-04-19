
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Sidebar } from "@/components/Sidebar";
import { ContentArea } from "@/components/ContentArea";
import { getMoodPlaylist } from "@/services/musicRecommender";

const Index = () => {
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState("chat");
  const [moodPlaylists, setMoodPlaylists] = useState<Record<string, any[]>>({});
  const [recentSongs, setRecentSongs] = useState<any[]>([]);
  const [likedSongs, setLikedSongs] = useState<any[]>([]);

  // Load liked songs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("likedSongs");
      if (stored) setLikedSongs(JSON.parse(stored));
      const storedRecent = localStorage.getItem("recentSongs");
      if (storedRecent) setRecentSongs(JSON.parse(storedRecent));
    } catch (e) {
      console.error("Failed to load saved songs:", e);
    }
  }, []);

  // Persist liked songs
  useEffect(() => {
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
  }, [likedSongs]);

  // Persist recents
  useEffect(() => {
    localStorage.setItem("recentSongs", JSON.stringify(recentSongs));
  }, [recentSongs]);

  // Load mood playlists on mount
  useEffect(() => {
    const loadMoodPlaylists = async () => {
      const moods = ["happy", "sad", "excited", "angry", "neutral"];
      const playlists: Record<string, any[]> = {};
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
    setRecentSongs((prev) => {
      const filtered = prev.filter((s) => s.title !== song.title || s.artist !== song.artist);
      return [song, ...filtered].slice(0, 30);
    });
  };

  const handlePlaylistUpdate = (newPlaylist: any[]) => {
    setPlaylist(newPlaylist);
  };

  const isSongLiked = (song: any) =>
    !!song && likedSongs.some((s) => s.title === song.title && s.artist === song.artist);

  const handleToggleLike = (song: any) => {
    if (!song) return;
    setLikedSongs((prev) => {
      const exists = prev.some((s) => s.title === song.title && s.artist === song.artist);
      if (exists) {
        return prev.filter((s) => !(s.title === song.title && s.artist === song.artist));
      }
      return [song, ...prev];
    });
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
            likedSongs={likedSongs}
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
              onToggleLike={handleToggleLike}
              isSongLiked={isSongLiked}
              onSectionChange={setActiveSection}
            />
          </div>

          <div className="w-80 p-6">
            <MusicPlayer
              currentSong={currentSong}
              playlist={playlist}
              onSongChange={handleSongChange}
              isLiked={isSongLiked(currentSong)}
              onToggleLike={() => handleToggleLike(currentSong)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
