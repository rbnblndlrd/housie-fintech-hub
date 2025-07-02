
import { useEffect } from 'react';

export const useDynamicGradients = () => {
  useEffect(() => {
    const applyStrategicOverlayPositioning = () => {
      console.log('🎨 Applying strategic overlay method for watermark concealment...');
      
      // Get all fintech card elements
      const cardSelectors = [
        '.fintech-card',
        '.fintech-metric-card', 
        '.fintech-chart-container',
        '.fintech-inner-box',
        '.fintech-button-secondary',
        '.fintech-card-base'
      ];
      
      const cards = document.querySelectorAll(cardSelectors.join(', '));
      console.log(`🎨 Found ${cards.length} cards to style with strategic overlay positioning`);
      
      cards.forEach((card: Element, index: number) => {
        const htmlCard = card as HTMLElement;
        
        // Apply strategic positioning to avoid watermark zones
        applyWatermarkAvoidancePositioning(htmlCard, index);
      });
    };

    const applyWatermarkAvoidancePositioning = (card: HTMLElement, index: number) => {
      // Strategic positioning zones that avoid common watermark locations
      const cleanZones = [
        { x: 20, y: 25, scale: 2.1 }, // Top-left clean area
        { x: 65, y: 30, scale: 2.3 }, // Top-right clean area  
        { x: 30, y: 55, scale: 2.2 }, // Center-left clean area
        { x: 50, y: 20, scale: 2.4 }, // Upper-center clean area
        { x: 15, y: 45, scale: 2.0 }, // Left-center clean area
        { x: 70, y: 65, scale: 2.5 }  // Right-lower clean area
      ];
      
      // Select a clean zone based on card index
      const selectedZone = cleanZones[index % cleanZones.length];
      
      // Add controlled variation to avoid exact repetition
      const bgPositionX = selectedZone.x + (Math.random() * 6 - 3); // ±3% variation
      const bgPositionY = selectedZone.y + (Math.random() * 6 - 3); // ±3% variation
      const scale = selectedZone.scale + (Math.random() * 0.2 - 0.1); // ±0.1 variation
      
      // Apply strategic positioning to show clean areas
      card.style.setProperty('--bg-position-x', `${Math.max(10, Math.min(80, bgPositionX))}%`);
      card.style.setProperty('--bg-position-y', `${Math.max(15, Math.min(75, bgPositionY))}%`);
      card.style.setProperty('--marble-scale', scale.toString());
      
      // Apply pattern variation classes for additional diversity
      const marblePatterns = [
        'fintech-pattern-warm', 
        'fintech-pattern-cool', 
        'fintech-pattern-soft',
        'fintech-pattern-subtle',
        'fintech-pattern-classic'
      ];
      
      // Remove any existing pattern classes
      marblePatterns.forEach(pattern => card.classList.remove(pattern));
      
      // Apply strategic marble pattern for variety
      const randomPattern = marblePatterns[index % marblePatterns.length];
      card.classList.add(randomPattern);
      
      console.log(`🎨 Applied strategic overlay positioning to card ${index}:`, {
        pattern: randomPattern,
        position: `${bgPositionX.toFixed(1)}%, ${bgPositionY.toFixed(1)}%`,
        scale: scale.toFixed(2)
      });
      
      // Enhanced text contrast for content readability
      const textElements = card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, .fintech-text-header');
      textElements.forEach(element => {
        const htmlElement = element as HTMLElement;
        htmlElement.classList.add('text-enhanced-contrast');
      });
      
      // Apply text-aware positioning for cards with multiple text elements
      if (textElements.length > 2) {
        card.classList.add('fintech-text-aware');
        console.log(`🎨 Applied text-aware positioning to card ${index}`);
      }
    };

    // Apply positioning immediately
    setTimeout(applyStrategicOverlayPositioning, 100);

    // Reapply when new elements are added to the DOM
    const observer = new MutationObserver((mutations) => {
      let shouldReapply = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              const hasFintechClass = node.classList?.contains('fintech-card') || 
                                 node.classList?.contains('fintech-metric-card') ||
                                 node.classList?.contains('fintech-chart-container') ||
                                 node.classList?.contains('fintech-inner-box') ||
                                 node.classList?.contains('fintech-card-base');
              
              const containsFintechCards = node.querySelectorAll?.('.fintech-card, .fintech-metric-card, .fintech-chart-container, .fintech-inner-box, .fintech-card-base').length > 0;
              
              if (hasFintechClass || containsFintechCards) {
                shouldReapply = true;
              }
            }
          });
        }
      });
      
      if (shouldReapply) {
        console.log('🎨 DOM changed, reapplying strategic overlay positioning...');
        setTimeout(applyStrategicOverlayPositioning, 100);
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
