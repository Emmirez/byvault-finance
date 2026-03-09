import { useCallback } from 'react';

export const useSmoothScroll = () => {
  /**
   * Smooth scroll to a section by ID
   * @param {string} id - The ID of the element to scroll to (without #)
   * @param {number} offset - Offset from top (default: 80px for header)
   */
  const scrollToSection = useCallback((id, offset = 80) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  /**
   * Smooth scroll to a section by selector
   * @param {string} selector - CSS selector of the element to scroll to
   * @param {number} offset - Offset from top (default: 80px for header)
   */
  const scrollToSelector = useCallback((selector, offset = 80) => {
    const element = document.querySelector(selector);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  
  const scrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, []);

  /**
   * Scroll to a specific position
   * @param {number} position - Position in pixels from top
   */
  const scrollToPosition = useCallback((position) => {
    window.scrollTo({
      top: position,
      behavior: 'smooth'
    });
  }, []);

  return {
    scrollToSection,
    scrollToSelector,
    scrollToTop,
    scrollToBottom,
    scrollToPosition
  };
};