"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import AppRedirectOverlay, { TriggerType } from "@/components/ui/AppRedirectOverlay";

interface AppModalContextValue {
  openModal: (triggerType?: TriggerType) => void;
  closeModal: () => void;
}

const AppModalContext = createContext<AppModalContextValue | null>(null);

export function AppModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerType, setTriggerType] = useState<TriggerType>("general");

  const openModal = useCallback((type: TriggerType = "general") => {
    setTriggerType(type);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AppModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <AppRedirectOverlay
        isOpen={isOpen}
        onClose={closeModal}
        triggerType={triggerType}
      />
    </AppModalContext.Provider>
  );
}

export function useAppModal() {
  const ctx = useContext(AppModalContext);
  if (!ctx) {
    throw new Error("useAppModal must be used within AppModalProvider");
  }
  return ctx;
}
