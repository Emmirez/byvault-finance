// hooks/useScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Custom hook version
export const useScrollToTop = (behavior = 'instant') => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior
    });
  }, [pathname, behavior]);
};

// Component wrapper for the hook
export const ScrollToTop = ({ behavior = 'instant' }) => {
  useScrollToTop(behavior);
  return null;
};

export default ScrollToTop;