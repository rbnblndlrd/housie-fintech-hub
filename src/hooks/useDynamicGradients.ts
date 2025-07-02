
import { useEffect } from 'react';

export const useDynamicGradients = () => {
  useEffect(() => {
    const applyCleanMarblePositioning = () => {
      console.log('🎨 Applying clean marble texture with strategic cropping only...');
      
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
      console.log(`🎨 Found ${cards.length} cards to style with clean marble positioning`);
      
      cards.forEach((card: Element, index: number) => {
        const htmlCard = card as HTMLElement;
        
        // Apply strategic watermark avoidance positioning
        applyStrategicCropping(htmlCard, index);
      });
    };

    const applyStrategicCropping = (card: HTMLElement, index: number) => {
      // Clean areas coordinate mapping for marble texture (avoiding watermark zones)
      const cleanMarbleZones = [
        { x: 25, y: 30, scale: 2.8 }, // Top-left clean area
        { x: 60, y: 35, scale: 3.0 }, // Top-right clean area  
        { x: 35, y: 55, scale: 2.9 }, // Center clean area
        { x: 45, y: 25, scale: 3.1 }, // Upper-center clean area
        { x: 20, y: 50, scale: 2.7 }, // Left-center clean area
        { x: 65, y: 60, scale: 3.2 }  // Right-lower clean area
      ];
      
      // Select a clean zone based on card index
      const selectedZone = cleanMarbleZones[index % cleanMarbleZones.length];
      
      // Add slight variation to avoid exact repetition
      const bgPositionX = selectedZone.x + (Math.random() * 8 - 4); // ±4% variation
      const bgPositionY = selectedZone.y + (Math.random() * 8 - 4); // ±4% variation
      const scale = selectedZone.scale + (Math.random() * 0.3 - 0.15); // ±0.15 variation
      
      // Apply strategic positioning to show clean areas
      card.style.setProperty('--bg-position-x', `${Math.max(15, Math.min(75, bgPositionX))}%`);
      card.style.setProperty('--bg-position-y', `${Math.max(20, Math.min(70, bgPositionY))}%`);
      card.style.setProperty('--marble-scale', scale.toString());
      
      // Apply pattern variation classes
      const marblePatterns = [
        'fintech-pattern-warm', 
        'fintech-pattern-cool', 
        'fintech-pattern-soft',
        'fintech-pattern-subtle',
        'fintech-pattern-classic'
      ];
      
      // Remove any existing pattern classes
      marblePatterns.forEach(pattern => card.classList.remove(pattern));
      
      // Apply random marble pattern for variety
      const randomPattern = marblePatterns[index % marblePatterns.length];
      card.classList.add(randomPattern);
      
      console.log(`🎨 Applied clean positioning to card ${index}:`, {
        pattern: randomPattern,
        position: `${bgPositionX.toFixed(1)}%, ${bgPositionY.toFixed(1)}%`,
        scale: scale.toFixed(2)
      });
      
      // Analyze text content for content-aware positioning
      const textElements = card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, .fintech-text-header');
      if (textElements.length > 2) {
        card.classList.add('fintech-text-aware');
        console.log(`🎨 Applied text-aware positioning to card ${index}`);
      }
    };

    // Apply positioning immediately
    setTimeout(applyCleanMarblePositioning, 100);

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
        console.log('🎨 DOM changed, reapplying clean marble positioning...');
        setTimeout(applyCleanMarblePositioning, 100);
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
