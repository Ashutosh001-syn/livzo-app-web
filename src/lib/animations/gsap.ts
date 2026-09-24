import gsap from "gsap";

export const gsapDefaults = {
  ease: "power3.out",
  duration: 0.8,
};

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap };
