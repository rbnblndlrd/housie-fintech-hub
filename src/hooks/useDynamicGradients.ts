
import { useEffect } from 'react';

export const useDynamicGradients = () => {
  useEffect(() => {
    const applyOrganicCloudGradients = () => {
      console.log('🎨 Applying DRAMATIC organic cloud gradients with enhanced randomization...');
      
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
      console.log(`🎨 Found ${cards.length} cards to style with DRAMATIC randomization`);
      
      cards.forEach((card: Element, index: number) => {
        const htmlCard = card as HTMLElement;
        
        // Apply content-aware gradients for fintech elements
        applyContentAwareGradient(htmlCard, index);
        
        // DRAMATICALLY randomize the pattern - 8 distinct patterns instead of 4
        const patterns = [
          'fintech-pattern-warm', 
          'fintech-pattern-cool', 
          'fintech-pattern-vibrant',
          'fintech-pattern-soft',
          'fintech-pattern-bold',
          'fintech-pattern-subtle',
          'fintech-pattern-dynamic',
          'fintech-pattern-classic'
        ];
        const randomPattern = Math.floor(Math.random() * patterns.length);
        
        // Remove any existing fintech pattern classes
        patterns.forEach(pattern => htmlCard.classList.remove(pattern));
        
        // Apply random fintech pattern
        htmlCard.classList.add(patterns[randomPattern]);
        console.log(`🎨 Applied ${patterns[randomPattern]} to card ${index}`);
        
        // DRAMATICALLY increase overlay opacity variation (0.15 to 0.45 for visibility)
        const overlayOpacity = 0.15 + Math.random() * 0.3; // Much more visible range
        htmlCard.style.setProperty('--fintech-overlay-opacity', overlayOpacity.toString());
        
        // Add rotation variation to patterns
        const rotation = Math.random() * 360;
        htmlCard.style.setProperty('--pattern-rotation', `${rotation}deg`);
        
        // Add scale variation to patterns
        const scale = 0.8 + Math.random() * 0.6; // 0.8 to 1.4 scale
        htmlCard.style.setProperty('--pattern-scale', scale.toString());
        
        // Add color hue shift for more variation
        const hueShift = Math.random() * 60 - 30; // -30 to +30 degrees
        htmlCard.style.setProperty('--hue-shift', `${hueShift}deg`);
        
        console.log(`🎨 Card ${index} dramatic styling:`, {
          pattern: patterns[randomPattern],
          opacity: overlayOpacity.toFixed(3),
          rotation: `${rotation.toFixed(1)}deg`,
          scale: scale.toFixed(2),
          hueShift: `${hueShift.toFixed(1)}deg`
        });
        
        // Force background image application with enhanced mobile support
        htmlCard.style.setProperty('background-image', 'url(/lovable-uploads/cream_gradient.jpg)', 'important');
      });
    };

    const applyContentAwareGradient = (card: HTMLElement, index: number) => {
      // Generate more dramatic organic cloud positions
      const seed = index * 137.5; // Golden angle for better distribution
      
      // Cloud 1 position - much more varied (expanded range)
      const cloud1X = 15 + Math.sin(seed) * 35; // 15-50% range (wider)
      const cloud1Y = 20 + Math.cos(seed * 0.7) * 40; // 20-60% range (wider)
      
      // Cloud 2 position - complementary with more variation
      const cloud2X = 60 + Math.sin(seed * 1.3) * 30; // 60-90% range (wider)
      const cloud2Y = 50 + Math.cos(seed * 1.8) * 35; // 50-85% range (wider)
      
      // Vignette position - more dramatic asymmetry
      const vignetteX = Math.sin(seed * 2.1) > 0 ? 
        10 + Math.random() * 25 : // Left side (10-35%)
        65 + Math.random() * 25;  // Right side (65-90%)
      const vignetteY = Math.cos(seed * 2.5) > 0 ? 
        10 + Math.random() * 30 : // Top (10-40%)
        60 + Math.random() * 30;  // Bottom (60-90%)
      
      // Apply dramatic cloud variations
      card.style.setProperty('--cloud1-x', `${cloud1X}%`);
      card.style.setProperty('--cloud1-y', `${cloud1Y}%`);
      card.style.setProperty('--cloud2-x', `${cloud2X}%`);
      card.style.setProperty('--cloud2-y', `${cloud2Y}%`);
      card.style.setProperty('--vignette-x', `${vignetteX}%`);
      card.style.setProperty('--vignette-y', `${vignetteY}%`);

      console.log(`🎨 Card ${index} DRAMATIC cloud positions:`, {
        cloud1: `${cloud1X.toFixed(1)}%, ${cloud1Y.toFixed(1)}%`,
        cloud2: `${cloud2X.toFixed(1)}%, ${cloud2Y.toFixed(1)}%`,
        vignette: `${vignetteX.toFixed(1)}%, ${vignetteY.toFixed(1)}%`
      });

      // Enhanced multi-light effect
      const textElements = card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span');
      
      if (textElements.length > 1) {
        let validPositions = 0;
        
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
            validPositions++;
          }
        });
        
        // Apply enhanced multi-light class
        if (validPositions > 1) {
          card.classList.add('fintech-multi-light');
          console.log(`🎨 Applied enhanced multi-light effect to card ${index}`);
        }
      }
    };

    // Apply gradients immediately
    setTimeout(applyOrganicCloudGradients, 100);

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
        console.log('🎨 DOM changed, reapplying DRAMATIC gradient randomization...');
        // Delay to ensure DOM is fully updated
        setTimeout(applyOrganicCloudGradients, 100);
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
