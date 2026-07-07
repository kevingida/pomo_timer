"use client";

import { ThemeContext } from "@/features/theme/providers/ThemeProvider";
import { useContext } from "react";

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
