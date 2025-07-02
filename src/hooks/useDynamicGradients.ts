
import { useEffect } from 'react';

export const useDynamicGradients = () => {
  useEffect(() => {
    const applyOrganicCloudGradients = () => {
      console.log('🎨 Applying ENHANCED brownish gradient system with improved tiling...');
      
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
      console.log(`🎨 Found ${cards.length} cards to style with brownish background system`);
      
      cards.forEach((card: Element, index: number) => {
        const htmlCard = card as HTMLElement;
        
        // Apply content-aware gradients for fintech elements
        applyContentAwareGradient(htmlCard, index);
        
        // Apply only brownish patterns (removed yellowish variants)
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
          'fintech-pattern-vibrant',
          'fintech-pattern-soft',
          'fintech-pattern-bold',
          'fintech-pattern-subtle',
          'fintech-pattern-dynamic',
          'fintech-pattern-classic'
        ];
        allPatterns.forEach(pattern => htmlCard.classList.remove(pattern));
        
        // Apply random brownish pattern
        htmlCard.classList.add(brownishPatterns[randomPattern]);
        console.log(`🎨 Applied ${brownishPatterns[randomPattern]} to card ${index}`);
        
        // Enhanced overlay opacity variation (0.20 to 0.40 for better consistency)
        const overlayOpacity = 0.20 + Math.random() * 0.20;
        htmlCard.style.setProperty('--fintech-overlay-opacity', overlayOpacity.toString());
        
        // Improved background positioning with larger coverage
        const bgPositionX = Math.random() * 60; // Reduced range for less repetition
        const bgPositionY = Math.random() * 60; // Reduced range for less repetition
        htmlCard.style.setProperty('--bg-position-x', `${bgPositionX}%`);
        htmlCard.style.setProperty('--bg-position-y', `${bgPositionY}%`);
        
        // Larger scale variation to reduce tiling visibility
        const scale = 1.2 + Math.random() * 0.6; // 1.2 to 1.8 scale for larger tiles
        htmlCard.style.setProperty('--pattern-scale', scale.toString());
        
        // Limited hue shift for consistent brown tones (only negative values)
        const hueShift = Math.random() * -15 - 5; // -20 to -5 degrees only
        htmlCard.style.setProperty('--hue-shift', `${hueShift}deg`);
        
        // Additional brownish filter enhancements
        const brownishSaturate = 0.8 + Math.random() * 0.3; // 0.8 to 1.1
        const brownishBrightness = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
        const brownishContrast = 1.0 + Math.random() * 0.2; // 1.0 to 1.2
        
        htmlCard.style.setProperty('--brownish-saturate', brownishSaturate.toString());
        htmlCard.style.setProperty('--brownish-brightness', brownishBrightness.toString());
        htmlCard.style.setProperty('--brownish-contrast', brownishContrast.toString());
        
        console.log(`🎨 Card ${index} brownish styling:`, {
          pattern: brownishPatterns[randomPattern],
          opacity: overlayOpacity.toFixed(3),
          bgPosition: `${bgPositionX.toFixed(1)}%, ${bgPositionY.toFixed(1)}%`,
          scale: scale.toFixed(2),
          hueShift: `${hueShift.toFixed(1)}deg`,
          filters: {
            saturate: brownishSaturate.toFixed(2),
            brightness: brownishBrightness.toFixed(2),
            contrast: brownishContrast.toFixed(2)
          }
        });
        
        // Force background image application with larger tile sizes
        htmlCard.style.setProperty('background-image', 'url(/lovable-uploads/cream_gradient.jpg)', 'important');
        htmlCard.style.setProperty('background-size', `${800 + Math.random() * 400}px`, 'important'); // 800-1200px
        htmlCard.style.setProperty('background-repeat', 'no-repeat', 'important');
        htmlCard.style.setProperty('background-attachment', 'local', 'important');
      });
    };

    const applyContentAwareGradient = (card: HTMLElement, index: number) => {
      // Generate improved organic cloud positions with better distribution
      const seed = index * 137.5; // Golden angle for better distribution
      
      // Cloud 1 position - more varied and distributed
      const cloud1X = 20 + Math.sin(seed) * 25; // 20-45% range
      const cloud1Y = 25 + Math.cos(seed * 0.7) * 30; // 25-55% range
      
      // Cloud 2 position - complementary positioning
      const cloud2X = 55 + Math.sin(seed * 1.3) * 25; // 55-80% range
      const cloud2Y = 45 + Math.cos(seed * 1.8) * 30; // 45-75% range
      
      // Vignette position - better asymmetric placement
      const vignetteX = Math.sin(seed * 2.1) > 0 ? 
        15 + Math.random() * 20 : // Left side (15-35%)
        65 + Math.random() * 20;  // Right side (65-85%)
      const vignetteY = Math.cos(seed * 2.5) > 0 ? 
        15 + Math.random() * 25 : // Top (15-40%)
        60 + Math.random() * 25;  // Bottom (60-85%)
      
      // Apply improved cloud variations
      card.style.setProperty('--cloud1-x', `${cloud1X}%`);
      card.style.setProperty('--cloud1-y', `${cloud1Y}%`);
      card.style.setProperty('--cloud2-x', `${cloud2X}%`);
      card.style.setProperty('--cloud2-y', `${cloud2Y}%`);
      card.style.setProperty('--vignette-x', `${vignetteX}%`);
      card.style.setProperty('--vignette-y', `${vignetteY}%`);

      console.log(`🎨 Card ${index} improved cloud positions:`, {
        cloud1: `${cloud1X.toFixed(1)}%, ${cloud1Y.toFixed(1)}%`,
        cloud2: `${cloud2X.toFixed(1)}%, ${cloud2Y.toFixed(1)}%`,
        vignette: `${vignetteX.toFixed(1)}%, ${vignetteY.toFixed(1)}%`
      });

      // Enhanced multi-light effect for text elements
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
            
            card.style.setProperty(`--text${textIndex + 1}-x`, `${Math.max(15, Math.min(85, relX))}%`);
            card.style.setProperty(`--text${textIndex + 1}-y`, `${Math.max(15, Math.min(85, relY))}%`);
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
      }
      
      if (shouldReapply) {
        console.log('🎨 DOM changed, reapplying brownish gradient system...');
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
