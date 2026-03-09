// hooks/useScrollToTop.js
import { useState, useEffect, useCallback } from 'react';

export const useScrollToTop = (options = {}) => {
  const {
    threshold = 300,
    behavior = 'smooth',
    onScrollTop
  } = options;

  const [isVisible, setIsVisible] = useState(false);

  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior
    });
    
    // Call optional callback
    if (onScrollTop) {
      onScrollTop();
    }
  }, [behavior, onScrollTop]);

  // Also scroll to top on route change (optional)
  const useScrollOnRouteChange = useCallback((deps = []) => {
    useEffect(() => {
      scrollToTop();
    }, deps);
  }, [scrollToTop]);

  return {
    isVisible,
    scrollToTop,
    useScrollOnRouteChange
  };
};