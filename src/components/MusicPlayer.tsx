
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Heart, Repeat, Shuffle } from "lucide-react";
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
  playlist?: Song[];
  onSongChange?: (song: Song) => void;
}

export const MusicPlayer = ({ currentSong, playlist = [], onSongChange }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Demo audio URL - replace with actual song URLs from your API
  const demoAudioUrl = "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentSong]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (playlist.length > 1 && currentSong && onSongChange) {
      const currentIndex = playlist.findIndex(song => song.title === currentSong.title);
      const nextIndex = isShuffle 
        ? Math.floor(Math.random() * playlist.length)
        : (currentIndex + 1) % playlist.length;
      onSongChange(playlist[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (playlist.length > 1 && currentSong && onSongChange) {
      const currentIndex = playlist.findIndex(song => song.title === currentSong.title);
      const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
      onSongChange(playlist[prevIndex]);
    }
  };

  const handleEnded = () => {
    if (isRepeat) {
      audioRef.current?.play();
    } else {
      handleNext();
    }
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
        
        <audio
          ref={audioRef}
          src={currentSong.preview_url || demoAudioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="metadata"
        />
        
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

          <div className="text-center mb-4">
            <h4 className="text-xl font-bold text-white mb-1 line-clamp-2">
              {currentSong.title}
            </h4>
            <p className="text-gray-300 mb-1">{currentSong.artist}</p>
            {currentSong.album && (
              <p className="text-gray-400 text-sm">{currentSong.album}</p>
            )}
          </div>

          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleProgressChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShuffle(!isShuffle)}
                className={`text-white hover:bg-white/10 ${isShuffle ? 'text-purple-400' : ''}`}
              >
                <Shuffle className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="text-white hover:bg-white/10"
                disabled={playlist.length <= 1}
              >
                <SkipBack className="w-5 h-5" />
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
                onClick={handleNext}
                className="text-white hover:bg-white/10"
                disabled={playlist.length <= 1}
              >
                <SkipForward className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsRepeat(!isRepeat)}
                className={`text-white hover:bg-white/10 ${isRepeat ? 'text-purple-400' : ''}`}
              >
                <Repeat className="w-4 h-4" />
              </Button>
            </div>

            {/* Secondary Controls */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={`text-white hover:bg-white/10 ${isLiked ? 'text-red-500' : ''}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </Button>

              <div className="flex items-center space-x-2 flex-1 max-w-32">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/10"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <Slider
                  value={volume}
                  max={100}
                  step={1}
                  onValueChange={setVolume}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
