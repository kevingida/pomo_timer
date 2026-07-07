import { bubble } from "./bubble";
import { forest } from "./forest";
import { ocean } from "./ocean";

export const themes = {
  bubble,
  forest,
  ocean,
};

export type ThemeName = keyof typeof themes;
