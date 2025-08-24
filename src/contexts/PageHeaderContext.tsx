'use client';
import React, { createContext, useState, useContext, ReactNode } from 'react';

type NavbarStyle = 'transparent' | 'solid' | 'brand-5';

interface PageHeaderState {
  navbarStyle: NavbarStyle;
  actions: ReactNode | null;
  setNavbarStyle: (style: NavbarStyle) => void;
  setActions: (actions: ReactNode | null) => void;
}

const PageHeaderContext = createContext<PageHeaderState | undefined>(undefined);

export const PageHeaderProvider = ({ children }: { children: ReactNode }) => {
  const [navbarStyle, setNavbarStyle] = useState<NavbarStyle>('transparent');
  const [actions, setActions] = useState<ReactNode | null>(null);

  const contextValue = {
    navbarStyle,
    actions,
    setNavbarStyle,
    setActions,
  };

  return (
    <PageHeaderContext.Provider value={contextValue}>
      {children}
    </PageHeaderContext.Provider>
  );
};

export const usePageHeader = () => {
  const context = useContext(PageHeaderContext);
  if (!context) {
    throw new Error('usePageHeader must be used within a PageHeaderProvider');
  }
  return context;
};