'use client';

import { ReactNode } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { PageHeaderProvider } from '@/contexts/PageHeaderContext';
import { Navbar } from './Navbar';
import { cn } from '@/lib/utils';

export function ProtectedContent({ children }: { children: ReactNode }) {
  const { isOpen, modalContent } = useModal();

  return (
    <div className="relative flex-1 flex flex-col">
         <PageHeaderProvider>
        <main className="flex-1 overflow-y-auto bg-system-6">
          <Navbar />
          <div className="mx-auto">
            {children}
          </div>
        </main>
      </PageHeaderProvider>        


      <div
        className={cn(
          "absolute inset-0 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {modalContent}
      </div>
    </div>
  );
}