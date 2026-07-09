import { bubble } from "./bubble";
import { sereneForest } from "./sereneForest";
import { minimalBlack } from "./minimalBlack";
import { lakeSideCafe } from "./lakeSideCafe";

export const themes = {
  minimalBlack,
  sereneForest,
  lakeSideCafe,
  // bubble,
};

export type ThemeName = keyof typeof themes;
