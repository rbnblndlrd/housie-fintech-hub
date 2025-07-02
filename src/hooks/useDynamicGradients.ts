
import { useEffect } from 'react';

export const useDynamicGradients = () => {
  useEffect(() => {
    const applySmartContentAwareGradients = () => {
      console.log('🎨 Applying SMART content-aware gradient system with cropped image...');
      
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
      console.log(`🎨 Found ${cards.length} cards to style with smart content-aware system`);
      
      cards.forEach((card: Element, index: number) => {
        const htmlCard = card as HTMLElement;
        
        // Apply intelligent content-aware positioning
        applyIntelligentContentPositioning(htmlCard, index);
        
        // Apply only brownish patterns (no yellowish variants)
        const brownishPatterns = [
          'fintech-pattern-warm', 
          'fintech-pattern-cool', 
          'fintech-pattern-soft',
          'fintech-pattern-subtle',
          'fintech-pattern-classic'
        ];
        const randomPattern = Math.floor(Math.random() * brownishPatterns.length);
        
        // Remove any existing fintech pattern classes
        const allPatterns = [
          'fintech-pattern-warm', 
          'fintech-pattern-cool', 
          'fintech-pattern-soft',
          'fintech-pattern-subtle',
          'fintech-pattern-classic'
        ];
        allPatterns.forEach(pattern => htmlCard.classList.remove(pattern));
        
        // Apply random brownish pattern
        htmlCard.classList.add(brownishPatterns[randomPattern]);
        console.log(`🎨 Applied ${brownishPatterns[randomPattern]} to card ${index}`);
        
        // Enhanced overlay opacity variation (0.15 to 0.30 for subtlety)
        const overlayOpacity = 0.15 + Math.random() * 0.15;
        htmlCard.style.setProperty('--fintech-overlay-opacity', overlayOpacity.toString());
        
        // Strict hue shift for consistent brown tones (smaller range)
        const hueShift = Math.random() * -8 - 8; // -16 to -8 degrees only
        htmlCard.style.setProperty('--hue-shift', `${hueShift}deg`);
        
        // Enhanced brownish filter optimizations
        const brownishSaturate = 0.9 + Math.random() * 0.15; // 0.9 to 1.05
        const brownishBrightness = 0.95 + Math.random() * 0.1; // 0.95 to 1.05
        const brownishContrast = 1.1 + Math.random() * 0.1; // 1.1 to 1.2
        
        htmlCard.style.setProperty('--brownish-saturate', brownishSaturate.toString());
        htmlCard.style.setProperty('--brownish-brightness', brownishBrightness.toString());
        htmlCard.style.setProperty('--brownish-contrast', brownishContrast.toString());
        
        console.log(`🎨 Card ${index} smart styling:`, {
          pattern: brownishPatterns[randomPattern],
          opacity: overlayOpacity.toFixed(3),
          hueShift: `${hueShift.toFixed(1)}deg`,
          filters: {
            saturate: brownishSaturate.toFixed(2),
            brightness: brownishBrightness.toFixed(2),
            contrast: brownishContrast.toFixed(2)
          }
        });
        
        // Force background image application with cropped image
        htmlCard.style.setProperty('background-image', 'url(/lovable-uploads/cream_gradient-cropped.jpg)', 'important');
        htmlCard.style.setProperty('background-size', `${1400 + Math.random() * 400}px`, 'important'); // 1400-1800px
        htmlCard.style.setProperty('background-repeat', 'no-repeat', 'important');
        htmlCard.style.setProperty('background-attachment', 'local', 'important');
      });
    };

    const applyIntelligentContentPositioning = (card: HTMLElement, index: number) => {
      // Analyze text content in the card
      const textElements = card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, .fintech-text-header');
      const hasSignificantText = textElements.length > 2 || Array.from(textElements).some(el => (el.textContent?.length || 0) > 50);
      
      console.log(`🎨 Card ${index} text analysis:`, {
        textElements: textElements.length,
        hasSignificantText,
        content: Array.from(textElements).slice(0, 2).map(el => el.textContent?.slice(0, 30))
      });

      if (hasSignificantText) {
        // Content-heavy cards: Position to show yellowish areas behind text
        applyTextAwarePositioning(card, index, textElements);
      } else {
        // Minimal content cards: Focus on brownish areas
        applyBrownishPositioning(card, index);
      }
    };

    const applyTextAwarePositioning = (card: HTMLElement, index: number, textElements: NodeListOf<Element>) => {
      // Coordinate mapping for cropped image (yellowish areas for text backing)
      const yellowishZones = [
        { x: 70, y: 25 }, // Top-right yellowish area
        { x: 80, y: 45 }, // Mid-right yellowish area
        { x: 65, y: 65 }  // Bottom-right yellowish area
      ];
      
      // Select a yellowish zone for text backing
      const selectedZone = yellowishZones[index % yellowishZones.length];
      
      // Position background to place yellowish area behind main text
      const bgPositionX = selectedZone.x + (Math.random() * 10 - 5); // ±5% variation
      const bgPositionY = selectedZone.y + (Math.random() * 10 - 5); // ±5% variation
      
      card.style.setProperty('--bg-position-x', `${bgPositionX}%`);
      card.style.setProperty('--bg-position-y', `${bgPositionY}%`);
      
      // Enhanced scale for better text readability
      const scale = 2.0 + Math.random() * 0.4; // 2.0 to 2.4 scale
      card.style.setProperty('--pattern-scale', scale.toString());
      
      // Apply subtle yellow tint overlays behind text elements
      let validTextPositions = 0;
      textElements.forEach((el, textIndex) => {
        if (textIndex >= 3) return; // Only handle first 3 text elements
        
        const htmlEl = el as HTMLElement;
        if (!htmlEl.textContent?.trim()) return;
        
        const rect = htmlEl.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        
        if (rect.width > 0 && rect.height > 0 && cardRect.width > 0) {
          const relX = ((rect.left + rect.width/2 - cardRect.left) / cardRect.width) * 100;
          const relY = ((rect.top + rect.height/2 - cardRect.top) / cardRect.height) * 100;
          
          card.style.setProperty(`--text${textIndex + 1}-x`, `${Math.max(10, Math.min(90, relX))}%`);
          card.style.setProperty(`--text${textIndex + 1}-y`, `${Math.max(10, Math.min(90, relY))}%`);
          validTextPositions++;
        }
      });
      
      // Apply enhanced text-aware multi-light class
      if (validTextPositions > 0) {
        card.classList.add('fintech-text-aware');
        console.log(`🎨 Applied text-aware positioning to card ${index} at ${bgPositionX.toFixed(1)}%, ${bgPositionY.toFixed(1)}%`);
      }
    };

    const applyBrownishPositioning = (card: HTMLElement, index: number) => {
      // Coordinate mapping for cropped image (brownish areas for general background)
      const brownishZones = [
        { x: 25, y: 35 }, // Left-center brownish area
        { x: 45, y: 55 }, // Center brownish area
        { x: 35, y: 75 }, // Bottom-left brownish area
        { x: 15, y: 45 }  // Far-left brownish area
      ];
      
      // Select a brownish zone
      const selectedZone = brownishZones[index % brownishZones.length];
      
      // Position background in brownish areas with variation
      const bgPositionX = selectedZone.x + (Math.random() * 15 - 7.5); // ±7.5% variation
      const bgPositionY = selectedZone.y + (Math.random() * 15 - 7.5); // ±7.5% variation
      
      card.style.setProperty('--bg-position-x', `${Math.max(5, Math.min(55, bgPositionX))}%`);
      card.style.setProperty('--bg-position-y', `${Math.max(20, Math.min(85, bgPositionY))}%`);
      
      // Standard scale for brownish areas
      const scale = 1.8 + Math.random() * 0.4; // 1.8 to 2.2 scale
      card.style.setProperty('--pattern-scale', scale.toString());
      
      console.log(`🎨 Applied brownish positioning to card ${index} at ${bgPositionX.toFixed(1)}%, ${bgPositionY.toFixed(1)}%`);
    };

    // Apply gradients immediately
    setTimeout(applySmartContentAwareGradients, 100);

    // Reapply gradients when new elements are added to the DOM
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
        console.log('🎨 DOM changed, reapplying smart content-aware gradient system...');
        setTimeout(applySmartContentAwareGradients, 100);
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
