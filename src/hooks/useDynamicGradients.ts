
import { useEffect } from 'react';

export const useDynamicGradients = () => {
  useEffect(() => {
    const applyOrganicCloudGradients = () => {
      console.log('🎨 Applying organic cloud gradients with new texture...');
      
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
      console.log(`🎨 Found ${cards.length} cards to style with cloud texture`);
      
      cards.forEach((card: Element, index: number) => {
        const htmlCard = card as HTMLElement;
        
        // Apply content-aware gradients for fintech elements
        applyContentAwareGradient(htmlCard, index);
        
        // Randomize the textured background pattern
        const patterns = ['fintech-pattern-1', 'fintech-pattern-2', 'fintech-pattern-3', 'fintech-pattern-4'];
        const randomPattern = Math.floor(Math.random() * patterns.length);
        
        // Remove any existing fintech pattern classes
        patterns.forEach(pattern => htmlCard.classList.remove(pattern));
        
        // Apply random fintech pattern
        htmlCard.classList.add(patterns[randomPattern]);
        console.log(`🎨 Applied ${patterns[randomPattern]} to card ${index}`);
        
        // Randomize overlay opacity for variation (very subtle)
        const overlayOpacity = 0.05 + Math.random() * 0.08; // 0.05 to 0.13 for maximum subtlety
        htmlCard.style.setProperty('--fintech-overlay-opacity', overlayOpacity.toString());
      });
    };

    const applyContentAwareGradient = (card: HTMLElement, index: number) => {
      // Generate organic cloud positions using golden angle distribution
      const seed = index * 137.5; // Golden angle for better distribution
      
      // Cloud 1 position - varies organically (reduced range for subtlety)
      const cloud1X = 30 + Math.sin(seed) * 15; // 30-45% range
      const cloud1Y = 35 + Math.cos(seed * 0.7) * 20; // 35-55% range
      
      // Cloud 2 position - complementary to cloud 1 (reduced range)
      const cloud2X = 70 + Math.sin(seed * 1.3) * 15; // 70-85% range
      const cloud2Y = 65 + Math.cos(seed * 1.8) * 15; // 65-80% range
      
      // Vignette position - push toward edges for asymmetry (reduced intensity)
      const vignetteX = Math.sin(seed * 2.1) > 0 ? 
        20 + Math.random() * 15 : // Left side (20-35%)
        70 + Math.random() * 15;  // Right side (70-85%)
      const vignetteY = Math.cos(seed * 2.5) > 0 ? 
        20 + Math.random() * 20 : // Top (20-40%)
        65 + Math.random() * 20;  // Bottom (65-85%)
      
      // Apply organic cloud variations
      card.style.setProperty('--cloud1-x', `${cloud1X}%`);
      card.style.setProperty('--cloud1-y', `${cloud1Y}%`);
      card.style.setProperty('--cloud2-x', `${cloud2X}%`);
      card.style.setProperty('--cloud2-y', `${cloud2Y}%`);
      card.style.setProperty('--vignette-x', `${vignetteX}%`);
      card.style.setProperty('--vignette-y', `${vignetteY}%`);

      console.log(`🎨 Card ${index} subtle cloud positions:`, {
        cloud1: `${cloud1X}%, ${cloud1Y}%`,
        cloud2: `${cloud2X}%, ${cloud2Y}%`,
        vignette: `${vignetteX}%, ${vignetteY}%`
      });

      // Get all text elements within the card for multi-light effect
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
        
        // Apply multi-light class if we have multiple text elements
        if (validPositions > 1) {
          card.classList.add('fintech-multi-light');
          console.log(`🎨 Applied subtle multi-light effect to card ${index}`);
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
        console.log('🎨 DOM changed, reapplying cloud texture gradients...');
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
