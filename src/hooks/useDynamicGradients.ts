
import { useEffect } from 'react';

export const useDynamicGradients = () => {
  useEffect(() => {
    const applyContentAwareGradients = () => {
      // Get all card elements including fintech cards
      const cardSelectors = [
        '.card:not(.fintech-card):not(.fintech-metric-card):not(.fintech-chart-container)',
        '.glass-card', 
        '.job-card', 
        '.widget-card',
        '.fintech-card',
        '.fintech-metric-card', 
        '.fintech-chart-container',
        '.fintech-inner-box',
        '.fintech-button-secondary'
      ];
      
      const cards = document.querySelectorAll(cardSelectors.join(', '));
      
      cards.forEach((card: Element) => {
        const htmlCard = card as HTMLElement;
        
        // Check if this is a fintech element
        const isFintechElement = htmlCard.classList.contains('fintech-card') ||
                                htmlCard.classList.contains('fintech-metric-card') ||
                                htmlCard.classList.contains('fintech-chart-container') ||
                                htmlCard.classList.contains('fintech-inner-box') ||
                                htmlCard.classList.contains('fintech-button-secondary');
        
        if (isFintechElement) {
          // For fintech elements, apply content-aware gradients
          applyContentAwareGradient(htmlCard);
          
          // Also randomize the textured background pattern
          const patterns = ['fintech-pattern-1', 'fintech-pattern-2', 'fintech-pattern-3', 'fintech-pattern-4'];
          const randomPattern = Math.floor(Math.random() * patterns.length);
          
          // Remove any existing fintech pattern classes
          patterns.forEach(pattern => htmlCard.classList.remove(pattern));
          
          // Apply random fintech pattern
          htmlCard.classList.add(patterns[randomPattern]);
          
          // Also randomize overlay opacity for variation
          const overlayOpacity = 0.2 + Math.random() * 0.3; // 0.2 to 0.5
          htmlCard.style.setProperty('--fintech-overlay-opacity', overlayOpacity.toString());
        } else {
          // Regular gradient logic for non-fintech cards
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
        }
      });
    };

    const applyContentAwareGradient = (card: HTMLElement) => {
      // Get all text elements within the card
      const textElements = card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div[class*="text"], .fintech-text-header, .fintech-text-primary, .fintech-text-secondary');
      
      if (textElements.length > 0) {
        // Calculate bounding box of all content
        let minX = Infinity, minY = Infinity;
        let maxX = 0, maxY = 0;
        let hasValidContent = false;
        
        textElements.forEach(el => {
          const htmlEl = el as HTMLElement;
          // Skip if element has no visible content
          if (!htmlEl.textContent?.trim()) return;
          
          const rect = htmlEl.getBoundingClientRect();
          const cardRect = card.getBoundingClientRect();
          
          // Skip if element is not visible
          if (rect.width === 0 || rect.height === 0) return;
          
          // Calculate relative positions
          const relX = rect.left - cardRect.left;
          const relY = rect.top - cardRect.top;
          
          minX = Math.min(minX, relX);
          minY = Math.min(minY, relY);
          maxX = Math.max(maxX, relX + rect.width);
          maxY = Math.max(maxY, relY + rect.height);
          hasValidContent = true;
        });
        
        if (hasValidContent && card.offsetWidth > 0 && card.offsetHeight > 0) {
          // Calculate content center as percentage
          const centerX = Math.max(0, Math.min(100, ((minX + maxX) / 2 / card.offsetWidth) * 100));
          const centerY = Math.max(0, Math.min(100, ((minY + maxY) / 2 / card.offsetHeight) * 100));
          
          // Apply custom gradient center with some randomization
          const randomOffsetX = (Math.random() - 0.5) * 20; // ±10% random offset
          const randomOffsetY = (Math.random() - 0.5) * 20; // ±10% random offset
          
          const finalX = Math.max(20, Math.min(80, centerX + randomOffsetX));
          const finalY = Math.max(20, Math.min(80, centerY + randomOffsetY));
          
          card.style.setProperty('--content-center-x', `${finalX}%`);
          card.style.setProperty('--content-center-y', `${finalY}%`);
          
          // Add multiple light sources for complex content
          if (textElements.length > 1) {
            const textPositions: string[] = [];
            let validPositions = 0;
            
            Array.from(textElements).slice(0, 3).forEach((el, index) => {
              const htmlEl = el as HTMLElement;
              if (!htmlEl.textContent?.trim()) return;
              
              const rect = htmlEl.getBoundingClientRect();
              const cardRect = card.getBoundingClientRect();
              
              if (rect.width > 0 && rect.height > 0) {
                const relX = ((rect.left + rect.width/2 - cardRect.left) / card.offsetWidth) * 100;
                const relY = ((rect.top + rect.height/2 - cardRect.top) / card.offsetHeight) * 100;
                
                card.style.setProperty(`--text${index + 1}-x`, `${Math.max(10, Math.min(90, relX))}%`);
                card.style.setProperty(`--text${index + 1}-y`, `${Math.max(10, Math.min(90, relY))}%`);
                validPositions++;
              }
            });
            
            // Apply multi-light class if we have multiple text elements
            if (validPositions > 1) {
              card.classList.add('fintech-multi-light');
            }
          }
        }
      }
      
      // If no content found, use default center with randomization
      if (textElements.length === 0) {
        const randomX = 30 + Math.random() * 40; // 30-70%
        const randomY = 30 + Math.random() * 40; // 30-70%
        card.style.setProperty('--content-center-x', `${randomX}%`);
        card.style.setProperty('--content-center-y', `${randomY}%`);
      }
    };

    // Apply gradients on initial load
    applyContentAwareGradients();

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
                                 node.classList?.contains('widget-card') ||
                                 node.classList?.contains('fintech-card') ||
                                 node.classList?.contains('fintech-metric-card') ||
                                 node.classList?.contains('fintech-chart-container') ||
                                 node.classList?.contains('fintech-inner-box');
              
              const containsCards = node.querySelectorAll?.('.card, .glass-card, .job-card, .widget-card, .fintech-card, .fintech-metric-card, .fintech-chart-container, .fintech-inner-box').length > 0;
              
              if (hasCardClass || containsCards) {
                shouldReapply = true;
              }
            }
          });
        }
      });
      
      if (shouldReapply) {
        // Delay to ensure DOM is fully updated
        setTimeout(applyContentAwareGradients, 100);
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
