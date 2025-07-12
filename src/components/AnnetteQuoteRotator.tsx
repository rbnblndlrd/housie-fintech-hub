import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Quote {
  id: string;
  text: string;
  page: string;
  category: string;
  is_active: boolean;
}

// Fallback quotes for when database is unavailable
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
  currentPage?: string;
  className?: string;
}

export const AnnetteQuoteRotator = ({ currentPage = "welcome", className = "" }: AnnetteQuoteRotatorProps) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuotes, setCurrentQuotes] = useState<string[]>(DEFAULT_QUOTES);
  const [currentCategory, setCurrentCategory] = useState("Sass Collection");
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showMoreQuotes, setShowMoreQuotes] = useState(false);
  const [randomQuote, setRandomQuote] = useState("");

  // Fetch quotes from database
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const { data, error } = await supabase
          .from('annette_quotes')
          .select('*')
          .eq('is_active', true)
          .eq('page', currentPage);

        if (error) throw error;

        if (data && data.length > 0) {
          const quotesForPage = data.map(q => q.text);
          setCurrentQuotes(quotesForPage);
          setCurrentCategory(data[0].category || "Sass Collection");
          setQuotes(data);
        } else {
          // Fallback to default quotes if no data found for this page
          setCurrentQuotes(DEFAULT_QUOTES);
          setCurrentCategory("Sass Collection");
        }
      } catch (error) {
        console.error('Error fetching quotes:', error);
        // Fallback to default quotes on error
        setCurrentQuotes(DEFAULT_QUOTES);
        setCurrentCategory("Sass Collection");
      }
    };

    fetchQuotes();
  }, [currentPage]);

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

  const handleMoreQuotes = async () => {
    if (!showMoreQuotes) {
      try {
        // Get random quote from database
        const { data, error } = await supabase
          .from('annette_quotes')
          .select('text')
          .eq('is_active', true);

        if (error) throw error;

        if (data && data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setRandomQuote(data[randomIndex].text);
        } else {
          // Fallback to default quotes
          const randomIndex = Math.floor(Math.random() * DEFAULT_QUOTES.length);
          setRandomQuote(DEFAULT_QUOTES[randomIndex]);
        }
      } catch (error) {
        console.error('Error fetching random quote:', error);
        // Fallback to default quotes
        const randomIndex = Math.floor(Math.random() * DEFAULT_QUOTES.length);
        setRandomQuote(DEFAULT_QUOTES[randomIndex]);
      }
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