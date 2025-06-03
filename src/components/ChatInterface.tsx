
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, User, Bot } from "lucide-react";
import { analyzeTone } from "@/services/toneAnalyzer";
import { recommendSongs } from "@/services/musicRecommender";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  tone?: string;
}

interface ChatInterfaceProps {
  onSongRecommend: (song: any) => void;
}

export const ChatInterface = ({ onSongRecommend }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your music companion. Tell me how you're feeling or what's on your mind, and I'll recommend some songs that match your vibe! 🎵",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Analyze tone of the message
      const tone = await analyzeTone(inputText);
      console.log("Detected tone:", tone);

      // Generate bot response based on tone
      const botResponse = generateBotResponse(tone, inputText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
        tone,
      };

      setMessages(prev => [...prev, botMessage]);

      // Get song recommendations based on tone
      const songs = await recommendSongs(tone, inputText);
      if (songs.length > 0) {
        onSongRecommend(songs[0]);
        
        const songMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: `🎵 Based on your ${tone} mood, I recommend: "${songs[0].title}" by ${songs[0].artist}. Perfect for how you're feeling!`,
          sender: "bot",
          timestamp: new Date(),
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, songMessage]);
        }, 1000);
      }

    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble understanding right now. Could you try rephrasing that?",
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateBotResponse = (tone: string, userMessage: string): string => {
    const responses = {
      happy: [
        "That's wonderful! I can feel the positive energy in your message! 😊",
        "I love your enthusiasm! It's contagious! ✨",
        "Your happiness is radiating through the screen! 🌟"
      ],
      sad: [
        "I hear you, and I'm here for you. Sometimes music can help us process these feelings. 💙",
        "It sounds like you're going through a tough time. Let me find something that might comfort you. 🤗",
        "I understand. Music has a way of helping us feel less alone. 💜"
      ],
      angry: [
        "I can sense the intensity in your message. Sometimes we need music that matches our energy. 🔥",
        "Strong emotions deserve powerful music. Let me find something that fits. ⚡",
        "I get it - sometimes we need to feel our feelings fully. Music can help with that. 💪"
      ],
      neutral: [
        "Thanks for sharing! Let me find something that might brighten your day. 🎵",
        "I'm listening! Music can often help us discover how we're really feeling. 🎶",
        "Interesting! Let me pick something that might resonate with you. 🎼"
      ],
      excited: [
        "Your excitement is infectious! I love the energy! 🚀",
        "Wow, I can feel your enthusiasm! This calls for some upbeat tunes! 🎉",
        "That energy is amazing! Let's find music that matches it! ⚡"
      ]
    };

    const toneResponses = responses[tone as keyof typeof responses] || responses.neutral;
    return toneResponses[Math.floor(Math.random() * toneResponses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col bg-black/40 backdrop-blur-sm border-white/20">
      <div className="p-4 border-b border-white/20">
        <h2 className="text-xl font-semibold text-white">Chat with VibeCheck</h2>
        <p className="text-gray-300 text-sm">Share your feelings and get personalized music recommendations</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[80%] ${
                message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div
                className={`p-2 rounded-full ${
                  message.sender === "user"
                    ? "bg-purple-500"
                    : "bg-gradient-to-r from-blue-500 to-purple-500"
                }`}
              >
                {message.sender === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-white/10 text-white border border-white/20"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                {message.tone && (
                  <span className="text-xs opacity-70 mt-1 block">
                    Tone: {message.tone}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-2 rounded-lg bg-white/10 border border-white/20">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/20">
        <div className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts or feelings..."
            className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputText.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
