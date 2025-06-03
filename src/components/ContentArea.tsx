
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Heart, Clock, Plus } from "lucide-react";
import { ChatInterface } from "./ChatInterface";

interface Song {
  title: string;
  artist: string;
  album?: string;
  duration?: string;
  image?: string;
  preview_url?: string;
}

interface ContentAreaProps {
  activeSection: string;
  onSongSelect: (song: Song) => void;
  onPlaylistUpdate: (playlist: Song[]) => void;
  moodPlaylists: { [key: string]: Song[] };
  recentSongs: Song[];
  likedSongs: Song[];
}

export const ContentArea = ({ 
  activeSection, 
  onSongSelect, 
  onPlaylistUpdate, 
  moodPlaylists, 
  recentSongs, 
  likedSongs 
}: ContentAreaProps) => {
  
  const renderSongList = (songs: Song[], title: string) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="grid gap-2">
        {songs.map((song, index) => (
          <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 p-4 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">{song.title}</h4>
                <p className="text-gray-400 text-sm">{song.artist}</p>
              </div>
              <div className="text-gray-400 text-sm">
                {song.duration || "2:30"}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSongSelect(song)}
                className="text-white hover:bg-white/10"
              >
                <Play className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMoodPlaylist = (mood: string) => {
    const moodData = {
      happy: { title: "Happy Vibes", color: "from-yellow-400 to-orange-500" },
      sad: { title: "Chill & Sad", color: "from-blue-400 to-blue-600" },
      excited: { title: "Energy Boost", color: "from-red-400 to-pink-500" },
      angry: { title: "Angry & Powerful", color: "from-orange-400 to-red-500" },
      neutral: { title: "Focus & Study", color: "from-green-400 to-green-600" },
    };

    const currentMood = moodData[mood as keyof typeof moodData];
    const songs = moodPlaylists[mood] || [];

    return (
      <div className="space-y-6">
        <div className={`h-64 bg-gradient-to-br ${currentMood.color} rounded-lg p-6 flex items-end`}>
          <div>
            <p className="text-white/80 text-sm">Playlist</p>
            <h1 className="text-4xl font-bold text-white mb-2">{currentMood.title}</h1>
            <p className="text-white/80">{songs.length} songs</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button size="lg" className="bg-green-500 hover:bg-green-600 rounded-full">
            <Play className="w-6 h-6 mr-2" />
            Play
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Heart className="w-6 h-6" />
          </Button>
        </div>

        {renderSongList(songs, "")}
      </div>
    );
  };

  if (activeSection === "chat") {
    return (
      <ChatInterface 
        onSongRecommend={onSongSelect} 
        onPlaylistUpdate={onPlaylistUpdate}
      />
    );
  }

  if (activeSection === "home") {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white">Good evening</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(moodPlaylists).slice(0, 6).map(([mood, songs]) => (
            <Card key={mood} className="bg-white/5 backdrop-blur-sm border-white/10 p-4 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded">
                </div>
                <div>
                  <h3 className="text-white font-medium capitalize">{mood} Vibes</h3>
                  <p className="text-gray-400 text-sm">{songs.length} songs</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">Recently Played</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentSongs.slice(0, 6).map((song, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 p-4 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded mb-3">
                </div>
                <h4 className="text-white font-medium text-sm line-clamp-2">{song.title}</h4>
                <p className="text-gray-400 text-xs">{song.artist}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeSection.startsWith("mood-")) {
    const mood = activeSection.replace("mood-", "");
    return renderMoodPlaylist(mood);
  }

  if (activeSection === "recents") {
    return renderSongList(recentSongs, "Recently Played");
  }

  if (activeSection === "liked") {
    return renderSongList(likedSongs, "Liked Songs");
  }

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-400">Select a section to view content</p>
    </div>
  );
};
