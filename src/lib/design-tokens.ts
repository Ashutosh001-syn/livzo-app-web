export const theme = {
  colors: {
    ink: "#09090b",
    canvas: "#0d0d12",
    panel: "#14141c",
    violet: "#8b5cf6",
    electric: "#3b82f6",
    cyan: "#22d3ee",
  },
  radii: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
  },
  motion: {
    ease: [0.22, 1, 0.36, 1] as const,
    fast: 0.2,
    base: 0.45,
    slow: 0.8,
  },
} as const;

export type Theme = typeof theme;
