import { useEffect } from 'react';

export const useDynamicGradients = () => {
  useEffect(() => {
    const applyRandomGradients = () => {
      // Get all card elements
      const cardSelectors = [
        '.card:not(.fintech-card):not(.fintech-metric-card):not(.fintech-chart-container)',
        '.glass-card', 
        '.job-card', 
        '.widget-card'
      ];
      
      const cards = document.querySelectorAll(cardSelectors.join(', '));
      
      cards.forEach((card: Element) => {
        const htmlCard = card as HTMLElement;
        
        // Randomize gradient center position (keeping it somewhat centered)
        const x = 40 + Math.random() * 20; // 40-60%
        const y = 40 + Math.random() * 20; // 40-60%
        
        // Randomize gradient size
        const size = 120 + Math.random() * 80; // 120-200%
        
        // Randomize gradient angle for linear gradients
        const angle = Math.random() * 360; // 0-360 degrees
        
        // Apply random values
        htmlCard.style.setProperty('--gradient-x', `${x}%`);
        htmlCard.style.setProperty('--gradient-y', `${y}%`);
        htmlCard.style.setProperty('--gradient-size', `${size}%`);
        htmlCard.style.setProperty('--gradient-angle', `${angle}deg`);
        
        // Randomly apply one of the gradient patterns (33% chance each)
        const patterns = ['gradient-pattern-1', 'gradient-pattern-2', 'gradient-pattern-3'];
        const randomPattern = Math.floor(Math.random() * 4); // 0-3, where 3 means no pattern (default)
        
        // Remove any existing pattern classes
        patterns.forEach(pattern => htmlCard.classList.remove(pattern));
        
        // Apply random pattern (75% chance of getting a pattern, 25% default)
        if (randomPattern < 3) {
          htmlCard.classList.add(patterns[randomPattern]);
        }
      });
    };

    // Apply gradients on initial load
    applyRandomGradients();

    // Reapply gradients when new elements are added to the DOM
    const observer = new MutationObserver((mutations) => {
      let shouldReapply = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              const hasCardClass = node.classList?.contains('card') || 
                                 node.classList?.contains('glass-card') || 
                                 node.classList?.contains('job-card') || 
                                 node.classList?.contains('widget-card');
              
              const containsCards = node.querySelectorAll?.('.card, .glass-card, .job-card, .widget-card').length > 0;
              
              if (hasCardClass || containsCards) {
                shouldReapply = true;
              }
            }
          });
        }
      });
      
      if (shouldReapply) {
        // Delay to ensure DOM is fully updated
        setTimeout(applyRandomGradients, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);
};
