"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.7 }}>
      {children}
    </MotionConfig>
  );
}
