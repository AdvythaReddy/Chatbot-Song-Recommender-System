
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Heart, Clock, Music, Sparkles, TrendingUp } from "lucide-react";
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
  onToggleLike: (song: Song) => void;
  isSongLiked: (song: Song) => boolean;
  onSectionChange: (section: string) => void;
}

const moodMeta: Record<string, { title: string; color: string; emoji: string }> = {
  happy: { title: "Happy Vibes", color: "from-yellow-400 to-orange-500", emoji: "😊" },
  sad: { title: "Chill & Sad", color: "from-blue-400 to-blue-600", emoji: "💙" },
  excited: { title: "Energy Boost", color: "from-red-400 to-pink-500", emoji: "🚀" },
  angry: { title: "Angry & Powerful", color: "from-orange-400 to-red-500", emoji: "🔥" },
  neutral: { title: "Focus & Study", color: "from-green-400 to-green-600", emoji: "🎯" },
};

export const ContentArea = ({
  activeSection,
  onSongSelect,
  onPlaylistUpdate,
  moodPlaylists,
  recentSongs,
  likedSongs,
  onToggleLike,
  isSongLiked,
  onSectionChange,
}: ContentAreaProps) => {
  const SongRow = ({ song, index }: { song: Song; index: number }) => {
    const liked = isSongLiked(song);
    return (
      <Card
        className="group bg-white/5 backdrop-blur-sm border-white/10 p-3 hover:bg-white/10 transition-all cursor-pointer"
        onClick={() => onSongSelect(song)}
      >
        <div className="flex items-center space-x-4">
          <div className="w-10 text-gray-400 text-sm text-center">{index + 1}</div>
          <div className="w-12 h-12 rounded overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            {song.image ? (
              <img src={song.image} alt={song.title} className="w-full h-full object-cover" />
            ) : (
              <Music className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium truncate">{song.title}</h4>
            <p className="text-gray-400 text-sm truncate">{song.artist}</p>
          </div>
          <div className="text-gray-400 text-sm hidden md:block">{song.album || "—"}</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(song);
            }}
            className={`opacity-0 group-hover:opacity-100 transition-opacity ${liked ? "opacity-100 text-red-500" : "text-white"} hover:bg-white/10`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          </Button>
          <div className="text-gray-400 text-sm w-12 text-right">{song.duration || "0:30"}</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onSongSelect(song);
            }}
            className="text-white hover:bg-white/10"
          >
            <Play className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  };

  const renderSongList = (songs: Song[], title: string, subtitle?: string, emptyMsg?: string) => (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {songs.length === 0 ? (
        <Card className="bg-white/5 border-white/10 p-12 text-center">
          <Music className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-300">{emptyMsg || "Nothing here yet"}</p>
        </Card>
      ) : (
        <div className="grid gap-2">
          {songs.map((song, i) => (
            <SongRow key={`${song.title}-${song.artist}-${i}`} song={song} index={i} />
          ))}
        </div>
      )}
    </div>
  );

  const renderMoodPlaylist = (mood: string) => {
    const meta = moodMeta[mood];
    if (!meta) return null;
    const songs = moodPlaylists[mood] || [];

    return (
      <div className="space-y-6">
        <div className={`h-64 bg-gradient-to-br ${meta.color} rounded-xl p-6 flex items-end shadow-2xl`}>
          <div>
            <p className="text-white/80 text-sm uppercase tracking-wider">Mood Playlist</p>
            <h1 className="text-5xl font-bold text-white mb-2">{meta.emoji} {meta.title}</h1>
            <p className="text-white/80">{songs.length} songs</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            size="lg"
            onClick={() => {
              if (songs.length > 0) {
                onPlaylistUpdate(songs);
                onSongSelect(songs[0]);
              }
            }}
            className="bg-green-500 hover:bg-green-600 rounded-full text-black font-semibold"
          >
            <Play className="w-5 h-5 mr-2 fill-current" />
            Play
          </Button>
        </div>

        {renderSongList(songs, "", undefined, "No songs in this playlist yet")}
      </div>
    );
  };

  const renderLibrary = () => {
    const playlistCards = [
      { id: "liked", title: "Liked Songs", count: likedSongs.length, color: "from-pink-500 to-red-500", icon: Heart },
      { id: "recents", title: "Recently Played", count: recentSongs.length, color: "from-purple-500 to-blue-500", icon: Clock },
      ...Object.keys(moodMeta).map((mood) => ({
        id: `mood-${mood}`,
        title: moodMeta[mood].title,
        count: (moodPlaylists[mood] || []).length,
        color: moodMeta[mood].color,
        icon: Music,
      })),
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Library</h1>
          <p className="text-gray-400 mt-1">All your playlists in one place</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlistCards.map((p) => {
            const Icon = p.icon;
            return (
              <Card
                key={p.id}
                onClick={() => onSectionChange(p.id)}
                className="bg-white/5 backdrop-blur-sm border-white/10 p-4 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-7 h-7 text-white ${p.id === "liked" ? "fill-current" : ""}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{p.title}</h3>
                    <p className="text-gray-400 text-sm">{p.count} songs</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  if (activeSection === "chat") {
    return <ChatInterface onSongRecommend={onSongSelect} onPlaylistUpdate={onPlaylistUpdate} />;
  }

  if (activeSection === "home") {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white">Good vibes, friend 👋</h1>
          <p className="text-gray-400 mt-1">Pick up where you left off</p>
        </div>

        {recentSongs.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-white mr-2" />
              <h2 className="text-2xl font-bold text-white">Recently Played</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {recentSongs.slice(0, 6).map((song, i) => (
                <Card
                  key={i}
                  onClick={() => onSongSelect(song)}
                  className="bg-white/5 backdrop-blur-sm border-white/10 p-3 hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="w-full aspect-square rounded mb-3 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
                    {song.image ? (
                      <img src={song.image} alt={song.title} className="w-full h-full object-cover" />
                    ) : (
                      <Music className="w-8 h-8 text-white" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-10 h-10 text-white fill-current" />
                    </div>
                  </div>
                  <h4 className="text-white font-medium text-sm line-clamp-1">{song.title}</h4>
                  <p className="text-gray-400 text-xs line-clamp-1">{song.artist}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center mb-4">
            <Sparkles className="w-5 h-5 text-white mr-2" />
            <h2 className="text-2xl font-bold text-white">Mood Playlists</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(moodMeta).map(([mood, meta]) => {
              const songs = moodPlaylists[mood] || [];
              return (
                <Card
                  key={mood}
                  onClick={() => onSectionChange(`mood-${mood}`)}
                  className="bg-white/5 backdrop-blur-sm border-white/10 p-4 hover:bg-white/10 transition-all cursor-pointer group overflow-hidden"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${meta.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-105 transition-transform`}>
                      {meta.emoji}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{meta.title}</h3>
                      <p className="text-gray-400 text-sm">{songs.length} songs</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {likedSongs.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <Heart className="w-5 h-5 text-red-500 mr-2 fill-current" />
              <h2 className="text-2xl font-bold text-white">Your Liked Songs</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {likedSongs.slice(0, 6).map((song, i) => (
                <Card
                  key={i}
                  onClick={() => onSongSelect(song)}
                  className="bg-white/5 backdrop-blur-sm border-white/10 p-3 hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="w-full aspect-square rounded mb-3 overflow-hidden bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
                    {song.image ? (
                      <img src={song.image} alt={song.title} className="w-full h-full object-cover" />
                    ) : (
                      <Heart className="w-8 h-8 text-white fill-current" />
                    )}
                  </div>
                  <h4 className="text-white font-medium text-sm line-clamp-1">{song.title}</h4>
                  <p className="text-gray-400 text-xs line-clamp-1">{song.artist}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeSection === "library") {
    return renderLibrary();
  }

  if (activeSection.startsWith("mood-")) {
    return renderMoodPlaylist(activeSection.replace("mood-", ""));
  }

  if (activeSection === "recents") {
    return renderSongList(
      recentSongs,
      "Recently Played",
      `${recentSongs.length} songs you've listened to`,
      "Play a song from the chat or a playlist to see it here"
    );
  }

  if (activeSection === "liked") {
    return (
      <div className="space-y-6">
        <div className="h-64 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl p-6 flex items-end shadow-2xl">
          <div>
            <p className="text-white/80 text-sm uppercase tracking-wider">Playlist</p>
            <h1 className="text-5xl font-bold text-white mb-2 flex items-center">
              <Heart className="w-10 h-10 mr-3 fill-current" /> Liked Songs
            </h1>
            <p className="text-white/80">{likedSongs.length} songs</p>
          </div>
        </div>
        {likedSongs.length > 0 && (
          <Button
            size="lg"
            onClick={() => {
              onPlaylistUpdate(likedSongs);
              onSongSelect(likedSongs[0]);
            }}
            className="bg-green-500 hover:bg-green-600 rounded-full text-black font-semibold"
          >
            <Play className="w-5 h-5 mr-2 fill-current" /> Play
          </Button>
        )}
        {renderSongList(likedSongs, "", undefined, "Tap the heart on any song to add it here ❤️")}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-400">Select a section to view content</p>
    </div>
  );
};
