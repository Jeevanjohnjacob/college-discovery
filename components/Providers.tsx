"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { CompareProvider } from "@/context/CompareContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CompareProvider>{children}</CompareProvider>
    </SessionProvider>
  );
}
