export type ThemeMode = "dark";

export type GradientTone = "violet" | "blue" | "cyan";

export interface ThemeConfig {
  mode: ThemeMode;
  accent: GradientTone;
}
