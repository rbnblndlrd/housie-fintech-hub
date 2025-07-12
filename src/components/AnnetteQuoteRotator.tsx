import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const QUOTE_VAULT = {
  welcome: {
    category: "Power Humblebrags",
    quotes: [
      "Try not to be intimidated. I make this look easy.",
      "You found HOUSIE. Already smarter than most.",
      "This is where the journey begins — and where I get all the credit."
    ]
  },
  booking: {
    category: "Onboarding Lies",
    quotes: [
      "You touch this, people show up. Wild, right?",
      "This button confirms the job. Big commitment. Bigger payoff.",
      "Remember to smile. It helps your rating. Even if it's fake."
    ]
  },
  calendar: {
    category: "Calendar Roasts",
    quotes: [
      "Oh look, you scheduled something. That's cute.",
      "Dragging that job across the week won't delay time, sweetie.",
      "This is where 'organized' people live. Welcome."
    ]
  },
  dashboard: {
    category: "Power Humblebrags",
    quotes: [
      "Everything's working exactly how I planned. You're just catching up.",
      "Dashboard's not broken. You just haven't earned anything yet.",
      "Your numbers look… present."
    ]
  }
};

// Fallback quotes for unknown pages
const DEFAULT_QUOTES = [
  "No offense, but I'll be the brains here.",
  "I'm like a GPS for humans who don't know where they're going… yet.",
  "You book the job, I'll pretend you had a plan all along.",
  "Need a pro? You've got Annette. I know people. I *am* people.",
  "Scroll gently. I'm sensitive to dramatic gestures.",
  "Most platforms take 12 steps. I take two. The second one's for show.",
  "HOUSIE's where trust and sass come standard."
];

interface AnnetteQuoteRotatorProps {
  currentPage?: keyof typeof QUOTE_VAULT;
  className?: string;
}

export const AnnetteQuoteRotator = ({ currentPage = "welcome", className = "" }: AnnetteQuoteRotatorProps) => {
  const currentQuotes = QUOTE_VAULT[currentPage]?.quotes || DEFAULT_QUOTES;
  const currentCategory = QUOTE_VAULT[currentPage]?.category || "Sass Collection";
  
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showMoreQuotes, setShowMoreQuotes] = useState(false);
  const [randomQuote, setRandomQuote] = useState("");

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % currentQuotes.length);
        setIsVisible(true);
      }, 300);
    }, 8000); // 8 seconds for rotation

    return () => clearInterval(interval);
  }, [isPaused, currentQuotes.length]);

  const handleClick = () => {
    if (!isPaused) {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % currentQuotes.length);
        setIsVisible(true);
      }, 300);
    }
  };

  const handleMoreQuotes = () => {
    if (!showMoreQuotes) {
      // Get random quote from any category
      const allQuotes = Object.values(QUOTE_VAULT).flatMap(vault => vault.quotes);
      const randomIndex = Math.floor(Math.random() * allQuotes.length);
      setRandomQuote(allQuotes[randomIndex]);
    }
    setShowMoreQuotes(!showMoreQuotes);
  };

  return (
    <div className={`text-center mb-8 ${className}`}>
      {/* Main Quote Rotator */}
      <div 
        className="cursor-pointer select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={handleClick}
      >
        <div 
          className={`transition-opacity duration-300 ease-in-out max-w-2xl mx-auto ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-base md:text-xl text-white/90 font-medium leading-relaxed px-4 mb-2">
            "{currentQuotes[currentQuoteIndex]}"
          </p>
          <p className="text-xs md:text-sm text-orange-400/80 font-serif">
            — <span className="font-medium">Annette</span> 🦉
          </p>
          <p className="text-xs text-white/50 mt-1">
            {currentCategory}
          </p>
        </div>
        
        {/* Quote indicators */}
        <div className="flex justify-center mt-4 space-x-1">
          {currentQuotes.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                index === currentQuoteIndex ? 'bg-orange-500' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* More Quotes Toggle */}
      <div className="mt-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleMoreQuotes}
          className="bg-white/10 border-orange-400/50 text-orange-400 hover:bg-orange-400/20 text-xs md:text-sm"
        >
          {showMoreQuotes ? "Hide Random Quote" : "More Annette Quotes"}
        </Button>
        
        {showMoreQuotes && (
          <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-orange-400/30 max-w-md mx-auto">
            <p className="text-sm md:text-base text-white/90 italic">
              "{randomQuote}"
            </p>
            <p className="text-xs text-orange-400/80 mt-2">
              — Random Annette Wisdom
            </p>
          </div>
        )}
      </div>
    </div>
  );
};