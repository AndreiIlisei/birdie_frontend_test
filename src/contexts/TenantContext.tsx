'use client';

import { createContext, useContext, ReactNode } from 'react';
import { TenantConfig } from '@/types';

const TenantContext = createContext<TenantConfig | null>(null);

export const TenantProvider = ({
  children,
  config,
}: {
  children: ReactNode;
  config: TenantConfig;
}) => {
  return (
    <TenantContext.Provider value={config}>{children}</TenantContext.Provider>
  );
};

export const useTenant = (): TenantConfig => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};