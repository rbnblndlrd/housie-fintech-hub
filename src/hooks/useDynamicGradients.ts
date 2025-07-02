
import { useEffect } from 'react';

export const useDynamicGradients = () => {
  useEffect(() => {
    const applySmartMarbleGradients = () => {
      console.log('🎨 Applying SMART marble texture system with watermark concealment...');
      
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
      console.log(`🎨 Found ${cards.length} cards to style with marble texture system`);
      
      cards.forEach((card: Element, index: number) => {
        const htmlCard = card as HTMLElement;
        
        // Apply intelligent watermark avoidance positioning
        applyWatermarkAvoidancePositioning(htmlCard, index);
        
        // Apply marble pattern variations with concealment
        const marblePatterns = [
          'fintech-pattern-warm', 
          'fintech-pattern-cool', 
          'fintech-pattern-soft',
          'fintech-pattern-subtle',
          'fintech-pattern-classic'
        ];
        const randomPattern = Math.floor(Math.random() * marblePatterns.length);
        
        // Remove any existing pattern classes
        const allPatterns = [
          'fintech-pattern-warm', 
          'fintech-pattern-cool', 
          'fintech-pattern-soft',
          'fintech-pattern-subtle',
          'fintech-pattern-classic'
        ];
        allPatterns.forEach(pattern => htmlCard.classList.remove(pattern));
        
        // Apply random marble pattern
        htmlCard.classList.add(marblePatterns[randomPattern]);
        console.log(`🎨 Applied ${marblePatterns[randomPattern]} to card ${index}`);
        
        // Strategic marble scaling to avoid watermarks (200-350%)
        const marbleScale = 2.5 + Math.random() * 1.0; // 2.5 to 3.5 scale
        htmlCard.style.setProperty('--marble-scale', marbleScale.toString());
        
        // Overlay opacity for watermark concealment (0.3 to 0.6)
        const overlayOpacity = 0.3 + Math.random() * 0.3;
        htmlCard.style.setProperty('--marble-overlay-opacity', overlayOpacity.toString());
        
        // Subtle hue shift for marble tone consistency (-12 to -4 degrees)
        const hueShift = Math.random() * -8 - 4; // -12 to -4 degrees
        htmlCard.style.setProperty('--hue-shift', `${hueShift}deg`);
        
        // Enhanced marble filter optimizations
        const marbleSaturate = 0.88 + Math.random() * 0.12; // 0.88 to 1.0
        const marbleBrightness = 1.0 + Math.random() * 0.1; // 1.0 to 1.1
        const marbleContrast = 1.08 + Math.random() * 0.08; // 1.08 to 1.16
        
        htmlCard.style.setProperty('--marble-saturate', marbleSaturate.toString());
        htmlCard.style.setProperty('--marble-brightness', marbleBrightness.toString());
        htmlCard.style.setProperty('--marble-contrast', marbleContrast.toString());
        
        console.log(`🎨 Card ${index} marble styling:`, {
          pattern: marblePatterns[randomPattern],
          scale: marbleScale.toFixed(2),
          overlayOpacity: overlayOpacity.toFixed(3),
          hueShift: `${hueShift.toFixed(1)}deg`,
          filters: {
            saturate: marbleSaturate.toFixed(2),
            brightness: marbleBrightness.toFixed(2),
            contrast: marbleContrast.toFixed(2)
          }
        });
        
        // Force marble background image application
        htmlCard.style.setProperty('background-image', 'url(/lovable-uploads/beige-marble-texture-with-spot-pattern.jpg)', 'important');
        htmlCard.style.setProperty('background-size', `${marbleScale * 100}%`, 'important');
        htmlCard.style.setProperty('background-repeat', 'no-repeat', 'important');
        htmlCard.style.setProperty('background-attachment', 'local', 'important');
      });
    };

    const applyWatermarkAvoidancePositioning = (card: HTMLElement, index: number) => {
      // Analyze text content in the card
      const textElements = card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, .fintech-text-header');
      const hasSignificantText = textElements.length > 2 || Array.from(textElements).some(el => (el.textContent?.length || 0) > 50);
      
      console.log(`🎨 Card ${index} content analysis:`, {
        textElements: textElements.length,
        hasSignificantText,
        content: Array.from(textElements).slice(0, 2).map(el => el.textContent?.slice(0, 30))
      });

      if (hasSignificantText) {
        // Content-heavy cards: Position to avoid watermarks behind text
        applyTextAwareMarblePositioning(card, index, textElements);
      } else {
        // Minimal content cards: Use clean marble areas
        applyCleanMarblePositioning(card, index);
      }
    };

    const applyTextAwareMarblePositioning = (card: HTMLElement, index: number, textElements: NodeListOf<Element>) => {
      // Clean areas coordinate mapping for marble texture (avoiding watermark zones)
      const cleanMarbleZones = [
        { x: 25, y: 30 }, // Top-left clean area
        { x: 65, y: 25 }, // Top-right clean area
        { x: 35, y: 55 }, // Center-left clean area
        { x: 70, y: 60 }  // Center-right clean area
      ];
      
      // Select a clean zone for text backing
      const selectedZone = cleanMarbleZones[index % cleanMarbleZones.length];
      
      // Position background to place clean area behind main text
      const bgPositionX = selectedZone.x + (Math.random() * 8 - 4); // ±4% variation
      const bgPositionY = selectedZone.y + (Math.random() * 8 - 4); // ±4% variation
      
      card.style.setProperty('--bg-position-x', `${bgPositionX}%`);
      card.style.setProperty('--bg-position-y', `${bgPositionY}%`);
      
      // Enhanced scale for better text readability on marble
      const scale = 2.8 + Math.random() * 0.4; // 2.8 to 3.2 scale
      card.style.setProperty('--marble-scale', scale.toString());
      
      // Apply gentle marble-tone overlays behind text elements
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
      
      // Apply enhanced text-aware marble class
      if (validTextPositions > 0) {
        card.classList.add('fintech-text-aware');
        console.log(`🎨 Applied text-aware marble positioning to card ${index} at ${bgPositionX.toFixed(1)}%, ${bgPositionY.toFixed(1)}%`);
      }
    };

    const applyCleanMarblePositioning = (card: HTMLElement, index: number) => {
      // Clean areas coordinate mapping for marble texture (general background)
      const cleanMarbleAreas = [
        { x: 20, y: 35 }, // Left clean area
        { x: 40, y: 45 }, // Center clean area
        { x: 60, y: 35 }, // Right clean area
        { x: 30, y: 65 }  // Bottom clean area
      ];
      
      // Select a clean area
      const selectedArea = cleanMarbleAreas[index % cleanMarbleAreas.length];
      
      // Position background in clean areas with variation
      const bgPositionX = selectedArea.x + (Math.random() * 12 - 6); // ±6% variation
      const bgPositionY = selectedArea.y + (Math.random() * 12 - 6); // ±6% variation
      
      card.style.setProperty('--bg-position-x', `${Math.max(15, Math.min(75, bgPositionX))}%`);
      card.style.setProperty('--bg-position-y', `${Math.max(25, Math.min(75, bgPositionY))}%`);
      
      // Standard scale for clean areas
      const scale = 2.6 + Math.random() * 0.4; // 2.6 to 3.0 scale
      card.style.setProperty('--marble-scale', scale.toString());
      
      console.log(`🎨 Applied clean marble positioning to card ${index} at ${bgPositionX.toFixed(1)}%, ${bgPositionY.toFixed(1)}%`);
    };

    // Apply gradients immediately
    setTimeout(applySmartMarbleGradients, 100);

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
        console.log('🎨 DOM changed, reapplying smart marble texture system...');
        setTimeout(applySmartMarbleGradients, 100);
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
