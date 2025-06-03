
import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { Header } from "@/components/Header";
import { MusicPlayer } from "@/components/MusicPlayer";

const Index = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [playlist, setPlaylist] = useState([]);

  const handleSongChange = (song: any) => {
    setCurrentSong(song);
  };

  const handlePlaylistUpdate = (newPlaylist: any[]) => {
    setPlaylist(newPlaylist);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          <div className="lg:col-span-2">
            <ChatInterface 
              onSongRecommend={setCurrentSong} 
              onPlaylistUpdate={handlePlaylistUpdate}
            />
          </div>
          <div className="lg:col-span-1">
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
