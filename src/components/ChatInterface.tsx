import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, User, Bot, Music } from "lucide-react";
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
  onPlaylistUpdate?: (playlist: any[]) => void;
}

// Greetings / small talk that should NOT trigger recommendations
const GREETING_PATTERNS = [
  /^(hi|hii+|hey+|hello+|yo|sup|hola|howdy|heya)[!,.?\s]*$/i,
  /^(good\s*(morning|afternoon|evening|night))[!,.?\s]*$/i,
  /^(what'?s\s*up|wassup|how\s*are\s*you|how'?s\s*it\s*going)[!,.?\s]*$/i,
];

const CASUAL_PATTERNS = [
  /^(ok|okay|cool|nice|great|fine|alright|hmm|hmmm|yeah|yep|nope|thanks|thank\s*you|ty)[!,.?\s]*$/i,
];

const EMOTION_PATTERNS = [
  /\b(feel|feeling|felt|sad|down|low|depressed|hurt|broken|cry|happy|great|amazing|excited|thrilled|angry|mad|frustrated|annoyed|stressed|anxious|tired|lonely|overwhelmed)\b/i,
];

const normalizeText = (text: string) => text.trim().toLowerCase();

const isGreeting = (text: string) => {
  const normalized = normalizeText(text);
  return GREETING_PATTERNS.some((pattern) => pattern.test(normalized));
};

const isShortCasualMessage = (text: string) => {
  const normalized = normalizeText(text);
  const wordCount = normalized.split(/\s+/).filter(Boolean).length;

  return (
    wordCount <= 3 &&
    CASUAL_PATTERNS.some((pattern) => pattern.test(normalized)) &&
    !EMOTION_PATTERNS.some((pattern) => pattern.test(normalized))
  );
};

const containsEmotionCue = (text: string) => {
  const normalized = normalizeText(text);
  return EMOTION_PATTERNS.some((pattern) => pattern.test(normalized));
};

const getGreetingResponse = (text: string) => {
  const normalized = normalizeText(text);

  if (/^hey+[!,.?\s]*$/i.test(normalized)) {
    return "Hey, how are you feeling today?";
  }

  if (/^hi[!,.?\s]*$/i.test(normalized) || /^hello[!,.?\s]*$/i.test(normalized)) {
    return "Hi, how are you feeling today?";
  }

  return "Hey, how are you feeling today?";
};

// Conversational follow-up prompts based on detected tone
const FOLLOW_UPS: Record<string, string[]> = {
  happy: [
    "That's lovely to hear! 😊 What's putting you in such a good mood?",
    "Tell me more — what made today special?",
    "I love that energy! Anything in particular you're celebrating?",
  ],
  sad: [
    "I'm sorry you're feeling that way. 💙 Do you want to talk about what's going on?",
    "That sounds tough. What's been weighing on your mind?",
    "I'm here to listen. Is there something specific that brought this on?",
  ],
  angry: [
    "That sounds really frustrating. What happened?",
    "I hear you. Want to vent a bit about it?",
    "Ugh, that's rough. Tell me more about what's bothering you.",
  ],
  excited: [
    "Yes! Tell me everything — what's got you so hyped? 🎉",
    "I love this energy! What's the big news?",
    "Spill the details! What's going on?",
  ],
  neutral: [
    "Got it. How has your day been overall?",
    "Tell me a bit more — what's on your mind?",
    "I'm listening. What else is going on with you?",
  ],
};

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const ChatInterface = ({ onSongRecommend, onPlaylistUpdate }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your music companion 🎵 Let's chat first — tell me how you're feeling, and once I understand your vibe after a few messages, I'll recommend songs.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<any[]>([]);
  const [userTurnCount, setUserTurnCount] = useState(0);
  const [detectedTones, setDetectedTones] = useState<string[]>([]);
  const [emotionalTurnCount, setEmotionalTurnCount] = useState(0);
  const [hasRecommended, setHasRecommended] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addBotMessage = (text: string, tone?: string, delay = 600) => {
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + Math.random(),
          text,
          sender: "bot",
          timestamp: new Date(),
          tone,
        },
      ]);
    }, delay);
  };

  const fetchAndPlaySongs = async (tone: string) => {
    const songs = await recommendSongs(tone, "");
    if (songs.length > 0) {
      const newPlaylist = [...currentPlaylist, ...songs];
      setCurrentPlaylist(newPlaylist);
      onPlaylistUpdate?.(newPlaylist);
      onSongRecommend(songs[0]);
      addBotMessage(
        `🎵 Based on your ${tone} vibe, I picked "${songs[0].title}" by ${songs[0].artist} and ${songs.length - 1} more. Hit play and enjoy!`,
        undefined,
        800
      );
      setHasRecommended(true);
    } else {
      addBotMessage("Hmm, I couldn't find songs right now. Try telling me a little more about how you're feeling.", undefined, 600);
    }
  };

  const handleManualRecommend = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const tone = detectedTones[detectedTones.length - 1] || "neutral";
      await fetchAndPlaySongs(tone);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    const newTurnCount = userTurnCount + 1;
    setUserTurnCount(newTurnCount);

    try {
      if (isGreeting(text)) {
        addBotMessage(getGreetingResponse(text));
        setIsLoading(false);
        return;
      }

      if (isShortCasualMessage(text)) {
        addBotMessage("I'm here with you — tell me a bit more about how you're feeling today.");
        setIsLoading(false);
        return;
      }

      const tone = await analyzeTone(text);
      const updatedTones = [...detectedTones, tone];
      setDetectedTones(updatedTones);

      const nonNeutralTones = updatedTones.filter((t) => t !== "neutral");

      // Recommend ASAP: as soon as we have any clear mood, OR by turn 2 regardless
      const shouldRecommend =
        !hasRecommended &&
        (nonNeutralTones.length >= 1 || newTurnCount >= 2);

      if (shouldRecommend) {
        const finalTone = nonNeutralTones[nonNeutralTones.length - 1] || tone || "neutral";
        addBotMessage(
          `Got it — I'm picking up a ${finalTone} vibe. Here are some songs for you. 🎶`,
          finalTone,
          400
        );

        setTimeout(async () => {
          await fetchAndPlaySongs(finalTone);
          setIsLoading(false);
        }, 900);
        return;
      }

      // Only one short follow-up on turn 1 if mood is unclear
      addBotMessage(pick(FOLLOW_UPS[tone] || FOLLOW_UPS.neutral), tone);
      setIsLoading(false);
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      addBotMessage("I'm having trouble understanding right now. Could you try rephrasing that?");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canManuallyRecommend = userTurnCount >= 2 && detectedTones.some((tone) => tone !== "neutral");

  return (
    <Card className="h-full flex flex-col bg-black/40 backdrop-blur-sm border-white/20">
      <div className="p-4 border-b border-white/20 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Chat with VibeCheck</h2>
          <p className="text-gray-300 text-sm">The chatbot talks first and only recommends after understanding your mood</p>
        </div>
        {canManuallyRecommend && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleManualRecommend}
            disabled={isLoading}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Music className="w-4 h-4 mr-1" />
            Recommend now
          </Button>
        )}
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
