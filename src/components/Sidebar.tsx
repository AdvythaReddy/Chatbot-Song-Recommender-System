
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Search, Library, Heart, Clock, Music, MessageCircle, Plus, List } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  moodPlaylists: any[];
  recentSongs: any[];
}

export const Sidebar = ({ activeSection, onSectionChange, moodPlaylists, recentSongs }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainSections = [
    { id: "chat", label: "Chat & Discover", icon: MessageCircle },
    { id: "home", label: "Home", icon: Home },
    { id: "search", label: "Search", icon: Search },
    { id: "library", label: "Your Library", icon: Library },
  ];

  const moodSections = [
    { id: "happy", label: "Happy Vibes", color: "bg-yellow-500" },
    { id: "sad", label: "Chill & Sad", color: "bg-blue-500" },
    { id: "excited", label: "Energy Boost", color: "bg-red-500" },
    { id: "angry", label: "Angry & Powerful", color: "bg-orange-500" },
    { id: "neutral", label: "Focus & Study", color: "bg-green-500" },
  ];

  return (
    <Card className={`h-full bg-black/90 backdrop-blur-sm border-white/20 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-white">VibeMusic</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-white/10"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 mb-6">
          {mainSections.map((section) => (
            <Button
              key={section.id}
              variant="ghost"
              onClick={() => onSectionChange(section.id)}
              className={`w-full justify-start text-white hover:bg-white/10 ${
                activeSection === section.id ? 'bg-white/20' : ''
              } ${isCollapsed ? 'px-2' : 'px-4'}`}
            >
              <section.icon className="w-5 h-5" />
              {!isCollapsed && <span className="ml-3">{section.label}</span>}
            </Button>
          ))}
        </div>

        {!isCollapsed && (
          <>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-2 px-2">MOOD PLAYLISTS</h3>
              <div className="space-y-1">
                {moodSections.map((mood) => (
                  <Button
                    key={mood.id}
                    variant="ghost"
                    onClick={() => onSectionChange(`mood-${mood.id}`)}
                    className={`w-full justify-start text-white hover:bg-white/10 ${
                      activeSection === `mood-${mood.id}` ? 'bg-white/20' : ''
                    }`}
                  >
                    <div className={`w-4 h-4 rounded ${mood.color} mr-3`} />
                    <span className="text-sm">{mood.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <Button
                variant="ghost"
                onClick={() => onSectionChange('recents')}
                className={`w-full justify-start text-white hover:bg-white/10 ${
                  activeSection === 'recents' ? 'bg-white/20' : ''
                }`}
              >
                <Clock className="w-5 h-5 mr-3" />
                <span>Recently Played</span>
              </Button>
            </div>

            <div>
              <Button
                variant="ghost"
                onClick={() => onSectionChange('liked')}
                className={`w-full justify-start text-white hover:bg-white/10 ${
                  activeSection === 'liked' ? 'bg-white/20' : ''
                }`}
              >
                <Heart className="w-5 h-5 mr-3" />
                <span>Liked Songs</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
