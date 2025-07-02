
import { useEffect } from 'react';

export const useDynamicGradients = () => {
  useEffect(() => {
    const applyOrganicCloudGradients = () => {
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
        
        // Randomize overlay opacity for variation
        const overlayOpacity = 0.2 + Math.random() * 0.3; // 0.2 to 0.5
        htmlCard.style.setProperty('--fintech-overlay-opacity', overlayOpacity.toString());
      });
    };

    const applyContentAwareGradient = (card: HTMLElement, index: number) => {
      // Generate organic cloud positions using golden angle distribution
      const seed = index * 137.5; // Golden angle for better distribution
      
      // Cloud 1 position - varies organically
      const cloud1X = 25 + Math.sin(seed) * 25; // 25-50% range
      const cloud1Y = 30 + Math.cos(seed * 0.7) * 30; // 30-60% range
      
      // Cloud 2 position - complementary to cloud 1
      const cloud2X = 65 + Math.sin(seed * 1.3) * 25; // 65-90% range
      const cloud2Y = 60 + Math.cos(seed * 1.8) * 25; // 60-85% range
      
      // Vignette position - push toward edges for asymmetry
      const vignetteX = Math.sin(seed * 2.1) > 0 ? 
        10 + Math.random() * 25 : // Left side (10-35%)
        65 + Math.random() * 25;  // Right side (65-90%)
      const vignetteY = Math.cos(seed * 2.5) > 0 ? 
        10 + Math.random() * 30 : // Top (10-40%)
        60 + Math.random() * 30;  // Bottom (60-90%)
      
      // Apply organic cloud variations
      card.style.setProperty('--cloud1-x', `${cloud1X}%`);
      card.style.setProperty('--cloud1-y', `${cloud1Y}%`);
      card.style.setProperty('--cloud2-x', `${cloud2X}%`);
      card.style.setProperty('--cloud2-y', `${cloud2Y}%`);
      card.style.setProperty('--vignette-x', `${vignetteX}%`);
      card.style.setProperty('--vignette-y', `${vignetteY}%`);

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
        }
      }
    };

    // Apply gradients on initial load
    applyOrganicCloudGradients();

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
