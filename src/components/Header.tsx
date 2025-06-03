
import { Music, Bot } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">VibeCheck Tunes</h1>
              <p className="text-gray-300 text-sm">AI-Powered Music Recommender</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <Music className="w-5 h-5" />
            <span className="text-sm">Powered by Tone Analysis</span>
          </div>
        </div>
      </div>
    </header>
  );
};
