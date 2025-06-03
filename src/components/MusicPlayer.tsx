
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, Volume2, Heart } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Song {
  title: string;
  artist: string;
  album?: string;
  duration?: string;
  image?: string;
  preview_url?: string;
}

interface MusicPlayerProps {
  currentSong: Song | null;
}

export const MusicPlayer = ({ currentSong }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  if (!currentSong) {
    return (
      <Card className="h-full bg-black/40 backdrop-blur-sm border-white/20 p-6">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg mb-4 flex items-center justify-center">
            <Volume2 className="w-12 h-12 text-white/50" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Song Selected</h3>
          <p className="text-gray-400 text-sm">
            Start chatting to get personalized music recommendations based on your mood!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-black/40 backdrop-blur-sm border-white/20 p-6">
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold text-white mb-4">Now Playing</h3>
        
        <div className="flex-1 flex flex-col">
          <AspectRatio ratio={1} className="mb-4">
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              {currentSong.image ? (
                <img 
                  src={currentSong.image} 
                  alt={currentSong.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Volume2 className="w-16 h-16 text-white" />
              )}
            </div>
          </AspectRatio>

          <div className="text-center mb-6">
            <h4 className="text-xl font-bold text-white mb-1 line-clamp-2">
              {currentSong.title}
            </h4>
            <p className="text-gray-300 mb-1">{currentSong.artist}</p>
            {currentSong.album && (
              <p className="text-gray-400 text-sm">{currentSong.album}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLike}
                className={`text-white hover:bg-white/10 ${isLiked ? 'text-red-500' : ''}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                onClick={togglePlay}
                size="lg"
                className="bg-white text-black hover:bg-gray-200 rounded-full w-12 h-12 p-0"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            <div className="w-full bg-white/20 rounded-full h-1">
              <div className="bg-white h-1 rounded-full w-1/3"></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400">
              <span>1:23</span>
              <span>{currentSong.duration || "3:45"}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
