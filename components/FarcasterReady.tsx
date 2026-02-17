"use client";

import { useEffect } from "react";

export function FarcasterReady() {
  useEffect(() => {
    import("@farcaster/miniapp-sdk")
      .then((mod) => {
        const sdk = (mod as { default?: { actions?: { ready?: () => Promise<void> } } }).default;
        sdk?.actions?.ready?.().catch(() => {});
      })
      .catch(() => {});
  }, []);
  return null;
}
