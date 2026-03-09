import { useState } from 'react';

export const useHeader = (initialState = { mobileMenuOpen: false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(initialState.mobileMenuOpen);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };

  return {
    mobileMenuOpen,
    setMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    openMobileMenu,
  };
};