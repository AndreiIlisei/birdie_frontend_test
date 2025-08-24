// src/contexts/ModalContext.tsx
'use client';

import { createContext, useState, useContext, ReactNode, useCallback } from 'react';

// The context type now includes `isOpen` and `modalContent` again.
interface ModalContextType {
  isOpen: boolean;
  modalContent: ReactNode | null;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * Provides a generic modal system with an overlay,
 * combining the original state logic with the new UI.
 */
export const ModalProvider = ({ children }: { children: ReactNode }) => {
  // Use both isOpen and modalContent state like in the original version.
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const openModal = useCallback((content: ReactNode) => {
    setModalContent(content);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Optional: delay clearing content to allow for closing animations
    setTimeout(() => {
      setModalContent(null);
    }, 300); // 300ms delay
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    // Provide all values in the context.
    <ModalContext.Provider value={{ isOpen, modalContent, openModal, closeModal }}>
      {children}
      {/* The UI is rendered based on the `isOpen` state. */}
      {isOpen && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm lg:ml-36"
        >
          {/* The modal content itself is rendered here */}
          {modalContent}
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
