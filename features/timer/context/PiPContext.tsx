"use client";

import { createContext, useContext } from "react";

type PiPContextType = {
  pipContainer: HTMLElement | null;
  isPiPActive: boolean;
};

const PiPContext = createContext<PiPContextType>({
  pipContainer: null,
  isPiPActive: false,
});

export function usePiPWindow(): PiPContextType {
  return useContext(PiPContext);
}

export function PiPProvider({
  children,
  pipContainer,
  isPiPActive,
}: {
  children: React.ReactNode;
  pipContainer: HTMLElement | null;
  isPiPActive: boolean;
}) {
  return (
    <PiPContext.Provider value={{ pipContainer, isPiPActive }}>
      {children}
    </PiPContext.Provider>
  );
}
