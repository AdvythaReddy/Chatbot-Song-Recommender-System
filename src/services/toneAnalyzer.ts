
// Mock tone analyzer - replace with actual IBM Watson Tone Analyzer API
export const analyzeTone = async (text: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simple keyword-based tone detection (replace with actual API)
  const lowerText = text.toLowerCase();
  
  // Happy indicators
  if (lowerText.includes('happy') || lowerText.includes('great') || lowerText.includes('awesome') || 
      lowerText.includes('excited') || lowerText.includes('amazing') || lowerText.includes('wonderful') ||
      lowerText.includes('love') || lowerText.includes('fantastic') || lowerText.includes('perfect')) {
    return 'happy';
  }
  
  // Sad indicators
  if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('depressed') ||
      lowerText.includes('tired') || lowerText.includes('exhausted') || lowerText.includes('lonely') ||
      lowerText.includes('hurt') || lowerText.includes('broken') || lowerText.includes('cry')) {
    return 'sad';
  }
  
  // Angry indicators
  if (lowerText.includes('angry') || lowerText.includes('mad') || lowerText.includes('frustrated') ||
      lowerText.includes('annoyed') || lowerText.includes('hate') || lowerText.includes('furious') ||
      lowerText.includes('pissed') || lowerText.includes('irritated')) {
    return 'angry';
  }
  
  // Excited indicators
  if (lowerText.includes('excited') || lowerText.includes('pumped') || lowerText.includes('energetic') ||
      lowerText.includes('thrilled') || lowerText.includes('hyped') || lowerText.includes('pumped up')) {
    return 'excited';
  }
  
  return 'neutral';
};
