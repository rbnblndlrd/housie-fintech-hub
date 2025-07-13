
import { useEffect } from 'react';

// Global modal state tracking
let isModalOpen = false;
let modalCheckInterval: NodeJS.Timeout | null = null;

export const useDynamicGradients = () => {
  useEffect(() => {
    // Enhanced modal detection function
    const checkModalState = () => {
      const modals = document.querySelectorAll('[data-state="open"]');
      const dialogs = document.querySelectorAll('[role="dialog"]');
      const portals = document.querySelectorAll('[data-radix-portal]');
      const fixedElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el as HTMLElement);
        return style.position === 'fixed' && parseInt(style.zIndex) > 50;
      });
      
      const wasModalOpen = isModalOpen;
      isModalOpen = modals.length > 0 || dialogs.length > 0 || portals.length > 0 || fixedElements.length > 2;
      
      // Modal state changed - reduced logging
      
      return isModalOpen;
    };

    const applyStrategicOverlayPositioning = () => {
      // Check modal state before any positioning
      if (checkModalState()) {
        return;
      }
      
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
      
      let processedCount = 0;
      
      cards.forEach((card: Element, index: number) => {
        const htmlCard = card as HTMLElement;
        
        // Enhanced modal element detection
        const isInModal = (
          htmlCard.closest('[data-state="open"]') ||
          htmlCard.closest('[data-radix-portal]') ||
          htmlCard.closest('[role="dialog"]') ||
          htmlCard.classList.contains('modal-stable') ||
          htmlCard.closest('.modal-stable') ||
          htmlCard.closest('[data-radix-dialog-content]') ||
          htmlCard.closest('[data-radix-dialog-overlay]') ||
          window.getComputedStyle(htmlCard).position === 'fixed' ||
          parseInt(window.getComputedStyle(htmlCard).zIndex || '0') > 50
        );
        
        if (isInModal) {
          return;
        }
        
        processedCount++;
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
      
      
      // Enhanced text contrast for content readability
      const textElements = card.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, .fintech-text-header');
      textElements.forEach(element => {
        const htmlElement = element as HTMLElement;
        htmlElement.classList.add('text-enhanced-contrast');
      });
      
      // Apply text-aware positioning for cards with multiple text elements
      if (textElements.length > 2) {
        card.classList.add('fintech-text-aware');
      }
    };

    // Start modal state monitoring
    modalCheckInterval = setInterval(checkModalState, 100);
    
    // Apply positioning after initial delay
    setTimeout(applyStrategicOverlayPositioning, 200);

    // Enhanced mutation observer with modal awareness
    const observer = new MutationObserver((mutations) => {
      // Always check modal state first
      if (checkModalState()) {
        return;
      }
      
      let shouldReapply = false;
      
      mutations.forEach((mutation) => {
        // Check for attribute changes that might indicate modal state
        if (mutation.type === 'attributes') {
          const target = mutation.target as HTMLElement;
          if (mutation.attributeName === 'data-state' || 
              mutation.attributeName === 'role' ||
              mutation.attributeName === 'class') {
            return; // State will be checked at start of next cycle
          }
        }
        
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
        setTimeout(() => {
          if (!checkModalState()) {
            applyStrategicOverlayPositioning();
          }
        }, 150);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-state', 'role', 'class', 'style']
    });

    return () => {
      observer.disconnect();
      if (modalCheckInterval) {
        clearInterval(modalCheckInterval);
        modalCheckInterval = null;
      }
    };
  }, []);
};
