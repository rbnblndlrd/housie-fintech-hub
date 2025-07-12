import { useState, useEffect } from "react";

const ANNETTE_QUOTES = [
  "Try not to be intimidated. I make this look easy.",
  "You found HOUSIE. That already puts you ahead of 94% of the population.",
  "No offense, but I'll be the brains here.",
  "I'm like a GPS for humans who don't know where they're going… yet.",
  "You book the job, I'll pretend you had a plan all along.",
  "Need a pro? You've got Annette. I know people. I *am* people.",
  "Scroll gently. I'm sensitive to dramatic gestures.",
  "Most platforms take 12 steps. I take two. The second one's for show.",
  "HOUSIE's where trust and sass come standard.",
  "Everything's working exactly how I planned. You're just catching up."
];

export const AnnetteQuoteRotator = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % ANNETTE_QUOTES.length);
        setIsVisible(true);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleClick = () => {
    if (!isPaused) {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % ANNETTE_QUOTES.length);
        setIsVisible(true);
      }, 300);
    }
  };

  return (
    <div 
      className="text-center mb-8 cursor-pointer select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={handleClick}
    >
      <div 
        className={`transition-opacity duration-300 ease-in-out max-w-2xl mx-auto ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="text-sm md:text-base text-muted-foreground font-mono italic leading-relaxed px-4">
          "{ANNETTE_QUOTES[currentQuoteIndex]}"
        </p>
        <p className="text-xs text-muted-foreground/70 mt-2 font-serif">
          — <span className="font-medium">Annette</span> 🦉
        </p>
      </div>
      <div className="flex justify-center mt-3 space-x-1">
        {ANNETTE_QUOTES.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
              index === currentQuoteIndex ? 'bg-orange-500' : 'bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};