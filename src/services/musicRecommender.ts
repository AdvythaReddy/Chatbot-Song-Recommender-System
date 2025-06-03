
// Mock music recommendation service - replace with Last.fm API or similar
interface Song {
  title: string;
  artist: string;
  album?: string;
  duration?: string;
  image?: string;
  preview_url?: string;
}

const musicDatabase = {
  happy: [
    { title: "Happy", artist: "Pharrell Williams", album: "Girl", duration: "3:53" },
    { title: "Good as Hell", artist: "Lizzo", album: "Cuz I Love You", duration: "2:39" },
    { title: "Can't Stop the Feeling!", artist: "Justin Timberlake", album: "Trolls Soundtrack", duration: "3:56" },
    { title: "Walking on Sunshine", artist: "Katrina and the Waves", album: "Walking on Sunshine", duration: "3:59" },
    { title: "I Gotta Feeling", artist: "The Black Eyed Peas", album: "The E.N.D.", duration: "4:05" }
  ],
  sad: [
    { title: "Someone Like You", artist: "Adele", album: "21", duration: "4:45" },
    { title: "Hurt", artist: "Johnny Cash", album: "American IV: The Man Comes Around", duration: "3:38" },
    { title: "Mad World", artist: "Gary Jules", album: "Donnie Darko Soundtrack", duration: "3:07" },
    { title: "The Sound of Silence", artist: "Simon & Garfunkel", album: "Sounds of Silence", duration: "3:05" },
    { title: "Everybody Hurts", artist: "R.E.M.", album: "Automatic for the People", duration: "5:17" }
  ],
  angry: [
    { title: "Break Stuff", artist: "Limp Bizkit", album: "Significant Other", duration: "2:47" },
    { title: "Killing in the Name", artist: "Rage Against the Machine", album: "Rage Against the Machine", duration: "5:14" },
    { title: "Stronger", artist: "Kelly Clarkson", album: "Stronger", duration: "3:42" },
    { title: "Fighter", artist: "Christina Aguilera", album: "Stripped", duration: "4:05" },
    { title: "Since U Been Gone", artist: "Kelly Clarkson", album: "Breakaway", duration: "3:08" }
  ],
  excited: [
    { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", album: "Uptown Special", duration: "4:30" },
    { title: "Can't Hold Us", artist: "Macklemore & Ryan Lewis", album: "The Heist", duration: "4:18" },
    { title: "Pump It", artist: "The Black Eyed Peas", album: "Monkey Business", duration: "3:33" },
    { title: "Thunder", artist: "Imagine Dragons", album: "Evolve", duration: "3:07" },
    { title: "High Hopes", artist: "Panic! At The Disco", album: "Pray for the Wicked", duration: "3:01" }
  ],
  neutral: [
    { title: "Counting Stars", artist: "OneRepublic", album: "Native", duration: "4:17" },
    { title: "Perfect", artist: "Ed Sheeran", album: "÷", duration: "4:23" },
    { title: "Shape of You", artist: "Ed Sheeran", album: "÷", duration: "3:53" },
    { title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:20" },
    { title: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line", duration: "2:54" }
  ]
};

export const recommendSongs = async (tone: string, userMessage: string): Promise<Song[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  console.log(`Getting recommendations for tone: ${tone}`);
  
  const songs = musicDatabase[tone as keyof typeof musicDatabase] || musicDatabase.neutral;
  
  // Shuffle and return top 3 recommendations
  const shuffled = [...songs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};
