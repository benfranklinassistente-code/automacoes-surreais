"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";

// Convex URL configurada
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convexClient = new ConvexReactClient(convexUrl!);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convexClient}>
      {children}
    </ConvexProvider>
  );
}
